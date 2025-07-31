import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { chatWithOpenRouter } from '@/lib/openrouter';
import { generateSpeech } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { chatbotId, message, sessionId } = await request.json();

    // Get chatbot configuration
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Prepare messages for OpenRouter
    const messages = [
      {
        role: 'system',
        content: chatbot.prompt || 'You are a helpful AI assistant.',
      },
      {
        role: 'user',
        content: message,
      },
    ];

    // Add lead capture prompt if enabled
    if (chatbot.data_capture_enabled) {
      messages[0].content += '\n\nIf appropriate during the conversation, naturally ask for the user\'s full name, email, and phone number. Don\'t be pushy - only ask when it feels natural based on the conversation context.';
    }

    // Get response from OpenRouter
    const chatResponse = await chatWithOpenRouter(
      chatbot.openrouter_api_key,
      chatbot.model,
      messages
    );

    const aiMessage = chatResponse.choices[0].message.content;
    const tokensUsed = chatResponse.usage?.total_tokens || 0;

    // Log usage
    const { error: usageError } = await supabase
      .from('usage_logs')
      .insert({
        chatbot_id: chatbotId,
        user_id: chatbot.user_id,
        tokens_used: tokensUsed,
        model_used: chatbot.model,
        request_type: 'chat',
        cost_estimate: tokensUsed * 0.000001, // Rough estimate
      });

    if (usageError) {
      console.error('Error logging usage:', usageError);
    }

    // Check for lead information extraction
    let leadData = null;
    if (chatbot.data_capture_enabled) {
      const emailMatch = message.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      const phoneMatch = message.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
      
      if (emailMatch || phoneMatch) {
        leadData = {
          email: emailMatch ? emailMatch[0] : null,
          phone: phoneMatch ? phoneMatch[0] : null,
          full_name: null, // Would need more sophisticated NLP to extract names
          conversation_context: { message, response: aiMessage },
        };

        // Store lead data
        const { error: leadError } = await supabase
          .from('leads')
          .insert({
            chatbot_id: chatbotId,
            user_id: chatbot.user_id,
            ...leadData,
          });

        if (leadError) {
          console.error('Error storing lead:', leadError);
        }
      }
    }

    let audioData = null;
    if (chatbot.voice_enabled && chatbot.elevenlabs_api_key && chatbot.voice_id) {
      try {
        const audioBuffer = await generateSpeech(
          chatbot.elevenlabs_api_key,
          chatbot.voice_id,
          aiMessage,
          chatbot.voice_settings
        );
        
        audioData = Buffer.from(audioBuffer).toString('base64');

        // Log voice usage
        await supabase
          .from('usage_logs')
          .insert({
            chatbot_id: chatbotId,
            user_id: chatbot.user_id,
            tokens_used: aiMessage.length, // Character count for voice
            model_used: 'elevenlabs-tts',
            request_type: 'voice',
            cost_estimate: aiMessage.length * 0.00001, // Rough estimate
          });
      } catch (voiceError) {
        console.error('Voice generation error:', voiceError);
      }
    }

    return NextResponse.json({
      message: aiMessage,
      audio: audioData,
      leadCaptured: leadData !== null,
      tokensUsed,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
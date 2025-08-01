import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const chatbotId = params.id;
  
  console.log('Embed script requested for chatbot ID:', chatbotId);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  try {
    // Get chatbot configuration
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    if (error || !chatbot) {
      console.log('Chatbot not found:', error);
      return new NextResponse('console.error("Chatbot not found");', { 
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/javascript; charset=utf-8',
        }
      });
    }

    console.log('Chatbot found:', chatbot.name);

    // Check payment status
    const lastPayment = new Date(chatbot.last_payment_date);
    const today = new Date();
    const daysSincePayment = Math.floor((today.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysSincePayment > 30;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yvexanchatbots.netlify.app';

    const embedScript = `
(function() {
  console.log('Loading chatbot widget for ID: ${chatbotId}');
  
  // Prevent multiple instances
  if (window.chatbotWidget_${chatbotId.replace(/-/g, '_')}) {
    console.log('Chatbot widget already loaded');
    return;
  }
  window.chatbotWidget_${chatbotId.replace(/-/g, '_')} = true;

  // Chatbot configuration
  const config = {
    chatbotId: '${chatbotId}',
    theme: ${JSON.stringify(chatbot.theme_settings)},
    voiceEnabled: ${chatbot.voice_enabled},
    dataCaptureEnabled: ${chatbot.data_capture_enabled},
    paymentOverdue: ${isOverdue},
    apiUrl: '${siteUrl}'
  };

  // Create chatbot widget
  function createChatWidget() {
    console.log('Creating chat widget');
    
    // Create container
    const container = document.createElement('div');
    container.id = 'chatbot-widget-container-${chatbotId}';
    container.style.cssText = \`
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    \`;

    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.id = 'chatbot-toggle-btn-${chatbotId}';
    chatButton.innerHTML = '💬';
    chatButton.style.cssText = \`
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: \${config.theme.primaryColor || '#000000'};
      color: \${config.theme.secondaryColor || '#ffffff'};
      border: none;
      cursor: pointer;
      font-size: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s ease;
    \`;

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatbot-window-${chatbotId}';
    chatWindow.style.cssText = \`
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    \`;

    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = \`
      background: \${config.theme.primaryColor || '#000000'};
      color: \${config.theme.secondaryColor || '#ffffff'};
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    \`;
    
    chatHeader.innerHTML = \`
      <span>Chat Assistant</span>
      \${config.paymentOverdue ? '<span style="background: #ff6b6b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Payment Due</span>' : ''}
    \`;

    // Chat messages area
    const chatMessages = document.createElement('div');
    chatMessages.id = 'chatbot-messages-${chatbotId}';
    chatMessages.style.cssText = \`
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f8f9fa;
    \`;

    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = \`
      background: white;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    \`;
    welcomeMsg.textContent = config.theme.welcomeMessage || 'Hi! How can I help you today?';
    chatMessages.appendChild(welcomeMsg);

    // Chat input area
    const chatInputArea = document.createElement('div');
    chatInputArea.style.cssText = \`
      padding: 16px;
      border-top: 1px solid #e9ecef;
      background: white;
    \`;

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'Type your message...';
    chatInput.style.cssText = \`
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      outline: none;
      font-size: 14px;
    \`;

    chatInputArea.appendChild(chatInput);

    // Assemble chat window
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(chatMessages);
    chatWindow.appendChild(chatInputArea);

    // Assemble container
    container.appendChild(chatButton);
    container.appendChild(chatWindow);

    // Add to page
    document.body.appendChild(container);

    // Event handlers
    let isOpen = false;
    chatButton.addEventListener('click', function() {
      isOpen = !isOpen;
      chatWindow.style.display = isOpen ? 'flex' : 'none';
      chatButton.innerHTML = isOpen ? '✕' : '💬';
    });

    chatButton.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });

    chatButton.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });

    // Chat functionality
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        sendMessage(this.value.trim());
        this.value = '';
      }
    });

    function sendMessage(message) {
      console.log('Sending message:', message);
      
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.cssText = \`
        background: \${config.theme.primaryColor || '#000000'};
        color: \${config.theme.secondaryColor || '#ffffff'};
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        margin-left: 20%;
        text-align: right;
        word-wrap: break-word;
      \`;
      userMsg.textContent = message;
      chatMessages.appendChild(userMsg);

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Add typing indicator
      const typingMsg = document.createElement('div');
      typingMsg.style.cssText = \`
        background: white;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        margin-right: 20%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        font-style: italic;
        color: #666;
      \`;
      typingMsg.textContent = 'Typing...';
      chatMessages.appendChild(typingMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Send to API
      fetch(\`\${config.apiUrl}/api/chat\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId: config.chatbotId,
          message: message,
          sessionId: 'web-session-' + Date.now()
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Remove typing indicator
        chatMessages.removeChild(typingMsg);
        
        // Add bot response
        const botMsg = document.createElement('div');
        botMsg.style.cssText = \`
          background: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          margin-right: 20%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          word-wrap: break-word;
        \`;
        botMsg.textContent = data.message || 'Sorry, I could not process your request.';
        chatMessages.appendChild(botMsg);

        // Play audio if available
        if (config.voiceEnabled && data.audio) {
          try {
            const audio = new Audio('data:audio/mpeg;base64,' + data.audio);
            audio.play().catch(console.error);
          } catch (e) {
            console.error('Audio playback error:', e);
          }
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      })
      .catch(error => {
        console.error('Chat error:', error);
        // Remove typing indicator
        if (typingMsg.parentNode) {
          chatMessages.removeChild(typingMsg);
        }
        
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = \`
          background: #ff6b6b;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          margin-right: 20%;
        \`;
        errorMsg.textContent = 'Sorry, something went wrong. Please try again.';
        chatMessages.appendChild(errorMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
  
  console.log('Chatbot widget script loaded successfully');
})();
`;

    return new NextResponse(embedScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    });

  } catch (error) {
    console.error('Embed script error:', error);
    return new NextResponse(`console.error('Embed script error: ${error}');`, { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/javascript; charset=utf-8',
      }
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
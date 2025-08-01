import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chatbotId = id.replace('.js', ''); // Remove .js extension if present
  
  // Add CORS headers
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
      return new NextResponse('Chatbot not found', { 
        status: 404,
        headers: corsHeaders
      });
    }

    // Check payment status
    const lastPayment = new Date(chatbot.last_payment_date);
    const today = new Date();
    const daysSincePayment = Math.floor((today.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysSincePayment > 30;

    const embedScript = `
(function() {
  // Chatbot configuration
  const config = {
    chatbotId: '${chatbotId}',
    theme: ${JSON.stringify(chatbot.theme_settings)},
    voiceEnabled: ${chatbot.voice_enabled},
    dataCaptureEnabled: ${chatbot.data_capture_enabled},
    paymentOverdue: ${isOverdue},
    apiUrl: '${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'}'
  };

  // Create chatbot widget
  function createChatWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = 'chatbot-widget-container';
    container.style.cssText = \`
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    \`;

    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.id = 'chatbot-toggle-btn';
    chatButton.innerHTML = '💬';
    chatButton.style.cssText = \`
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: \${config.theme.primaryColor};
      color: \${config.theme.secondaryColor};
      border: none;
      cursor: pointer;
      font-size: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s ease;
    \`;

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatbot-window';
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
    \`;

    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = \`
      background: \${config.theme.primaryColor};
      color: \${config.theme.secondaryColor};
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
    chatMessages.id = 'chatbot-messages';
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
    welcomeMsg.textContent = config.theme.welcomeMessage;
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
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.cssText = \`
        background: \${config.theme.primaryColor};
        color: \${config.theme.secondaryColor};
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        margin-left: 20%;
        text-align: right;
      \`;
      userMsg.textContent = message;
      chatMessages.appendChild(userMsg);

      // Scroll to bottom
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
      .then(response => response.json())
      .then(data => {
        // Add bot response
        const botMsg = document.createElement('div');
        botMsg.style.cssText = \`
          background: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          margin-right: 20%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        \`;
        botMsg.textContent = data.message;
        chatMessages.appendChild(botMsg);

        // Play audio if available
        if (config.voiceEnabled && data.audio) {
          const audio = new Audio('data:audio/mpeg;base64,' + data.audio);
          audio.play().catch(console.error);
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      })
      .catch(error => {
        console.error('Chat error:', error);
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
})();
`;

    return new NextResponse(embedScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Embed script error:', error);
    return new NextResponse('Internal server error', { 
      status: 500,
      headers: corsHeaders
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
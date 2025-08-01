import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Remove .js extension if present
  const chatbotId = params.id.replace(/\.js$/, '');
  
  console.log('=== EMBED SCRIPT DEBUG ===');
  console.log('Requested chatbot ID:', chatbotId);
  console.log('Request URL:', request.url);
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  try {
    // First, let's check if we can connect to Supabase
    console.log('Attempting to connect to Supabase...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('chatbots')
      .select('count')
      .limit(1);
    
    console.log('Database test query result:', testData);
    console.log('Database test error:', testError);
    
    // Get all chatbots to debug
    const { data: allChatbots, error: allError } = await supabase
      .from('chatbots')
      .select('id, name, user_id');
    
    console.log('All chatbots in database:', allChatbots);
    console.log('Database connection error (if any):', allError);
    console.log('Number of chatbots found:', allChatbots?.length || 0);
    
    // Get specific chatbot
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    console.log('Specific chatbot query result:', chatbot);
    console.log('Specific chatbot query error:', error);

    if (error || !chatbot) {
      console.log('Chatbot not found, returning error script');
      const errorScript = `
console.error("Chatbot not found: ${chatbotId}");
console.log("Raw requested ID: ${params.id}");
console.log("Cleaned chatbot ID: ${chatbotId}");
console.log("Available chatbots:", ${JSON.stringify(allChatbots?.map(c => ({ id: c.id, name: c.name })) || [])});
console.log("Database error:", ${JSON.stringify(allError)});
console.log("Specific chatbot error:", ${JSON.stringify(error)});
console.log("Environment check - Supabase URL:", "${process.env.NEXT_PUBLIC_SUPABASE_URL}");
console.log("Environment check - Has Supabase Key:", ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY});
`;
      
      return new NextResponse(errorScript, { 
        status: 200, // Return 200 so the script loads
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/javascript; charset=utf-8',
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
  console.log('=== CHATBOT WIDGET LOADING ===');
  console.log('Chatbot ID: ${chatbotId}');
  console.log('Chatbot Name: ${chatbot.name}');
  console.log('Owner: ${chatbot.owner_name || 'Not specified'}');
  console.log('Layout: ${chatbot.ui_layout || 'corner'}');
  console.log('Theme: ${chatbot.ui_theme || 'light'}');
  console.log('Site URL: ${siteUrl}');
  
  // Prevent multiple instances
  if (window.chatbotWidget_${chatbotId.replace(/-/g, '_')}) {
    console.log('Chatbot widget already loaded');
    return;
  }
  window.chatbotWidget_${chatbotId.replace(/-/g, '_')} = true;

  // Chatbot configuration
  const config = {
    chatbotId: '${chatbotId}',
    name: '${chatbot.name}',
    ownerName: '${chatbot.owner_name || ''}',
    avatarUrl: '${chatbot.bot_avatar_url || ''}',
    startingPhrase: '${chatbot.starting_phrase || 'Hi there! How can I help you today?'}',
    theme: ${JSON.stringify(chatbot.theme_settings)},
    uiTheme: '${chatbot.ui_theme || 'light'}',
    layout: '${chatbot.ui_layout || 'corner'}',
    voiceEnabled: ${chatbot.voice_enabled},
    dataCaptureEnabled: ${chatbot.data_capture_enabled},
    paymentOverdue: ${isOverdue},
    footerBranding: ${chatbot.footer_branding !== false},
    apiUrl: '${siteUrl}'
  };

  console.log('Chatbot config:', config);

  // Create chatbot widget
  function createChatWidget() {
    console.log('Creating chat widget...');
    
    try {
      // Get layout-specific styles
      const isFullPage = config.layout === 'full';
      const isDarkTheme = config.uiTheme === 'dark';
      
      const themeColors = {
        primary: config.theme.primaryColor || '#000000',
        secondary: config.theme.secondaryColor || '#ffffff',
        background: isDarkTheme ? '#1a1a1a' : '#ffffff',
        text: isDarkTheme ? '#ffffff' : '#000000',
        border: isDarkTheme ? '#333333' : '#e5e7eb',
        chatBg: isDarkTheme ? '#2a2a2a' : '#f8f9fa'
      };

      // Create container
      const container = document.createElement('div');
      container.id = 'chatbot-widget-container-${chatbotId}';
      
      if (isFullPage) {
        container.style.cssText = \`
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 10000;
          background: \${themeColors.background};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        \`;
      } else {
        container.style.cssText = \`
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        \`;
      }

      if (!isFullPage) {
        // Create chat button for corner layout
        const chatButton = document.createElement('button');
        chatButton.id = 'chatbot-toggle-btn-${chatbotId}';
        
        if (config.avatarUrl) {
          chatButton.innerHTML = \`<img src="\${config.avatarUrl}" alt="Chat" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">\`;
        } else {
          chatButton.innerHTML = '💬';
        }
        
        chatButton.style.cssText = \`
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: \${themeColors.primary};
          color: \${themeColors.secondary};
          border: none;
          cursor: pointer;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        \`;
        container.appendChild(chatButton);
      }

      // Create chat window
      const chatWindow = document.createElement('div');
      chatWindow.id = 'chatbot-window-${chatbotId}';
      
      if (isFullPage) {
        chatWindow.style.cssText = \`
          width: 100%;
          height: 100%;
          background: \${themeColors.background};
          display: flex;
          flex-direction: column;
          overflow: hidden;
        \`;
      } else {
        chatWindow.style.cssText = \`
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: \${themeColors.background};
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid \${themeColors.border};
        \`;
      }

      // Chat header
      const chatHeader = document.createElement('div');
      chatHeader.style.cssText = \`
        background: \${themeColors.primary};
        color: \${themeColors.secondary};
        padding: 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      \`;
      
      let headerContent = \`<span>\${config.name}</span>\`;
      if (config.paymentOverdue) {
        headerContent += '<span style="background: #ff6b6b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Payment Due</span>';
      }
      chatHeader.innerHTML = headerContent;

      // Chat messages area
      const chatMessages = document.createElement('div');
      chatMessages.id = 'chatbot-messages-${chatbotId}';
      chatMessages.style.cssText = \`
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: \${themeColors.chatBg};
      \`;

      // Welcome message
      const welcomeMsg = document.createElement('div');
      welcomeMsg.style.cssText = \`
        background: \${themeColors.background};
        color: \${themeColors.text};
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid \${themeColors.border};
      \`;
      welcomeMsg.textContent = config.startingPhrase;
      chatMessages.appendChild(welcomeMsg);

      // Chat input area
      const chatInputArea = document.createElement('div');
      chatInputArea.style.cssText = \`
        padding: 16px;
        border-top: 1px solid \${themeColors.border};
        background: \${themeColors.background};
      \`;

      const chatInput = document.createElement('input');
      chatInput.type = 'text';
      chatInput.placeholder = 'Type your message...';
      chatInput.style.cssText = \`
        width: 100%;
        padding: 12px;
        border: 1px solid \${themeColors.border};
        border-radius: 6px;
        outline: none;
        font-size: 14px;
        background: \${themeColors.background};
        color: \${themeColors.text};
      \`;

      chatInputArea.appendChild(chatInput);

      // Footer branding
      if (config.footerBranding) {
        const footer = document.createElement('div');
        footer.style.cssText = \`
          padding: 8px 16px;
          text-align: center;
          font-size: 12px;
          color: \${isDarkTheme ? '#888' : '#666'};
          border-top: 1px solid \${themeColors.border};
          background: \${themeColors.background};
        \`;
        footer.innerHTML = 'Powered by <a href="https://yvexan-agency.com" target="_blank" style="color: \${themeColors.primary}; text-decoration: none;">Yvexan Agency</a>';
        chatWindow.appendChild(footer);
      }

      // Assemble chat window
      chatWindow.appendChild(chatHeader);
      chatWindow.appendChild(chatMessages);
      chatWindow.appendChild(chatInputArea);

      container.appendChild(chatWindow);

      // Add to page
      document.body.appendChild(container);

      console.log('Chat widget created successfully');

      // Event handlers for corner layout
      if (!isFullPage) {
        const chatButton = container.querySelector('#chatbot-toggle-btn-${chatbotId}');
        let isOpen = false;
        
        chatButton.addEventListener('click', function() {
          isOpen = !isOpen;
          chatWindow.style.display = isOpen ? 'flex' : 'none';
          if (config.avatarUrl) {
            chatButton.innerHTML = isOpen 
              ? '✕' 
              : \`<img src="\${config.avatarUrl}" alt="Chat" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">\`;
          } else {
            chatButton.innerHTML = isOpen ? '✕' : '💬';
          }
          console.log('Chat window toggled:', isOpen ? 'opened' : 'closed');
        });

        chatButton.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.1)';
        });

        chatButton.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
        });
      } else {
        // For full page layout, show immediately
        chatWindow.style.display = 'flex';
      }

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
          background: \${themeColors.primary};
          color: \${themeColors.secondary};
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
          background: \${themeColors.background};
          color: \${themeColors.text};
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          margin-right: 20%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          font-style: italic;
          border: 1px solid \${themeColors.border};
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
          console.log('Chat API response status:', response.status);
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log('Chat API response data:', data);
          
          // Remove typing indicator
          if (typingMsg.parentNode) {
            chatMessages.removeChild(typingMsg);
          }
          
          // Add bot response
          const botMsg = document.createElement('div');
          botMsg.style.cssText = \`
            background: \${themeColors.background};
            color: \${themeColors.text};
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 12px;
            margin-right: 20%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            word-wrap: break-word;
            border: 1px solid \${themeColors.border};
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

    } catch (error) {
      console.error('Error creating chatbot widget:', error);
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

    console.log('Returning embed script for chatbot:', chatbot.name);

    return new NextResponse(embedScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    });

  } catch (error) {
    console.error('Embed script error:', error);
    
    const errorScript = `
console.error('Embed script error:', ${JSON.stringify(error instanceof Error ? error.message : String(error))});
console.log('Raw requested ID: ${params.id}');
console.log('Cleaned chatbot ID: ${chatbotId}');
console.log('Full error object:', ${JSON.stringify(error instanceof Error ? { message: error.message, stack: error.stack } : { error: String(error) })});
`;
    return new NextResponse(errorScript, { 
      status: 200, // Return 200 so the script loads
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript; charset=utf-8',
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
        <span>${chatbot.name}</span>
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

      console.log('Chat widget created successfully');

      // Event handlers
      let isOpen = false;
      chatButton.addEventListener('click', function() {
        isOpen = !isOpen;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        chatButton.innerHTML = isOpen ? '✕' : '💬';
        console.log('Chat window toggled:', isOpen ? 'opened' : 'closed');
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
          console.log('Chat API response status:', response.status);
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log('Chat API response data:', data);
          
          // Remove typing indicator
          if (typingMsg.parentNode) {
            chatMessages.removeChild(typingMsg);
          }
          
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

    } catch (error) {
      console.error('Error creating chatbot widget:', error);
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

    console.log('Returning embed script for chatbot:', chatbot.name);

    return new NextResponse(embedScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    });

  } catch (error) {
    
    // Check if this is an RLS issue by trying without RLS
    console.log('Attempting query without RLS restrictions...');
    const { data: publicData, error: publicError } = await supabase
      .from('chatbots')
      .select('id, name, user_id')
      .limit(5);
    
    console.log('Public query result:', publicData);
    console.log('Public query error:', publicError);
    console.error('Embed script error:', error);
    
    // Try one more query with explicit anon access
    console.log('Attempting explicit anon query...');
    const { data: anonData, error: anonError } = await supabase
      .from('chatbots')
      .select('id, name, user_id')
      .eq('id', chatbotId);
    
    console.log('Anon query result:', anonData);
    console.log('Anon query error:', anonError);
    
    const errorScript = `
console.error('Embed script error:', ${JSON.stringify(error instanceof Error ? error.message : String(error))});
console.log('Raw requested ID: ${params.id}');
console.log('Cleaned chatbot ID: ${chatbotId}');
console.log('Full error object:', ${JSON.stringify(error instanceof Error ? error : { error: String(error) })});
console.log('Anon query result:', ${JSON.stringify(anonData)});
console.log('Anon query error:', ${JSON.stringify(anonError)});
`;
    return new NextResponse(errorScript, { 
      status: 200, // Return 200 so the script loads
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript; charset=utf-8',
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
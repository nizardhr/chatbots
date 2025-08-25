import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Remove .js extension if present
  const chatbotId = params.id.replace(/\.js$/, "");

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  try {
    // Get specific chatbot
    const { data: chatbot, error } = await supabase
      .from("chatbots")
      .select(
        `
        *,
        widget_width,
        widget_height,
        border_radius,
        widget_padding,
        widget_margin,
        color_scheme,
        typography,
        header_config,
        bubble_config,
        input_config,
        footer_config,
        voice_config,
        animation_config,
        responsive_config
      `
      )
      .eq("id", chatbotId)
      .single();

    if (error || !chatbot) {
      const errorScript = `
console.error("Chatbot not found: ${chatbotId}");
console.log("Please check the chatbot ID and try again.");
`;

      return new NextResponse(errorScript, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/javascript; charset=utf-8",
        },
      });
    }

    // Check payment status
    const lastPayment = new Date(chatbot.last_payment_date);
    const today = new Date();
    const daysSincePayment = Math.floor(
      (today.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isOverdue = daysSincePayment > 30;

    const siteUrl =
      process.env.SITE_URL || "https://yvexanchatbots.netlify.app";

    // Parse design configuration with defaults
    const designConfig = {
      layout: chatbot.ui_layout || "corner",
      theme: chatbot.ui_theme || "light",
      width: chatbot.widget_width || "350px",
      height: chatbot.widget_height || "500px",
      borderRadius: chatbot.border_radius || "12px",
      padding: chatbot.widget_padding || "16px",
      margin: chatbot.widget_margin || "20px",
      colors: chatbot.color_scheme || {
        background: "#ffffff",
        header: "#000000",
        botMessage: "#f3f4f6",
        userMessage: "#3b82f6",
        textPrimary: "#111827",
        textSecondary: "#6b7280",
        inputField: "#ffffff",
        inputBorder: "#d1d5db",
        buttonPrimary: "#3b82f6",
        accent: "#8b5cf6",
      },
      typography: chatbot.typography || {
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        headerSize: "18px",
        messageSize: "14px",
        inputSize: "14px",
        headerWeight: "600",
        messageWeight: "400",
      },
      header: chatbot.header_config || {
        showHeader: true,
        customTitle: "",
        showLogo: true,
        showOwnerName: false,
        headerHeight: "60px",
        logoSize: "32px",
      },
      bubbles: chatbot.bubble_config || {
        showTail: true,
        alignment: "left",
        animation: "fade",
        spacing: "8px",
        maxWidth: "80%",
        borderRadius: "18px",
        tailSize: "8px",
        shadow: "light",
        showTimestamp: false,
        showAvatar: false,
      },
      input: chatbot.input_config || {
        placeholder: "Type your message...",
        borderRadius: "24px",
        showMicButton: true,
        showSendButton: true,
        buttonStyle: "modern",
        height: "48px",
        padding: "12px 16px",
        buttonSize: "36px",
        autoFocus: false,
        showCharacterCount: false,
        maxCharacters: "500",
      },
      footer: chatbot.footer_config || {
        showPoweredBy: true,
        customBrandingUrl: "https://yvexan-agency.com",
        customBrandingText: "Powered by Yvexan Agency",
        showCTA: false,
      },
      voice: chatbot.voice_config || {
        autoReadMessages: true,
        pushToTalk: false,
        voiceSpeed: 1.0,
      },
      animation: chatbot.animation_config || {
        messageAnimation: "slideUp",
        typingIndicator: true,
        hoverEffects: true,
        transitionDuration: "300ms",
      },
      responsive: chatbot.responsive_config || {
        mobileWidth: "100%",
        mobileHeight: "100vh",
        tabletWidth: "400px",
        tabletHeight: "600px",
      },
    };

    const embedScript = `
(function() {
  // Prevent multiple instances
  if (window.chatbotWidget_${chatbotId.replace(/-/g, "_")}) {
    return;
  }
  window.chatbotWidget_${chatbotId.replace(/-/g, "_")} = true;

  // Chatbot configuration
  const config = {
    chatbotId: '${chatbotId}',
    name: '${chatbot.name}',
    ownerName: '${chatbot.owner_name || ""}',
    avatarUrl: '${chatbot.bot_avatar_url || ""}',
    startingPhrase: '${
      chatbot.starting_phrase || "Hi there! How can I help you today?"
    }',
    design: ${JSON.stringify(designConfig)},
    voiceEnabled: ${chatbot.voice_enabled},
    dataCaptureEnabled: ${chatbot.data_capture_enabled},
    paymentOverdue: ${isOverdue},
    apiUrl: '${siteUrl}'
  };

  // Create chatbot widget
  function createChatWidget() {
    try {
      const colors = config.design.colors;
      const typography = config.design.typography;
      const isFullPage = config.design.layout === 'full';
      
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
          background: \${colors.background};
          font-family: \${typography.fontFamily};
        \`;
      } else {
        container.style.cssText = \`
          position: fixed;
          bottom: \${config.design.margin};
          right: \${config.design.margin};
          z-index: 10000;
          font-family: \${typography.fontFamily};
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
          border-radius: \${config.design.borderRadius};
          background: \${colors.header};
          color: \${colors.background};
          border: none;
          cursor: pointer;
          font-size: \${typography.messageSize};
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: all \${config.design.animation.transitionDuration} ease;
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
          background: \${colors.background};
          display: flex;
          flex-direction: column;
          overflow: hidden;
        \`;
      } else {
        chatWindow.style.cssText = \`
          position: absolute;
          bottom: 80px;
          right: 0;
          width: \${config.design.width};
          height: \${config.design.height};
          background: \${colors.background};
          border-radius: \${config.design.borderRadius};
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid \${colors.inputBorder};
        \`;
      }

      // Chat header (if enabled)
      if (config.design.header.showHeader) {
        const chatHeader = document.createElement('div');
        chatHeader.style.cssText = \`
          background: \${colors.header};
          color: \${colors.background};
          padding: \${config.design.padding};
          font-weight: \${typography.headerWeight};
          font-size: \${typography.headerSize};
          height: \${config.design.header.headerHeight};
          display: flex;
          justify-content: space-between;
          align-items: center;
        \`;
        
        let headerContent = '';
        
        if (config.design.header.showLogo && config.avatarUrl) {
          headerContent += \`<img src="\${config.avatarUrl}" alt="Bot Avatar" style="width: \${config.design.header.logoSize}; height: \${config.design.header.logoSize}; border-radius: 50%; margin-right: 12px;">\`;
        }
        
        const title = config.design.header.customTitle || config.name;
        headerContent += \`<span>\${title}</span>\`;
        
        if (config.design.header.showOwnerName && config.ownerName) {
          headerContent += \`<small style="opacity: 0.8; font-size: 12px;">by \${config.ownerName}</small>\`;
        }
        
        if (config.paymentOverdue) {
          headerContent += '<span style="background: #ff6b6b; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: auto;">Payment Due</span>';
        }
        
        chatHeader.innerHTML = headerContent;
        chatWindow.appendChild(chatHeader);
      }

      // Chat messages area
      const chatMessages = document.createElement('div');
      chatMessages.id = 'chatbot-messages-${chatbotId}';
      chatMessages.style.cssText = \`
        flex: 1;
        padding: \${config.design.padding};
        overflow-y: auto;
        background: \${colors.background};
      \`;

      // Welcome message
      const welcomeMsg = document.createElement('div');
      const bubbleShadow = config.design.bubbles.shadow === 'none' ? 'none' : 
                          config.design.bubbles.shadow === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' :
                          config.design.bubbles.shadow === 'medium' ? '0 2px 8px rgba(0,0,0,0.15)' :
                          '0 4px 12px rgba(0,0,0,0.2)';
      
      welcomeMsg.style.cssText = \`
        background: \${colors.botMessage};
        color: \${colors.textPrimary};
        padding: 12px 16px;
        border-radius: \${config.design.bubbles.borderRadius};
        margin-bottom: \${config.design.bubbles.spacing};
        max-width: \${config.design.bubbles.maxWidth};
        box-shadow: \${bubbleShadow};
        font-size: \${typography.messageSize};
        font-weight: \${typography.messageWeight};
        animation: \${config.design.animation.messageAnimation} \${config.design.animation.transitionDuration} ease-out;
        position: relative;
      \`;
      
      if (config.design.bubbles.showTail) {
        welcomeMsg.style.cssText += \`
          &::after {
            content: '';
            position: absolute;
            left: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: \${config.design.bubbles.tailSize} solid transparent;
            border-bottom: \${config.design.bubbles.tailSize} solid transparent;
            border-right: \${config.design.bubbles.tailSize} solid \${colors.botMessage};
          }
        \`;
      }
      
      if (config.design.bubbles.showTimestamp) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        welcomeMsg.innerHTML = \`
          <div>\${config.startingPhrase}</div>
          <div style="font-size: 11px; opacity: 0.6; margin-top: 4px;">\${timestamp}</div>
        \`;
      } else {
        welcomeMsg.textContent = config.startingPhrase;
      }
      
      chatMessages.appendChild(welcomeMsg);

      // Chat input area
      const chatInputArea = document.createElement('div');
      chatInputArea.style.cssText = \`
        padding: \${config.design.padding};
        border-top: 1px solid \${colors.inputBorder};
        background: \${colors.background};
      \`;

      const chatInput = document.createElement('input');
      chatInput.type = 'text';
      chatInput.placeholder = config.design.input.placeholder;
      chatInput.maxLength = parseInt(config.design.input.maxCharacters) || 500;
      chatInput.style.cssText = \`
        width: calc(100% - \${config.design.input.showSendButton ? '50px' : '0px'});
        padding: \${config.design.input.padding};
        border: 1px solid \${colors.inputBorder};
        border-radius: \${config.design.input.borderRadius};
        height: \${config.design.input.height};
        outline: none;
        font-size: \${typography.inputSize};
        font-weight: \${typography.inputWeight};
        background: \${colors.inputField};
        color: \${colors.textPrimary};
        font-family: \${typography.fontFamily};
      \`;
      
      if (config.design.input.autoFocus) {
        setTimeout(() => chatInput.focus(), 100);
      }

      chatInputArea.appendChild(chatInput);

      // Add send button if enabled
      if (config.design.input.showSendButton) {
        const sendButton = document.createElement('button');
        sendButton.innerHTML = '→';
        
        const buttonStyle = config.design.input.buttonStyle;
        const buttonSize = config.design.input.buttonSize;
        const borderRadius = buttonStyle === 'rounded' ? '50%' : 
                           buttonStyle === 'modern' ? '8px' : 
                           buttonStyle === 'minimal' ? '4px' : '6px';
        
        sendButton.style.cssText = \`
          position: absolute;
          right: \${config.design.padding};
          bottom: calc(\${config.design.padding} + 8px);
          width: \${buttonSize};
          height: \${buttonSize};
          border: none;
          border-radius: \${borderRadius};
          background: \${colors.buttonPrimary};
          color: white;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all \${config.design.animation.transitionDuration} ease;
        \`;
        
        sendButton.addEventListener('click', () => {
          if (chatInput.value.trim()) {
            sendMessage(chatInput.value.trim());
            chatInput.value = '';
          }
        });
        
        chatInputArea.style.position = 'relative';
        chatInputArea.appendChild(sendButton);
      }

      // Footer branding and CTA
      if (config.design.footer.showPoweredBy || config.design.footer.showCTA) {
        const footer = document.createElement('div');
        footer.style.cssText = \`
          padding: 8px \${config.design.padding};
          text-align: center;
          font-size: 12px;
          color: \${colors.textSecondary};
          border-top: 1px solid \${colors.inputBorder};
          background: \${colors.background};
        \`;
        
        let footerContent = '';
        
        if (config.design.footer.showCTA && config.design.footer.ctaText) {
          footerContent += \`<a href="\${config.design.footer.ctaUrl}" target="_blank" style="color: \${colors.accent}; text-decoration: none; font-weight: 500; display: block; margin-bottom: 4px;">\${config.design.footer.ctaText}</a>\`;
        }
        
        if (config.design.footer.showPoweredBy) {
          footerContent += \`<a href="\${config.design.footer.customBrandingUrl}" target="_blank" style="color: \${colors.textSecondary}; text-decoration: none; opacity: 0.8;">\${config.design.footer.customBrandingText}</a>\`;
        }
        
        footer.innerHTML = footerContent;
        chatWindow.appendChild(footer);
      }

      // Assemble chat window
      chatWindow.appendChild(chatMessages);
      chatWindow.appendChild(chatInputArea);

      container.appendChild(chatWindow);

      // Add to page
      document.body.appendChild(container);

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
        // Add user message
        const userMsg = document.createElement('div');
        const userBubbleShadow = config.design.bubbles.shadow === 'none' ? 'none' : 
                                config.design.bubbles.shadow === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' :
                                config.design.bubbles.shadow === 'medium' ? '0 2px 8px rgba(0,0,0,0.15)' :
                                '0 4px 12px rgba(0,0,0,0.2)';
        
        userMsg.style.cssText = \`
          background: \${colors.userMessage};
          color: white;
          padding: 12px 16px;
          border-radius: \${config.design.bubbles.borderRadius};
          margin-bottom: \${config.design.bubbles.spacing};
          margin-left: calc(100% - \${config.design.bubbles.maxWidth});
          max-width: \${config.design.bubbles.maxWidth};
          text-align: right;
          word-wrap: break-word;
          font-size: \${typography.messageSize};
          font-weight: \${typography.messageWeight};
          animation: \${config.design.animation.messageAnimation} \${config.design.animation.transitionDuration} ease-out;
          position: relative;
          box-shadow: \${userBubbleShadow};
        \`;
        
        if (config.design.bubbles.showTail) {
          userMsg.style.cssText += \`
            &::after {
              content: '';
              position: absolute;
              right: -8px;
              top: 50%;
              transform: translateY(-50%);
              width: 0;
              height: 0;
              border-top: \${config.design.bubbles.tailSize} solid transparent;
              border-bottom: \${config.design.bubbles.tailSize} solid transparent;
              border-left: \${config.design.bubbles.tailSize} solid \${colors.userMessage};
            }
          \`;
        }
        
        if (config.design.bubbles.showTimestamp) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          userMsg.innerHTML = \`
            <div>\${message}</div>
            <div style="font-size: 11px; opacity: 0.6; margin-top: 4px;">\${timestamp}</div>
          \`;
        } else {
          userMsg.textContent = message;
        }
        
        chatMessages.appendChild(userMsg);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add typing indicator
        let typingMsg = null;
        if (config.design.animation.typingIndicator) {
          typingMsg = document.createElement('div');
          typingMsg.style.cssText = \`
            background: \${colors.botMessage};
            color: \${colors.textPrimary};
            padding: 12px 16px;
            border-radius: \${config.design.bubbles.borderRadius};
            margin-bottom: \${config.design.bubbles.spacing};
            max-width: \${config.design.bubbles.maxWidth};
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            font-style: italic;
            font-size: \${typography.messageSize};
            animation: pulse 1.5s ease-in-out infinite;
          \`;
          typingMsg.textContent = 'Typing...';
          chatMessages.appendChild(typingMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }

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
            throw new Error('Network response was not ok: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          // Remove typing indicator
          if (typingMsg && typingMsg.parentNode) {
            chatMessages.removeChild(typingMsg);
          }
          
          // Add bot response
          const botMsg = document.createElement('div');
          const botBubbleShadow = config.design.bubbles.shadow === 'none' ? 'none' : 
                                 config.design.bubbles.shadow === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' :
                                 config.design.bubbles.shadow === 'medium' ? '0 2px 8px rgba(0,0,0,0.15)' :
                                 '0 4px 12px rgba(0,0,0,0.2)';
          
          botMsg.style.cssText = \`
            background: \${colors.botMessage};
            color: \${colors.textPrimary};
            padding: 12px 16px;
            border-radius: \${config.design.bubbles.borderRadius};
            margin-bottom: \${config.design.bubbles.spacing};
            max-width: \${config.design.bubbles.maxWidth};
            box-shadow: \${botBubbleShadow};
            word-wrap: break-word;
            font-size: \${typography.messageSize};
            font-weight: \${typography.messageWeight};
            animation: \${config.design.animation.messageAnimation} \${config.design.animation.transitionDuration} ease-out;
            position: relative;
          \`;
          
          if (config.design.bubbles.showTail) {
            botMsg.style.cssText += \`
              &::after {
                content: '';
                position: absolute;
                left: -8px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: \${config.design.bubbles.tailSize} solid transparent;
                border-bottom: \${config.design.bubbles.tailSize} solid transparent;
                border-right: \${config.design.bubbles.tailSize} solid \${colors.botMessage};
              }
            \`;
          }
          
          if (config.design.bubbles.showTimestamp) {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            botMsg.innerHTML = \`
              <div>\${data.message || 'Sorry, I could not process your request.'}</div>
              <div style="font-size: 11px; opacity: 0.6; margin-top: 4px;">\${timestamp}</div>
            \`;
          } else {
            botMsg.textContent = data.message || 'Sorry, I could not process your request.';
          }
          
          chatMessages.appendChild(botMsg);

          // Play audio if available and auto-read is enabled
          if (config.voiceEnabled && data.audio && config.design.voice.autoReadMessages) {
            try {
              const audio = new Audio('data:audio/mpeg;base64,' + data.audio);
              audio.playbackRate = config.design.voice.voiceSpeed;
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
          if (typingMsg && typingMsg.parentNode) {
            chatMessages.removeChild(typingMsg);
          }
          
          const errorMsg = document.createElement('div');
          errorMsg.style.cssText = \`
            background: #ff6b6b;
            color: white;
            padding: 12px 16px;
            border-radius: \${config.design.bubbles.borderRadius};
            margin-bottom: \${config.design.bubbles.spacing};
            max-width: \${config.design.bubbles.maxWidth};
            font-size: \${typography.messageSize};
          \`;
          errorMsg.textContent = 'Sorry, something went wrong. Please try again.';
          chatMessages.appendChild(errorMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      }

      // Add CSS animations
      const style = document.createElement('style');
      style.textContent = \`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -8px, 0); }
          70% { transform: translate3d(0, -4px, 0); }
          90% { transform: translate3d(0, -2px, 0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      \`;
      document.head.appendChild(style);

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
})();
`;

    return new NextResponse(embedScript, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=300", // 5 minutes cache
      },
    });
  } catch (error) {
    console.error("Embed script error:", error);

    const errorScript = `
console.error('Embed script error:', ${JSON.stringify(
      error instanceof Error ? error.message : String(error)
    )});
console.log('Please check the chatbot configuration and try again.');
`;
    return new NextResponse(errorScript, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript; charset=utf-8",
      },
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

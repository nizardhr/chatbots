'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ChatbotPreviewProps {
  chatbotId: string;
  config: any;
  className?: string;
}

export function ChatbotPreview({ chatbotId, config, className }: ChatbotPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // Generate preview HTML with current config
      const previewHTML = generatePreviewHTML(chatbotId, config);
      const blob = new Blob([previewHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [chatbotId, config]);

  const generatePreviewHTML = (chatbotId: string, config: any) => {
    const siteUrl = process.env.SITE_URL || 'https://yvexanchatbots.netlify.app';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot Preview</title>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: ${config.typography?.fontFamily || 'Inter, sans-serif'};
      background: #f8fafc;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .preview-container {
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 400px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .preview-header {
      background: #1f2937;
      color: white;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }
    
    .preview-content {
      padding: 16px;
      height: calc(100% - 40px);
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .sample-content {
      color: white;
      text-align: center;
      padding: 20px 16px;
    }
    
    .sample-content h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    
    .sample-content p {
      font-size: 0.875rem;
      opacity: 0.9;
      max-width: 300px;
      margin: 0 auto;
      line-height: 1.4;
    }
    
    .chat-widget-preview {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 48px;
      height: 48px;
      background: ${config.color_scheme?.header || '#000000'};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .chat-widget-preview:hover {
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-header">
      Preview: ${config.ui_layout === 'full' ? 'Full Screen Mode' : 'Corner Widget Mode'}
    </div>
    <div class="preview-content">
      <div class="sample-content">
        <h1>Your Website</h1>
        <p>This is how your chatbot will appear on your website. The chatbot widget will be positioned according to your layout settings.</p>
      </div>
      
      <div class="chat-widget-preview">
        💬
      </div>
    </div>
  </div>

  <!-- Load the actual chatbot widget -->
  <script>
    (function() {
      // Simulate the embed script loading
      const script = document.createElement('script');
      script.src = '${siteUrl}/embed/${chatbotId}.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      // Add configuration data attributes
      script.setAttribute('data-layout', '${config.ui_layout || 'corner'}');
      script.setAttribute('data-theme', '${config.ui_theme || 'light'}');
      script.setAttribute('data-preview', 'true');
      
      document.head.appendChild(script);
    })();
  </script>
</body>
</html>
    `;
  };

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <iframe
          ref={iframeRef}
          className="w-full h-64 border-0 rounded-lg"
          title="Chatbot Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </CardContent>
    </Card>
  );
}
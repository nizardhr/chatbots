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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yvexanchatbots.netlify.app';
    
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
      padding: 20px;
      font-family: ${config.typography?.fontFamily || 'Inter, sans-serif'};
      background: #f5f5f5;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .preview-container {
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 1200px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .preview-header {
      background: #333;
      color: white;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .preview-content {
      padding: 20px;
      height: calc(100% - 60px);
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .sample-content {
      color: white;
      text-align: center;
      padding: 40px 20px;
    }
    
    .sample-content h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .sample-content p {
      font-size: 1.2rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
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
          className="w-full h-96 border-0 rounded-lg"
          title="Chatbot Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </CardContent>
    </Card>
  );
}
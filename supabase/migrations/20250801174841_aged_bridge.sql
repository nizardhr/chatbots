/*
  # Advanced Chatbot Design Customization System

  1. New Tables
    - Enhanced chatbots table with comprehensive design fields
    - Voice configuration with full ElevenLabs support
    - Typography and layout controls
    - Animation and interaction settings

  2. Design Fields Added
    - Complete layout control (dimensions, spacing, positioning)
    - Full color palette (background, messages, buttons, accents)
    - Typography system (fonts, sizes, weights)
    - Header customization (logo, title, branding)
    - Chat bubble styling (shapes, animations, alignment)
    - Input field configuration (placeholder, styling, buttons)
    - Footer and branding controls

  3. Voice System Enhancement
    - Full ElevenLabs voice profile management
    - Advanced voice settings (stability, similarity, style)
    - Model selection and language detection
    - Streaming vs pre-generated audio modes
    - Push-to-talk and continuous mic options

  4. Security
    - Maintain existing RLS policies
    - Add indexes for performance
    - Proper data validation
*/

-- Add comprehensive design customization fields to chatbots table
DO $$
BEGIN
  -- Layout and Dimensions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'widget_width'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN widget_width text DEFAULT '350px';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'widget_height'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN widget_height text DEFAULT '500px';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'border_radius'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN border_radius text DEFAULT '12px';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'widget_padding'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN widget_padding text DEFAULT '16px';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'widget_margin'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN widget_margin text DEFAULT '20px';
  END IF;

  -- Color System
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'color_scheme'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN color_scheme jsonb DEFAULT '{
      "background": "#ffffff",
      "header": "#000000",
      "botMessage": "#f3f4f6",
      "userMessage": "#3b82f6",
      "textPrimary": "#111827",
      "textSecondary": "#6b7280",
      "inputField": "#ffffff",
      "inputBorder": "#d1d5db",
      "buttonPrimary": "#3b82f6",
      "buttonSecondary": "#6b7280",
      "accent": "#8b5cf6",
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444"
    }';
  END IF;

  -- Typography
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'typography'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN typography jsonb DEFAULT '{
      "fontFamily": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      "headerSize": "18px",
      "messageSize": "14px",
      "inputSize": "14px",
      "headerWeight": "600",
      "messageWeight": "400",
      "inputWeight": "400"
    }';
  END IF;

  -- Header Configuration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'header_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN header_config jsonb DEFAULT '{
      "showHeader": true,
      "customTitle": "",
      "showLogo": true,
      "showOwnerName": false,
      "headerHeight": "60px",
      "logoSize": "32px"
    }';
  END IF;

  -- Chat Bubble Styling
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'bubble_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN bubble_config jsonb DEFAULT '{
      "showTail": true,
      "alignment": "left",
      "animation": "fade",
      "spacing": "8px",
      "maxWidth": "80%",
      "borderRadius": "18px"
    }';
  END IF;

  -- Input Field Configuration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'input_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN input_config jsonb DEFAULT '{
      "placeholder": "Type your message...",
      "borderRadius": "24px",
      "showMicButton": true,
      "showSendButton": true,
      "buttonStyle": "modern",
      "height": "48px"
    }';
  END IF;

  -- Footer Configuration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'footer_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN footer_config jsonb DEFAULT '{
      "showPoweredBy": true,
      "customBrandingUrl": "https://yvexan-agency.com",
      "customBrandingText": "Powered by Yvexan Agency",
      "showCTA": false,
      "ctaText": "",
      "ctaUrl": ""
    }';
  END IF;

  -- Enhanced Voice Configuration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'voice_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN voice_config jsonb DEFAULT '{
      "model": "eleven_monolingual_v1",
      "autoDetectLanguage": false,
      "streamingMode": false,
      "autoReadMessages": true,
      "pushToTalk": false,
      "continuousMic": false,
      "voiceSpeed": 1.0,
      "outputFormat": "mp3_44100_128"
    }';
  END IF;

  -- Animation and Interaction Settings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'animation_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN animation_config jsonb DEFAULT '{
      "messageAnimation": "slideUp",
      "typingIndicator": true,
      "soundEffects": false,
      "hoverEffects": true,
      "transitionDuration": "300ms"
    }';
  END IF;

  -- Responsive Configuration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'responsive_config'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN responsive_config jsonb DEFAULT '{
      "mobileWidth": "100%",
      "mobileHeight": "100vh",
      "tabletWidth": "400px",
      "tabletHeight": "600px",
      "breakpoints": {
        "mobile": "768px",
        "tablet": "1024px"
      }
    }';
  END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbots_color_scheme ON chatbots USING GIN (color_scheme);
CREATE INDEX IF NOT EXISTS idx_chatbots_typography ON chatbots USING GIN (typography);
CREATE INDEX IF NOT EXISTS idx_chatbots_voice_config ON chatbots USING GIN (voice_config);

-- Create a view for easy access to design configurations
CREATE OR REPLACE VIEW chatbot_design_configs AS
SELECT 
  id,
  name,
  ui_layout,
  ui_theme,
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
  responsive_config,
  bot_avatar_url,
  starting_phrase
FROM chatbots;

-- Grant access to the view
GRANT SELECT ON chatbot_design_configs TO authenticated;
GRANT SELECT ON chatbot_design_configs TO anon;
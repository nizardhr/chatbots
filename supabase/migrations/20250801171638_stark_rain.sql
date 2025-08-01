/*
  # Advanced Chatbot Platform Features

  1. Database Schema Updates
    - Add new customization fields to chatbots table
    - Add model selection and routing options
    - Add UI layout and branding options
    - Add payment tracking enhancements

  2. New Fields Added
    - owner_name (text)
    - bot_avatar_url (text)
    - starting_phrase (text)
    - ui_theme (text: 'light' or 'dark')
    - ui_layout (text: 'corner' or 'full')
    - auto_model_selection (boolean)
    - fallback_models (jsonb array)
    - footer_branding (boolean)
    - available_models (jsonb)

  3. Security
    - Maintain existing RLS policies
    - Add indexes for performance
*/

-- Add new columns to chatbots table
DO $$
BEGIN
  -- Owner and branding fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'owner_name'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN owner_name text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'bot_avatar_url'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN bot_avatar_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'starting_phrase'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN starting_phrase text DEFAULT 'Hi there! How can I help you today?';
  END IF;

  -- UI customization fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'ui_theme'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN ui_theme text DEFAULT 'light' CHECK (ui_theme IN ('light', 'dark'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'ui_layout'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN ui_layout text DEFAULT 'corner' CHECK (ui_layout IN ('corner', 'full'));
  END IF;

  -- Advanced model selection
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'auto_model_selection'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN auto_model_selection boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'fallback_models'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN fallback_models jsonb DEFAULT '["gpt-3.5-turbo", "claude-3.5-haiku"]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'available_models'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN available_models jsonb DEFAULT '{
      "openai": ["gpt-3.5-turbo", "gpt-4", "gpt-4.1", "gpt-4o"],
      "anthropic": ["claude-3.5-haiku", "claude-4-sonnet", "claude-4-opus"],
      "google": ["gemini-pro", "gemini-2.5-flash", "gemini-2.5-pro"]
    }';
  END IF;

  -- Branding options
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'footer_branding'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN footer_branding boolean DEFAULT true;
  END IF;

END $$;

-- Update theme_settings to include new fields
DO $$
BEGIN
  -- Update existing chatbots with enhanced theme settings
  UPDATE chatbots 
  SET theme_settings = jsonb_build_object(
    'primaryColor', COALESCE(theme_settings->>'primaryColor', '#000000'),
    'secondaryColor', COALESCE(theme_settings->>'secondaryColor', '#ffffff'),
    'welcomeMessage', COALESCE(theme_settings->>'welcomeMessage', 'Hi! How can I help you today?'),
    'theme', 'light',
    'layout', 'corner',
    'footerBranding', true
  )
  WHERE theme_settings IS NOT NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbots_ui_layout ON chatbots(ui_layout);
CREATE INDEX IF NOT EXISTS idx_chatbots_auto_model ON chatbots(auto_model_selection);
CREATE INDEX IF NOT EXISTS idx_chatbots_owner ON chatbots(owner_name);
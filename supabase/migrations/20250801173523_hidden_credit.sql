/*
  # Fix Chatbot Schema - Add Missing Columns

  1. New Columns Added
    - `auto_model_selection` (boolean) - Enable intelligent model routing
    - `fallback_models` (jsonb) - Array of fallback model IDs
    - `available_models` (jsonb) - Available models configuration
    - All other missing columns from the advanced features

  2. Security
    - Maintain existing RLS policies
    - Add indexes for performance
*/

-- Add missing columns to chatbots table
DO $$
BEGIN
  -- Auto model selection
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'auto_model_selection'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN auto_model_selection boolean DEFAULT false;
  END IF;

  -- Fallback models
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'fallback_models'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN fallback_models jsonb DEFAULT '["gpt-3.5-turbo", "claude-3.5-haiku"]';
  END IF;

  -- Available models
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

  -- Owner name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'owner_name'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN owner_name text DEFAULT '';
  END IF;

  -- Bot avatar URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'bot_avatar_url'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN bot_avatar_url text DEFAULT '';
  END IF;

  -- Starting phrase
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'starting_phrase'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN starting_phrase text DEFAULT 'Hi there! How can I help you today?';
  END IF;

  -- UI theme
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'ui_theme'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN ui_theme text DEFAULT 'light' CHECK (ui_theme IN ('light', 'dark'));
  END IF;

  -- UI layout
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'ui_layout'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN ui_layout text DEFAULT 'corner' CHECK (ui_layout IN ('corner', 'full'));
  END IF;

  -- Footer branding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chatbots' AND column_name = 'footer_branding'
  ) THEN
    ALTER TABLE chatbots ADD COLUMN footer_branding boolean DEFAULT true;
  END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbots_auto_model ON chatbots(auto_model_selection);
CREATE INDEX IF NOT EXISTS idx_chatbots_ui_layout ON chatbots(ui_layout);
CREATE INDEX IF NOT EXISTS idx_chatbots_ui_theme ON chatbots(ui_theme);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for avatars
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to avatar images
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');
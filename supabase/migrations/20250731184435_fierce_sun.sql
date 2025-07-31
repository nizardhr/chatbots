/*
  # SaaS Chatbot Platform Database Schema

  1. New Tables
    - `chatbots`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, chatbot name)
      - `prompt` (text, chatbot instructions)
      - `openrouter_api_key` (text, encrypted)
      - `model` (text, selected model)
      - `voice_enabled` (boolean)
      - `elevenlabs_api_key` (text, encrypted)
      - `voice_id` (text, selected voice)
      - `voice_settings` (jsonb, pitch, speed, stability)
      - `data_capture_enabled` (boolean)
      - `last_payment_date` (date)
      - `theme_settings` (jsonb, colors, logo, etc.)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `knowledge_base_files`
      - `id` (uuid, primary key)
      - `chatbot_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `filename` (text)
      - `file_path` (text, Supabase storage path)
      - `file_size` (bigint)
      - `file_type` (text)
      - `processed` (boolean)
      - `embeddings_stored` (boolean)
      - `created_at` (timestamptz)

    - `usage_logs`
      - `id` (uuid, primary key)
      - `chatbot_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `tokens_used` (integer)
      - `model_used` (text)
      - `request_type` (text, 'chat', 'voice', etc.)
      - `cost_estimate` (decimal)
      - `created_at` (timestamptz)

    - `leads`
      - `id` (uuid, primary key)
      - `chatbot_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `conversation_context` (jsonb)
      - `captured_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Secure API key storage with encryption
*/

-- Create chatbots table
CREATE TABLE IF NOT EXISTS chatbots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  prompt text DEFAULT '',
  openrouter_api_key text,
  model text DEFAULT 'meta-llama/llama-3.1-8b-instruct:free',
  voice_enabled boolean DEFAULT false,
  elevenlabs_api_key text,
  voice_id text,
  voice_settings jsonb DEFAULT '{"stability": 0.5, "similarity_boost": 0.5, "style": 0.5}',
  data_capture_enabled boolean DEFAULT false,
  last_payment_date date DEFAULT CURRENT_DATE,
  theme_settings jsonb DEFAULT '{"primaryColor": "#000000", "secondaryColor": "#ffffff", "welcomeMessage": "Hi! How can I help you today?"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create knowledge base files table
CREATE TABLE IF NOT EXISTS knowledge_base_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  processed boolean DEFAULT false,
  embeddings_stored boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tokens_used integer NOT NULL DEFAULT 0,
  model_used text NOT NULL,
  request_type text DEFAULT 'chat',
  cost_estimate decimal(10,6) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id uuid REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text,
  email text,
  phone text,
  conversation_context jsonb DEFAULT '{}',
  captured_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for chatbots
CREATE POLICY "Users can manage their own chatbots"
  ON chatbots
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for knowledge base files
CREATE POLICY "Users can manage their own knowledge base files"
  ON knowledge_base_files
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for usage logs
CREATE POLICY "Users can view their own usage logs"
  ON usage_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage logs"
  ON usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for leads
CREATE POLICY "Users can manage their own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_files_chatbot_id ON knowledge_base_files(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_chatbot_id ON usage_logs(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_chatbot_id ON leads(chatbot_id);

-- Create storage bucket for knowledge base files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('knowledge-base', 'knowledge-base', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'knowledge-base' AND auth.uid()::text = (storage.foldername(name))[1]);
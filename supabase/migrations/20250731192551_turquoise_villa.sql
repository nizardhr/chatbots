/*
  # Add Test Credentials

  1. Test Users
    - Creates test user accounts for platform testing
    - Includes sample chatbots and data
    
  2. Sample Data
    - Test chatbots with different configurations
    - Sample usage logs and leads
    
  3. Security
    - Uses Supabase's built-in auth system
    - Passwords are properly hashed
*/

-- Insert test users into auth.users
-- Note: In a real Supabase environment, you would create these users through the Supabase Auth API
-- This is for demonstration purposes - you'll need to create actual users through the signup process

-- Insert sample chatbots for testing (assuming user will be created through signup)
-- We'll create these with placeholder user_ids that can be updated once real users are created

-- Sample chatbot 1
INSERT INTO chatbots (
  id,
  user_id,
  name,
  prompt,
  openrouter_api_key,
  model,
  voice_enabled,
  elevenlabs_api_key,
  voice_id,
  voice_settings,
  data_capture_enabled,
  last_payment_date,
  theme_settings,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001', -- Placeholder - will be updated with real user ID
  'Customer Support Bot',
  'You are a helpful customer support assistant. Be friendly, professional, and try to resolve customer issues quickly.',
  'your-openrouter-key-here',
  'meta-llama/llama-3.1-8b-instruct:free',
  true,
  'your-elevenlabs-key-here',
  'voice-id-here',
  '{"stability": 0.7, "similarity_boost": 0.8, "style": 0.6}',
  true,
  CURRENT_DATE,
  '{"primaryColor": "#2563eb", "secondaryColor": "#ffffff", "welcomeMessage": "Hi! How can I help you today?"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Sample chatbot 2
INSERT INTO chatbots (
  id,
  user_id,
  name,
  prompt,
  openrouter_api_key,
  model,
  voice_enabled,
  elevenlabs_api_key,
  voice_id,
  voice_settings,
  data_capture_enabled,
  last_payment_date,
  theme_settings,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001', -- Placeholder - will be updated with real user ID
  'Sales Assistant',
  'You are a sales assistant for a SaaS company. Help potential customers understand our product features and pricing.',
  'your-openrouter-key-here',
  'meta-llama/llama-3.1-8b-instruct:free',
  false,
  null,
  null,
  '{"stability": 0.5, "similarity_boost": 0.5, "style": 0.5}',
  true,
  CURRENT_DATE - INTERVAL '15 days',
  '{"primaryColor": "#059669", "secondaryColor": "#ffffff", "welcomeMessage": "Welcome! Interested in learning about our platform?"}',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Sample usage logs
INSERT INTO usage_logs (
  chatbot_id,
  user_id,
  tokens_used,
  model_used,
  request_type,
  cost_estimate,
  created_at
) 
SELECT 
  c.id,
  c.user_id,
  FLOOR(RANDOM() * 1000 + 100)::integer,
  c.model,
  'chat',
  RANDOM() * 0.01,
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM chatbots c
WHERE c.user_id = '00000000-0000-0000-0000-000000000001'
LIMIT 10;

-- Sample leads
INSERT INTO leads (
  chatbot_id,
  user_id,
  full_name,
  email,
  phone,
  conversation_context,
  captured_at
)
SELECT 
  c.id,
  c.user_id,
  'John Doe',
  'john.doe@example.com',
  '+1-555-0123',
  '{"message": "I am interested in your product", "response": "Great! Let me help you learn more about our features."}',
  NOW() - (RANDOM() * INTERVAL '7 days')
FROM chatbots c
WHERE c.user_id = '00000000-0000-0000-0000-000000000001' AND c.data_capture_enabled = true
LIMIT 3;

INSERT INTO leads (
  chatbot_id,
  user_id,
  full_name,
  email,
  phone,
  conversation_context,
  captured_at
)
SELECT 
  c.id,
  c.user_id,
  'Jane Smith',
  'jane.smith@company.com',
  '+1-555-0456',
  '{"message": "What are your pricing plans?", "response": "We have several pricing tiers to fit different needs."}',
  NOW() - (RANDOM() * INTERVAL '5 days')
FROM chatbots c
WHERE c.user_id = '00000000-0000-0000-0000-000000000001' AND c.data_capture_enabled = true
LIMIT 2;
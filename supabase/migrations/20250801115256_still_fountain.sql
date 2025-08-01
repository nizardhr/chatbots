/*
  # Fix Embed Access for Chatbots

  1. Security Changes
    - Add public read policy for chatbots table to allow embed scripts
    - Maintain security for write operations (still require authentication)
    - Allow anonymous access only for reading chatbot configuration

  2. Changes Made
    - Add policy for anonymous users to read chatbot data for embed purposes
    - Keep existing authenticated user policies intact
*/

-- Add policy to allow anonymous read access for embed scripts
CREATE POLICY "Allow anonymous read for embed scripts"
  ON chatbots
  FOR SELECT
  TO anon
  USING (true);

-- Ensure the anon role has SELECT permission on chatbots table
GRANT SELECT ON chatbots TO anon;
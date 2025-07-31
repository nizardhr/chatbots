import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      chatbots: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          prompt: string;
          openrouter_api_key: string | null;
          model: string;
          voice_enabled: boolean;
          elevenlabs_api_key: string | null;
          voice_id: string | null;
          voice_settings: any;
          data_capture_enabled: boolean;
          last_payment_date: string;
          theme_settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          prompt?: string;
          openrouter_api_key?: string | null;
          model?: string;
          voice_enabled?: boolean;
          elevenlabs_api_key?: string | null;
          voice_id?: string | null;
          voice_settings?: any;
          data_capture_enabled?: boolean;
          last_payment_date?: string;
          theme_settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          prompt?: string;
          openrouter_api_key?: string | null;
          model?: string;
          voice_enabled?: boolean;
          elevenlabs_api_key?: string | null;
          voice_id?: string | null;
          voice_settings?: any;
          data_capture_enabled?: boolean;
          last_payment_date?: string;
          theme_settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_base_files: {
        Row: {
          id: string;
          chatbot_id: string;
          user_id: string;
          filename: string;
          file_path: string;
          file_size: number;
          file_type: string;
          processed: boolean;
          embeddings_stored: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          chatbot_id: string;
          user_id: string;
          filename: string;
          file_path: string;
          file_size: number;
          file_type: string;
          processed?: boolean;
          embeddings_stored?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          chatbot_id?: string;
          user_id?: string;
          filename?: string;
          file_path?: string;
          file_size?: number;
          file_type?: string;
          processed?: boolean;
          embeddings_stored?: boolean;
          created_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          chatbot_id: string;
          user_id: string;
          tokens_used: number;
          model_used: string;
          request_type: string;
          cost_estimate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          chatbot_id: string;
          user_id: string;
          tokens_used?: number;
          model_used: string;
          request_type?: string;
          cost_estimate?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          chatbot_id?: string;
          user_id?: string;
          tokens_used?: number;
          model_used?: string;
          request_type?: string;
          cost_estimate?: number;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          chatbot_id: string;
          user_id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          conversation_context: any;
          captured_at: string;
        };
        Insert: {
          id?: string;
          chatbot_id: string;
          user_id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          conversation_context?: any;
          captured_at?: string;
        };
        Update: {
          id?: string;
          chatbot_id?: string;
          user_id?: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          conversation_context?: any;
          captured_at?: string;
        };
      };
    };
  };
};
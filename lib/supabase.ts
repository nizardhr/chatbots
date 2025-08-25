// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client (for auth, public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for admin operations, bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Type definitions for your database
export type Database = {
 public: {
   Tables: {
     chatbots: {
       Row: {
         id: string;
         user_id: string;
         name: string;
         prompt: string;
         owner_name: string;
         bot_avatar_url: string;
         starting_phrase: string;
         openrouter_api_key: string | null;
         model: string;
         voice_enabled: boolean;
         elevenlabs_api_key: string | null;
         voice_id: string | null;
         data_capture_enabled: boolean;
         ui_layout: string;
         ui_theme: string;
         widget_width: string;
         widget_height: string;
         border_radius: string;
         widget_padding: string;
         widget_margin: string;
         color_scheme: any;
         typography: any;
         header_config: any;
         bubble_config: any;
         input_config: any;
         footer_config: any;
         animation_config: any;
         responsive_config: any;
         voice_settings: any;
         last_payment_date: string;
         is_active: boolean;
         created_at: string;
         updated_at: string;
       };
       Insert: {
         id?: string;
         user_id: string;
         name: string;
         prompt?: string;
         owner_name?: string;
         bot_avatar_url?: string;
         starting_phrase?: string;
         openrouter_api_key?: string | null;
         model?: string;
         voice_enabled?: boolean;
         elevenlabs_api_key?: string | null;
         voice_id?: string | null;
         data_capture_enabled?: boolean;
         ui_layout?: string;
         ui_theme?: string;
         widget_width?: string;
         widget_height?: string;
         border_radius?: string;
         widget_padding?: string;
         widget_margin?: string;
         color_scheme?: any;
         typography?: any;
         header_config?: any;
         bubble_config?: any;
         input_config?: any;
         footer_config?: any;
         animation_config?: any;
         responsive_config?: any;
         voice_settings?: any;
         last_payment_date?: string;
         is_active?: boolean;
         created_at?: string;
         updated_at?: string;
       };
       Update: {
         id?: string;
         user_id?: string;
         name?: string;
         prompt?: string;
         owner_name?: string;
         bot_avatar_url?: string;
         starting_phrase?: string;
         openrouter_api_key?: string | null;
         model?: string;
         voice_enabled?: boolean;
         elevenlabs_api_key?: string | null;
         voice_id?: string | null;
         data_capture_enabled?: boolean;
         ui_layout?: string;
         ui_theme?: string;
         widget_width?: string;
         widget_height?: string;
         border_radius?: string;
         widget_padding?: string;
         widget_margin?: string;
         color_scheme?: any;
         typography?: any;
         header_config?: any;
         bubble_config?: any;
         input_config?: any;
         footer_config?: any;
         animation_config?: any;
         responsive_config?: any;
         voice_settings?: any;
         last_payment_date?: string;
         is_active?: boolean;
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
     conversations: {
       Row: {
         id: string;
         chatbot_id: string;
         session_id: string;
         user_ip: string | null;
         started_at: string;
         last_activity_at: string;
         message_count: number;
         lead_captured: boolean;
         lead_email: string | null;
         lead_name: string | null;
         lead_phone: string | null;
       };
       Insert: {
         id?: string;
         chatbot_id: string;
         session_id: string;
         user_ip?: string | null;
         started_at?: string;
         last_activity_at?: string;
         message_count?: number;
         lead_captured?: boolean;
         lead_email?: string | null;
         lead_name?: string | null;
         lead_phone?: string | null;
       };
       Update: {
         id?: string;
         chatbot_id?: string;
         session_id?: string;
         user_ip?: string | null;
         started_at?: string;
         last_activity_at?: string;
         message_count?: number;
         lead_captured?: boolean;
         lead_email?: string | null;
         lead_name?: string | null;
         lead_phone?: string | null;
       };
     };
     messages: {
       Row: {
         id: string;
         conversation_id: string;
         chatbot_id: string;
         content: string;
         role: string;
         model_used: string | null;
         tokens_used: number;
         created_at: string;
       };
       Insert: {
         id?: string;
         conversation_id: string;
         chatbot_id: string;
         content: string;
         role: string;
         model_used?: string | null;
         tokens_used?: number;
         created_at?: string;
       };
       Update: {
         id?: string;
         conversation_id?: string;
         chatbot_id?: string;
         content?: string;
         role?: string;
         model_used?: string | null;
         tokens_used?: number;
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
         cost_estimate: number;
         created_at: string;
       };
       Insert: {
         id?: string;
         chatbot_id: string;
         user_id: string;
         tokens_used?: number;
         model_used: string;
         cost_estimate?: number;
         created_at?: string;
       };
       Update: {
         id?: string;
         chatbot_id?: string;
         user_id?: string;
         tokens_used?: number;
         model_used?: string;
         cost_estimate?: number;
         created_at?: string;
       };
     };
   };
 };
};
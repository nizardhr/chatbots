// Mock Supabase client for local development
// This allows the app to run without real Supabase setup

interface MockUser {
  id: string;
  email: string;
}

interface MockSession {
  user: MockUser;
}

class MockSupabaseClient {
  private mockUser: MockUser | null = null;
  private mockData: any = {
    chatbots: [],
    usage_logs: [],
    leads: [],
    knowledge_base_files: []
  };

  auth = {
    signUp: async (credentials: any) => {
      const user = {
        id: 'mock-user-id',
        email: credentials.email
      };
      this.mockUser = user;
      return { data: { user }, error: null };
    },

    signInWithPassword: async (credentials: any) => {
      const user = {
        id: 'mock-user-id',
        email: credentials.email
      };
      this.mockUser = user;
      return { data: { user, session: { user } }, error: null };
    },

    signOut: async () => {
      this.mockUser = null;
      return { error: null };
    },

    getUser: async () => {
      return { data: { user: this.mockUser }, error: null };
    },

    getSession: async () => {
      return { 
        data: { 
          session: this.mockUser ? { user: this.mockUser } : null 
        }, 
        error: null 
      };
    }
  };

  from(table: string) {
    return {
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: { message: 'No data found' } }),
          order: (column: string, options?: any) => ({
            then: async (callback: any) => callback({ data: [], error: null })
          })
        }),
        order: (column: string, options?: any) => ({
          then: async (callback: any) => callback({ data: [], error: null })
        }),
        then: async (callback: any) => callback({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ 
            data: { ...data, id: 'mock-id-' + Date.now() }, 
            error: null 
          })
        }),
        then: async (callback: any) => callback({ data: null, error: null })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => callback({ data: null, error: null })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => callback({ data: null, error: null })
        })
      })
    };
  }

  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        return { error: null };
      }
    })
  };
}

// Use mock client if no real Supabase URL is provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') 
  ? require('@supabase/supabase-js').createClient(supabaseUrl, supabaseKey)
  : new MockSupabaseClient();

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
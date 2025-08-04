'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Define a type for your chatbot data for type safety
type ChatbotData = any; // Replace 'any' with a more specific type if available from lib/supabase.ts

interface ChatbotContextType {
  chatbot: ChatbotData | null;
  loading: boolean;
  updateChatbot: (updatedFields: Partial<ChatbotData>) => void;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children, chatbotId }: { children: React.ReactNode; chatbotId: string }) {
  const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChatbot = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('id', chatbotId)
        .single();

      if (error) {
        console.error('Error fetching chatbot data:', error);
        router.push('/dashboard');
      } else {
        setChatbot(data);
      }
      setLoading(false);
    };

    if (chatbotId) {
      fetchChatbot();
    }
  }, [chatbotId, router]);

  const updateChatbot = useCallback((updatedFields: Partial<ChatbotData>) => {
    setChatbot((prev) => (prev ? { ...prev, ...updatedFields } : null));
  }, []);

  const saveChanges = async () => {
    if (!chatbot) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('chatbots')
      .update({ ...chatbot, updated_at: new Date().toISOString() })
      .eq('id', chatbot.id);

    if (error) {
      console.error('Failed to save changes:', error);
      // Here you would ideally show a toast notification
      alert('Error saving changes.');
    } else {
      // alert('Changes saved successfully!');
      router.refresh(); // Re-fetches data on the server for the current route
    }
    setIsSaving(false);
  };

  return (
    <ChatbotContext.Provider value={{ chatbot, loading, updateChatbot, saveChanges, isSaving }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
} 
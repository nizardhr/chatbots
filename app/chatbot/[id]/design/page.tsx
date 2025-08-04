'use client';

import { useChatbot } from '../chatbot-context';
import { DesignPanel } from '@/components/ui/design-panel';
import { ChatbotPreview } from '@/components/ui/chatbot-preview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DesignPage() {
  const { chatbot, updateChatbot, loading } = useChatbot();

  if (loading || !chatbot) {
    return (
        <div>
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full mt-4" />
        </div>
    );
  }

  // Dummy functions for props that are not used on this page
  const handlePreview = () => {};
  const handleVoicePreview = async () => {};

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChatbotPreview chatbotId={chatbot.id} config={chatbot} className="w-full" />
        </CardContent>
      </Card>
      
      <DesignPanel
        config={chatbot}
        onChange={(updatedConfig) => updateChatbot(updatedConfig)}
        onPreview={handlePreview}
        voiceEnabled={chatbot.voice_enabled}
        availableVoices={[]} // Pass empty or fetch if needed
        onVoicePreview={handleVoicePreview}
      />
    </div>
  );
} 
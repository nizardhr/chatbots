'use client';

import { useChatbot } from '../chatbot-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

export default function IdentityPage() {
  const { chatbot, updateChatbot, loading } = useChatbot();

  if (loading || !chatbot) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Identity & Personality</h2>
        <p className="text-muted-foreground">
          Configure your chatbot's core settings and identity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>Basic Information</span>
          </CardTitle>
          <CardDescription>
            Configure your chatbot's core settings and identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Chatbot Name *</Label>
              <Input
                id="name"
                required
                value={chatbot.name || ''}
                onChange={(e) => updateChatbot({ name: e.target.value })}
                placeholder="e.g., Customer Support Bot"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner_name" className="text-sm font-medium">Owner Name</Label>
              <Input
                id="owner_name"
                value={chatbot.owner_name || ''}
                onChange={(e) => updateChatbot({ owner_name: e.target.value })}
                placeholder="Your name or company"
                className="h-10"
              />
            </div>
          </div>

          <FileUpload
            label="Bot Avatar"
            description="Upload an avatar image for your chatbot"
            currentUrl={chatbot.bot_avatar_url || ''}
            userId={chatbot.user_id || ''}
            onUpload={(url) => updateChatbot({ bot_avatar_url: url })}
            maxSize={5}
          />

          <div className="space-y-2">
            <Label htmlFor="starting_phrase" className="text-sm font-medium">Starting Phrase</Label>
            <Input
              id="starting_phrase"
              value={chatbot.starting_phrase || ''}
              onChange={(e) => updateChatbot({ starting_phrase: e.target.value })}
              placeholder="Hi there! How can I help you today?"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">System Prompt & Instructions</Label>
            <Textarea
              id="prompt"
              value={chatbot.prompt || ''}
              onChange={(e) => updateChatbot({ prompt: e.target.value })}
              placeholder="Describe how your chatbot should behave and what it should help with..."
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
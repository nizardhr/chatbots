'use client';

import { useChatbot } from '../chatbot-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

export default function LeadsPage() {
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
        <h2 className="text-2xl font-bold tracking-tight">Lead Capture</h2>
        <p className="text-muted-foreground">
          Enable conversational lead data collection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <span>Lead Capture</span>
          </CardTitle>
          <CardDescription>
            Enable conversational lead data collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="data_capture_enabled"
                checked={chatbot.data_capture_enabled || false}
                onCheckedChange={(checked) => updateChatbot({ data_capture_enabled: checked })}
              />
              <Label htmlFor="data_capture_enabled" className="text-sm font-medium">Enable Lead Capture</Label>
            </div>
            {chatbot.data_capture_enabled && (
              <p className="text-sm text-gray-600">
                Your chatbot will naturally ask for contact information during conversations
                and store leads in your dashboard.
              </p>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="footer_branding"
                checked={chatbot.footer_branding !== false}
                onCheckedChange={(checked) => updateChatbot({ footer_branding: checked })}
              />
              <Label htmlFor="footer_branding" className="text-sm font-medium">Show Footer Branding</Label>
            </div>
            {chatbot.footer_branding !== false && (
              <p className="text-sm text-gray-600">
                Display "Powered by Yvexan Agency" in the chatbot footer.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
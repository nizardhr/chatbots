'use client';

import { useChatbot } from '../chatbot-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Mic } from 'lucide-react';

export default function VoicePage() {
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
        <h2 className="text-2xl font-bold tracking-tight">Voice Integration</h2>
        <p className="text-muted-foreground">
          Add voice capabilities using ElevenLabs (optional)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5 text-orange-600" />
            <span>Voice Integration</span>
          </CardTitle>
          <CardDescription>
            Add voice capabilities using ElevenLabs (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="voice_enabled"
              checked={chatbot.voice_enabled || false}
              onCheckedChange={(checked) => updateChatbot({ voice_enabled: checked })}
            />
            <Label htmlFor="voice_enabled" className="text-sm font-medium">Enable Voice</Label>
          </div>

          {chatbot.voice_enabled && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs_api_key" className="text-sm font-medium">ElevenLabs API Key</Label>
                  <Input
                    id="elevenlabs_api_key"
                    type="password"
                    value={chatbot.elevenlabs_api_key || ''}
                    onChange={(e) => updateChatbot({ elevenlabs_api_key: e.target.value })}
                    placeholder="Enter your ElevenLabs API key"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice_id" className="text-sm font-medium">Voice</Label>
                  <Select
                    value={chatbot.voice_id || ''}
                    onValueChange={(value) => updateChatbot({ voice_id: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voice1">Voice 1</SelectItem>
                      <SelectItem value="voice2">Voice 2</SelectItem>
                      <SelectItem value="voice3">Voice 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stability" className="text-sm font-medium">Stability</Label>
                    <Input
                      id="stability"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={chatbot.voice_settings?.stability || 0.5}
                      onChange={(e) => updateChatbot({ 
                        voice_settings: { 
                          ...chatbot.voice_settings, 
                          stability: parseFloat(e.target.value) 
                        } 
                      })}
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {chatbot.voice_settings?.stability || 0.5}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="similarity_boost" className="text-sm font-medium">Similarity</Label>
                    <Input
                      id="similarity_boost"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={chatbot.voice_settings?.similarity_boost || 0.5}
                      onChange={(e) => updateChatbot({ 
                        voice_settings: { 
                          ...chatbot.voice_settings, 
                          similarity_boost: parseFloat(e.target.value) 
                        } 
                      })}
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {chatbot.voice_settings?.similarity_boost || 0.5}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-sm font-medium">Style</Label>
                    <Input
                      id="style"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={chatbot.voice_settings?.style || 0.5}
                      onChange={(e) => updateChatbot({ 
                        voice_settings: { 
                          ...chatbot.voice_settings, 
                          style: parseFloat(e.target.value) 
                        } 
                      })}
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {chatbot.voice_settings?.style || 0.5}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
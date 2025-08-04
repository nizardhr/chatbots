'use client';

import { useChatbot } from '../chatbot-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { MODEL_PROVIDERS, getAllModels } from '@/lib/models';

export default function ModelPage() {
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
        <h2 className="text-2xl font-bold tracking-tight">AI Model & Configuration</h2>
        <p className="text-muted-foreground">
          Configure the AI model and API settings for your chatbot
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>AI Model Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure the AI model and API settings for your chatbot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="openrouter_api_key" className="text-sm font-medium">OpenRouter API Key *</Label>
            <Input
              id="openrouter_api_key"
              type="password"
              required
              value={chatbot.openrouter_api_key || ''}
              onChange={(e) => updateChatbot({ openrouter_api_key: e.target.value })}
              placeholder="Enter your OpenRouter API key"
              className="h-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_model_selection"
              checked={chatbot.auto_model_selection || false}
              onCheckedChange={(checked) => updateChatbot({ auto_model_selection: checked })}
            />
            <Label htmlFor="auto_model_selection" className="text-sm font-medium">Enable Intelligent Model Selection</Label>
          </div>

          {!chatbot.auto_model_selection && (
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">Default AI Model</Label>
              <Select
                value={chatbot.model || ''}
                onValueChange={(value) => updateChatbot({ model: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_PROVIDERS.map((provider) => (
                    <div key={provider.id}>
                      <div className="px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100">
                        {provider.name}
                      </div>
                      {provider.models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-gray-500">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-sm font-medium">Fallback Models</Label>
            <div className="grid grid-cols-2 gap-3">
              {getAllModels().slice(0, 6).map((model) => (
                <div key={model.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fallback-${model.id}`}
                    checked={(chatbot.fallback_models || []).includes(model.id)}
                    onCheckedChange={(checked) => {
                      const currentFallbacks = chatbot.fallback_models || [];
                      const newFallbacks = checked
                        ? [...currentFallbacks, model.id]
                        : currentFallbacks.filter(m => m !== model.id);
                      updateChatbot({ fallback_models: newFallbacks });
                    }}
                  />
                  <Label htmlFor={`fallback-${model.id}`} className="text-sm">
                    {model.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Last Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {chatbot.last_payment_date ? format(new Date(chatbot.last_payment_date), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={chatbot.last_payment_date ? new Date(chatbot.last_payment_date) : undefined}
                  onSelect={(date) => date && updateChatbot({ last_payment_date: date.toISOString() })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
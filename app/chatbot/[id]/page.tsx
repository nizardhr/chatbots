'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { getAvailableModels } from '@/lib/openrouter-advanced';
import { MODEL_PROVIDERS, getAllModels } from '@/lib/models';
import { getElevenLabsVoices } from '@/lib/elevenlabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, ArrowLeft, Bot, Mic, Database, Palette, Save, User, Image, MessageSquare, Sparkles, Paintbrush } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DesignPanel } from '@/components/ui/design-panel';
import { ChatbotPreview } from '@/components/ui/chatbot-preview';
import Link from 'next/link';
import { ChatbotEditorLayout } from '@/components/ui/chatbot-editor-layout';
import { Checkbox } from '@/components/ui/checkbox';

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
}

const sidebarNavItems = [
    { title: 'Identity', href: '#identity', icon: Bot },
    { title: 'AI Model', href: '#model', icon: Sparkles },
    { title: 'Knowledge', href: '#knowledge', icon: Database },
    { title: 'Voice', href: '#voice', icon: Mic },
    { title: 'Lead Capture', href: '#leads', icon: User },
    { title: 'Design', href: '#design', icon: Paintbrush },
];

export default function EditChatbotPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const params = useParams();
  const chatbotId = params?.id as string;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    bot_avatar_url: '',
    starting_phrase: 'Hi there! How can I help you today?',
    prompt: '',
    openrouter_api_key: '',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    auto_model_selection: false,
    fallback_models: ['gpt-3.5-turbo', 'claude-3.5-haiku'],
    voice_enabled: false,
    elevenlabs_api_key: '',
    voice_id: '',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
      style: 0.5,
    },
    data_capture_enabled: false,
    last_payment_date: new Date(),
    ui_theme: 'light' as 'light' | 'dark',
    ui_layout: 'corner' as 'corner' | 'full',
    footer_branding: true,
    theme_settings: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      welcomeMessage: 'Hi! How can I help you today?',
    },
  });

  // Initialize design config with defaults if not present
  const initializeDesignConfig = (data: any) => {
    return {
      ...data,
      widget_width: data.widget_width || '350px',
      widget_height: data.widget_height || '500px',
      border_radius: data.border_radius || '12px',
      widget_padding: data.widget_padding || '16px',
      widget_margin: data.widget_margin || '20px',
      color_scheme: data.color_scheme || {
        background: '#ffffff',
        header: '#000000',
        botMessage: '#f3f4f6',
        userMessage: '#3b82f6',
        textPrimary: '#111827',
        textSecondary: '#6b7280',
        inputField: '#ffffff',
        inputBorder: '#d1d5db',
        buttonPrimary: '#3b82f6',
        buttonSecondary: '#6b7280',
        accent: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      typography: data.typography || {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        headerSize: '18px',
        messageSize: '14px',
        inputSize: '14px',
        headerWeight: '600',
        messageWeight: '400',
        inputWeight: '400'
      },
      header_config: data.header_config || {
        showHeader: true,
        customTitle: '',
        showLogo: true,
        showOwnerName: false,
        headerHeight: '60px',
        logoSize: '32px'
      },
      bubble_config: data.bubble_config || {
        showTail: true,
        alignment: 'left',
        animation: 'fade',
        spacing: '8px',
        maxWidth: '80%',
        borderRadius: '18px',
        tailSize: '8px',
        shadow: 'light',
        showTimestamp: false,
        showAvatar: false
      },
      input_config: data.input_config || {
        placeholder: 'Type your message...',
        borderRadius: '24px',
        showMicButton: true,
        showSendButton: true,
        buttonStyle: 'modern',
        height: '48px',
        padding: '12px 16px',
        buttonSize: '36px',
        autoFocus: false,
        showCharacterCount: false,
        maxCharacters: '500'
      },
      footer_config: data.footer_config || {
        showPoweredBy: true,
        customBrandingUrl: 'https://yvexan-agency.com',
        customBrandingText: 'Powered by Yvexan Agency',
        showCTA: false,
        ctaText: '',
        ctaUrl: ''
      },
      voice_config: data.voice_config || {
        model: 'eleven_monolingual_v1',
        autoDetectLanguage: false,
        streamingMode: false,
        autoReadMessages: true,
        pushToTalk: false,
        continuousMic: false,
        voiceSpeed: 1.0,
        outputFormat: 'mp3_44100_128'
      },
      animation_config: data.animation_config || {
        messageAnimation: 'slideUp',
        typingIndicator: true,
        soundEffects: false,
        hoverEffects: true,
        transitionDuration: '300ms'
      },
      responsive_config: data.responsive_config || {
        mobileWidth: '100%',
        mobileHeight: '100vh',
        tabletWidth: '400px',
        tabletHeight: '600px',
        breakpoints: {
          mobile: '768px',
          tablet: '1024px'
        }
      }
    };
  };

  useEffect(() => {
    const checkUserAndLoadChatbot = async () => {
      const { user, error } = await getCurrentUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await loadChatbot(user.id);
    };

    checkUserAndLoadChatbot();
  }, [router, chatbotId]);

  const loadChatbot = async (userId: string) => {
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Error loading chatbot:', error);
      router.push('/dashboard');
      return;
    }

    const initializedData = initializeDesignConfig({
      name: data.name,
      owner_name: data.owner_name || '',
      bot_avatar_url: data.bot_avatar_url || '',
      starting_phrase: data.starting_phrase || 'Hi there! How can I help you today?',
      prompt: data.prompt || '',
      openrouter_api_key: data.openrouter_api_key || '',
      model: data.model,
      auto_model_selection: data.auto_model_selection || false,
      fallback_models: data.fallback_models || ['gpt-3.5-turbo', 'claude-3.5-haiku'],
      voice_enabled: data.voice_enabled,
      elevenlabs_api_key: data.elevenlabs_api_key || '',
      voice_id: data.voice_id || '',
      voice_settings: data.voice_settings || {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.5,
      },
      data_capture_enabled: data.data_capture_enabled,
      last_payment_date: new Date(data.last_payment_date),
      ui_theme: data.ui_theme || 'light',
      ui_layout: data.ui_layout || 'corner',
      footer_branding: data.footer_branding !== false,
      theme_settings: data.theme_settings || {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        welcomeMessage: 'Hi! How can I help you today?',
      },
      // Include all the design fields from the database
      widget_width: data.widget_width,
      widget_height: data.widget_height,
      border_radius: data.border_radius,
      widget_padding: data.widget_padding,
      widget_margin: data.widget_margin,
      color_scheme: data.color_scheme,
      typography: data.typography,
      header_config: data.header_config,
      bubble_config: data.bubble_config,
      input_config: data.input_config,
      footer_config: data.footer_config,
      voice_config: data.voice_config,
      animation_config: data.animation_config,
      responsive_config: data.responsive_config,
    });

    setFormData(initializedData);

    setLoading(false);

    // Load models and voices if API keys are present
    if (data.openrouter_api_key) {
      loadModels();
    }
    if (data.elevenlabs_api_key) {
      loadVoices(data.elevenlabs_api_key);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value,
      },
    }));
  };

  const loadModels = async () => {
    const key = formData.openrouter_api_key;
    if (!key) return;
    
    try {
      const fetchedModels = await getAvailableModels(key);
      setModels(fetchedModels);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const loadVoices = async (apiKey?: string) => {
    const key = apiKey || formData.elevenlabs_api_key;
    if (!key) return;
    
    try {
      const fetchedVoices = await getElevenLabsVoices(key);
      setVoices(fetchedVoices);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const handleFileUpload = async () => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${chatbotId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('knowledge-base')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        continue;
      }

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('knowledge_base_files')
        .insert({
          chatbot_id: chatbotId,
          user_id: user.id,
          filename: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: fileExt || 'unknown',
        });

      if (dbError) {
        console.error('Database error:', dbError);
      }
    }
  };

  const handleVoicePreview = async (voiceId: string, text: string) => {
    if (!formData.elevenlabs_api_key) return;
    
    try {
      // This would call ElevenLabs API to generate preview audio
      console.log('Voice preview:', voiceId, text);
      // Implementation would go here
    } catch (error) {
      console.error('Voice preview error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    try {
      // Update chatbot
      const { error: chatbotError } = await supabase
        .from('chatbots')
        .update({
          name: formData.name,
          owner_name: formData.owner_name,
          bot_avatar_url: formData.bot_avatar_url,
          starting_phrase: formData.starting_phrase,
          prompt: formData.prompt,
          openrouter_api_key: formData.openrouter_api_key,
          model: formData.model,
          auto_model_selection: formData.auto_model_selection,
          fallback_models: formData.fallback_models,
          voice_enabled: formData.voice_enabled,
          elevenlabs_api_key: formData.elevenlabs_api_key,
          voice_id: formData.voice_id,
          voice_settings: formData.voice_settings,
          data_capture_enabled: formData.data_capture_enabled,
          last_payment_date: format(formData.last_payment_date, 'yyyy-MM-dd'),
          ui_theme: formData.ui_theme,
          ui_layout: formData.ui_layout,
          footer_branding: formData.footer_branding,
          theme_settings: formData.theme_settings,
          updated_at: new Date().toISOString(),
          widget_width: formData.widget_width,
          widget_height: formData.widget_height,
          border_radius: formData.border_radius,
          widget_padding: formData.widget_padding,
          widget_margin: formData.widget_margin,
          color_scheme: formData.color_scheme,
          typography: formData.typography,
          header_config: formData.header_config,
          bubble_config: formData.bubble_config,
          input_config: formData.input_config,
          footer_config: formData.footer_config,
          voice_config: formData.voice_config,
          animation_config: formData.animation_config,
          responsive_config: formData.responsive_config,
        })
        .eq('id', chatbotId)
        .eq('user_id', user.id);

      if (chatbotError) {
        throw chatbotError;
      }

      // Upload new files if any
      if (files && files.length > 0) {
        await handleFileUpload();
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating chatbot:', error);
      alert('Failed to update chatbot. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chatbot editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <Link href="/dashboard">
                <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
                </Link>
                <h1 className="text-xl font-bold text-gray-900 truncate">Editing: {formData.name}</h1>
                <Button onClick={handleSubmit} disabled={saving} className="bg-black text-white hover:bg-gray-800">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
      </header>

      <main>
        <ChatbotEditorLayout sidebarNavItems={sidebarNavItems}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div id="identity" className="space-y-8">
              <h3 className="text-lg font-medium">Identity & Personality</h3>
              <Separator />
              <Card>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Chatbot Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g., Customer Support Bot"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="owner_name" className="text-sm font-medium">Owner Name</Label>
                      <Input
                        id="owner_name"
                        value={formData.owner_name}
                        onChange={(e) => handleInputChange('owner_name', e.target.value)}
                        placeholder="Your name or company"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <FileUpload
                    label="Bot Avatar"
                    description="Upload an avatar image for your chatbot"
                    currentUrl={formData.bot_avatar_url}
                    userId={user?.id || ''}
                    onUpload={(url) => handleInputChange('bot_avatar_url', url)}
                    maxSize={5}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="starting_phrase" className="text-sm font-medium">Starting Phrase</Label>
                    <Input
                      id="starting_phrase"
                      value={formData.starting_phrase}
                      onChange={(e) => handleInputChange('starting_phrase', e.target.value)}
                      placeholder="Hi there! How can I help you today?"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-sm font-medium">System Prompt & Instructions</Label>
                    <Textarea
                      id="prompt"
                      value={formData.prompt}
                      onChange={(e) => handleInputChange('prompt', e.target.value)}
                      placeholder="Describe how your chatbot should behave and what it should help with..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div id="model" className="space-y-8 pt-8">
              <h3 className="text-lg font-medium">AI Model & Configuration</h3>
              <Separator />
              <Card>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="openrouter_api_key" className="text-sm font-medium">OpenRouter API Key *</Label>
                    <Input
                      id="openrouter_api_key"
                      type="password"
                      required
                      value={formData.openrouter_api_key}
                      onChange={(e) => handleInputChange('openrouter_api_key', e.target.value)}
                      onBlur={() => loadModels()}
                      placeholder="Enter your OpenRouter API key"
                      className="h-10"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto_model_selection"
                      checked={formData.auto_model_selection}
                      onCheckedChange={(checked) => handleInputChange('auto_model_selection', checked)}
                    />
                    <Label htmlFor="auto_model_selection" className="text-sm font-medium">Enable Intelligent Model Selection</Label>
                  </div>

                  {!formData.auto_model_selection && (
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-sm font-medium">Default AI Model</Label>
                      <Select
                        value={formData.model}
                        onValueChange={(value) => handleInputChange('model', value)}
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
                            checked={formData.fallback_models.includes(model.id)}
                            onCheckedChange={(checked) => {
                              const newFallbacks = checked
                                ? [...formData.fallback_models, model.id]
                                : formData.fallback_models.filter(m => m !== model.id);
                              handleInputChange('fallback_models', newFallbacks);
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
                          {format(formData.last_payment_date, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.last_payment_date}
                          onSelect={(date) => date && handleInputChange('last_payment_date', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div id="knowledge" className="space-y-8 pt-8">
                <h3 className="text-lg font-medium">Knowledge Base</h3>
                <Separator />
                <Card>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="files" className="text-sm font-medium">Upload New Files</Label>
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="files"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PDF, TXT, DOCX files only</p>
                            </div>
                            <input
                              id="files"
                              type="file"
                              multiple
                              accept=".pdf,.txt,.docx"
                              onChange={(e) => setFiles(e.target.files)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {files && files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">New files to upload:</p>
                            <ul className="text-sm text-gray-500">
                              {Array.from(files).map((file, index) => (
                                <li key={index}>• {file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                </Card>
            </div>

            <div id="voice" className="space-y-8 pt-8">
                <h3 className="text-lg font-medium">Voice Integration</h3>
                <Separator />
                <Card>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="voice_enabled"
                          checked={formData.voice_enabled}
                          onCheckedChange={(checked) => handleInputChange('voice_enabled', checked)}
                        />
                        <Label htmlFor="voice_enabled" className="text-sm font-medium">Enable Voice</Label>
                      </div>

                      {formData.voice_enabled && (
                        <>
                          <Separator />
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="elevenlabs_api_key" className="text-sm font-medium">ElevenLabs API Key</Label>
                              <Input
                                id="elevenlabs_api_key"
                                type="password"
                                value={formData.elevenlabs_api_key}
                                onChange={(e) => handleInputChange('elevenlabs_api_key', e.target.value)}
                                onBlur={() => loadVoices()}
                                placeholder="Enter your ElevenLabs API key"
                                className="h-10"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="voice_id" className="text-sm font-medium">Voice</Label>
                              <Select
                                value={formData.voice_id}
                                onValueChange={(value) => handleInputChange('voice_id', value)}
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Select a voice" />
                                </SelectTrigger>
                                <SelectContent>
                                  {voices.map((voice) => (
                                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                      {voice.name} ({voice.category})
                                    </SelectItem>
                                  ))}
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
                                  value={formData.voice_settings.stability}
                                  onChange={(e) => handleNestedInputChange('voice_settings', 'stability', parseFloat(e.target.value))}
                                />
                                <div className="text-xs text-gray-500 text-center">
                                  {formData.voice_settings.stability}
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
                                  value={formData.voice_settings.similarity_boost}
                                  onChange={(e) => handleNestedInputChange('voice_settings', 'similarity_boost', parseFloat(e.target.value))}
                                />
                                <div className="text-xs text-gray-500 text-center">
                                  {formData.voice_settings.similarity_boost}
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
                                  value={formData.voice_settings.style}
                                  onChange={(e) => handleNestedInputChange('voice_settings', 'style', parseFloat(e.target.value))}
                                />
                                <div className="text-xs text-gray-500 text-center">
                                  {formData.voice_settings.style}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                </Card>
            </div>

            <div id="leads" className="space-y-8 pt-8">
                <h3 className="text-lg font-medium">Lead Capture</h3>
                <Separator />
                <Card>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="data_capture_enabled"
                          checked={formData.data_capture_enabled}
                          onCheckedChange={(checked) => handleInputChange('data_capture_enabled', checked)}
                        />
                        <Label htmlFor="data_capture_enabled" className="text-sm font-medium">Enable Lead Capture</Label>
                      </div>
                      {formData.data_capture_enabled && (
                        <p className="text-sm text-gray-600 mt-2">
                          Your chatbot will naturally ask for contact information during conversations
                          and store leads in your dashboard.
                        </p>
                      )}
                    </CardContent>
                </Card>
            </div>

            <div id="design" className="space-y-8 pt-8">
              <h3 className="text-lg font-medium">Design & Appearance</h3>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChatbotPreview chatbotId={chatbotId} config={formData} className="w-full" />
                </CardContent>
              </Card>
              <DesignPanel
                config={formData}
                onChange={setFormData}
                onPreview={() => setShowPreview(true)}
                voiceEnabled={formData.voice_enabled}
                availableVoices={voices}
                onVoicePreview={handleVoicePreview}
              />
            </div>
          </form>
        </ChatbotEditorLayout>
      </main>
    </div>
  );
}
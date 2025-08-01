'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { CalendarIcon, Upload, ArrowLeft, Bot, Mic, Database, Palette, Save, User, Image, MessageSquare, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DesignPanel } from '@/components/ui/design-panel';
import { ChatbotPreview } from '@/components/ui/chatbot-preview';
import Link from 'next/link';

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

export default function CreateChatbotPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

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
    available_models: MODEL_PROVIDERS.reduce((acc, provider) => ({ ...acc, [provider.id]: provider.models.map(m => m.id) }), {}),
    
    // Design configuration
    widget_width: '350px',
    widget_height: '500px',
    border_radius: '12px',
    widget_padding: '16px',
    widget_margin: '20px',
    color_scheme: {
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
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      headerSize: '18px',
      messageSize: '14px',
      inputSize: '14px',
      headerWeight: '600',
      messageWeight: '400',
      inputWeight: '400'
    },
    header_config: {
      showHeader: true,
      customTitle: '',
      showLogo: true,
      showOwnerName: false,
      headerHeight: '60px',
      logoSize: '32px'
    },
    bubble_config: {
      showTail: true,
      alignment: 'left',
      animation: 'fade',
      spacing: '8px',
      maxWidth: '80%',
      borderRadius: '18px'
    },
    input_config: {
      placeholder: 'Type your message...',
      borderRadius: '24px',
      showMicButton: true,
      showSendButton: true,
      buttonStyle: 'modern',
      height: '48px'
    },
    footer_config: {
      showPoweredBy: true,
      customBrandingUrl: 'https://yvexan-agency.com',
      customBrandingText: 'Powered by Yvexan Agency',
      showCTA: false,
      ctaText: '',
      ctaUrl: ''
    },
    voice_config: {
      model: 'eleven_monolingual_v1',
      autoDetectLanguage: false,
      streamingMode: false,
      autoReadMessages: true,
      pushToTalk: false,
      continuousMic: false,
      voiceSpeed: 1.0,
      outputFormat: 'mp3_44100_128'
    },
    animation_config: {
      messageAnimation: 'slideUp',
      typingIndicator: true,
      soundEffects: false,
      hoverEffects: true,
      transitionDuration: '300ms'
    },
    responsive_config: {
      mobileWidth: '100%',
      mobileHeight: '100vh',
      tabletWidth: '400px',
      tabletHeight: '600px',
      breakpoints: {
        mobile: '768px',
        tablet: '1024px'
      }
    }
  });

  useEffect(() => {
    const checkUser = async () => {
      const { user, error } = await getCurrentUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    checkUser();
  }, [router]);

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
    if (!formData.openrouter_api_key) return;
    
    try {
      const fetchedModels = await getAvailableModels(formData.openrouter_api_key);
      setModels(fetchedModels);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const loadVoices = async () => {
    if (!formData.elevenlabs_api_key) return;
    
    try {
      const fetchedVoices = await getElevenLabsVoices(formData.elevenlabs_api_key);
      setVoices(fetchedVoices);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const handleFileUpload = async (chatbotId: string) => {
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

    setLoading(true);

    try {
      // Create chatbot
      const { data: chatbotData, error: chatbotError } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
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
          available_models: formData.available_models,
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
        .select()
        .single();

      console.log('Chatbot creation result:', chatbotData);
      console.log('Chatbot creation error:', chatbotError);

      if (chatbotError) {
        throw chatbotError;
      }

      // Upload files if any
      if (files && files.length > 0) {
        await handleFileUpload(chatbotData.id);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating chatbot:', error);
      alert('Failed to create chatbot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-gray-900">Create New Chatbot</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Configure your chatbot's core settings and AI model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Chatbot Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter a name for your chatbot"
                />
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
                <Label htmlFor="starting_phrase">Starting Phrase</Label>
                <Input
                  id="starting_phrase"
                  value={formData.starting_phrase}
                  onChange={(e) => handleInputChange('starting_phrase', e.target.value)}
                  placeholder="Hi there! How can I help you today?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt & Instructions</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  placeholder="Describe how your chatbot should behave and what it should help with..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openrouter_api_key">OpenRouter API Key *</Label>
                <Input
                  id="openrouter_api_key"
                  type="password"
                  required
                  value={formData.openrouter_api_key}
                  onChange={(e) => handleInputChange('openrouter_api_key', e.target.value)}
                  onBlur={loadModels}
                  placeholder="Enter your OpenRouter API key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => handleInputChange('model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta-llama/llama-3.1-8b-instruct:free">
                      Llama 3.1 8B (Free)
                    </SelectItem>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_payment_date">Last Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.last_payment_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.last_payment_date ? (
                        format(formData.last_payment_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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

          {/* Knowledge Base Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Knowledge Base</span>
              </CardTitle>
              <CardDescription>
                Upload files to enhance your chatbot's knowledge (PDF, TXT, DOCX)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="files">Upload Files</Label>
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
                    <p className="text-sm text-gray-600">Selected files:</p>
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

          {/* Voice Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="h-5 w-5" />
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
                  checked={formData.voice_enabled}
                  onCheckedChange={(checked) => handleInputChange('voice_enabled', checked)}
                />
                <Label htmlFor="voice_enabled">Enable Voice</Label>
              </div>

              {formData.voice_enabled && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="elevenlabs_api_key">ElevenLabs API Key</Label>
                      <Input
                        id="elevenlabs_api_key"
                        type="password"
                        value={formData.elevenlabs_api_key}
                        onChange={(e) => handleInputChange('elevenlabs_api_key', e.target.value)}
                        onBlur={loadVoices}
                        placeholder="Enter your ElevenLabs API key"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice_id">Voice</Label>
                      <Select
                        value={formData.voice_id}
                        onValueChange={(value) => handleInputChange('voice_id', value)}
                      >
                        <SelectTrigger>
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
                        <Label htmlFor="stability">Stability</Label>
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
                        <Label htmlFor="similarity_boost">Similarity</Label>
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
                        <Label htmlFor="style">Style</Label>
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

          {/* Data Capture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Lead Capture</span>
              </CardTitle>
              <CardDescription>
                Enable conversational lead data collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="data_capture_enabled"
                  checked={formData.data_capture_enabled}
                  onCheckedChange={(checked) => handleInputChange('data_capture_enabled', checked)}
                />
                <Label htmlFor="data_capture_enabled">Enable Lead Capture</Label>
              </div>
              {formData.data_capture_enabled && (
                <p className="text-sm text-gray-600 mt-2">
                  Your chatbot will naturally ask for contact information during conversations
                  and store leads in your dashboard.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Theme & Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize how your chatbot looks when embedded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.theme_settings.primaryColor}
                    onChange={(e) => handleNestedInputChange('theme_settings', 'primaryColor', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.theme_settings.secondaryColor}
                    onChange={(e) => handleNestedInputChange('theme_settings', 'secondaryColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={formData.theme_settings.welcomeMessage}
                  onChange={(e) => handleNestedInputChange('theme_settings', 'welcomeMessage', e.target.value)}
                  placeholder="Hi! How can I help you today?"
                />
              </div>
            </CardContent>
          </Card>

              {/* Design Customization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Design Customization</span>
                  </CardTitle>
                  <CardDescription>
                    Customize the appearance and behavior of your chatbot widget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DesignPanel
                    config={formData}
                    onChange={setFormData}
                    onPreview={() => setShowPreview(true)}
                    voiceEnabled={formData.voice_enabled}
                    availableVoices={voices}
                    onVoicePreview={handleVoicePreview}
                  />
                </CardContent>
              </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Chatbot'}</span>
            </Button>
          </div>
        </form>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your chatbot will look and behave
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotPreview
                  chatbotId="preview"
                  config={formData}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Layout:</span>
                  <span className="font-medium">{formData.ui_layout === 'corner' ? 'Corner Widget' : 'Full Screen'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Theme:</span>
                  <span className="font-medium">{formData.ui_theme === 'light' ? 'Light' : 'Dark'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Enabled:</span>
                  <span className="font-medium">{formData.voice_enabled ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Capture:</span>
                  <span className="font-medium">{formData.data_capture_enabled ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto Model Selection:</span>
                  <span className="font-medium">{formData.auto_model_selection ? 'Yes' : 'No'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
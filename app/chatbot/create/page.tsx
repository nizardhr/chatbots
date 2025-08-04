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
import { CalendarIcon, Upload, ArrowLeft, Bot, Mic, Database, Palette, Save, User, Image, MessageSquare, Sparkles, Settings, Eye, Paintbrush } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DesignPanel } from '@/components/ui/design-panel';
import { ChatbotPreview } from '@/components/ui/chatbot-preview';
import { DesignShowcase } from '@/components/ui/design-showcase';
import Link from 'next/link';
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
      borderRadius: '18px',
      tailSize: '8px',
      shadow: 'light',
      showTimestamp: false,
      showAvatar: false
    },
    input_config: {
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

  const handlePresetSelect = (preset: any) => {
    setFormData(prev => ({
      ...prev,
      color_scheme: preset.colors,
      typography: preset.typography,
      bubble_config: preset.bubble_config,
      input_config: preset.input_config,
    }));
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Create New Chatbot</h1>
              </div>
            </div>
            <Button
              type="submit"
              form="chatbot-form"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Chatbot'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Configuration */}
          <div className="xl:col-span-2 space-y-8">
            <form id="chatbot-form" onSubmit={handleSubmit} className="space-y-8">
              
            <div id="identity" className="space-y-8">
              <h3 className="text-lg font-medium">Identity & Personality</h3>
              <Separator />
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
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
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter a name for your chatbot"
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
              {/* AI Model Configuration */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
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
                      value={formData.openrouter_api_key}
                      onChange={(e) => handleInputChange('openrouter_api_key', e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-sm font-medium">Default AI Model</Label>
                      <Select
                        value={formData.model}
                        onValueChange={(value) => handleInputChange('model', value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.auto_model_selection}
                        onCheckedChange={(checked) => handleInputChange('auto_model_selection', checked)}
                      />
                      <Label className="text-sm font-medium">Enable Intelligent Model Selection</Label>
                    </div>
                    
                    {formData.auto_model_selection && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Fallback Models</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {['gpt-3.5-turbo', 'gpt-4', 'gpt-4o', 'claude-3.5-haiku', 'claude-3-sonnet'].map((model) => (
                            <div key={model} className="flex items-center space-x-2">
                              <Checkbox
                                checked={formData.fallback_models.includes(model)}
                                onCheckedChange={(checked) => {
                                  const newFallbacks = checked
                                    ? [...formData.fallback_models, model]
                                    : formData.fallback_models.filter((m) => m !== model);
                                  handleInputChange('fallback_models', newFallbacks);
                                }}
                              />
                              <Label className="text-sm">{model}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div id="knowledge" className="space-y-8 pt-8">
              <h3 className="text-lg font-medium">Knowledge Base</h3>
              <Separator />
              {/* Knowledge Base */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Database className="h-5 w-5 text-green-600" />
                    <span>Knowledge Base</span>
                  </CardTitle>
                  <CardDescription>
                    Upload documents to give your chatbot access to specific information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload New Files</h3>
                    <p className="text-gray-600 mb-4">Click to upload or drag and drop PDF, TXT, DOCX files only</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.txt,.docx"
                      onChange={(e) => setFiles(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div id="voice" className="space-y-8 pt-8">
              <h3 className="text-lg font-medium">Voice Integration</h3>
              <Separator />
              {/* Voice Integration */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <span>Features</span>
                  </CardTitle>
                  <CardDescription>
                    Enable additional features for your chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.voice_enabled}
                          onCheckedChange={(checked) => handleInputChange('voice_enabled', checked)}
                        />
                        <Label className="text-sm font-medium">Voice Integration</Label>
                      </div>
                      {formData.voice_enabled && (
                        <div className="space-y-2">
                          <Input
                            type="password"
                            placeholder="ElevenLabs API Key"
                            value={formData.elevenlabs_api_key}
                            onChange={(e) => handleInputChange('elevenlabs_api_key', e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      )}
                    </div>

                                         <div className="flex items-center space-x-2">
                       <Switch
                         checked={formData.voice_enabled}
                         onCheckedChange={(checked) => handleInputChange('voice_enabled', checked)}
                       />
                       <Label className="text-sm font-medium">Voice Integration</Label>
                     </div>
                     {formData.voice_enabled && (
                       <div className="space-y-2">
                         <Input
                           type="password"
                           placeholder="ElevenLabs API Key"
                           value={formData.elevenlabs_api_key}
                           onChange={(e) => handleInputChange('elevenlabs_api_key', e.target.value)}
                           className="h-8 text-xs"
                         />
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             </div>

             <div id="leads" className="space-y-8 pt-8">
               <h3 className="text-lg font-medium">Lead Capture</h3>
               <Separator />
               <Card className="shadow-sm border-0 bg-white">
                 <CardContent className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex items-center space-x-2">
                       <Switch
                         checked={formData.data_capture_enabled}
                         onCheckedChange={(checked) => handleInputChange('data_capture_enabled', checked)}
                       />
                       <Label className="text-sm font-medium">Lead Capture</Label>
                     </div>

                     <div className="flex items-center space-x-2">
                       <Switch
                         checked={formData.footer_branding}
                         onCheckedChange={(checked) => handleInputChange('footer_branding', checked)}
                       />
                       <Label className="text-sm font-medium">Show Footer Branding</Label>
                     </div>
                   </div>
                 </CardContent>
               </Card>
            </div>

            <div id="design" className="space-y-8 pt-8">
              <h3 className="text-lg font-medium">Design & Appearance</h3>
              <Separator />
              {/* Design Customization */}
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Palette className="h-5 w-5 text-pink-600" />
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
            </div>
          </form>
        </div>

        {/* Right Column - Preview & Summary */}
        <div className="space-y-6">
          {/* Design Presets */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Palette className="h-5 w-5 text-indigo-600" />
                <span>Design Presets</span>
              </CardTitle>
              <CardDescription>
                Start with a pre-designed theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DesignShowcase onSelectPreset={handlePresetSelect} />
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Eye className="h-5 w-5 text-blue-600" />
                <span>Live Preview</span>
              </CardTitle>
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
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <span>Configuration Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Layout:</span>
                  <span className="font-medium">{formData.ui_layout === 'corner' ? 'Corner Widget' : 'Full Screen'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Theme:</span>
                  <span className="font-medium">{formData.ui_theme === 'light' ? 'Light' : 'Dark'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Voice Enabled:</span>
                  <span className="font-medium">{formData.voice_enabled ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Lead Capture:</span>
                  <span className="font-medium">{formData.data_capture_enabled ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Auto Model Selection:</span>
                  <span className="font-medium">{formData.auto_model_selection ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
);
}
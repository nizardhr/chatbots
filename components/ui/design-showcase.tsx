'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Type, Layout, MessageSquare, Mic, Settings } from 'lucide-react';

interface DesignShowcaseProps {
  onSelectPreset: (preset: any) => void;
}

const DESIGN_PRESETS = [
  {
    name: 'Modern Minimal',
    description: 'Clean and contemporary design',
    colors: {
      background: '#ffffff',
      header: '#1a1a1a',
      botMessage: '#f8f9fa',
      userMessage: '#007bff',
      textPrimary: '#212529',
      textSecondary: '#6c757d',
      inputField: '#ffffff',
      inputBorder: '#dee2e6',
      buttonPrimary: '#007bff',
      buttonSecondary: '#6c757d',
      accent: '#6f42c1',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      headerSize: '16px',
      messageSize: '14px',
      inputSize: '14px',
      headerWeight: '600',
      messageWeight: '400',
      inputWeight: '400'
    },
    bubble_config: {
      showTail: true,
      alignment: 'left',
      animation: 'fade',
      spacing: '8px',
      maxWidth: '75%',
      borderRadius: '16px',
      tailSize: '6px',
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
      height: '44px',
      padding: '12px 16px',
      buttonSize: '32px',
      autoFocus: false,
      showCharacterCount: false,
      maxCharacters: '500'
    }
  },
  {
    name: 'Dark Professional',
    description: 'Sophisticated dark theme',
    colors: {
      background: '#1a1a1a',
      header: '#000000',
      botMessage: '#2d2d2d',
      userMessage: '#007bff',
      textPrimary: '#ffffff',
      textSecondary: '#b0b0b0',
      inputField: '#2d2d2d',
      inputBorder: '#404040',
      buttonPrimary: '#007bff',
      buttonSecondary: '#6c757d',
      accent: '#6f42c1',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
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
    bubble_config: {
      showTail: true,
      alignment: 'left',
      animation: 'slideUp',
      spacing: '10px',
      maxWidth: '80%',
      borderRadius: '20px',
      tailSize: '8px',
      shadow: 'medium',
      showTimestamp: true,
      showAvatar: false
    },
    input_config: {
      placeholder: 'Send a message...',
      borderRadius: '20px',
      showMicButton: true,
      showSendButton: true,
      buttonStyle: 'rounded',
      height: '48px',
      padding: '14px 18px',
      buttonSize: '36px',
      autoFocus: true,
      showCharacterCount: true,
      maxCharacters: '500'
    }
  },
  {
    name: 'Warm & Friendly',
    description: 'Cozy and approachable design',
    colors: {
      background: '#fef3c7',
      header: '#92400e',
      botMessage: '#fde68a',
      userMessage: '#059669',
      textPrimary: '#92400e',
      textSecondary: '#a16207',
      inputField: '#fef3c7',
      inputBorder: '#f59e0b',
      buttonPrimary: '#059669',
      buttonSecondary: '#a16207',
      accent: '#7c3aed',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    typography: {
      fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif',
      headerSize: '20px',
      messageSize: '15px',
      inputSize: '15px',
      headerWeight: '700',
      messageWeight: '500',
      inputWeight: '400'
    },
    bubble_config: {
      showTail: true,
      alignment: 'left',
      animation: 'bounce',
      spacing: '12px',
      maxWidth: '85%',
      borderRadius: '24px',
      tailSize: '10px',
      shadow: 'light',
      showTimestamp: false,
      showAvatar: true
    },
    input_config: {
      placeholder: 'Say hello! 👋',
      borderRadius: '28px',
      showMicButton: true,
      showSendButton: true,
      buttonStyle: 'rounded',
      height: '52px',
      padding: '16px 20px',
      buttonSize: '40px',
      autoFocus: false,
      showCharacterCount: false,
      maxCharacters: '500'
    }
  },
  {
    name: 'Corporate Blue',
    description: 'Professional business theme',
    colors: {
      background: '#f0f9ff',
      header: '#0c4a6e',
      botMessage: '#e0f2fe',
      userMessage: '#0284c7',
      textPrimary: '#0c4a6e',
      textSecondary: '#0369a1',
      inputField: '#f0f9ff',
      inputBorder: '#0ea5e9',
      buttonPrimary: '#0284c7',
      buttonSecondary: '#0369a1',
      accent: '#7c3aed',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
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
    bubble_config: {
      showTail: true,
      alignment: 'left',
      animation: 'slideLeft',
      spacing: '8px',
      maxWidth: '75%',
      borderRadius: '16px',
      tailSize: '6px',
      shadow: 'light',
      showTimestamp: true,
      showAvatar: false
    },
    input_config: {
      placeholder: 'How can I help you today?',
      borderRadius: '20px',
      showMicButton: false,
      showSendButton: true,
      buttonStyle: 'modern',
      height: '46px',
      padding: '12px 16px',
      buttonSize: '34px',
      autoFocus: false,
      showCharacterCount: true,
      maxCharacters: '500'
    }
  }
];

export function DesignShowcase({ onSelectPreset }: DesignShowcaseProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset.name);
    onSelectPreset(preset);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Design Presets</span>
          </CardTitle>
          <CardDescription>
            Choose from pre-designed themes or use them as a starting point for customization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DESIGN_PRESETS.map((preset) => (
              <Card
                key={preset.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPreset === preset.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{preset.name}</h4>
                      {selectedPreset === preset.name && (
                        <Badge variant="secondary" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{preset.description}</p>
                    
                    {/* Color Preview */}
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.background }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.header }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.botMessage }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.userMessage }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.colors.accent }}
                      />
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {preset.bubble_config.showTail && (
                        <Badge variant="outline" className="text-xs">Tail</Badge>
                      )}
                      {preset.bubble_config.showTimestamp && (
                        <Badge variant="outline" className="text-xs">Time</Badge>
                      )}
                      {preset.bubble_config.showAvatar && (
                        <Badge variant="outline" className="text-xs">Avatar</Badge>
                      )}
                      {preset.input_config.autoFocus && (
                        <Badge variant="outline" className="text-xs">Auto-focus</Badge>
                      )}
                      {preset.input_config.showCharacterCount && (
                        <Badge variant="outline" className="text-xs">Counter</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Design Features</CardTitle>
          <CardDescription>
            Explore the comprehensive customization options available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-sm">Color Scheme</h4>
              <p className="text-xs text-gray-600">14 customizable colors</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Type className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-sm">Typography</h4>
              <p className="text-xs text-gray-600">Fonts, sizes & weights</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-sm">Bubbles</h4>
              <p className="text-xs text-gray-600">Shadows, tails & animations</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-sm">Advanced</h4>
              <p className="text-xs text-gray-600">Timestamps & effects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
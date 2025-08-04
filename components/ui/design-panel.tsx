"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Palette,
  Type,
  Layout,
  MessageSquare,
  Mic,
  Settings,
  Smartphone,
  Monitor,
  Eye,
  Play,
  Pause,
} from "lucide-react";

interface DesignConfig {
  // Layout
  ui_layout: "corner" | "full";
  widget_width: string;
  widget_height: string;
  border_radius: string;
  widget_padding: string;
  widget_margin: string;

  // Colors
  color_scheme: {
    background: string;
    header: string;
    botMessage: string;
    userMessage: string;
    textPrimary: string;
    textSecondary: string;
    inputField: string;
    inputBorder: string;
    buttonPrimary: string;
    buttonSecondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };

  // Typography
  typography: {
    fontFamily: string;
    headerSize: string;
    messageSize: string;
    inputSize: string;
    headerWeight: string;
    messageWeight: string;
    inputWeight: string;
  };

  // Header
  header_config: {
    showHeader: boolean;
    customTitle: string;
    showLogo: boolean;
    showOwnerName: boolean;
    headerHeight: string;
    logoSize: string;
  };

  // Bubbles
  bubble_config: {
    showTail: boolean;
    alignment: string;
    animation: string;
    spacing: string;
    maxWidth: string;
    borderRadius: string;
    tailSize: string;
    shadow: string;
    showTimestamp: boolean;
    showAvatar: boolean;
  };

  // Input
  input_config: {
    placeholder: string;
    borderRadius: string;
    showMicButton: boolean;
    showSendButton: boolean;
    buttonStyle: string;
    height: string;
    padding: string;
    buttonSize: string;
    autoFocus: boolean;
    showCharacterCount: boolean;
    maxCharacters: string;
  };

  // Footer
  footer_config: {
    showPoweredBy: boolean;
    customBrandingUrl: string;
    customBrandingText: string;
    showCTA: boolean;
    ctaText: string;
    ctaUrl: string;
  };

  // Voice
  voice_config: {
    model: string;
    autoDetectLanguage: boolean;
    streamingMode: boolean;
    autoReadMessages: boolean;
    pushToTalk: boolean;
    continuousMic: boolean;
    voiceSpeed: number;
    outputFormat: string;
  };

  // Animation
  animation_config: {
    messageAnimation: string;
    typingIndicator: boolean;
    soundEffects: boolean;
    hoverEffects: boolean;
    transitionDuration: string;
  };

  // Responsive
  responsive_config: {
    mobileWidth: string;
    mobileHeight: string;
    tabletWidth: string;
    tabletHeight: string;
    breakpoints: {
      mobile: string;
      tablet: string;
    };
  };
}

interface DesignPanelProps {
  config: DesignConfig;
  onChange: (config: DesignConfig) => void;
  onPreview: () => void;
  voiceEnabled: boolean;
  availableVoices: Array<{ voice_id: string; name: string; category: string }>;
  onVoicePreview: (voiceId: string, text: string) => void;
}

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Source Sans Pro",
  "Raleway",
  "PT Sans",
  "Lora",
  "Merriweather",
  "Playfair Display",
  "Oswald",
  "Nunito",
  "Ubuntu",
  "Poppins",
];

const ANIMATIONS = [
  { value: "fade", label: "Fade In" },
  { value: "slideUp", label: "Slide Up" },
  { value: "slideLeft", label: "Slide Left" },
  { value: "scale", label: "Scale" },
  { value: "bounce", label: "Bounce" },
  { value: "none", label: "No Animation" },
];

const VOICE_MODELS = [
  { value: "eleven_monolingual_v1", label: "Monolingual V1 (English)" },
  { value: "eleven_multilingual_v1", label: "Multilingual V1" },
  { value: "eleven_multilingual_v2", label: "Multilingual V2 (Latest)" },
];

export function DesignPanel({
  config,
  onChange,
  onPreview,
  voiceEnabled,
  availableVoices,
  onVoicePreview,
}: DesignPanelProps) {
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const updateConfig = (
    section: keyof DesignConfig,
    field: string,
    value: any
  ) => {
    const newConfig = { ...config };
    if (typeof newConfig[section] === "object" && newConfig[section] !== null) {
      (newConfig[section] as any)[field] = value;
    } else {
      (newConfig as any)[section] = value;
    }
    onChange(newConfig);
  };

  const updateNestedConfig = (
    section: keyof DesignConfig,
    subsection: string,
    field: string,
    value: any
  ) => {
    const newConfig = { ...config };
    if (typeof newConfig[section] === "object" && newConfig[section] !== null) {
      const sectionConfig = newConfig[section] as any;
      if (typeof sectionConfig[subsection] === "object") {
        sectionConfig[subsection][field] = value;
      }
    }
    onChange(newConfig);
  };

  const handleVoicePreview = async (voiceId: string) => {
    setIsPlayingVoice(true);
    try {
      await onVoicePreview(
        voiceId,
        "Hello! This is how I sound with the current voice settings."
      );
    } finally {
      setIsPlayingVoice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Live Preview</span>
          </CardTitle>
          <CardDescription>
            Preview your chatbot design in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </Button>
            <Button
              variant={previewMode === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("tablet")}
            >
              <Layout className="h-4 w-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </Button>
          </div>
          <Button onClick={onPreview} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Open Live Preview
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layout className="h-5 w-5" />
                <span>Layout & Dimensions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Layout Mode</Label>
                  <Select
                    value={config.ui_layout}
                    onValueChange={(value: "corner" | "full") =>
                      updateConfig("ui_layout", "", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corner">Corner Widget</SelectItem>
                      <SelectItem value="full">Full Screen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Input
                    value={config.border_radius}
                    onChange={(e) =>
                      updateConfig("border_radius", "", e.target.value)
                    }
                    placeholder="12px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input
                    value={config.widget_width}
                    onChange={(e) =>
                      updateConfig("widget_width", "", e.target.value)
                    }
                    placeholder="350px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    value={config.widget_height}
                    onChange={(e) =>
                      updateConfig("widget_height", "", e.target.value)
                    }
                    placeholder="500px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Padding</Label>
                  <Input
                    value={config.widget_padding}
                    onChange={(e) =>
                      updateConfig("widget_padding", "", e.target.value)
                    }
                    placeholder="16px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Margin</Label>
                  <Input
                    value={config.widget_margin}
                    onChange={(e) =>
                      updateConfig("widget_margin", "", e.target.value)
                    }
                    placeholder="20px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsive Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mobile Width</Label>
                  <Input
                    value={config.responsive_config.mobileWidth}
                    onChange={(e) =>
                      updateConfig(
                        "responsive_config",
                        "mobileWidth",
                        e.target.value
                      )
                    }
                    placeholder="100%"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mobile Height</Label>
                  <Input
                    value={config.responsive_config.mobileHeight}
                    onChange={(e) =>
                      updateConfig(
                        "responsive_config",
                        "mobileHeight",
                        e.target.value
                      )
                    }
                    placeholder="100vh"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tablet Width</Label>
                  <Input
                    value={config.responsive_config.tabletWidth}
                    onChange={(e) =>
                      updateConfig(
                        "responsive_config",
                        "tabletWidth",
                        e.target.value
                      )
                    }
                    placeholder="400px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tablet Height</Label>
                  <Input
                    value={config.responsive_config.tabletHeight}
                    onChange={(e) =>
                      updateConfig(
                        "responsive_config",
                        "tabletHeight",
                        e.target.value
                      )
                    }
                    placeholder="600px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Color Scheme</span>
              </CardTitle>
              <CardDescription>
                Customize the color palette for your chatbot widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Primary Colors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.background}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "background",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.background}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "background",
                            e.target.value
                          )
                        }
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Header Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.header}
                        onChange={(e) =>
                          updateConfig("color_scheme", "header", e.target.value)
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.header}
                        onChange={(e) =>
                          updateConfig("color_scheme", "header", e.target.value)
                        }
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.textPrimary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "textPrimary",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.textPrimary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "textPrimary",
                            e.target.value
                          )
                        }
                        placeholder="#111827"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Secondary Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.textSecondary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "textSecondary",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.textSecondary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "textSecondary",
                            e.target.value
                          )
                        }
                        placeholder="#6b7280"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Message Colors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bot Message Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.botMessage}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "botMessage",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.botMessage}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "botMessage",
                            e.target.value
                          )
                        }
                        placeholder="#f3f4f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>User Message Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.userMessage}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "userMessage",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.userMessage}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "userMessage",
                            e.target.value
                          )
                        }
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Input & Button Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Input & Button Colors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input Field Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.inputField}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "inputField",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.inputField}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "inputField",
                            e.target.value
                          )
                        }
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Input Border Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.inputBorder}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "inputBorder",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.inputBorder}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "inputBorder",
                            e.target.value
                          )
                        }
                        placeholder="#d1d5db"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Button Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.buttonPrimary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "buttonPrimary",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.buttonPrimary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "buttonPrimary",
                            e.target.value
                          )
                        }
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Secondary Button Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.buttonSecondary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "buttonSecondary",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.buttonSecondary}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "buttonSecondary",
                            e.target.value
                          )
                        }
                        placeholder="#6b7280"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Accent & Status Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Accent & Status Colors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.accent}
                        onChange={(e) =>
                          updateConfig("color_scheme", "accent", e.target.value)
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.accent}
                        onChange={(e) =>
                          updateConfig("color_scheme", "accent", e.target.value)
                        }
                        placeholder="#8b5cf6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Success Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.success}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "success",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.success}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "success",
                            e.target.value
                          )
                        }
                        placeholder="#10b981"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Warning Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.warning}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "warning",
                            e.target.value
                          )
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.warning}
                        onChange={(e) =>
                          updateConfig(
                            "color_scheme",
                            "warning",
                            e.target.value
                          )
                        }
                        placeholder="#f59e0b"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Error Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={config.color_scheme.error}
                        onChange={(e) =>
                          updateConfig("color_scheme", "error", e.target.value)
                        }
                        className="w-16 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.color_scheme.error}
                        onChange={(e) =>
                          updateConfig("color_scheme", "error", e.target.value)
                        }
                        placeholder="#ef4444"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Quick Presets
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const preset = {
                        background: "#ffffff",
                        header: "#000000",
                        botMessage: "#f3f4f6",
                        userMessage: "#3b82f6",
                        textPrimary: "#111827",
                        textSecondary: "#6b7280",
                        inputField: "#ffffff",
                        inputBorder: "#d1d5db",
                        buttonPrimary: "#3b82f6",
                        buttonSecondary: "#6b7280",
                        accent: "#8b5cf6",
                        success: "#10b981",
                        warning: "#f59e0b",
                        error: "#ef4444",
                      };
                      onChange({ ...config, color_scheme: preset });
                    }}
                    className="text-xs"
                  >
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const preset = {
                        background: "#1f2937",
                        header: "#111827",
                        botMessage: "#374151",
                        userMessage: "#3b82f6",
                        textPrimary: "#f9fafb",
                        textSecondary: "#d1d5db",
                        inputField: "#374151",
                        inputBorder: "#4b5563",
                        buttonPrimary: "#3b82f6",
                        buttonSecondary: "#6b7280",
                        accent: "#8b5cf6",
                        success: "#10b981",
                        warning: "#f59e0b",
                        error: "#ef4444",
                      };
                      onChange({ ...config, color_scheme: preset });
                    }}
                    className="text-xs"
                  >
                    Dark
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const preset = {
                        background: "#fef3c7",
                        header: "#92400e",
                        botMessage: "#fde68a",
                        userMessage: "#059669",
                        textPrimary: "#92400e",
                        textSecondary: "#a16207",
                        inputField: "#fef3c7",
                        inputBorder: "#f59e0b",
                        buttonPrimary: "#059669",
                        buttonSecondary: "#a16207",
                        accent: "#7c3aed",
                        success: "#059669",
                        warning: "#d97706",
                        error: "#dc2626",
                      };
                      onChange({ ...config, color_scheme: preset });
                    }}
                    className="text-xs"
                  >
                    Warm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const preset = {
                        background: "#f0f9ff",
                        header: "#0c4a6e",
                        botMessage: "#e0f2fe",
                        userMessage: "#0284c7",
                        textPrimary: "#0c4a6e",
                        textSecondary: "#0369a1",
                        inputField: "#f0f9ff",
                        inputBorder: "#0ea5e9",
                        buttonPrimary: "#0284c7",
                        buttonSecondary: "#0369a1",
                        accent: "#7c3aed",
                        success: "#059669",
                        warning: "#d97706",
                        error: "#dc2626",
                      };
                      onChange({ ...config, color_scheme: preset });
                    }}
                    className="text-xs"
                  >
                    Cool
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Type className="h-5 w-5" />
                <span>Typography</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={config.typography.fontFamily.split(",")[0]}
                  onValueChange={(value) =>
                    updateConfig(
                      "typography",
                      "fontFamily",
                      `${value}, -apple-system, BlinkMacSystemFont, sans-serif`
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOOGLE_FONTS.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Header Size</Label>
                  <Input
                    value={config.typography.headerSize}
                    onChange={(e) =>
                      updateConfig("typography", "headerSize", e.target.value)
                    }
                    placeholder="18px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message Size</Label>
                  <Input
                    value={config.typography.messageSize}
                    onChange={(e) =>
                      updateConfig("typography", "messageSize", e.target.value)
                    }
                    placeholder="14px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Input Size</Label>
                  <Input
                    value={config.typography.inputSize}
                    onChange={(e) =>
                      updateConfig("typography", "inputSize", e.target.value)
                    }
                    placeholder="14px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Header Weight</Label>
                  <Select
                    value={config.typography.headerWeight}
                    onValueChange={(value) =>
                      updateConfig("typography", "headerWeight", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Normal (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semi Bold (600)</SelectItem>
                      <SelectItem value="700">Bold (700)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Message Weight</Label>
                  <Select
                    value={config.typography.messageWeight}
                    onValueChange={(value) =>
                      updateConfig("typography", "messageWeight", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Normal (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semi Bold (600)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Input Weight</Label>
                  <Select
                    value={config.typography.inputWeight}
                    onValueChange={(value) =>
                      updateConfig("typography", "inputWeight", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Normal (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-4">
          {/* Header Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Header Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.header_config.showHeader}
                  onCheckedChange={(checked) =>
                    updateConfig("header_config", "showHeader", checked)
                  }
                />
                <Label>Show Header</Label>
              </div>

              {config.header_config.showHeader && (
                <>
                  <div className="space-y-2">
                    <Label>
                      Custom Title (leave empty to use chatbot name)
                    </Label>
                    <Input
                      value={config.header_config.customTitle}
                      onChange={(e) =>
                        updateConfig(
                          "header_config",
                          "customTitle",
                          e.target.value
                        )
                      }
                      placeholder="Custom header title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.header_config.showLogo}
                        onCheckedChange={(checked) =>
                          updateConfig("header_config", "showLogo", checked)
                        }
                      />
                      <Label>Show Logo/Avatar</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.header_config.showOwnerName}
                        onCheckedChange={(checked) =>
                          updateConfig(
                            "header_config",
                            "showOwnerName",
                            checked
                          )
                        }
                      />
                      <Label>Show Owner Name</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Header Height</Label>
                      <Input
                        value={config.header_config.headerHeight}
                        onChange={(e) =>
                          updateConfig(
                            "header_config",
                            "headerHeight",
                            e.target.value
                          )
                        }
                        placeholder="60px"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo Size</Label>
                      <Input
                        value={config.header_config.logoSize}
                        onChange={(e) =>
                          updateConfig(
                            "header_config",
                            "logoSize",
                            e.target.value
                          )
                        }
                        placeholder="32px"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Chat Bubbles */}
          <Card>
            <CardHeader>
              <CardTitle>Chat Bubbles</CardTitle>
              <CardDescription>
                Customize the appearance and behavior of message bubbles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.bubble_config.showTail}
                    onCheckedChange={(checked) =>
                      updateConfig("bubble_config", "showTail", checked)
                    }
                  />
                  <Label>Show Message Tail</Label>
                </div>

                <div className="space-y-2">
                  <Label>Alignment</Label>
                  <Select
                    value={config.bubble_config.alignment}
                    onValueChange={(value) =>
                      updateConfig("bubble_config", "alignment", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left Aligned</SelectItem>
                      <SelectItem value="right">Right Aligned</SelectItem>
                      <SelectItem value="center">Center Aligned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Animation</Label>
                  <Select
                    value={config.bubble_config.animation}
                    onValueChange={(value) =>
                      updateConfig("bubble_config", "animation", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANIMATIONS.map((animation) => (
                        <SelectItem
                          key={animation.value}
                          value={animation.value}
                        >
                          {animation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Input
                    value={config.bubble_config.borderRadius}
                    onChange={(e) =>
                      updateConfig(
                        "bubble_config",
                        "borderRadius",
                        e.target.value
                      )
                    }
                    placeholder="18px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Message Spacing</Label>
                  <Input
                    value={config.bubble_config.spacing}
                    onChange={(e) =>
                      updateConfig("bubble_config", "spacing", e.target.value)
                    }
                    placeholder="8px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Width</Label>
                  <Input
                    value={config.bubble_config.maxWidth}
                    onChange={(e) =>
                      updateConfig("bubble_config", "maxWidth", e.target.value)
                    }
                    placeholder="80%"
                  />
                </div>
              </div>

              {/* Advanced Bubble Settings */}
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Advanced Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tail Size</Label>
                    <Input
                      value={config.bubble_config.tailSize || "8px"}
                      onChange={(e) =>
                        updateConfig(
                          "bubble_config",
                          "tailSize",
                          e.target.value
                        )
                      }
                      placeholder="8px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Shadow Intensity</Label>
                    <Select
                      value={config.bubble_config.shadow || "light"}
                      onValueChange={(value) =>
                        updateConfig("bubble_config", "shadow", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Shadow</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.bubble_config.showTimestamp || false}
                    onCheckedChange={(checked) =>
                      updateConfig("bubble_config", "showTimestamp", checked)
                    }
                  />
                  <Label>Show Message Timestamps</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.bubble_config.showAvatar || false}
                    onCheckedChange={(checked) =>
                      updateConfig("bubble_config", "showAvatar", checked)
                    }
                  />
                  <Label>Show Avatar in Messages</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Field */}
          <Card>
            <CardHeader>
              <CardTitle>Input Field</CardTitle>
              <CardDescription>
                Customize the input area and button appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Placeholder Text</Label>
                <Input
                  value={config.input_config.placeholder}
                  onChange={(e) =>
                    updateConfig("input_config", "placeholder", e.target.value)
                  }
                  placeholder="Type your message..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Input
                    value={config.input_config.borderRadius}
                    onChange={(e) =>
                      updateConfig(
                        "input_config",
                        "borderRadius",
                        e.target.value
                      )
                    }
                    placeholder="24px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    value={config.input_config.height}
                    onChange={(e) =>
                      updateConfig("input_config", "height", e.target.value)
                    }
                    placeholder="48px"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.input_config.showSendButton}
                    onCheckedChange={(checked) =>
                      updateConfig("input_config", "showSendButton", checked)
                    }
                  />
                  <Label>Show Send Button</Label>
                </div>

                {voiceEnabled && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.input_config.showMicButton}
                      onCheckedChange={(checked) =>
                        updateConfig("input_config", "showMicButton", checked)
                      }
                    />
                    <Label>Show Mic Button</Label>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Button Style</Label>
                <Select
                  value={config.input_config.buttonStyle}
                  onValueChange={(value) =>
                    updateConfig("input_config", "buttonStyle", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Input Settings */}
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Advanced Settings
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input Padding</Label>
                    <Input
                      value={config.input_config.padding || "12px 16px"}
                      onChange={(e) =>
                        updateConfig("input_config", "padding", e.target.value)
                      }
                      placeholder="12px 16px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Button Size</Label>
                    <Input
                      value={config.input_config.buttonSize || "36px"}
                      onChange={(e) =>
                        updateConfig(
                          "input_config",
                          "buttonSize",
                          e.target.value
                        )
                      }
                      placeholder="36px"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.input_config.autoFocus || false}
                    onCheckedChange={(checked) =>
                      updateConfig("input_config", "autoFocus", checked)
                    }
                  />
                  <Label>Auto-focus Input on Open</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.input_config.showCharacterCount || false}
                    onCheckedChange={(checked) =>
                      updateConfig(
                        "input_config",
                        "showCharacterCount",
                        checked
                      )
                    }
                  />
                  <Label>Show Character Count</Label>
                </div>

                <div className="space-y-2">
                  <Label>Max Characters</Label>
                  <Input
                    type="number"
                    value={config.input_config.maxCharacters || "500"}
                    onChange={(e) =>
                      updateConfig(
                        "input_config",
                        "maxCharacters",
                        e.target.value
                      )
                    }
                    placeholder="500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.footer_config.showPoweredBy}
                  onCheckedChange={(checked) =>
                    updateConfig("footer_config", "showPoweredBy", checked)
                  }
                />
                <Label>Show "Powered by" Branding</Label>
              </div>

              {config.footer_config.showPoweredBy && (
                <>
                  <div className="space-y-2">
                    <Label>Branding Text</Label>
                    <Input
                      value={config.footer_config.customBrandingText}
                      onChange={(e) =>
                        updateConfig(
                          "footer_config",
                          "customBrandingText",
                          e.target.value
                        )
                      }
                      placeholder="Powered by Yvexan Agency"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Branding URL</Label>
                    <Input
                      value={config.footer_config.customBrandingUrl}
                      onChange={(e) =>
                        updateConfig(
                          "footer_config",
                          "customBrandingUrl",
                          e.target.value
                        )
                      }
                      placeholder="https://yvexan-agency.com"
                    />
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.footer_config.showCTA}
                  onCheckedChange={(checked) =>
                    updateConfig("footer_config", "showCTA", checked)
                  }
                />
                <Label>Show Call-to-Action Banner</Label>
              </div>

              {config.footer_config.showCTA && (
                <>
                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                      value={config.footer_config.ctaText}
                      onChange={(e) =>
                        updateConfig("footer_config", "ctaText", e.target.value)
                      }
                      placeholder="Start your free trial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CTA URL</Label>
                    <Input
                      value={config.footer_config.ctaUrl}
                      onChange={(e) =>
                        updateConfig("footer_config", "ctaUrl", e.target.value)
                      }
                      placeholder="https://your-website.com/signup"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice" className="space-y-4">
          {voiceEnabled ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mic className="h-5 w-5" />
                    <span>Voice Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Voice Model</Label>
                    <Select
                      value={config.voice_config.model}
                      onValueChange={(value) =>
                        updateConfig("voice_config", "model", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VOICE_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Voice Speed</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.voice_config.voiceSpeed]}
                        onValueChange={([value]) =>
                          updateConfig("voice_config", "voiceSpeed", value)
                        }
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0.5x</span>
                        <span>{config.voice_config.voiceSpeed}x</span>
                        <span>2.0x</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.voice_config.autoDetectLanguage}
                        onCheckedChange={(checked) =>
                          updateConfig(
                            "voice_config",
                            "autoDetectLanguage",
                            checked
                          )
                        }
                      />
                      <Label>Auto Detect Language</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.voice_config.streamingMode}
                        onCheckedChange={(checked) =>
                          updateConfig("voice_config", "streamingMode", checked)
                        }
                      />
                      <Label>Streaming Mode</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.voice_config.autoReadMessages}
                        onCheckedChange={(checked) =>
                          updateConfig(
                            "voice_config",
                            "autoReadMessages",
                            checked
                          )
                        }
                      />
                      <Label>Auto Read Messages</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={config.voice_config.pushToTalk}
                        onCheckedChange={(checked) =>
                          updateConfig("voice_config", "pushToTalk", checked)
                        }
                      />
                      <Label>Push to Talk</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select
                      value={config.voice_config.outputFormat}
                      onValueChange={(value) =>
                        updateConfig("voice_config", "outputFormat", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3_44100_128">
                          MP3 44.1kHz 128kbps
                        </SelectItem>
                        <SelectItem value="mp3_44100_192">
                          MP3 44.1kHz 192kbps
                        </SelectItem>
                        <SelectItem value="pcm_16000">PCM 16kHz</SelectItem>
                        <SelectItem value="pcm_22050">PCM 22.05kHz</SelectItem>
                        <SelectItem value="pcm_24000">PCM 24kHz</SelectItem>
                        <SelectItem value="pcm_44100">PCM 44.1kHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Voice Preview */}
              {availableVoices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Preview</CardTitle>
                    <CardDescription>
                      Test different voices with your current settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availableVoices.map((voice) => (
                      <div
                        key={voice.voice_id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-sm text-gray-500">
                            {voice.category}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVoicePreview(voice.voice_id)}
                          disabled={isPlayingVoice}
                        >
                          {isPlayingVoice ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Voice Not Enabled
                </h3>
                <p className="text-gray-600">
                  Enable voice functionality in the basic settings to configure
                  voice options.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Animation & Effects</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Message Animation</Label>
                <Select
                  value={config.animation_config.messageAnimation}
                  onValueChange={(value) =>
                    updateConfig("animation_config", "messageAnimation", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANIMATIONS.map((animation) => (
                      <SelectItem key={animation.value} value={animation.value}>
                        {animation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transition Duration</Label>
                <Input
                  value={config.animation_config.transitionDuration}
                  onChange={(e) =>
                    updateConfig(
                      "animation_config",
                      "transitionDuration",
                      e.target.value
                    )
                  }
                  placeholder="300ms"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.animation_config.typingIndicator}
                    onCheckedChange={(checked) =>
                      updateConfig(
                        "animation_config",
                        "typingIndicator",
                        checked
                      )
                    }
                  />
                  <Label>Typing Indicator</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.animation_config.hoverEffects}
                    onCheckedChange={(checked) =>
                      updateConfig("animation_config", "hoverEffects", checked)
                    }
                  />
                  <Label>Hover Effects</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.animation_config.soundEffects}
                  onCheckedChange={(checked) =>
                    updateConfig("animation_config", "soundEffects", checked)
                  }
                />
                <Label>Sound Effects</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>
                Add custom CSS for advanced styling (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="/* Add your custom CSS here */
.chatbot-widget {
  /* Custom styles */
}"
                rows={8}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

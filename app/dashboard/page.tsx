'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signOut } from '@/lib/auth';
import { formatPaymentStatus } from '@/lib/utils/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Bot, Mic, Mail, AlertTriangle, Calendar, LogOut, User, Settings } from 'lucide-react';

interface Chatbot {
  id: string;
  name: string;
  owner_name?: string;
  bot_avatar_url?: string;
  starting_phrase?: string;
  model: string;
  auto_model_selection?: boolean;
  fallback_models?: string[];
  available_models?: any;
  voice_enabled: boolean;
  elevenlabs_api_key?: string;
  voice_id?: string;
  voice_settings?: any;
  data_capture_enabled: boolean;
  last_payment_date: string;
  ui_theme?: string;
  ui_layout?: string;
  footer_branding?: boolean;
  theme_settings?: any;
  created_at: string;
  updated_at: string;
  monthly_tokens?: number;
}

interface UserProfile {
  id: string;
  email?: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { user, error } = await getCurrentUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchChatbots(user.id);
    };

    checkUser();
  }, [router]);

  const fetchChatbots = async (userId: string) => {
    setLoading(true);
    
    console.log('Fetching chatbots for user:', userId);
    
    // Fetch chatbots
    const { data: chatbotsData, error: chatbotsError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('Dashboard chatbots query result:', chatbotsData);
    console.log('Dashboard chatbots query error:', chatbotsError);

    if (chatbotsError) {
      console.error('Error fetching chatbots:', chatbotsError);
      setLoading(false);
      return;
    }

    // Fetch monthly token usage for each chatbot
    const chatbotsWithUsage = await Promise.all(
      (chatbotsData || []).map(async (chatbot) => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: usageData } = await supabase
          .from('usage_logs')
          .select('tokens_used')
          .eq('chatbot_id', chatbot.id)
          .gte('created_at', startOfMonth.toISOString());

        const monthly_tokens = usageData?.reduce((sum, log) => sum + log.tokens_used, 0) || 0;

        return {
          ...chatbot,
          monthly_tokens,
        };
      })
    );

    setChatbots(chatbotsWithUsage);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleDeleteChatbot = async (chatbotId: string) => {
    if (!confirm('Are you sure you want to delete this chatbot? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', chatbotId);

    if (error) {
      console.error('Error deleting chatbot:', error);
      alert('Failed to delete chatbot');
      return;
    }

    // Refresh the list
    if (user) {
      await fetchChatbots(user.id);
    }
  };

  const handleGetEmbedCode = (chatbotId: string) => {
    const siteUrl = process.env.SITE_URL || 'https://yvexanchatbots.netlify.app';
    console.log('Generating embed code for chatbot:', chatbotId);
    console.log('Site URL:', siteUrl);
    
    // Find the chatbot to get its layout
    const chatbot = chatbots.find(c => c.id === chatbotId);
    const layout = chatbot?.ui_layout || 'corner';
    
    const embedCode = `<!-- ${chatbot?.name || 'Chatbot'} Embed Code -->
<script>
  const script = document.createElement('script');
  script.src = '${siteUrl}/embed/${chatbotId}.js';
  script.setAttribute('data-layout', '${layout}');
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
</script>`;

    navigator.clipboard.writeText(embedCode).then(() => {
      alert(`Embed code copied to clipboard!\n\nLayout: ${layout === 'corner' ? 'Corner Widget' : 'Full Page'}`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Bot className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-gray-900">ChatBot Platform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Link href="/settings">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Chatbots</h2>
            <p className="text-gray-600 mt-2">Manage your AI-powered chatbots</p>
          </div>
          <Link href="/chatbot/create">
            <Button className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Chatbot</span>
            </Button>
          </Link>
        </div>

        {chatbots.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No chatbots yet</h3>
              <p className="text-gray-600 mb-6">Create your first chatbot to get started</p>
              <Link href="/chatbot/create">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Create Your First Chatbot
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot) => {
              const paymentStatus = formatPaymentStatus(chatbot.last_payment_date);
              
              return (
                <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">{chatbot.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {user?.email}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/chatbot/${chatbot.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGetEmbedCode(chatbot.id)}>
                            Get Embed Code
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteChatbot(chatbot.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Model:</span>
                      <Badge variant="secondary" className="text-xs">
                        {chatbot.model.split('/').pop()?.replace('-instruct', '') || chatbot.model}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tokens this month:</span>
                      <span className="text-sm font-mono">{chatbot.monthly_tokens?.toLocaleString() || 0}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">Features:</span>
                      <div className="flex space-x-2">
                        {chatbot.voice_enabled && (
                          <Badge variant="outline" className="text-xs flex items-center space-x-1">
                            <Mic className="h-3 w-3" />
                            <span>Voice</span>
                          </Badge>
                        )}
                        {chatbot.data_capture_enabled && (
                          <Badge variant="outline" className="text-xs flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>Leads</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          {paymentStatus.status === 'overdue' && (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">
                                {paymentStatus.message}
                              </span>
                            </div>
                          )}
                          {paymentStatus.status === 'due-soon' && (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-600 font-medium">
                                {paymentStatus.message}
                              </span>
                            </div>
                          )}
                          {paymentStatus.status === 'current' && (
                            <span className="text-sm text-gray-600">
                              {paymentStatus.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
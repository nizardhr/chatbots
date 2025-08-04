'use client';

import { useParams } from 'next/navigation';
import { Bot, Sparkles, Database, Mic, User, Paintbrush, Save, ArrowLeft, Settings } from 'lucide-react';
import { ChatbotProvider, useChatbot } from './chatbot-context';
import { SidebarNav, SidebarNavItem } from '@/components/ui/sidebar-nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const sidebarNavItems: SidebarNavItem[] = [
  { title: 'Identity', href: 'identity', icon: Bot },
  { title: 'AI Model', href: 'model', icon: Sparkles },
  { title: 'Knowledge', href: 'knowledge', icon: Database },
  { title: 'Voice', href: 'voice', icon: Mic },
  { title: 'Lead Capture', href: 'leads', icon: User },
  { title: 'Design', href: 'design', icon: Paintbrush },
];

function EditorHeader() {
    const { chatbot, saveChanges, isSaving } = useChatbot();
    return (
         <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link href="/dashboard">
                    <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 truncate">
                        Editing: {chatbot?.name || 'Loading...'}
                    </h1>
                    <Button onClick={saveChanges} disabled={isSaving} className="bg-black text-white hover:bg-gray-800">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default function ChatbotEditorLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const chatbotId = params.id as string;

  return (
    <ChatbotProvider chatbotId={chatbotId}>
        <EditorHeader />
        <div className="container mx-auto my-8">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-4xl">
                    {children}
                </div>
            </div>
        </div>
    </ChatbotProvider>
  );
} 
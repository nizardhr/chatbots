'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarNav, SidebarNavItem } from '@/components/ui/sidebar-nav';

interface ChatbotEditorLayoutProps {
  children: React.ReactNode;
  sidebarNavItems: SidebarNavItem[];
}

export function ChatbotEditorLayout({ children, sidebarNavItems }: ChatbotEditorLayoutProps) {
  return (
    <div className="space-y-6 p-4 pb-16 md:p-8 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Chatbot Editor</h2>
        <p className="text-muted-foreground">
          Configure your chatbot's identity, AI model, and appearance.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
} 
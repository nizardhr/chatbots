'use client';

// useEffect and useRouter are no longer needed for the redirect
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Mic, Database, Code, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // The automatic redirect logic has been removed.
  // The page will now display for both logged-in and logged-out users.

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
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-black text-white hover:bg-gray-800">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Powerful AI Chatbots
            <br />
            <span className="text-gray-600">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create intelligent chatbots with voice capabilities, lead capture, and custom knowledge bases. 
            Deploy anywhere with our embeddable widget.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Start Building Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features to create professional chatbots</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Bot className="h-8 w-8 mb-4" />
                <CardTitle>AI-Powered Conversations</CardTitle>
                <CardDescription>
                  Use OpenRouter's advanced AI models to create intelligent, context-aware chatbots
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Mic className="h-8 w-8 mb-4" />
                <CardTitle>Voice Integration</CardTitle>
                <CardDescription>
                  Add ElevenLabs voice synthesis to make your chatbots speak with natural-sounding voices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 mb-4" />
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>
                  Upload documents (PDF, TXT, DOCX) to give your chatbot domain-specific knowledge
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 mb-4" />
                <CardTitle>Lead Capture</CardTitle>
                <CardDescription>
                  Automatically collect contact information through natural conversations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-8 w-8 mb-4" />
                <CardTitle>Easy Embedding</CardTitle>
                <CardDescription>
                  Get embed code to add your chatbot to any website with a single script tag
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-4" />
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Track token usage, conversations, and costs with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Create your first chatbot in minutes and start engaging with your users
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Create Your First Chatbot
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-4">
            <Bot className="h-6 w-6" />
            <span className="text-gray-600">© 2025 ChatBot Platform. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

# SaaS Chatbot Platform

A comprehensive SaaS platform for creating and managing AI-powered chatbots with voice capabilities, lead capture, and embeddable widgets.

## Features

- 🤖 AI-powered chatbots using OpenRouter
- 🎤 Voice integration with ElevenLabs
- 📊 Lead capture and analytics
- 📎 Embeddable widgets
- 💳 Payment tracking and reminders
- 📁 Knowledge base uploads
- 🔐 Secure authentication

## Getting Started

### Local Development (No Supabase Required)

The app is configured to work with mock data for local development. You can start building and testing immediately:

```bash
npm run dev
```

The app will run with a mock authentication system and in-memory data storage.

### Production Setup with Supabase

When you're ready to deploy or want to use real data:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Update environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run the database migrations** in your Supabase SQL editor:
   - Copy the contents of `supabase/migrations/create_chatbot_platform_schema.sql`
   - Run it in your Supabase project's SQL editor

4. **Install Supabase client** (if not already installed):
   ```bash
   npm install @supabase/supabase-js
   ```

The app will automatically switch from mock mode to real Supabase when valid credentials are provided.

## API Keys Required for Full Functionality

- **OpenRouter API Key**: For AI chat functionality
- **ElevenLabs API Key**: For voice features (optional)

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/ui/          # Reusable UI components
├── lib/                   # Utility functions and API clients
├── supabase/migrations/   # Database schema
└── public/               # Static assets
```

## Deployment

The app is ready for deployment on Vercel or any Next.js-compatible platform. Make sure to set your environment variables in your deployment platform.

## Development vs Production

- **Development**: Uses mock data, no external dependencies required
- **Production**: Requires Supabase setup and API keys for full functionality

This approach allows you to start developing immediately while having a clear path to production deployment.
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

## Setup Instructions

### 1. Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database migration**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from `supabase/migrations/20250731184435_fierce_sun.sql`

3. **Configure Storage**:
   - Go to Storage in your Supabase dashboard
   - The migration should have created a `knowledge-base` bucket
   - Verify the bucket exists and has proper policies

4. **Get your credentials**:
   - Go to Settings > API
   - Copy your Project URL and anon/public key

### 2. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Local Development

```bash
npm install
npm run dev
```

### 4. Netlify Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `out`
   - Add environment variables in Netlify dashboard

3. **Environment Variables for Netlify**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
   ```

## API Keys Required

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

## Features Overview

### Authentication
- Secure user registration and login via Supabase Auth
- Session management and protected routes

### Dashboard
- View all created chatbots
- Monitor token usage and payment status
- Quick access to edit, delete, and embed code

### Chatbot Creation
- Configure AI models via OpenRouter
- Upload knowledge base files (PDF, TXT, DOCX)
- Enable voice synthesis with ElevenLabs
- Set up lead capture functionality
- Customize themes and appearance

### Embeddable Widget
- Generate JavaScript embed code
- Customizable chat widget for any website
- Voice playback and lead capture support
- Payment status indicators

### Analytics & Billing
- Track token usage per chatbot
- Monthly payment reminders
- Usage cost estimates
- Lead capture analytics

## Support

For issues or questions, please check the documentation or create an issue in the repository.
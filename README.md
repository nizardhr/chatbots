# SaaS Chatbot Platform

A comprehensive SaaS platform for creating and managing AI-powered chatbots with voice capabilities, lead capture, embeddable widgets, and **advanced design customization**.

## Features

- 🤖 AI-powered chatbots using OpenRouter
- 🎤 Voice integration with ElevenLabs
- 📊 Lead capture and analytics
- 📎 Embeddable widgets
- 💳 Payment tracking and reminders
- 📁 Knowledge base uploads
- 🔐 Secure authentication
- 🎨 **Advanced Design Studio** - Voiceflow-level customization
- 🎯 **Design Presets** - Pre-built themes for quick setup
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Live Preview** - Real-time design updates

## 🎨 Design Customization Features

### Color Scheme Management
- **14 Customizable Colors**: Background, header, messages, text, input fields, buttons, and status colors
- **Color Presets**: Light, Dark, Warm, and Cool themes
- **Visual Color Picker**: Intuitive color selection with hex input
- **Accessibility**: High contrast options and color validation

### Typography Control
- **Google Fonts Integration**: 15+ premium fonts including Inter, Roboto, Nunito
- **Font Sizing**: Independent control for headers, messages, and input text
- **Font Weights**: Light to Bold options for different text elements
- **Font Families**: Complete typography system customization

### Chat Bubble Styling
- **Message Tails**: Customizable chat bubble tails with size control
- **Shadow Effects**: None, Light, Medium, and Heavy shadow options
- **Border Radius**: Precise control over bubble roundness
- **Animation**: Fade, Slide, Scale, Bounce, and custom animations
- **Timestamps**: Optional message timestamps with styling
- **Avatar Display**: Show/hide avatars in messages
- **Alignment**: Left, right, and center message alignment

### Input Field Customization
- **Button Styles**: Modern, Classic, Minimal, and Rounded button designs
- **Input Sizing**: Height, padding, and border radius control
- **Auto-focus**: Automatic input focus on widget open
- **Character Count**: Optional character limit with visual counter
- **Placeholder Text**: Customizable input placeholder messages
- **Button Sizing**: Independent control of send and mic button sizes

### Layout & Responsive Design
- **Layout Modes**: Corner widget and full-screen options
- **Responsive Breakpoints**: Mobile, tablet, and desktop optimization
- **Widget Dimensions**: Width, height, padding, and margin control
- **Border Radius**: Global widget corner rounding
- **Positioning**: Precise widget placement and spacing

### Advanced Features
- **Animation System**: Message animations, typing indicators, hover effects
- **Transition Control**: Customizable animation durations
- **Sound Effects**: Optional audio feedback
- **Header Configuration**: Logo, title, and owner name display
- **Footer Branding**: Custom "Powered by" text and CTA options
- **Voice Integration**: Voice button styling and configuration

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
│   ├── design-panel.tsx   # Advanced design customization
│   ├── design-showcase.tsx # Design presets and themes
│   └── chatbot-preview.tsx # Live preview component
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
- **Advanced design customization with live preview**

### Design Studio
- **Visual Design Panel**: Tabbed interface for all customization options
- **Design Presets**: 4 pre-built themes (Modern Minimal, Dark Professional, Warm & Friendly, Corporate Blue)
- **Live Preview**: Real-time design updates as you customize
- **Color Management**: 14 customizable colors with visual picker
- **Typography System**: Google Fonts integration with size/weight control
- **Component Styling**: Detailed control over bubbles, input, header, and footer
- **Animation System**: Message animations, transitions, and effects
- **Responsive Design**: Mobile-first approach with breakpoint control

### Embeddable Widget
- Generate JavaScript embed code
- Customizable chat widget for any website
- Voice playback and lead capture support
- Payment status indicators
- **Fully customizable appearance and behavior**

### Analytics & Billing
- Track token usage per chatbot
- Monthly payment reminders
- Usage cost estimates
- Lead capture analytics

## Design Customization Examples

### Quick Start with Presets
1. Choose from 4 pre-designed themes
2. Customize colors, fonts, and layout
3. Preview changes in real-time
4. Apply to your chatbot

### Advanced Customization
1. **Colors**: Use the visual color picker to create your brand palette
2. **Typography**: Select from 15+ Google Fonts with size/weight control
3. **Bubbles**: Add tails, shadows, timestamps, and animations
4. **Input**: Style buttons, add character limits, and auto-focus
5. **Layout**: Control dimensions, positioning, and responsive behavior

### Professional Themes
- **Modern Minimal**: Clean, contemporary design for tech companies
- **Dark Professional**: Sophisticated dark theme for B2B applications
- **Warm & Friendly**: Cozy, approachable design for customer service
- **Corporate Blue**: Professional business theme for enterprise clients

## Support

For issues or questions, please check the documentation or create an issue in the repository.

## Roadmap

- [ ] Additional animation presets
- [ ] Custom CSS injection
- [ ] Theme marketplace
- [ ] Advanced voice customization
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Team collaboration features
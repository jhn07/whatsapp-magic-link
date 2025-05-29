# WhatsApp AI Assistant Frontend

This is a Next.js frontend interface for an AI assistant that provides medical and legal consultations via WhatsApp. The project demonstrates integration with Firebase Authentication using Magic Links and user session management.

## Key Features

- Authentication via Magic Links (passwordless authentication)
- Protected access to personal dashboard
- Firebase Admin SDK integration
- Next.js Server Actions for secure authentication handling
- Progressive enhancement
- Type safety with TypeScript

## Tech Stack

- [Next.js 14](https://nextjs.org/) with App Router
- [Firebase](https://firebase.google.com/) for authentication
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn/UI](https://ui.shadcn.com) for component styling
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/whatsapp-ai-chatbot-frontend.git
cd whatsapp-ai-chatbot-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up Firebase project:
   - Create a new project in [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and select Email link (passwordless) as sign-in method
   - Add domains to allowlist for Magic Links

4. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   ```bash
   cp .env.local.example .env.local
   ```
   - Fill in the environment variables (see "Environment Setup" section)

5. Run the project:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Environment Setup

### Firebase Client SDK
In Project Settings > General find the web app configuration and fill in:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Firebase Admin SDK
In Project Settings > Service Accounts:
1. Click "Generate New Private Key"
2. From the downloaded JSON, fill in:
```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Session Settings
```env
SESSION_COOKIE_NAME=session
SESSION_EXPIRY_DAYS=5
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
COOKIE_PATH=/
```

## Project Architecture

- `app/` - application routes and pages
- `components/` - React components
- `lib/` - utilities and Firebase configuration
- `hooks/` - custom React hooks
- `public/` - static files

## Core Components

- `MagicLinkForm` - form for sending Magic Link
- `SignOut` - component for logging out
- `Dashboard` - protected dashboard page

## Implementation Features

1. **Passwordless Authentication**
   - Firebase Email Link Authentication usage
   - Secure Magic Links handling
   - Session state management

2. **Server-Side Security**
   - Firebase Admin SDK implementation
   - Secure session cookies
   - Route protection middleware

3. **Progressive Enhancement**
   - Server Actions for forms
   - JavaScript-free functionality
   - Enhanced UX with JavaScript


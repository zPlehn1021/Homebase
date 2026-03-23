# 🏡 Homebase

**Never forget home maintenance again.** Homebase is a personalized home maintenance planner with seasonal reminders, cost tracking, and smart scheduling — all for a one-time $19 payment.

Built with Next.js 16, React 19, Tailwind CSS v4, and deployed on Vercel.

---

## Quick Start

### Prerequisites

- Node.js 18+
- A [Turso](https://turso.tech) database
- A [Resend](https://resend.com) account (for email)

### 1. Clone & Install

```bash
git clone https://github.com/zPlehn1021/Homebase.git
cd Homebase
npm install
```

### 2. Set Up Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Sign up / log in
turso auth signup

# Create database
turso db create homebase

# Get your credentials
turso db show homebase --url     # → TURSO_DATABASE_URL
turso db tokens create homebase  # → TURSO_AUTH_TOKEN
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See the comments in `.env.example` for where to find each value.

### 4. Push Database Schema & Seed

```bash
# Push schema to Turso
npm run db:push

# Seed with task templates (optional but recommended)
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page. Sign in to access the dashboard.

---

## Deploy to Vercel

### 1. Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo: `zPlehn1021/Homebase`
3. Vercel auto-detects Next.js — no build settings needed

### 2. Add Environment Variables

In Vercel project settings → Environment Variables, add every variable from `.env.example`:

| Variable | Where to get it |
|----------|----------------|
| `TURSO_DATABASE_URL` | `turso db show homebase --url` |
| `TURSO_AUTH_TOKEN` | `turso db tokens create homebase` |
| `AUTH_SECRET` | `npx auth secret` |
| `AUTH_URL` | Your production URL (e.g. `https://homebase.app`) |
| `AUTH_GOOGLE_ID` | Google Cloud Console → Credentials |
| `AUTH_GOOGLE_SECRET` | Google Cloud Console → Credentials |
| `AUTH_RESEND_KEY` | Resend dashboard → API Keys |
| `LEMONSQUEEZY_*` | LemonSqueezy dashboard (see below) |
| `CRON_SECRET` | `openssl rand -base64 32` |

### 3. Deploy

Push to `main` — Vercel auto-deploys. Cron jobs (`vercel.json`) activate automatically on Pro/Enterprise plans.

---

## Service Configuration

### Google OAuth

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URIs:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
4. Copy Client ID → `AUTH_GOOGLE_ID`, Client Secret → `AUTH_GOOGLE_SECRET`

### Resend Email

1. Sign up at [resend.com](https://resend.com)
2. [Verify your sending domain](https://resend.com/domains) (e.g. `homebase.app`)
3. [Create an API key](https://resend.com/api-keys) → `AUTH_RESEND_KEY`

The same API key is used for both magic link sign-in and email reminders/digests.

### LemonSqueezy Payments

1. Create a store at [app.lemonsqueezy.com](https://app.lemonsqueezy.com)
2. Create a product ($19, one-time payment)
3. Get your values:
   - **Store ID**: Settings → General
   - **API Key**: Settings → API → Create API Key
   - **Checkout URL**: Products → Your Product → Share → Checkout URL
4. Set up the webhook:
   - Go to Settings → Webhooks → Create Webhook
   - **URL**: `https://your-domain.com/api/webhooks/lemonsqueezy`
   - **Events**: Select `order_completed`
   - Copy the **Signing Secret** → `LEMONSQUEEZY_WEBHOOK_SECRET`

### Cron Jobs

Configured in `vercel.json`. Requires Vercel Pro plan or higher.

| Job | Schedule | Description |
|-----|----------|-------------|
| `/api/cron/send-reminders` | Daily at 8am EST | Sends task reminder emails |
| `/api/cron/weekly-digest` | Mondays at 8am EST | Sends weekly summary emails |

Both endpoints are protected by `CRON_SECRET` (Vercel sends it automatically as a Bearer token).

---

## Database Migrations

```bash
# Push schema changes to database
npm run db:push

# Generate migration files (for version control)
npm run db:generate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

---

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Authenticated routes (dashboard, tasks, etc.)
│   ├── (auth)/         # Login page
│   ├── (onboarding)/   # Onboarding flow
│   ├── api/            # API routes
│   ├── purchase/       # Post-purchase pages
│   └── pricing/        # Checkout redirect
├── components/
│   ├── landing/        # Landing page components
│   ├── settings/       # Settings sections
│   ├── tasks/          # Task card, modals
│   └── ui/             # Reusable UI (focus trap, skeleton, etc.)
├── db/                 # Drizzle schema, seed script
├── emails/             # React Email templates
└── lib/                # Auth, hooks, utilities
```

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS v4
- **Database**: Turso (LibSQL) via Drizzle ORM
- **Auth**: NextAuth v5 (Google OAuth + Magic Link via Resend)
- **Email**: Resend + React Email
- **Payments**: LemonSqueezy (one-time purchase)
- **Hosting**: Vercel
- **PWA**: Custom service worker, web app manifest

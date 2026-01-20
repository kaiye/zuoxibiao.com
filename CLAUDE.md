# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese health and wellness website (zuoxibiao.com) that displays optimal daily schedules with health tips. It's a Next.js 15 application with static export, deployed to Cloudflare Pages.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Rendering**: Static Export (`output: 'export'`)
- **Deployment**: Cloudflare Pages via GitHub Actions
- **State Management**: React Context + localStorage

## Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page
├── globals.css         # Global styles
├── schedules/page.tsx  # Schedule selection page
└── my/page.tsx         # Custom schedule management

components/             # React components
├── providers/          # Context providers
├── pages/              # Page client components
├── Navbar.tsx          # Navigation
├── Footer.tsx          # Footer
├── Modal.tsx           # Modal dialogs
├── Timeline.tsx        # Schedule timeline
└── ScheduleCard.tsx    # Schedule cards

hooks/                  # Custom React hooks
├── useCurrentTime.ts   # Real-time clock
├── useToast.ts         # Toast notifications
└── useNotifications.ts # Browser notifications

lib/                    # Utilities and data
├── schedules.ts        # Schedule data (17 schedules)
└── timeUtils.ts        # Time parsing utilities

types/                  # TypeScript definitions
└── schedule.ts

public/                 # Static assets
├── favicon.png
├── favicons/
├── manifest.json
├── robots.txt
└── sitemap.xml
```

## Key Features

- **Real-time Schedule Highlighting**: Automatically highlights current time period
- **Multiple Schedules**: 17 schedules from WHO, Harvard, Tsinghua, etc.
- **Custom Schedules**: Users can create and manage personal schedules
- **Responsive Design**: Mobile-first responsive UI
- **SEO Optimized**: Metadata API, sitemap, robots.txt

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Output directory: out/
```

## Deployment

- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
- **Platform**: Cloudflare Pages
- **Domain**: https://zuoxibiao.com
- **Trigger**: Push to `main` branch

## Important Notes

- All interactive components use `'use client'` directive
- localStorage access is wrapped in useEffect for SSR safety
- Static export means no API routes or server-side features

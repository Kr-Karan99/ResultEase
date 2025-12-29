# ResultEase Deployment Guide

## Overview

ResultEase is built with Next.js and can be deployed to various platforms. This guide covers deployment options, environment setup, and production considerations.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/result-ease-mvp)

**Advantages:**
- Zero configuration deployment
- Automatic HTTPS
- Global CDN
- Built-in analytics
- Preview deployments

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/result-ease-mvp)

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18+

### Railway

**Steps:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`

## 🔧 Environment Configuration

### Environment Variables

Create production environment variables:

```env
# Required
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ResultEase
# Optional (for analytics)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX
# Future Firebase Integration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

### Build Configuration

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployments
  images: {
    domains: ['your-domain.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  serverExternalPackages: ['xlsx'],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  resultease:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=https://your-domain.com
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - resultease
    restart: unless-stopped
```
## ☁️ Cloud Deployments
### AWS (Amplify)
**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```
### Google Cloud Platform
**app.yaml (App Engine):**
```yaml
runtime: nodejs18

env_variables:
  NODE_ENV: production
  NEXT_PUBLIC_BASE_URL: https://your-project.appspot.com

automatic_scaling:
  min_instances: 1
  max_instances: 10
```
### Azure (Static Web Apps)
**staticwebapp.config.json:**
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

## 🔒 Security Configuration

### Content Security Policy

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
      style-src 'self' 'unsafe-inline' fonts.googleapis.com;
      img-src 'self' data: https:;
      font-src 'self' fonts.gstatic.com;
      connect-src 'self' *.google-analytics.com *.analytics.google.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

### Rate Limiting

For API routes (future):

```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const limit = 10 // requests per minute
  const windowMs = 60 * 1000 // 1 minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    })
  }

  const ipData = rateLimitMap.get(ip)

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0
    ipData.lastReset = Date.now()
  }

  if (ipData.count >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  ipData.count += 1

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```
## 📊 Monitoring & Analytics
### Google Analytics 4
Add to `app/layout.tsx`:
```typescript
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```
### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```
**sentry.client.config.js:**
```javascript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```
### Performance Monitoring
**Web Vitals tracking:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
## 🚀 Performance Optimization
### Build Optimization
```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:production": "NODE_ENV=production next build"
  }
}
```
### Bundle Analysis
```bash
npm install @next/bundle-analyzer
```
**next.config.js:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```
### Image Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```
## 🔄 CI/CD Pipeline
### GitHub Actions
**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```
### Quality Gates
```yaml
# Additional quality checks
- name: Check bundle size
  run: npm run build:analyze

- name: Security audit
  run: npm audit --audit-level high

- name: Type checking
  run: npx tsc --noEmit
```
## 📱 Progressive Web App
### Manifest Configuration
**public/manifest.json:**
```json
{
  "name": "ResultEase - School Result Analysis",
  "short_name": "ResultEase",
  "description": "Transform Excel result files into professional insights",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'resultease-v1'
const urlsToCache = [
  '/',
  '/upload',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})
```
## 🔍 SEO Optimization
### Sitemap Generation
Automatic sitemap at `/sitemap.xml` via `app/sitemap.ts`
### Robots.txt
Automatic robots.txt at `/robots.txt` via `app/robots.ts`
### Meta Tags
Comprehensive meta tags in each page layout for:
- Search engines
- Social media sharing
- Mobile optimization
## 🚨 Troubleshooting
### Common Issues
**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version # Should be 18+
```
**Memory Issues:**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```
**Deployment Failures:**
- Check environment variables
- Verify build command
- Review deployment logs
- Test build locally first
### Health Checks
Create health check endpoint:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```
## 📈 Scaling Considerations
### CDN Configuration
- Static assets via CDN
- Image optimization
- Gzip compression
- Browser caching headers
### Database Scaling (Future)
When integrating Firebase:
- Firestore indexes
- Connection pooling
- Read replicas
- Caching strategies
### Load Balancing
For high-traffic deployments:
- Multiple instances
- Health checks
- Session affinity
- Auto-scaling rules
---
This deployment guide ensures **reliable**, **secure**, and **scalable** production deployments of ResultEase.

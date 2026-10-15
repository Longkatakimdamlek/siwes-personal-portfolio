# SIWES Developer Portfolio Website

A personal full-stack developer portfolio and content management system built as part of a **SIWES (Students Industrial Work Experience Scheme)** software engineering project.

Built with **Next.js 15 (App Router)**, **React 19**, **pure JavaScript**, **CSS Modules**, **PostgreSQL via Supabase**, **Supabase Auth**, **Resend email delivery**, and **Progressive Web App (PWA)** capabilities.

---

## Table of Contents

1. [Key Features](#key-features)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Local Development Setup](#local-development-setup)
6. [Supabase Database & Authentication Setup](#supabase-database--authentication-setup)
7. [Contact Form & Resend Email Setup](#contact-form--resend-email-setup)
8. [Progressive Web App (PWA) & Offline Mode](#progressive-web-app-pwa--offline-mode)
9. [Environment Variables Reference](#environment-variables-reference)
10. [Production Deployment Guide (Vercel)](#production-deployment-guide-vercel)
11. [Security Architecture](#security-architecture)
12. [Troubleshooting & Common Questions](#troubleshooting--common-questions)
13. [Final Handover Checklist](#final-handover-checklist)

---

## Key Features

- **Public Portfolio Showcase**:
  - **Hero Section**: Responsive fluid typography (`clamp()`), availability badge kicker, and CTAs.
  - **About Section**: Professional biography, SIWES objectives, and core strengths.
  - **Skills Matrix**: Interactive category filter tabs (Frontend, Backend, Database, Tools) with proficiency progress bars.
  - **Projects Showcase**: Interactive project cards with screenshots, tech stacks, live demo links, and source code links.
  - **Experience & Education Timeline**: Chronological presentation of internship placements, roles, and academic qualifications.
  - **Contact Section**: Direct email form with honeypot spam traps, IP rate-limiting, and client/server validation.
  - **Dedicated Sub-pages**: Direct navigation routes for `/about`, `/skills`, `/projects`, and `/contact`.

- **Protected Admin Content Management**:
  - **Supabase Auth Session Management**: Cookie-based server sessions via `@supabase/ssr`.
  - **Single-Owner Authorization**: Edge middleware and Server Component guards enforcing matching `ADMIN_EMAIL`.
  - **Dashboard Overview**: Metrics counters for projects, skills, and work experiences with one-click data seeding.
  - **Full CRUD Management**: Dedicated forms and tables to create, edit, reorder, and delete:
    - Site settings (branding, meta tags, hero copy, social URLs)
    - Developer profile (bio, headline, years of experience, availability status)
    - Skills (name, category, proficiency level, display order, featured status)
    - Projects (title, slug, descriptions, technologies, links, status)
    - Experience entries (role, company, dates, current employment flag)
    - Education records (degree, institution, field of study, timeline)
  - **Instant Cache Revalidation**: Mutations invoke `revalidatePath()` to refresh public pages in real time.

- **Progressive Web App (PWA)**:
  - Installable on desktop and mobile (Safari, Chrome, Edge) with standalone window mode.
  - Multi-tier caching Service Worker (`public/sw.js`) with cache versioning.
  - Dedicated offline shell (`/offline`) and real-time connectivity status indicator (`OfflineIndicator`).
  - Security exclusions: `/admin/*` routes and API endpoints are never cached.

- **Accessibility & Design**:
  - Dark/near-black theme with purple glow accents (`#0b0b12`, `#7c3aed`).
  - Pure CSS Modules (no Tailwind or external utility libraries).
  - WCAG AA compliance with visible `:focus-visible` rings, `.skipLink`, and `@media (prefers-reduced-motion)`.
  - Minimum touch targets $\ge 44\text{px}$ across mobile and tablet viewports.

---

## Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.2.0 | App Router with Server Components, Server Actions, Route Handlers |
| **Library** | React 19.0.0 | Pure JavaScript, functional components, React Hooks |
| **Styling** | CSS Modules | Locally scoped CSS classes and CSS custom property theme tokens |
| **Database** | PostgreSQL | Hosted on Supabase with Row Level Security (RLS) policies |
| **Auth** | Supabase Auth (GoTrue) | `@supabase/ssr` with HTTP-only cookie-based sessions |
| **Email** | Resend SDK (`resend`) | Server-side email delivery with responsive HTML templates |
| **Icons** | `lucide-react` | Lightweight SVG icons |
| **PWA** | Service Worker API | Custom caching worker, manifest, and offline fallback |

---

## Project Structure

```
.
├── .env.example                     # Comprehensive environment variable documentation
├── .gitignore                       # Git exclusion rules (protects .env.local and .next)
├── jsconfig.json                    # Path aliases (@/* -> src/*)
├── metadata.json                    # Application metadata
├── next.config.mjs                  # Next.js configuration, security headers, image domains
├── package.json                     # Dependencies and run scripts
├── public/
│   ├── favicon.png                  # Browser favicon
│   ├── icon.svg                     # Vector app icon
│   ├── icon-192.png                 # PWA standard icon
│   ├── icon-512.png                 # PWA splash icon
│   ├── icon-maskable-512.png        # PWA adaptive maskable icon
│   ├── apple-touch-icon.png         # iOS Safari home screen icon
│   ├── manifest.webmanifest         # PWA Web App Manifest
│   ├── sw.js                        # Multi-tier Service Worker
│   └── images/                      # Project screenshots and avatar asset
├── scripts/
│   ├── seed-db.js                   # Node.js database content seeder
│   └── verify-db.js                 # Supabase connectivity & RLS verification
├── src/
│   ├── middleware.js                # Edge middleware for /admin route protection
│   ├── app/
│   │   ├── layout.js                # Root HTML layout with PWA script and skip link
│   │   ├── page.js                  # Main portfolio homepage
│   │   ├── error.js                 # Global client error boundary
│   │   ├── not-found.js             # 404 page with dark theme
│   │   ├── about/page.js            # Standalone About page
│   │   ├── skills/page.js           # Standalone Skills page
│   │   ├── projects/page.js         # Standalone Projects page
│   │   ├── contact/
│   │   │   ├── page.js              # Standalone Contact page
│   │   │   └── actions.js           # Server Action for contact submissions
│   │   ├── api/contact/route.js     # REST API route handler for contact form
│   │   ├── offline/page.js          # Pre-cached offline fallback page
│   │   └── admin/
│   │       ├── actions.js           # Server Actions for CRUD operations
│   │       ├── layout.js            # Admin layout with sidebar navigation
│   │       ├── page.js              # Admin dashboard metrics view
│   │       ├── login/page.js        # Administrator login page with open-redirect guard
│   │       ├── settings/page.js     # Site settings editor
│   │       ├── profile/page.js      # Developer profile editor
│   │       ├── skills/page.js       # Skills manager
│   │       ├── projects/page.js     # Projects manager
│   │       ├── experience/page.js   # Work experience manager
│   │       └── education/page.js    # Education manager
│   ├── components/
│   │   ├── Header.js                # Sticky navigation header with mobile drawer
│   │   ├── Hero.js                  # Hero introduction section
│   │   ├── About.js                 # About section
│   │   ├── Skills.js                # Skills grid and interactive filter bar
│   │   ├── SkillCard.js             # Skill card with proficiency level
│   │   ├── Projects.js              # Projects showcase with status filter
│   │   ├── ProjectCard.js           # Project card with tech badges
│   │   ├── ExperienceTimeline.js    # Work & education chronological list
│   │   ├── ContactSection.js        # Contact form with spam protection
│   │   ├── Footer.js                # Footer with social links and back-to-top
│   │   ├── PWAInstallButton.js      # PWA install button with iOS modal
│   │   ├── PWARegistration.js       # Client component registering sw.js
│   │   ├── OfflineIndicator.js      # Real-time online/offline network banner
│   │   └── admin/
│   │       ├── AdminLayout.js       # Responsive admin drawer and sidebar
│   │       ├── ConfirmDialog.js     # Accessible deletion modal dialog
│   │       ├── ImagePreviewInput.js # Input field with live image preview
│   │       └── LogoutButton.js      # Sign-out action trigger
│   ├── hooks/
│   │   └── usePWA.js                # React hook for install prompt and standalone check
│   ├── lib/
│   │   ├── auth.js                  # Server session verification (assertAdmin)
│   │   ├── defaults.js              # Fallback portfolio content
│   │   ├── email.js                 # Resend email template and dispatch
│   │   ├── models.js                # Public data query functions
│   │   ├── rate-limiter.js          # In-memory IP submission rate limiter
│   │   ├── supabase.js              # Supabase client helper
│   │   └── supabase/
│   │       ├── client.js            # Browser client (@supabase/ssr)
│   │       ├── server.js            # Server client (@supabase/ssr)
│   │       └── middleware.js        # Middleware session updater
│   └── styles/
│       └── globals.css              # CSS theme tokens, skip link, reduced motion
└── supabase/
    ├── migrations/
    │   ├── 20260920000000_create_portfolio_tables.sql   # Core 6 tables + RLS + indexes
    │   └── 20261013000000_create_contact_messages_table.sql # Contact inquiries table
    └── seed.sql                     # Realistic starter SQL data
```

---

## Prerequisites

Before starting local development or deployment, make sure you have:

1. **Node.js**: Version `18.17.0` or higher (recommended: Node.js 20 LTS or 22).
2. **Package Manager**: `npm` (version 9+ comes with Node.js).
3. **Supabase Account**: Free account at [supabase.com](https://supabase.com).
4. **Resend Account** *(for contact emails)*: Free account at [resend.com](https://resend.com).
5. **Code Editor**: Visual Studio Code (or any preferred editor).

---

## Local Development Setup

Follow these steps to run the project on your machine in VS Code:

### 1. Download and Extract the Code
Export or download the project from AI Studio, unzip it into a folder, and open it in VS Code:
```bash
cd siwes-developer-portfolio
code .
```

### 2. Install Dependencies
Install all project packages:
```bash
npm install
```

### 3. Create Environment Configuration
Copy the template to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Initial Run:** Before connecting your real Supabase project, the portfolio renders default data from `src/lib/defaults.js`. No crashes or empty white-screens will occur.

---

## Supabase Database & Authentication Setup

Follow this step-by-step process to connect your real PostgreSQL database and configure the administrator account:

### Step 1: Create a Supabase Project
1. Go to [database.new](https://database.new) (or log in to [supabase.com/dashboard](https://supabase.com/dashboard)).
2. Click **New Project**.
3. Choose an organization, enter a name (e.g. `siwes-portfolio`), and set a secure database password.
4. Select the region closest to you and click **Create new project**.

### Step 2: Retrieve API Credentials
1. In your Supabase Dashboard, click on the **Project Settings** (gear icon) in the bottom-left.
2. Select **API** under Configuration.
3. Copy the following:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys &rarr; anon / public** key
4. Open `.env.local` in VS Code and fill in the values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

### Step 3: Run Database Migrations
1. In your Supabase Dashboard, click on the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Open `supabase/migrations/20260920000000_create_portfolio_tables.sql` in VS Code, copy all contents, paste them into the SQL Editor, and click **Run**.
4. Create another new query, copy the contents of `supabase/migrations/20261013000000_create_contact_messages_table.sql`, paste, and click **Run**.
5. Both migrations will create the tables, indexes, and Row Level Security (RLS) policies.

### Step 4: Verify Database Tables & Policies
Run the automated verification script from your terminal:
```bash
npm run db:verify
```
You should see green checkmarks for all six core tables:
- `site_settings`
- `profiles`
- `skills`
- `projects`
- `experiences`
- `education`

### Step 5: Seed Starter Content (Optional)
Populate your new tables with realistic initial portfolio content:
```bash
npm run db:seed
```
*(Alternatively, you can seed later directly from the `/admin` dashboard using the "Seed Starter Content" button).*

### Step 6: Create the Administrator Account
Because this is a personal single-owner portfolio, registration is not exposed publicly:
1. In your Supabase Dashboard, go to **Authentication** &rarr; **Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter your personal administrator email (e.g. `yourname@gmail.com`).
4. Enter a strong password.
5. Toggle **Auto Confirm User?** to **ON** (skips email verification).
6. Click **Create User**.

### Step 7: Configure Single-Owner Authorization
In `.env.local`, set `ADMIN_EMAIL` to the exact email address you just created:
```env
ADMIN_EMAIL=yourname@gmail.com
```

### Step 8: Test Admin Access
1. Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
2. Enter your credentials.
3. Upon login, you will be redirected to `/admin` where you can manage your portfolio content.

---

## Contact Form & Resend Email Setup

The portfolio contact form uses [Resend](https://resend.com) to deliver messages directly to your inbox with zero server dependencies.

### Step 1: Create an API Key
1. Sign up for free at [resend.com](https://resend.com).
2. Go to **API Keys** &rarr; **Create API Key**.
3. Set the name to `Portfolio Contact` and give it **Full Access**.
4. Copy the key starting with `re_...`.

### Step 2: Configure Environment Variables
Add the key and addresses to `.env.local`:
```env
RESEND_API_KEY=re_your_api_key_here

# During initial testing (without a custom domain), use Resend's sandbox sender:
CONTACT_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"

# Set to your personal email where messages should arrive:
CONTACT_TO_EMAIL=yourname@gmail.com
```

> **Testing Note:** Resend's free test sender (`onboarding@resend.dev`) only delivers to the email address registered with your Resend account. Once you verify your custom domain in the Resend dashboard, you can change `CONTACT_FROM_EMAIL` to `Contact <contact@yourcustomdomain.com>` to receive emails from any visitor.

---

## Progressive Web App (PWA) & Offline Mode

The application meets PWA standards and can be installed as a standalone desktop or mobile application.

- **Manifest**: Located at `/manifest.webmanifest`, defining app icons, colors (`#0b0b12`), and quick-action shortcuts (`/#projects`, `/#contact`, `/#skills`).
- **Service Worker (`public/sw.js`)**:
  - Automatically caches the offline shell (`/offline`), homepage, icons, and static assets.
  - Excludes all `/admin/*` routes and API endpoints for security.
- **Offline Shell**: If a visitor loses internet connectivity, the application continues to display cached pages and presents a dedicated offline screen with a network retry button if an uncached page is requested.
- **In-App Install Prompt**: Desktop and Android devices show a native install button in the header; iOS Safari users receive guided modal instructions.

---

## Environment Variables Reference

| Variable Name | Required? | Scope | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Public | Supabase Project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **Yes** | Public | Supabase Public / Anon API key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Public | Fallback alias for the public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only | Secret key for backend administrative scripts (`seed-db.js`). **Never expose to browser code.** |
| `ADMIN_EMAIL` | **Yes** | Server-only | Owner email address matching Supabase Auth user. Grants `/admin` access. |
| `RESEND_API_KEY` | Optional | Server-only | API key from Resend for contact form email delivery. |
| `CONTACT_FROM_EMAIL` | Optional | Server-only | Sender email header (e.g. `onboarding@resend.dev`). |
| `CONTACT_TO_EMAIL` | Optional | Server-only | Inbox address where contact messages will be forwarded. |

---

## Production Deployment Guide (Vercel)

**Vercel** is the recommended hosting platform for this application because:
- It was created by the maintainers of Next.js.
- It natively supports Next.js App Router Server Components, Server Actions, and Edge Middleware without extra configuration.
- It provisions free automatic SSL certificates, global CDN edge caching, and preview environments.

### Step 1: Push Code to a Private GitHub Repository
1. Initialize Git in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SIWES Developer Portfolio complete"
   ```
2. Create a new **Private** repository on [github.com](https://github.com/new).
3. Link and push your repository:
   ```bash
   git remote add origin https://github.com/your-username/siwes-portfolio.git
   git branch -M main
   git push -u origin main
   ```
   *(Confirm that `.env.local` was NOT pushed to GitHub).*

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** &rarr; **Project**.
3. Select your `siwes-portfolio` repository and click **Import**.
4. In the **Environment Variables** section, add your production values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`
5. Click **Deploy**.

Vercel will build the project and assign a production URL (e.g. `https://siwes-portfolio.vercel.app`).

### Step 3: Add a Custom Domain (Optional)
1. In your Vercel Project Dashboard, go to **Settings** &rarr; **Domains**.
2. Enter your custom domain (e.g. `yourname.dev` or `yourname.com`).
3. Follow the DNS instructions to add the required `CNAME` or `A` record at your domain registrar.

---

## Security Architecture

- **Row Level Security (RLS)**: Enforced directly at the PostgreSQL database level. Anonymous users can only `SELECT` published portfolio records and `INSERT` contact messages. Modifications require an authenticated session.
- **Server Action Protection**: All administrative Server Actions in `src/app/admin/actions.js` invoke `assertAdmin()`, verifying the authenticated user's email against `ADMIN_EMAIL` server-side before executing mutations.
- **Edge Route Middleware**: `src/middleware.js` intercepts all `/admin/*` requests, redirecting unauthenticated users to `/admin/login` before Server Components execute.
- **Open-Redirect Sanitization**: Login target redirects are sanitized via `getSafeRedirect()` to prevent external domain phishing.
- **Contact Form Abuse Protection**: Includes an invisible honeypot trap, in-memory IP rate limiting (max 5 requests per 10 minutes), and strict input length checks.
- **No Credentials in Client Bundles**: Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) are kept server-side and never prefixed with `NEXT_PUBLIC_`.

---

## Troubleshooting & Common Questions

#### 1. "TypeError: fetch failed" when running `npm run db:verify`
- **Cause**: Supabase credentials in `.env.local` are still placeholders or the Supabase project is paused.
- **Solution**: Check that `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` points to your active project URL.

#### 2. "Invalid login credentials" on `/admin/login`
- **Cause**: The email or password entered does not match a user in Supabase Auth &rarr; Users.
- **Solution**: Confirm you created the user in the Supabase Dashboard and that **Auto Confirm User** was turned ON.

#### 3. Access denied after logging in / Redirected back to login
- **Cause**: The authenticated user's email does not match `ADMIN_EMAIL` in `.env.local`.
- **Solution**: Ensure `ADMIN_EMAIL` exactly matches the email in Supabase Auth (case-insensitive).

#### 4. Contact form shows "API key is invalid"
- **Cause**: `RESEND_API_KEY` is not set or contains a placeholder.
- **Solution**: Add a valid key from [resend.com/api-keys](https://resend.com/api-keys) to `.env.local`.

---

## Final Handover Checklist

Use this checklist when completing your final verification in VS Code:

- [ ] Project cloned/extracted and `npm install` completed with zero errors.
- [ ] `.env.local` created from `.env.example` with real credentials.
- [ ] `.env.local` confirmed to be ignored by Git (`git status` does not show `.env.local`).
- [ ] Supabase database created at [database.new](https://database.new).
- [ ] SQL migrations executed in Supabase SQL Editor:
  - [ ] `20260920000000_create_portfolio_tables.sql`
  - [ ] `20261013000000_create_contact_messages_table.sql`
- [ ] `npm run db:verify` outputs green checkmarks for all six tables.
- [ ] Admin user created in Supabase Auth with Auto Confirm enabled.
- [ ] `ADMIN_EMAIL` in `.env.local` matches the admin user email.
- [ ] Administrator login at `/admin/login` works and redirects to `/admin`.
- [ ] CRUD operations tested in the Admin Dashboard (e.g. updating hero title or adding a skill).
- [ ] Changes confirmed to reflect immediately on the public homepage `/`.
- [ ] Admin logout tested via the "Sign Out" button.
- [ ] Contact form tested with a real `RESEND_API_KEY`.
- [ ] PWA manifest validated in browser DevTools &rarr; Application &rarr; Manifest.
- [ ] Offline fallback tested in browser DevTools &rarr; Network &rarr; Offline.
- [ ] `npm run lint` passes (`✔ No ESLint warnings or errors`).
- [ ] `npm run build` compiles cleanly.
- [ ] Repository pushed to GitHub and deployed to Vercel with production environment variables.

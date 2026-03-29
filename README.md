# Plant Mommy 🌿

A mobile-first web app for tracking the growth, care, and health of your houseplants. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User accounts** — register, login, logout, password reset via Supabase Auth
- **Plant profiles** — name, species, photo, location, pot info, light/water preferences
- **Care reminders** — per-plant watering, fertilizing, misting, pruning schedules with snooze/complete/reschedule
- **Care logging** — timestamped log of every care action with amount and notes
- **Growth tracking** — height, width, leaf count, flowering status, new growth over time with a visual bar chart
- **Photo gallery** — upload and browse time-stamped progress photos per plant
- **Health tracking** — log pests, diseases, and conditions with severity, treatment, and resolution
- **Environment notes** — room, light direction, temperature, humidity, and seasonal observations
- **Calendar view** — monthly calendar showing all care tasks with color-coded dots
- **Dashboard** — at-a-glance view of overdue, due today, and upcoming care tasks

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| Backend | Supabase (Auth, PostgreSQL, Storage) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Install dependencies

```bash
cd plant-mommy
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql` to create all tables, policies, and storage buckets
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) on your phone or in a mobile-sized browser window.

### 5. Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── main.tsx                    # App entry point
├── App.tsx                     # Route definitions
├── vite-env.d.ts               # TypeScript env types
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # Data models and label maps
│   └── helpers.ts              # Date/formatting utilities
├── context/
│   └── AuthContext.tsx          # Auth state and methods
├── hooks/
│   ├── usePlants.ts            # Plant CRUD hooks
│   ├── useCare.ts              # Care reminders and events
│   ├── useGrowth.ts            # Growth measurements and photos
│   └── useHealth.ts            # Health issues and environment
├── components/
│   ├── layout/MobileShell.tsx   # Bottom nav layout
│   └── shared/                  # Reusable UI components
├── pages/
│   ├── auth/                    # Login, Register, ForgotPassword
│   ├── DashboardPage.tsx        # Home dashboard
│   ├── PlantsPage.tsx           # Plant list
│   ├── PlantDetailPage.tsx      # Single plant view
│   ├── AddPlantPage.tsx         # Create plant form
│   ├── EditPlantPage.tsx        # Edit plant form
│   ├── CareLogPage.tsx          # Care reminders and history
│   ├── GrowthPage.tsx           # Growth tracking and photos
│   ├── HealthPage.tsx           # Health issues and environment
│   ├── CalendarPage.tsx         # Monthly care calendar
│   └── SettingsPage.tsx         # Profile and app settings
└── styles/
    └── tailwind.css             # Theme and custom utilities
```

## Database Schema

The SQL migration in `supabase/schema.sql` creates:

- **profiles** — user profiles with display name and avatar
- **plants** — plant records with all profile fields
- **care_reminders** — per-plant reminder schedules
- **care_events** — log of performed care actions
- **growth_measurements** — height, width, leaf count over time
- **plant_photos** — uploaded progress photos
- **health_issues** — pest/disease/condition tracking
- **environment_notes** — room conditions and seasonal observations

All tables use Row Level Security so each user can only access their own data.

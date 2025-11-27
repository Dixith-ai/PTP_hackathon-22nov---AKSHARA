# AKSHARA

A calm, neon-lit learning companion built with Next.js 14. AKSHARA blends structured courses, mood-aware planning, and supportive community tools to make studying feel intentional, social, and sustainable.

## Highlights

- **Mood & Vibe Check-In** – Generate a personalized study plan by selecting your current mood, desired vibe, time budget, and subjects.
- **Study Buddy Matching** – Swipe through curated buddy profiles, match, and keep a lightweight roster of partners who fit your learning energy.
- **Habit Engine** – Design daily or weekly micro-habits, complete them in one tap, and maintain streaks.
- **Course Hub** – Browse, enroll, and progress through curated courses with onboarding, lessons, and notes.
- **Community Pulse** – Share wins, ask questions, react, and stay accountable with friendly peers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, Framer Motion, Lucide Icons
- **State**: Zustand + React Context
- **Data Layer**: Prisma ORM (SQLite locally, bring-your-own DATABASE_URL for production)
- **Auth**: Cookie-backed session handling with simplified demo login

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or another Node package manager)

### Installation
```bash
npm install
npx prisma generate
npm run dev
```

Visit `http://localhost:3000` after the dev server boots.

### Environment

| Variable       | Purpose                                    |
| -------------- | ------------------------------------------ |
| `DATABASE_URL` | Prisma connection string (SQLite or remote) |

If no `DATABASE_URL` is provided, the app defaults to `file:./prisma/dev.db` for local development. For serverless deployment (Vercel, Netlify), point this variable to a remote database (Turso, PostgreSQL, etc.).

### Useful Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start Next.js in development mode            |
| `npm run build`      | Create an optimized production build         |
| `npm run start`      | Run the production server                    |
| `npm run lint`       | Lint the codebase with ESLint                |
| `npm run db:push`    | Push Prisma schema changes to the database   |
| `npm run db:studio`  | Launch Prisma Studio                         |
| `npm run db:seed`    | Seed the database with sample data           |

## Project Layout

```
app/
  api/              → Route handlers (auth, courses, habits, etc.)
  home/             → Dashboard experience
  mood-vibe-check/  → Mood-driven plan generator
  study-buddy/      → Matching interface
  community/        → Social feed
  ...
components/
  ui/               → Buttons, cards, inputs, badges, modal primitives
  Layout.tsx        → Sidebar navigation + app shell
lib/
  auth.ts           → User lookup helpers
  prisma.ts         → Prisma client bootstrap
  utils.ts          → Shared helpers (compatibility scoring, etc.)
prisma/
  schema.prisma     → Database schema
  seed.ts           → Demo seed script
scripts/
  dev-with-open.js  → Dev server + auto-open browser helper
```

## Key Experiences

### Mood & Vibe Check-In
- Clients-only workflow with local mock data fallback.
- Generates a structured plan (lessons, breaks, intensity, schedule) from mood, vibe, time, and optional subjects.
- Provides a “Today’s Study Schedule” recap with stats and next steps.

### Study Buddy Matching
- Swipeable card deck powered by Framer Motion drag gestures.
- Matches produce a lightweight summary object and append to a glowing roster.
- Empty states, refresh controls, and match success overlays keep the flow engaging even without a backend.

### Courses & Habits
- Courses include onboarding, enrollment, lessons, note-taking, and progress tracking endpoints under `app/api/courses`.
- Habits and streak tracking flow through `app/api/habits` and `app/api/streaks`, with quick-complete actions surfaced on the home dashboard.

### Community
- Lightweight posts, reactions, and notifications accessible under `/community`.
- API routes support sharing updates, reacting, and marking notifications read.

## Deployment Notes

- The app is optimized for a front-end-first experience. When no backend is available, it gracefully falls back to mock data for authentication, mood planning, and buddy matching.
- For production deployments (e.g., Vercel), configure `DATABASE_URL` to a persistent database. Ensure Prisma migrations/seeds run prior to `npm run start`.

## License

This project was created for the PTP Hackathon and is provided as-is for learning and experimentation.

---

Crafted to make focused study sessions feel modern, social, and encouraging—even on the days when motivation needs a spark.
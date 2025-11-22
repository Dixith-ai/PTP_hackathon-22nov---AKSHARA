# AKSHARA - Your Learning Companion

A warm, playful, futuristic learning platform that makes studying feel less lonely, less stressful, and more joyful — one small win at a time.

## ✨ Features

- **Tiny Daily Habits** - Build consistency with small, achievable wins
- **Mood-Aware Learning** - Get task suggestions that match your energy
- **Course System** - Browse, enroll, and learn from structured courses
- **Community** - Share wins, ask questions, and support each other
- **Streak Tracking** - Stay motivated with visual progress tracking
- **Emotion Check-ins** - Track your mood and get personalized suggestions
- **Study Buddies** - Find your perfect learning partner
- **Class Replay Notes** - Take and save notes as you learn

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Seed the database (optional):
```bash
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

Or use the dev script that auto-opens the browser:
```bash
node scripts/dev-with-open.js
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Test Account

- Email: `test@akshara.com`
- Password: `password123`

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── home/              # Home dashboard
│   ├── courses/           # Course pages
│   ├── community/         # Community feed
│   ├── habits/            # Habit tracking
│   ├── profile/           # User profile
│   └── ...
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── ...
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🎨 Design System

AKSHARA uses a dark-first design with warm neon accents:

- **Colors**: Dark backgrounds with neon pink, purple, blue, cyan, green, and yellow accents
- **Typography**: Modern, energetic fonts
- **Animations**: Smooth, friendly micro-interactions
- **Voice**: Warm, playful, and supportive

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## 🔐 Authentication

The app uses cookie-based session management. Users can:
- Sign up with email and password
- Log in to access their dashboard
- Complete onboarding to personalize their experience

## 📚 Key Features Explained

### Habits System
- Create daily, weekly, or custom habits
- Track completions and build streaks
- Visual progress indicators

### Emotion Tracking
- Check in with your mood daily
- Get personalized task suggestions based on energy level
- Track emotional patterns over time

### Course Learning
- Browse courses by category and difficulty
- Enroll in courses and track progress
- Take notes during lessons
- Complete lessons and advance through courses

### Community
- Share posts, questions, and wins
- React to posts with likes
- Support and encourage each other

## 🎯 Roadmap

- [ ] Study Buddy matching algorithm
- [ ] AI-powered note summaries
- [ ] Mistake pattern insights
- [ ] Advanced analytics
- [ ] Mobile app

## 📄 License

This project is built for the PTP Hackathon.

## 💝 Made with

Built with love, neon colors, and lots of coffee ☕



# DataQuest - Gamified Data Science Learning Platform

<p align="center">
  <img src="public/logo.png" alt="DataQuest Logo" width="120"/>
</p>

A modern, gamified platform for learning Data Science concepts through interactive theory modules, quizzes, and hands-on data analysis.

## ✨ Features

- **🎮 Gamified Learning** - Earn XP, level up, maintain streaks, and unlock badges
- **📚 Interactive Theory** - Visual explanations with embedded charts and visualizations
- **📊 Progress Tracking** - Analytics dashboard with skill radar, accuracy trends, and completion stats
- **🏆 Leaderboard** - Compete with other learners globally
- **🔐 Authentication** - Google OAuth and email/password login via NextAuth.js
- **💾 Database** - Supabase backend with PostgreSQL for data persistence

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + custom components |
| State Management | Zustand |
| Authentication | NextAuth.js |
| Database | Supabase (PostgreSQL) |
| Charts | Plotly.js, Recharts |
| Animations | Framer Motion |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for database)
- Google OAuth credentials (for social login)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dataquest.git
   cd dataquest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run database migrations**
   
   Execute the SQL migration in your Supabase SQL editor:
   ```bash
   # File: supabase/migrations/001_initial_schema.sql
   ```

5. **Seed the database (optional)**
   ```bash
   npx tsx scripts/seed-database.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

For testing without Google OAuth:
- **Email:** `admin@dataquest.com`
- **Password:** `admin123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js handlers
│   │   ├── register/      # User registration
│   │   ├── topics/        # Topics CRUD
│   │   ├── leaderboard/   # Leaderboard data
│   │   └── users/         # User profile
│   ├── dashboard/         # User dashboard
│   ├── theory/            # Learning modules
│   ├── progress/          # Analytics page
│   ├── profile/           # User profile
│   └── leaderboard/       # Rankings
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── shared/            # Reusable components
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configs
│   ├── supabase/          # Supabase clients
│   └── mockData.ts        # Demo data
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## 🔒 Authentication

The app supports two authentication methods:

1. **Google OAuth** - Recommended for production
2. **Email/Password** - Uses bcrypt for password hashing

Session handling is managed by NextAuth.js with JWT strategy.

## 📊 Database Schema

Key tables:
- `users` - User profiles with XP, level, streak
- `topics` - Learning modules with content
- `user_progress` - Topic completion tracking
- `badges` - Achievement definitions
- `user_badges` - Earned badges

Row Level Security (RLS) is enabled for data protection.

## 🧪 Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

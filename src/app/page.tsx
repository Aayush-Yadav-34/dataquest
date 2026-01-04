'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import {
  BookOpen,
  Upload,
  Brain,
  Trophy,
  ChevronRight,
  Star,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  Play,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Theory',
    description: 'Learn complex ML concepts through engaging, bite-sized lessons with interactive visualizations.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Upload,
    title: 'Dataset Upload & Auto-Viz',
    description: 'Upload any CSV and get instant exploratory data analysis with beautiful visualizations.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Brain,
    title: 'AI-Powered Quizzes',
    description: 'Test your knowledge with adaptive quizzes that adjust to your skill level.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Trophy,
    title: 'Leaderboards & Badges',
    description: 'Compete with peers, earn badges, and climb the global leaderboard.',
    color: 'from-orange-500 to-amber-600',
  },
];

const stats = [
  { value: '10K+', label: 'Active Learners', icon: Users },
  { value: '50+', label: 'ML Topics', icon: BookOpen },
  { value: '98%', label: 'Completion Rate', icon: BarChart3 },
  { value: '4.9', label: 'User Rating', icon: Star },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">The Future of Data Science Education</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Learn Data Science
              <br />
              <span className="text-gradient">Like a Game.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Master Machine Learning through gamified lessons, interactive visualizations,
              and real-world dataset analysis. Level up your skills and compete with learners worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 h-14 glow">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-primary/30 hover:bg-primary/10">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-4 pt-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-primary border-2 border-background flex items-center justify-center text-white text-sm font-bold"
                  >
                    {['A', 'B', 'C', 'D', 'E'][i - 1]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> students love DataQuest
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl border border-border/50 overflow-hidden shadow-2xl glass">
              <div className="aspect-[16/9] bg-gradient-to-br from-card to-background p-8">
                {/* Mock Dashboard Preview */}
                <div className="h-full rounded-xl border border-border/30 bg-card/50 p-4 grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-4">
                    <div className="h-8 rounded-lg bg-muted animate-pulse" />
                    <div className="h-6 rounded-lg bg-muted/50 animate-pulse" />
                    <div className="h-6 rounded-lg bg-muted/50 animate-pulse" />
                    <div className="h-6 rounded-lg bg-muted/50 animate-pulse" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 rounded-xl bg-primary/10 border border-primary/20" />
                      <div className="h-24 rounded-xl bg-accent/10 border border-accent/20" />
                      <div className="h-24 rounded-xl bg-emerald-500/10 border border-emerald-500/20" />
                    </div>
                    <div className="h-48 rounded-xl bg-muted/30 border border-border/30" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl bg-gradient-primary glow flex items-center justify-center text-4xl">
              🎯
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-gradient-accent glow-accent flex items-center justify-center text-3xl">
              📊
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="text-gradient"> Master Data Science</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines the best of gaming mechanics with rigorous
              data science education for an unmatched learning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 hover:border-primary/50 transition-all hover:shadow-xl"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 text-primary font-semibold mb-4">
                <Zap className="w-5 h-5" />
                Gamified Learning
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Level Up Your Skills,
                <br />
                <span className="text-gradient">One XP at a Time</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Earn experience points, unlock achievements, and maintain your daily streak.
                Watch yourself climb from beginner to ML expert with our dopamine-driven
                learning system.
              </p>
              <ul className="space-y-4">
                {[
                  'Earn XP for every completed lesson and quiz',
                  'Unlock badges for special achievements',
                  'Compete on weekly and global leaderboards',
                  'Track your progress with detailed analytics',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      ✓
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Gamification Preview Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* XP Card */}
                <div className="glass-card p-6 col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                      15
                    </div>
                    <div>
                      <h4 className="font-semibold">Level 15</h4>
                      <p className="text-sm text-muted-foreground">DataWizard</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level 16</span>
                      <span className="text-primary">2,450 / 2,500 XP</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-primary rounded-full animate-pulse-glow" />
                    </div>
                  </div>
                </div>

                {/* Streak Card */}
                <div className="glass-card p-6">
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="text-3xl font-bold text-orange-400">7</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>

                {/* Rank Card */}
                <div className="glass-card p-6">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-3xl font-bold text-yellow-400">#42</div>
                  <p className="text-sm text-muted-foreground">Global Rank</p>
                </div>

                {/* Badges */}
                <div className="glass-card p-6 col-span-2">
                  <h4 className="font-semibold mb-3">Recent Badges</h4>
                  <div className="flex gap-3">
                    {['🎯', '🏆', '📊', '🔥', '⭐'].map((badge, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl"
                      >
                        {badge}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Your
                <span className="text-gradient"> Data Science Journey?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who are mastering machine learning
                the fun way. It&apos;s free to get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 h-14 glow">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-primary/30">
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">DataQuest</span>
            </div>
            <div className="flex items-center gap-6 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">About</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 DataQuest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

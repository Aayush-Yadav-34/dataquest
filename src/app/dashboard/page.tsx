'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/shared/StatCard';
import { XPProgressBar } from '@/components/shared/ProgressBar';
import { BadgeGrid } from '@/components/shared/Badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BookOpen,
    Target,
    TrendingUp,
    Trophy,
    Flame,
    ArrowRight,
    ChevronRight,
    Clock,
    Zap,
    Star,
    Crown,
    Loader2,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useTopics } from '@/hooks/useTopics';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUserData } from '@/hooks/useUserData';
import { useUserStats, useUserProgress } from '@/hooks/useProgress';
import { useBadges } from '@/hooks/useBadges';
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { profile, stats, isAuthenticated: storeAuth } = useUserStore();

    // Fetch data from APIs
    const { topics, isLoading: topicsLoading } = useTopics();
    const { leaderboard, currentUserRank, isLoading: leaderboardLoading } = useLeaderboard({ limit: 10 });
    const { userData, isLoading: userDataLoading } = useUserData();
    const { summary: progressStats, skillsData, isLoading: statsLoading } = useUserStats();
    const { progress: userProgress } = useUserProgress();
    const { earnedBadges, checkAndAwardBadges, isLoading: badgesLoading } = useBadges();

    // Combined auth check
    const isAuthenticated = status === 'authenticated' || storeAuth;
    const isLoading = status === 'loading';

    // Check for new badges on dashboard load
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            checkAndAwardBadges();
        }
    }, [isAuthenticated, isLoading]);

    // Get user info from session or store, with fresh data from useUserData (database source of truth)
    const user = session?.user ? {
        username: userData?.username ?? session.user.username ?? session.user.name ?? 'User',
        email: userData?.email ?? session.user.email ?? '',
        avatar: userData?.avatar_url ?? session.user.image,
        role: session.user.role || 'user',
        // Use fresh data from useUserData hook if available
        xp: userData?.xp ?? session.user.xp ?? 0,
        level: userData?.level ?? session.user.level ?? 1,
        streak: userData?.streak ?? session.user.streak ?? 0,
    } : profile;

    // Auth protection
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            toast.error('Please login first', {
                description: 'You need to be logged in to access the dashboard.',
            });
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while checking auth
    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Get recent/in-progress topics from API data (topics with progress between 0-100)
    // Also include topics that are in user_progress
    const topicsWithProgress = topics.map(topic => {
        const userTopicProgress = userProgress?.topics?.find(p => p.topic_id === topic.id);
        return {
            ...topic,
            progress: userTopicProgress?.progress ?? topic.progress ?? 0,
            completed: userTopicProgress?.completed ?? false,
        };
    });

    const continueTopics = topicsWithProgress
        .filter((t) => t.progress > 0 && t.progress < 100 && !t.completed)
        .slice(0, 3);
    const recommendedTopics = topicsWithProgress
        .filter((t) => !t.locked && t.progress === 0 && !t.completed)
        .slice(0, 2);

    // Top 5 leaderboard from API
    const topLeaders = leaderboard.slice(0, 5);
    const totalUsers = leaderboard.length;
    // Use currentUserRank from hook (works for admins too)
    const userGlobalRank = currentUserRank?.rank || 0;

    if (!user) {
        return null;
    }

    // Use user for profile data
    const displayProfile = {
        username: user.username,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                Welcome back, <span className="text-gradient">{displayProfile.username}</span>! 👋
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Ready to continue your data science journey?
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Streak */}
                            <div className="flex items-center gap-2 glass-card px-4 py-2">
                                <Flame className="w-5 h-5 text-orange-500" />
                                <div>
                                    <span className="text-xl font-bold text-orange-400">{displayProfile.streak}</span>
                                    <span className="text-sm text-muted-foreground ml-1">day streak</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* XP Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-4 sm:p-6 mb-8"
                >
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-xl sm:text-2xl font-bold text-white glow">
                            {displayProfile.level}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-lg font-semibold">Level {displayProfile.level}</h2>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                    {displayProfile.xp.toLocaleString()} XP Total
                                </span>
                            </div>
                            <XPProgressBar currentXP={displayProfile.xp} level={displayProfile.level} showLabel={false} size="lg" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {Math.pow(displayProfile.level, 2) * 100 - displayProfile.xp} XP to Level {displayProfile.level + 1}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <StatCard
                        title="Topics Completed"
                        value={`${progressStats?.completedTopics || 0}/${progressStats?.totalTopics || topics.length}`}
                        subtitle={`${progressStats?.totalTopics ? Math.round((progressStats.completedTopics / progressStats.totalTopics) * 100) : 0}% complete`}
                        icon={BookOpen}
                        variant="primary"
                    />
                    <StatCard
                        title="Quiz Accuracy"
                        value={`${progressStats?.averageAccuracy || 0}%`}
                        subtitle={`${progressStats?.totalQuizzes || 0} quizzes completed`}
                        icon={Target}
                        variant="accent"
                        trend={progressStats?.averageAccuracy ? { value: 5, positive: true } : undefined}
                    />
                    <StatCard
                        title="Global Rank"
                        value={userGlobalRank > 0 ? `#${userGlobalRank}` : '#-'}
                        subtitle={userGlobalRank > 0 ? `Top performer` : 'Take a quiz to rank!'}
                        icon={Trophy}
                        variant="warning"
                        trend={userGlobalRank > 0 ? { value: 3, positive: true } : undefined}
                    />
                    <StatCard
                        title="Time Spent"
                        value={`${Math.floor(progressStats?.totalHours || 0)}h`}
                        subtitle={`${Math.round(((progressStats?.totalHours || 0) % 1) * 60)}m estimated`}
                        icon={Clock}
                        variant="success"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 overflow-hidden">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Continue Learning */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Continue Learning</h2>
                                <Link href="/theory">
                                    <Button variant="ghost" size="sm">
                                        View All <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {continueTopics.map((topic, index) => (
                                    <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <Link href={`/theory/${topic.id}`}>
                                            <div className="group glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-primary/50 transition-all cursor-pointer">
                                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg sm:text-2xl flex-shrink-0">
                                                    {topic.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate">{topic.title}</h3>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${topic.difficulty === 'beginner' ? 'bg-emerald-500/20 text-emerald-500' :
                                                            topic.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-500' :
                                                                'bg-red-500/20 text-red-500'
                                                            }`}>
                                                            {topic.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Progress value={topic.progress} className="flex-1 h-2" />
                                                        <span className="text-sm text-muted-foreground">{topic.progress}%</span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Big CTA Button */}
                            <Link href={continueTopics.length > 0 ? `/theory/${continueTopics[0].id}` : '/theory'}>
                                <Button className="w-full mt-4 h-12 sm:h-14 text-base sm:text-lg bg-gradient-primary hover:opacity-90 glow">
                                    <Zap className="w-5 h-5 mr-2" />
                                    Continue Learning
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </motion.section>

                        {/* Recommended Topics */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {recommendedTopics.map((topic) => (
                                    <Link key={topic.id} href={`/theory/${topic.id}`}>
                                        <div className="group glass-card p-4 sm:p-6 hover:border-primary/50 transition-all cursor-pointer h-full overflow-hidden">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl flex-shrink-0">
                                                    {topic.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                                        {topic.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {topic.description}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {topic.estimated_time}m
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-primary" />
                                                            +{topic.xp_reward} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 min-w-0">
                        {/* Mini Leaderboard */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-4 sm:p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Leaderboard
                                </h2>
                                <Link href="/leaderboard">
                                    <Button variant="ghost" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {topLeaders.map((leader, index) => (
                                    <div
                                        key={leader.id}
                                        className={`flex items-center gap-3 p-2 rounded-lg ${index === 0 ? 'bg-yellow-500/10' :
                                            index === 1 ? 'bg-gray-400/10' :
                                                index === 2 ? 'bg-amber-600/10' : ''
                                            }`}
                                    >
                                        <div className="w-8 text-center font-bold">
                                            {index === 0 ? <Crown className="w-5 h-5 text-yellow-500 mx-auto" /> :
                                                <span className="text-muted-foreground">{leader.rank}</span>}
                                        </div>
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={leader.avatar_url} />
                                            <AvatarFallback className="bg-gradient-primary text-white text-xs">
                                                {leader.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{leader.username}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-primary">
                                            {leader.xp.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Current User Rank */}
                            {currentUserRank && (
                                <div className="mt-4 pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
                                        <div className="w-8 text-center font-bold text-primary">
                                            {currentUserRank.rank}
                                        </div>
                                        <Avatar className="w-8 h-8 border-2 border-primary">
                                            <AvatarImage src={currentUserRank.avatar_url} />
                                            <AvatarFallback className="bg-gradient-primary text-white text-xs">
                                                {currentUserRank.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{currentUserRank.username}</p>
                                            <p className="text-xs text-muted-foreground">You</p>
                                        </div>
                                        <div className="text-sm font-semibold text-primary">
                                            {currentUserRank.xp.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Recent Badges */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="glass-card p-4 sm:p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Recent Badges</h2>
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <BadgeGrid
                                badges={earnedBadges.slice(0, 4).map(b => ({
                                    id: b.id,
                                    name: b.name,
                                    icon: b.icon,
                                    description: b.description,
                                    locked: false,
                                    earnedAt: b.earned_at ? new Date(b.earned_at) : undefined,
                                }))}
                                size="md"
                            />
                            {earnedBadges.length === 0 && !badgesLoading && (
                                <p className="text-sm text-muted-foreground">No badges earned yet. Keep learning!</p>
                            )}
                        </motion.section>

                        {/* Quick Actions */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="glass-card p-4 sm:p-6"
                        >
                            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <Link href="/quiz">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Target className="w-4 h-4 mr-2" />
                                        Take a Quiz
                                    </Button>
                                </Link>
                                <Link href="/upload">
                                    <Button variant="outline" className="w-full justify-start">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Analyze Dataset
                                    </Button>
                                </Link>
                                <Link href="/progress">
                                    <Button variant="outline" className="w-full justify-start">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        View Progress
                                    </Button>
                                </Link>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </main>
        </div>
    );
}

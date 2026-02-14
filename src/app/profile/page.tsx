'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { XPProgressBar } from '@/components/shared/ProgressBar';
import { BadgeGrid } from '@/components/shared/Badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Calendar,
    Settings,
    Flame,
    Star,
    Trophy,
    Zap,
    BookOpen,
    Target,
    Upload,
    Award,
    Loader2,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useUserData } from '@/hooks/useUserData';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useBadges } from '@/hooks/useBadges';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { profile, stats, isAuthenticated: storeAuth } = useUserStore();
    const { userData, isLoading: userDataLoading } = useUserData();
    const { currentUserRank, isLoading: leaderboardLoading } = useLeaderboard({ limit: 50 });
    const { badges: apiBadges, earnedBadges, lockedBadges, isLoading: badgesLoading } = useBadges();

    // Get user's global rank from leaderboard API
    const globalRank = currentUserRank?.rank || stats.rank;

    // Fetch activities from API
    const [activities, setActivities] = useState<any[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            setActivitiesLoading(true);
            fetch('/api/user/activities')
                .then(res => res.json())
                .then(data => setActivities(data.activities || []))
                .catch(() => setActivities([]))
                .finally(() => setActivitiesLoading(false));
        }
    }, [status]);

    // Combined auth check
    const isAuthenticated = status === 'authenticated' || storeAuth;
    // Wait for both session AND userData to prevent flash of stale username
    const isLoading = status === 'loading' || (isAuthenticated && userDataLoading);

    // Get user info from session or store, with fresh data from useUserData (database source of truth)
    const user = session?.user ? {
        username: userData?.username ?? session.user.username ?? session.user.name ?? 'User',
        email: userData?.email ?? session.user.email ?? '',
        avatar: userData?.avatar_url ?? session.user.image,
        // Use fresh XP data from useUserData hook if available
        xp: userData?.xp ?? session.user.xp ?? 0,
        level: userData?.level ?? session.user.level ?? 1,
        streak: userData?.streak ?? session.user.streak ?? 0,
    } : profile ? {
        username: userData?.username ?? profile.username,
        email: userData?.email ?? profile.email,
        avatar: userData?.avatar_url ?? profile.avatar,
        xp: userData?.xp ?? profile.xp,
        level: userData?.level ?? profile.level,
        streak: userData?.streak ?? profile.streak,
    } : null;

    // Show loading or redirect if not authenticated
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }


    const activityIcons = {
        theory: BookOpen,
        quiz: Target,
        upload: Upload,
        achievement: Award,
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <Avatar className="w-28 h-28 border-4 border-primary/50 glow">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-gradient-primary text-white text-3xl">
                                    {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold border-4 border-background">
                                {user.level}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
                                    <p className="text-muted-foreground">{user.email}</p>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Member
                                        </span>
                                    </div>
                                </div>

                                {/* Settings Button */}
                                <Link href="/settings">
                                    <Button variant="outline" size="sm">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Button>
                                </Link>
                            </div>

                            {/* XP Progress */}
                            <div className="mt-6">
                                <XPProgressBar currentXP={user.xp} level={user.level} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-primary mb-1">
                                <Zap className="w-5 h-5" />
                                <span className="text-2xl font-bold">{user.xp.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Total XP</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
                                <Flame className="w-5 h-5" />
                                <span className="text-2xl font-bold">{user.streak}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Day Streak</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                                <Trophy className="w-5 h-5" />
                                <span className="text-2xl font-bold">#{globalRank || '-'}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Global Rank</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-emerald-500 mb-1">
                                <Star className="w-5 h-5" />
                                <span className="text-2xl font-bold">{earnedBadges.length}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Badges Earned</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <Tabs defaultValue="badges" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="badges">
                            <Award className="w-4 h-4 mr-2" />
                            Badges
                        </TabsTrigger>
                        <TabsTrigger value="activity">
                            <Calendar className="w-4 h-4 mr-2" />
                            Activity
                        </TabsTrigger>
                    </TabsList>

                    {/* Badges Tab */}
                    <TabsContent value="badges">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Achievement Badges</h2>

                            {badgesLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    {/* Earned Badges */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                            Earned ({earnedBadges.length})
                                        </h3>
                                        {earnedBadges.length > 0 ? (
                                            <BadgeGrid
                                                badges={earnedBadges.map(b => ({
                                                    id: b.id,
                                                    name: b.name,
                                                    icon: b.icon,
                                                    description: b.description,
                                                    locked: false,
                                                    earnedAt: b.earned_at ? new Date(b.earned_at) : undefined,
                                                }))}
                                                size="lg"
                                                className="gap-6"
                                            />
                                        ) : (
                                            <p className="text-muted-foreground text-sm py-4">Complete quizzes and topics to earn badges!</p>
                                        )}
                                    </div>

                                    {/* Locked Badges */}
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                            Locked ({lockedBadges.length})
                                        </h3>
                                        <BadgeGrid
                                            badges={lockedBadges.map(b => ({
                                                id: b.id,
                                                name: b.name,
                                                icon: b.icon,
                                                description: b.description,
                                                locked: true,
                                            }))}
                                            size="lg"
                                            className="gap-6"
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>

                            {activitiesLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No activity yet</p>
                                    <p className="text-sm mt-1">Complete quizzes and lessons to see your activity here!</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                                    <div className="space-y-6">
                                        {activities.map((activity: any, index: number) => {
                                            const Icon = activityIcons[activity.type as keyof typeof activityIcons] || BookOpen;
                                            return (
                                                <motion.div
                                                    key={activity.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="relative flex gap-4 ml-3"
                                                >
                                                    {/* Icon */}
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center z-10",
                                                        activity.type === 'theory' && "bg-primary/20 text-primary",
                                                        activity.type === 'quiz' && "bg-accent/20 text-accent",
                                                        activity.type === 'upload' && "bg-emerald-500/20 text-emerald-500",
                                                        activity.type === 'achievement' && "bg-yellow-500/20 text-yellow-500",
                                                    )}>
                                                        <Icon className="w-3 h-3" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 glass-card p-4 -mt-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{activity.title}</h4>
                                                                {activity.description && (
                                                                    <p className="text-sm text-muted-foreground mt-1">
                                                                        {activity.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {activity.xp_earned > 0 && (
                                                                <span className="text-sm font-medium text-primary flex items-center gap-1">
                                                                    <Zap className="w-3 h-3" />
                                                                    +{activity.xp_earned} XP
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-3">
                                                            {new Date(activity.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

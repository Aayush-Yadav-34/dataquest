'use client';

import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/shared/StatCard';
import { CircularProgress } from '@/components/shared/ProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    BookOpen,
    Target,
    Clock,
    TrendingUp,
    Brain,
    BarChart3,
    Trophy,
    Zap,
    Calendar,
    Loader2,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useTopics } from '@/hooks/useTopics';
import { useUserStats } from '@/hooks/useProgress';
import { useUserData } from '@/hooks/useUserData';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { cn } from '@/lib/utils';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function ProgressPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { profile, stats, isAuthenticated: storeAuth } = useUserStore();
    const { topics, isLoading: topicsLoading } = useTopics();
    const { userData } = useUserData();
    const { skillsData, accuracyTrend, timeSpentData, summary, isLoading: statsLoading } = useUserStats();
    const { currentUserRank, isLoading: leaderboardLoading } = useLeaderboard({ limit: 50 });

    // Get global rank from leaderboard API
    const globalRank = currentUserRank?.rank || 0;

    // Combined auth check
    const isAuthenticated = status === 'authenticated' || storeAuth;
    const isLoading = status === 'loading' || statsLoading;

    // Calculate category progress from API data
    const categoryProgress = useMemo(() => {
        const categories = [...new Set(topics.map((t) => t.category))];
        return categories.map((category) => {
            const categoryTopics = topics.filter((t) => t.category === category);
            const completed = categoryTopics.filter((t) => (t.progress || 0) >= 100).length;
            const totalProgress = categoryTopics.reduce((sum, t) => sum + (t.progress || 0), 0) / (categoryTopics.length || 1);
            return {
                category,
                completed,
                total: categoryTopics.length,
                progress: totalProgress,
            };
        });
    }, [topics]);

    // Weekly activity data
    const weeklyActivity = [
        { day: 'Mon', minutes: 45, xp: 120 },
        { day: 'Tue', minutes: 30, xp: 80 },
        { day: 'Wed', minutes: 60, xp: 150 },
        { day: 'Thu', minutes: 0, xp: 0 },
        { day: 'Fri', minutes: 75, xp: 200 },
        { day: 'Sat', minutes: 90, xp: 250 },
        { day: 'Sun', minutes: 45, xp: 100 },
    ];

    // Redirect if not authenticated (in useEffect to avoid render-time state updates)
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Show loading or redirect if not authenticated
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="text-gradient">Progress & Analytics</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Track your learning journey and improvement over time
                    </p>
                </motion.div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Topics Completed"
                        value={`${summary?.completedTopics || 0}/${summary?.totalTopics || topics.length}`}
                        subtitle={`${summary?.totalTopics ? Math.round((summary.completedTopics / summary.totalTopics) * 100) : 0}% complete`}
                        icon={BookOpen}
                        variant="primary"
                    />
                    <StatCard
                        title="Quiz Accuracy"
                        value={`${summary?.averageAccuracy || 0}%`}
                        subtitle={`${summary?.totalQuizzes || 0} quizzes completed`}
                        icon={Target}
                        variant="accent"
                        trend={summary?.averageAccuracy ? { value: 5, positive: true } : undefined}
                    />
                    <StatCard
                        title="Study Time"
                        value={`${Math.floor((summary?.totalHours || 0))}h ${Math.round(((summary?.totalHours || 0) % 1) * 60)}m`}
                        subtitle="Estimated time"
                        icon={Clock}
                        variant="success"
                    />
                    <StatCard
                        title="Global Rank"
                        value={globalRank > 0 ? `#${globalRank}` : '#-'}
                        subtitle={globalRank > 0 ? 'Top performer' : 'Complete quizzes to rank'}
                        icon={Trophy}
                        variant="warning"
                        trend={globalRank > 0 ? { value: 3, positive: true } : undefined}
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Skill Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-primary" />
                                    Skill Radar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl overflow-hidden bg-card/50">
                                    <Plot
                                        data={[
                                            {
                                                type: 'scatterpolar',
                                                r: skillsData.map((s) => s.score),
                                                theta: skillsData.map((s) => s.topic),
                                                fill: 'toself',
                                                fillcolor: 'rgba(139, 92, 246, 0.3)',
                                                line: { color: 'rgb(139, 92, 246)', width: 2 },
                                                marker: { color: 'rgb(139, 92, 246)', size: 8 },
                                            },
                                        ]}
                                        layout={{
                                            polar: {
                                                radialaxis: {
                                                    visible: true,
                                                    range: [0, 100],
                                                    gridcolor: 'rgba(255,255,255,0.1)',
                                                    linecolor: 'rgba(255,255,255,0.1)',
                                                    tickfont: { color: '#a3a3a3' },
                                                },
                                                angularaxis: {
                                                    gridcolor: 'rgba(255,255,255,0.1)',
                                                    linecolor: 'rgba(255,255,255,0.1)',
                                                    tickfont: { color: '#e5e5e5' },
                                                },
                                                bgcolor: 'transparent',
                                            },
                                            paper_bgcolor: 'transparent',
                                            margin: { t: 30, b: 30, l: 60, r: 60 },
                                            showlegend: false,
                                        }}
                                        config={{ responsive: true, displayModeBar: false }}
                                        style={{ width: '100%', height: '350px' }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Accuracy Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-accent" />
                                    Accuracy Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl overflow-hidden bg-card/50">
                                    <Plot
                                        data={[
                                            {
                                                x: accuracyTrend.map((d) => d.date),
                                                y: accuracyTrend.map((d) => d.accuracy),
                                                type: 'scatter',
                                                mode: 'lines+markers',
                                                fill: 'tozeroy',
                                                fillcolor: 'rgba(34, 211, 238, 0.1)',
                                                line: { color: 'rgb(34, 211, 238)', width: 3, shape: 'spline' },
                                                marker: { color: 'rgb(34, 211, 238)', size: 8 },
                                            },
                                        ]}
                                        layout={{
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'rgba(0,0,0,0.2)',
                                            xaxis: {
                                                gridcolor: 'rgba(255,255,255,0.1)',
                                                color: '#a3a3a3',
                                            },
                                            yaxis: {
                                                title: { text: 'Accuracy %' },
                                                gridcolor: 'rgba(255,255,255,0.1)',
                                                color: '#a3a3a3',
                                                range: [0, 100],
                                            },
                                            margin: { t: 20, b: 40, l: 50, r: 20 },
                                        }}
                                        config={{ responsive: true, displayModeBar: false }}
                                        style={{ width: '100%', height: '300px' }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Weekly Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Weekly Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl overflow-hidden bg-card/50">
                                    <Plot
                                        data={[
                                            {
                                                x: weeklyActivity.map((d) => d.day),
                                                y: weeklyActivity.map((d) => d.minutes),
                                                type: 'bar',
                                                marker: {
                                                    color: weeklyActivity.map((d) =>
                                                        d.minutes > 60
                                                            ? 'rgb(139, 92, 246)'
                                                            : d.minutes > 30
                                                                ? 'rgba(139, 92, 246, 0.7)'
                                                                : 'rgba(139, 92, 246, 0.4)'
                                                    ),
                                                    line: { width: 0 },
                                                },
                                            },
                                        ]}
                                        layout={{
                                            paper_bgcolor: 'transparent',
                                            plot_bgcolor: 'rgba(0,0,0,0.2)',
                                            xaxis: {
                                                gridcolor: 'rgba(255,255,255,0.1)',
                                                color: '#a3a3a3',
                                            },
                                            yaxis: {
                                                title: 'Minutes',
                                                gridcolor: 'rgba(255,255,255,0.1)',
                                                color: '#a3a3a3',
                                            },
                                            margin: { t: 20, b: 40, l: 50, r: 20 },
                                            bargap: 0.3,
                                        }}
                                        config={{ responsive: true, displayModeBar: false }}
                                        style={{ width: '100%', height: '250px' }}
                                    />
                                </div>
                                <div className="grid grid-cols-7 gap-2 mt-4">
                                    {weeklyActivity.map((day, i) => (
                                        <div key={day.day} className="text-center">
                                            <p className="text-xs text-muted-foreground">{day.day}</p>
                                            <p className="text-sm font-semibold text-primary">
                                                +{day.xp}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Overall Completion */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                                    Overall Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center pt-4">
                                <CircularProgress
                                    progress={(stats.topicsCompleted / stats.totalTopics) * 100}
                                    size={180}
                                    strokeWidth={12}
                                    label="Complete"
                                />
                                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">{stats.topicsCompleted}</p>
                                        <p className="text-xs text-muted-foreground">Completed</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-muted-foreground">
                                            {stats.totalTopics - stats.topicsCompleted}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Remaining</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Time Spent per Topic */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                Time Spent by Topic
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {timeSpentData.map((item, index) => {
                                    const percentage = (item.hours / Math.max(...timeSpentData.map((d) => d.hours))) * 100;
                                    return (
                                        <motion.div
                                            key={item.topic}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{item.topic}</span>
                                                <span className="text-sm text-muted-foreground">{item.hours}h</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                                                    className="h-full bg-gradient-primary rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Category Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Category Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {categoryProgress.map((cat, index) => (
                                    <motion.div
                                        key={cat.category}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.9 + index * 0.1 }}
                                        className="glass-card p-4"
                                    >
                                        <h4 className="font-medium mb-3 truncate">{cat.category}</h4>
                                        <div className="flex items-center gap-3">
                                            <CircularProgress
                                                progress={cat.progress}
                                                size={60}
                                                strokeWidth={6}
                                                showPercentage={false}
                                            />
                                            <div>
                                                <p className="text-lg font-bold">
                                                    {cat.completed}/{cat.total}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Topics
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}

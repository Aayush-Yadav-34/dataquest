'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    Trophy,
    Crown,
    Medal,
    TrendingUp,
    TrendingDown,
    Minus,
    Search,
    Flame,
    Zap,
    GraduationCap,
    Loader2,
} from 'lucide-react';
import { useLeaderboard, LeaderboardUser } from '@/hooks/useLeaderboard';
import { cn } from '@/lib/utils';

// Extended type for local transformations
interface ExtendedLeaderboardUser extends LeaderboardUser {
    college?: string;
    avatar?: string;
    userId?: string;
    change?: number;
}

export default function LeaderboardPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('global');
    const { leaderboard, isLoading } = useLeaderboard({ limit: 50 });
    const { leaderboard: weeklyLeaderboardRaw } = useLeaderboard({ type: 'weekly', limit: 50 });

    // Map API data to extended format
    const leaderboardData: ExtendedLeaderboardUser[] = leaderboard.map((user, index) => ({
        ...user,
        avatar: user.avatar_url,
        userId: user.id,
        college: 'DataQuest University', // Default college for demo
        change: user.rankChange || 0,
    }));

    // Weekly leaderboard uses weekly_xp from API
    const weeklyLeaderboard: ExtendedLeaderboardUser[] = weeklyLeaderboardRaw.map((user, index) => ({
        ...user,
        xp: user.weekly_xp || 0, // Use weekly_xp for display
        avatar: user.avatar_url,
        userId: user.id,
        college: 'DataQuest University',
        change: user.rankChange || 0,
    }));

    // Filter leaderboard by search
    const filteredLeaderboard = leaderboardData.filter((entry) =>
        entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.college?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Generate college leaderboard (group by college)
    const collegeStats = leaderboardData.reduce((acc, entry) => {
        const college = entry.college || 'Other';
        if (!acc[college]) {
            acc[college] = { totalXp: 0, students: 0, avgLevel: 0 };
        }
        acc[college].totalXp += entry.xp;
        acc[college].students += 1;
        acc[college].avgLevel += entry.level;
        return acc;
    }, {} as Record<string, { totalXp: number; students: number; avgLevel: number }>);

    const collegeLeaderboard = Object.entries(collegeStats)
        .map(([college, stats]) => ({
            college,
            totalXp: stats.totalXp,
            students: stats.students,
            avgLevel: Math.round(stats.avgLevel / stats.students),
        }))
        .sort((a, b) => b.totalXp - a.totalXp)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-20 flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-24 md:pb-12 px-2 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-x-hidden">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                        <span className="text-gradient">Leaderboard</span>
                    </h1>
                    <p className="text-muted-foreground">
                        See how you rank against other learners worldwide
                    </p>
                </motion.div>

                {/* Top 3 Podium */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex items-end justify-center gap-2 sm:gap-4 h-56 sm:h-64">
                        {/* 2nd Place */}
                        <PodiumCard
                            entry={leaderboardData[1]}
                            position={2}
                            height="h-40"
                        />
                        {/* 1st Place */}
                        <PodiumCard
                            entry={leaderboardData[0]}
                            position={1}
                            height="h-52"
                        />
                        {/* 3rd Place */}
                        <PodiumCard
                            entry={leaderboardData[2]}
                            position={3}
                            height="h-32"
                        />
                    </div>
                </motion.div>

                {/* Tabs */}
                <Tabs defaultValue="global" className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <TabsList>
                            <TabsTrigger value="global">
                                <Trophy className="w-4 h-4 mr-2" />
                                Global
                            </TabsTrigger>
                            <TabsTrigger value="weekly">
                                <Flame className="w-4 h-4 mr-2" />
                                Weekly
                            </TabsTrigger>
                            <TabsTrigger value="college">
                                <GraduationCap className="w-4 h-4 mr-2" />
                                College
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search players..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Global Leaderboard */}
                    <TabsContent value="global">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card overflow-hidden"
                        >
                            <div className="p-4 border-b border-border/50 grid grid-cols-12 text-sm font-medium text-muted-foreground">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-6 sm:col-span-5">Player</div>
                                <div className="col-span-3 sm:col-span-2 text-right">Level</div>
                                <div className="col-span-2 sm:col-span-2 text-right hidden sm:block">XP</div>
                                <div className="col-span-2 text-right">Change</div>
                            </div>
                            <div className="divide-y divide-border/30">
                                {filteredLeaderboard.slice(0, 10).map((entry, index) => (
                                    <LeaderboardRow
                                        key={entry.userId}
                                        entry={entry}
                                        index={index}
                                    />
                                ))}

                                {/* Current User (if not in top 10) */}
                                {leaderboardData.find((e: ExtendedLeaderboardUser) => e.isCurrentUser)?.rank! > 10 && (
                                    <>
                                        <div className="py-4 text-center text-muted-foreground text-sm">
                                            • • •
                                        </div>
                                        <LeaderboardRow
                                            entry={leaderboardData.find((e: ExtendedLeaderboardUser) => e.isCurrentUser)!}
                                            index={leaderboardData.findIndex((e: ExtendedLeaderboardUser) => e.isCurrentUser)}
                                            isHighlighted
                                        />
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Weekly Leaderboard */}
                    <TabsContent value="weekly">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card overflow-hidden"
                        >
                            <div className="p-4 border-b border-border/50 grid grid-cols-12 text-sm font-medium text-muted-foreground">
                                <div className="col-span-1">Rank</div>
                                <div className="col-span-6 sm:col-span-5">Player</div>
                                <div className="col-span-3 sm:col-span-2 text-right">Level</div>
                                <div className="col-span-2 sm:col-span-2 text-right hidden sm:block">Weekly XP</div>
                                <div className="col-span-2 text-right">Change</div>
                            </div>
                            <div className="divide-y divide-border/30">
                                {weeklyLeaderboard
                                    .filter((e) =>
                                        e.username.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .slice(0, 10)
                                    .map((entry, index) => (
                                        <LeaderboardRow
                                            key={entry.userId}
                                            entry={entry}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* College Leaderboard */}
                    <TabsContent value="college">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                <div className="p-4 border-b border-border/50 grid grid-cols-12 text-sm font-medium text-muted-foreground min-w-[500px]">
                                    <div className="col-span-1">Rank</div>
                                    <div className="col-span-5">College</div>
                                    <div className="col-span-2 text-right">Students</div>
                                    <div className="col-span-2 text-right">Avg Level</div>
                                    <div className="col-span-2 text-right">Total XP</div>
                                </div>
                                <div className="divide-y divide-border/30 min-w-[500px]">
                                    {collegeLeaderboard
                                        .filter((e) =>
                                            e.college.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((entry, index) => (
                                            <motion.div
                                                key={entry.college}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="p-4 grid grid-cols-12 items-center hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="col-span-1 font-bold">
                                                    {entry.rank <= 3 ? (
                                                        <span className={cn(
                                                            entry.rank === 1 && "text-yellow-500",
                                                            entry.rank === 2 && "text-gray-400",
                                                            entry.rank === 3 && "text-amber-600",
                                                        )}>
                                                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">{entry.rank}</span>
                                                    )}
                                                </div>
                                                <div className="col-span-5 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                                        <GraduationCap className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{entry.college}</span>
                                                </div>
                                                <div className="col-span-2 text-right text-muted-foreground">
                                                    {entry.students}
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <span className="inline-flex items-center gap-1 text-primary">
                                                        Lv. {entry.avgLevel}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-right font-semibold text-primary">
                                                    {entry.totalXp.toLocaleString()}
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

interface PodiumCardProps {
    entry: ExtendedLeaderboardUser;
    position: 1 | 2 | 3;
    height: string;
}

function PodiumCard({ entry, position, height }: PodiumCardProps) {
    const colors = {
        1: 'from-yellow-500 to-amber-600',
        2: 'from-gray-300 to-gray-500',
        3: 'from-amber-600 to-orange-700',
    };

    const icons = {
        1: <Crown className="w-6 h-6 text-yellow-400" />,
        2: <Medal className="w-5 h-5 text-gray-300" />,
        3: <Medal className="w-5 h-5 text-amber-600" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + position * 0.1 }}
            className="flex flex-col items-center"
        >
            {/* Avatar */}
            <div className="relative mb-2">
                <Avatar className={cn(
                    "border-4",
                    position === 1 && "w-20 h-20 border-yellow-500",
                    position === 2 && "w-16 h-16 border-gray-400",
                    position === 3 && "w-16 h-16 border-amber-600",
                )}>
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                        {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className={cn(
                    "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center",
                    position === 1 && "bg-yellow-500",
                    position === 2 && "bg-gray-400",
                    position === 3 && "bg-amber-600",
                )}>
                    {position}
                </div>
            </div>

            <p className="font-semibold text-sm mb-1">{entry.username}</p>
            <p className="text-xs text-muted-foreground mb-2">{entry.college}</p>

            {/* Podium */}
            <div className={cn(
                "w-20 sm:w-24 rounded-t-lg flex flex-col items-center justify-start pt-3 sm:pt-4 bg-gradient-to-b",
                colors[position],
                height,
            )}>
                {icons[position]}
                <span className="text-white font-bold text-lg mt-2">
                    {entry.xp.toLocaleString()}
                </span>
                <span className="text-white/70 text-xs">XP</span>
            </div>
        </motion.div>
    );
}

interface LeaderboardRowProps {
    entry: ExtendedLeaderboardUser;
    index: number;
    isHighlighted?: boolean;
}

function LeaderboardRow({ entry, index, isHighlighted }: LeaderboardRowProps) {
    const rankIcons: Record<number, React.ReactNode> = {
        1: <Crown className="w-5 h-5 text-yellow-500" />,
        2: <Medal className="w-5 h-5 text-gray-400" />,
        3: <Medal className="w-5 h-5 text-amber-600" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "p-4 grid grid-cols-12 items-center transition-colors",
                isHighlighted
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-muted/30",
                entry.isCurrentUser && "bg-primary/5",
            )}
        >
            {/* Rank */}
            <div className="col-span-1 font-bold">
                {rankIcons[entry.rank] || (
                    <span className="text-muted-foreground">{entry.rank}</span>
                )}
            </div>

            {/* Player */}
            <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                <Avatar className={cn(
                    "w-10 h-10",
                    entry.isCurrentUser && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}>
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium flex items-center gap-2">
                        {entry.username}
                        {entry.isCurrentUser && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                You
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                        {entry.college}
                    </p>
                </div>
            </div>

            {/* Level */}
            <div className="col-span-3 sm:col-span-2 text-right">
                <span className="inline-flex items-center gap-1 text-primary font-medium">
                    <Zap className="w-4 h-4" />
                    Lv. {entry.level}
                </span>
            </div>

            {/* XP */}
            <div className="col-span-2 text-right font-medium hidden sm:block">
                {entry.xp.toLocaleString()}
            </div>

            {/* Change */}
            <div className="col-span-2 text-right">
                {entry.change !== undefined && (
                    <span className={cn(
                        "inline-flex items-center gap-1 text-sm font-medium",
                        entry.change > 0 && "text-emerald-500",
                        entry.change < 0 && "text-red-500",
                        entry.change === 0 && "text-muted-foreground",
                    )}>
                        {entry.change > 0 ? (
                            <>
                                <TrendingUp className="w-4 h-4" />
                                +{entry.change}
                            </>
                        ) : entry.change < 0 ? (
                            <>
                                <TrendingDown className="w-4 h-4" />
                                {entry.change}
                            </>
                        ) : (
                            <Minus className="w-4 h-4" />
                        )}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

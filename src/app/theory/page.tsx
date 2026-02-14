'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Lock,
    Clock,
    Star,
    ArrowRight,
    CheckCircle,
    BookOpen,
    Filter,
    Loader2,
} from 'lucide-react';
import { useTopics, Topic } from '@/hooks/useTopics';
import { cn } from '@/lib/utils';

const categories = ['All', 'Machine Learning', 'Deep Learning', 'Data Science Fundamentals', 'Unsupervised Learning'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function TheoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const { topics, isLoading } = useTopics();

    const filteredTopics = topics.filter((topic) => {
        const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'All' ||
            topic.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const inProgressTopics = filteredTopics.filter((t) => (t.progress || 0) > 0 && (t.progress || 0) < 100);
    const completedTopics = filteredTopics.filter((t) => (t.progress || 0) >= 100);
    const notStartedTopics = filteredTopics.filter((t) => (t.progress || 0) === 0 && !t.locked);
    const lockedTopics = filteredTopics.filter((t) => t.locked);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-24 md:pb-12 px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="text-gradient">Learning Modules</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Master data science and machine learning through interactive lessons
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col lg:flex-row gap-4 mb-8"
                >
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search topics..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    selectedCategory === category && 'bg-gradient-primary',
                                )}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Difficulty Filter */}
                    <div className="flex gap-2">
                        {difficulties.map((difficulty) => (
                            <Button
                                key={difficulty}
                                variant={selectedDifficulty === difficulty ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedDifficulty(difficulty)}
                                className={cn(
                                    difficulty === 'Beginner' && selectedDifficulty === difficulty && 'text-emerald-500',
                                    difficulty === 'Intermediate' && selectedDifficulty === difficulty && 'text-amber-500',
                                    difficulty === 'Advanced' && selectedDifficulty === difficulty && 'text-red-500',
                                )}
                            >
                                {difficulty}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {/* Topics Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="all">
                            All ({filteredTopics.length})
                        </TabsTrigger>
                        <TabsTrigger value="in-progress">
                            In Progress ({inProgressTopics.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                            Completed ({completedTopics.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-8">
                        {/* In Progress Section */}
                        {inProgressTopics.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Continue Learning
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {inProgressTopics.map((topic, index) => (
                                        <TopicCard key={topic.id} topic={topic} index={index} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Not Started Section */}
                        {notStartedTopics.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Ready to Start</h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {notStartedTopics.map((topic, index) => (
                                        <TopicCard key={topic.id} topic={topic} index={index} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Completed Section */}
                        {completedTopics.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    Completed
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {completedTopics.map((topic, index) => (
                                        <TopicCard key={topic.id} topic={topic} index={index} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Locked Section */}
                        {lockedTopics.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-muted-foreground" />
                                    Locked
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {lockedTopics.map((topic, index) => (
                                        <TopicCard key={topic.id} topic={topic} index={index} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </TabsContent>

                    <TabsContent value="in-progress">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {inProgressTopics.map((topic, index) => (
                                <TopicCard key={topic.id} topic={topic} index={index} />
                            ))}
                            {inProgressTopics.length === 0 && (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No topics in progress. Start learning!
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="completed">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {completedTopics.map((topic, index) => (
                                <TopicCard key={topic.id} topic={topic} index={index} />
                            ))}
                            {completedTopics.length === 0 && (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No completed topics yet. Keep learning!
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

interface TopicCardProps {
    topic: Topic & { prerequisites?: string[]; completed?: boolean };
    index: number;
}

function TopicCard({ topic, index }: TopicCardProps) {
    const difficultyColors = {
        beginner: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
        intermediate: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
        advanced: 'bg-red-500/20 text-red-500 border-red-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link href={topic.locked ? '#' : `/theory/${topic.id}`}>
                <div className={cn(
                    "group glass-card p-6 h-full transition-all",
                    topic.locked
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:border-primary/50 cursor-pointer hover:shadow-lg",
                    topic.completed && "border-emerald-500/30",
                )}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                            {topic.locked ? <Lock className="w-6 h-6 text-muted-foreground" /> : topic.icon}
                        </div>
                        <div className="flex items-center gap-2">
                            {topic.completed && (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            )}
                            <span className={cn(
                                "text-xs px-2 py-1 rounded-full border",
                                difficultyColors[topic.difficulty],
                            )}>
                                {topic.difficulty}
                            </span>
                        </div>
                    </div>

                    <h3 className={cn(
                        "text-lg font-semibold mb-2 transition-colors",
                        !topic.locked && "group-hover:text-primary",
                    )}>
                        {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {topic.description}
                    </p>

                    {/* Progress Bar */}
                    {!topic.locked && (topic.progress ?? 0) > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{topic.progress}%</span>
                            </div>
                            <Progress value={topic.progress} className="h-2" />
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {topic.estimated_time}m
                            </span>
                            <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-primary" />
                                +{topic.xp_reward} XP
                            </span>
                        </div>
                        {!topic.locked && (
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                    </div>

                    {/* Locked overlay message */}
                    {topic.locked && topic.prerequisites && (
                        <p className="mt-4 text-xs text-muted-foreground">
                            Complete {topic.prerequisites.join(', ')} first
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

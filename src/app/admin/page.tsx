'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Edit,
    Trash2,
    BookOpen,
    Users,
    Trophy,
    Settings,
    Search,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Loader2,
    BarChart3,
    Brain,
} from 'lucide-react';
import { mockTopics, mockQuizzes } from '@/lib/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AdminTopic {
    id: string;
    title: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    status: 'published' | 'draft';
    questionsCount: number;
    studentsCompleted: number;
}

const adminTopics: AdminTopic[] = mockTopics.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    difficulty: t.difficulty,
    status: t.locked ? 'draft' : 'published',
    questionsCount: Math.floor(Math.random() * 15) + 5,
    studentsCompleted: Math.floor(Math.random() * 500) + 50,
}));

export default function AdminPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
    const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newTopic, setNewTopic] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner' as const,
        xpReward: 100,
    });

    const filteredTopics = adminTopics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddTopic = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsAddTopicOpen(false);
        toast.success('Topic created successfully!');
        setNewTopic({
            title: '',
            description: '',
            category: '',
            difficulty: 'beginner',
            xpReward: 100,
        });
    };

    const handleResetLeaderboard = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsResetDialogOpen(false);
        toast.success('Weekly leaderboard has been reset!');
    };

    const stats = {
        totalTopics: adminTopics.length,
        publishedTopics: adminTopics.filter((t) => t.status === 'published').length,
        totalQuizzes: mockQuizzes.length,
        totalUsers: 1250,
        activeToday: 342,
    };

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
                        <span className="text-gradient">Admin Panel</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Manage topics, quizzes, and platform settings
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalTopics}</p>
                                    <p className="text-xs text-muted-foreground">Total Topics</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.publishedTopics}</p>
                                    <p className="text-xs text-muted-foreground">Published</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Brain className="w-8 h-8 text-accent" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                                    <p className="text-xs text-muted-foreground">Quizzes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-amber-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Total Users</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-emerald-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.activeToday}</p>
                                    <p className="text-xs text-muted-foreground">Active Today</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="topics" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="topics">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Topics
                        </TabsTrigger>
                        <TabsTrigger value="quizzes">
                            <Brain className="w-4 h-4 mr-2" />
                            Quizzes
                        </TabsTrigger>
                        <TabsTrigger value="leaderboard">
                            <Trophy className="w-4 h-4 mr-2" />
                            Leaderboard
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Topics Tab */}
                    <TabsContent value="topics">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <CardTitle>Topic Management</CardTitle>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search topics..."
                                                className="pl-9 w-64"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="bg-gradient-primary">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Topic
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Add New Topic</DialogTitle>
                                                    <DialogDescription>
                                                        Create a new learning topic for students.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">Title</Label>
                                                        <Input
                                                            id="title"
                                                            value={newTopic.title}
                                                            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                                                            placeholder="e.g., Introduction to Neural Networks"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="description">Description</Label>
                                                        <Textarea
                                                            id="description"
                                                            value={newTopic.description}
                                                            onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                                                            placeholder="Brief description of the topic..."
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Category</Label>
                                                            <Select
                                                                value={newTopic.category}
                                                                onValueChange={(value) => setNewTopic({ ...newTopic, category: value })}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                                                    <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                                                                    <SelectItem value="Data Science Fundamentals">Data Science Fundamentals</SelectItem>
                                                                    <SelectItem value="Unsupervised Learning">Unsupervised Learning</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Difficulty</Label>
                                                            <Select
                                                                value={newTopic.difficulty}
                                                                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                                                                    setNewTopic({ ...newTopic, difficulty: value })
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="xp">XP Reward</Label>
                                                        <Input
                                                            id="xp"
                                                            type="number"
                                                            value={newTopic.xpReward}
                                                            onChange={(e) => setNewTopic({ ...newTopic, xpReward: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsAddTopicOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleAddTopic} disabled={isLoading}>
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Creating...
                                                            </>
                                                        ) : (
                                                            'Create Topic'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Topic</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Difficulty</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Questions</TableHead>
                                            <TableHead>Completed By</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTopics.map((topic) => (
                                            <TableRow key={topic.id}>
                                                <TableCell className="font-medium">{topic.title}</TableCell>
                                                <TableCell className="text-muted-foreground">{topic.category}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        topic.difficulty === 'beginner' && 'bg-emerald-500/20 text-emerald-500',
                                                        topic.difficulty === 'intermediate' && 'bg-amber-500/20 text-amber-500',
                                                        topic.difficulty === 'advanced' && 'bg-red-500/20 text-red-500',
                                                    )}>
                                                        {topic.difficulty}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={topic.status === 'published' ? 'default' : 'secondary'}>
                                                        {topic.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{topic.questionsCount}</TableCell>
                                                <TableCell>{topic.studentsCompleted}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Quizzes Tab */}
                    <TabsContent value="quizzes">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Quiz Management</CardTitle>
                                    <Dialog open={isAddQuizOpen} onOpenChange={setIsAddQuizOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-gradient-primary">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Quiz
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Quiz</DialogTitle>
                                                <DialogDescription>
                                                    Create a new quiz for a topic.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="quiz-title">Quiz Title</Label>
                                                    <Input id="quiz-title" placeholder="e.g., Linear Regression Fundamentals" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Associated Topic</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select topic" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {mockTopics.map((topic) => (
                                                                <SelectItem key={topic.id} value={topic.id}>
                                                                    {topic.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="time-limit">Time Limit (seconds)</Label>
                                                        <Input id="time-limit" type="number" defaultValue={300} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="passing-score">Passing Score (%)</Label>
                                                        <Input id="passing-score" type="number" defaultValue={70} />
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsAddQuizOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={() => {
                                                    toast.success('Quiz created successfully!');
                                                    setIsAddQuizOpen(false);
                                                }}>
                                                    Create Quiz
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Quiz</TableHead>
                                            <TableHead>Topic</TableHead>
                                            <TableHead>Questions</TableHead>
                                            <TableHead>Time Limit</TableHead>
                                            <TableHead>XP Reward</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockQuizzes.map((quiz) => {
                                            const topic = mockTopics.find((t) => t.id === quiz.topicId);
                                            return (
                                                <TableRow key={quiz.id}>
                                                    <TableCell className="font-medium">{quiz.title}</TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {topic?.title || '-'}
                                                    </TableCell>
                                                    <TableCell>{quiz.questions.length}</TableCell>
                                                    <TableCell>{Math.floor(quiz.timeLimit / 60)}m</TableCell>
                                                    <TableCell className="text-primary">+{quiz.xpReward} XP</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="icon">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Leaderboard Tab */}
                    <TabsContent value="leaderboard">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Leaderboard Management</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Manage weekly and global leaderboard settings
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Weekly Reset */}
                                <div className="glass-card p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <RefreshCw className="w-5 h-5 text-primary" />
                                                Weekly Leaderboard Reset
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Reset the weekly leaderboard and archive current standings
                                            </p>
                                        </div>
                                        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Reset Weekly
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Reset Weekly Leaderboard?</DialogTitle>
                                                    <DialogDescription>
                                                        This will reset all weekly XP scores to 0. Current standings will be archived. This action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                                    <p className="text-sm">
                                                        Make sure to announce the reset to users before proceeding.
                                                    </p>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="destructive" onClick={handleResetLeaderboard} disabled={isLoading}>
                                                        {isLoading ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Resetting...
                                                            </>
                                                        ) : (
                                                            'Confirm Reset'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                {/* Leaderboard Stats */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="glass-card p-4 text-center">
                                        <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">MLMaster</p>
                                        <p className="text-sm text-muted-foreground">Current #1</p>
                                    </div>
                                    <div className="glass-card p-4 text-center">
                                        <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                                        <p className="text-2xl font-bold">1,250</p>
                                        <p className="text-sm text-muted-foreground">Active Competitors</p>
                                    </div>
                                    <div className="glass-card p-4 text-center">
                                        <BarChart3 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-2xl font-bold">15,420</p>
                                        <p className="text-sm text-muted-foreground">Highest XP</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">XP Configuration</h3>
                                        <div className="space-y-2">
                                            <Label>Topic Completion XP (Base)</Label>
                                            <Input type="number" defaultValue={100} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Quiz Completion XP (Base)</Label>
                                            <Input type="number" defaultValue={50} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Daily Streak Bonus XP</Label>
                                            <Input type="number" defaultValue={25} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Quiz Settings</h3>
                                        <div className="space-y-2">
                                            <Label>Default Time Limit (seconds)</Label>
                                            <Input type="number" defaultValue={300} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Default Passing Score (%)</Label>
                                            <Input type="number" defaultValue={70} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Questions per Quiz (Default)</Label>
                                            <Input type="number" defaultValue={10} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-border/50">
                                    <Button className="bg-gradient-primary" onClick={() => toast.success('Settings saved!')}>
                                        Save Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

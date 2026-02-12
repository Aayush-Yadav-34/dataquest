'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
    Shield,
    Lock,
    Ban,
    UserCheck,
} from 'lucide-react';
import { useAdminTopics, AdminTopic } from '@/hooks/useAdminTopics';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';



export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { profile, isAuthenticated: storeAuth } = useUserStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
    const [isAddQuizOpen, setIsAddQuizOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [adminStats, setAdminStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        topUser: 'Loading...',
        highestXP: 0,
        competitorCount: 0
    });
    const [usersList, setUsersList] = useState<Array<{
        id: string;
        email: string;
        username: string;
        avatar_url: string | null;
        xp: number;
        level: number;
        role: string;
        blocked: boolean;
        created_at: string;
    }>>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

    // Settings state
    const [settings, setSettings] = useState({
        maintenance_mode: false,
        allow_registration: true,
        session_time_tracking: true,
        auto_weekly_reset: false,
        weekly_reset_day: 'monday',
        email_notifications: false,
    });
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settingsSaving, setSettingsSaving] = useState(false);

    // Fetch data from API
    const { topics: adminTopicsRaw, isLoading: topicsLoading, refetch: refetchTopics } = useAdminTopics();
    const { quizzes, isLoading: quizzesLoading, refetch: refetchQuizzes } = useQuizzes();

    // Transform topics for admin view (add status from locked)
    const adminTopics = adminTopicsRaw.map((t) => ({
        ...t,
        status: t.locked ? 'draft' as const : 'published' as const,
    }));

    // Fetch admin stats from API
    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                if (response.ok) {
                    const data = await response.json();
                    setAdminStats(data);
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            }
        };
        fetchAdminStats();
    }, []);

    // Fetch users list on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            try {
                const response = await fetch('/api/admin/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsersList(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setUsersLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Fetch settings on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            setSettingsLoading(true);
            try {
                const response = await fetch('/api/admin/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(prev => ({ ...prev, ...data.settings }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setSettingsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Save settings handler
    const handleSaveSettings = async () => {
        setSettingsSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });

            if (response.ok) {
                toast.success('Settings saved successfully!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSettingsSaving(false);
        }
    };

    const [newTopic, setNewTopic] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        xpReward: 100,
    });

    // Edit topic state
    const [editingTopic, setEditingTopic] = useState<AdminTopic | null>(null);
    const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);

    // Edit quiz state  
    const [editingQuiz, setEditingQuiz] = useState<any>(null);
    const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);

    // New quiz state
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        topic_id: '',
        time_limit: 300,
        xp_reward: 50,
    });

    // Manage questions state
    const [managingQuiz, setManagingQuiz] = useState<any>(null);
    const [isManageQuestionsOpen, setIsManageQuestionsOpen] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: '',
    });
    const [editingQuestion, setEditingQuestion] = useState<any>(null);

    // Combined auth check - check both NextAuth session and Zustand store
    const isAuthenticated = status === 'authenticated' || storeAuth;
    const isCheckingAuth = status === 'loading';

    // Check admin role from session or profile
    const userRole = session?.user?.role || profile?.role;
    const isAdmin = userRole === 'admin';
    const userEmail = session?.user?.email || profile?.email || '';

    useEffect(() => {
        if (!isCheckingAuth) {
            if (!isAuthenticated) {
                toast.error('Please login first', {
                    description: 'You need to be logged in to access this page.',
                });
                router.push('/login');
            } else if (!isAdmin) {
                toast.error('Access Denied', {
                    description: 'You do not have permission to access the admin panel.',
                });
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, isAdmin, router, isCheckingAuth]);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Checking permissions...</p>
                </div>
            </div>
        );
    }

    // Show access denied if not admin
    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center glass-card p-12 max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">
                        You do not have permission to access the admin panel. Please login with an admin account.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>
                            Go to Dashboard
                        </Button>
                        <Button onClick={() => router.push('/login')}>
                            Login as Admin
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const filteredTopics = adminTopics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddTopic = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTopic.title,
                    description: newTopic.description,
                    category: newTopic.category,
                    difficulty: newTopic.difficulty,
                    xp_reward: newTopic.xpReward,
                }),
            });

            if (response.ok) {
                toast.success('Topic created successfully!');
                setIsAddTopicOpen(false);
                setNewTopic({
                    title: '',
                    description: '',
                    category: '',
                    difficulty: 'beginner',
                    xpReward: 100,
                });
                refetchTopics();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to create topic');
            }
        } catch (error) {
            toast.error('Failed to create topic');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        console.log('Delete topic clicked:', topicId);

        try {
            const response = await fetch(`/api/topics/${topicId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Topic deleted successfully!');
                refetchTopics();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete topic');
            }
        } catch (error) {
            console.error('Delete topic error:', error);
            toast.error('Failed to delete topic');
        }
    };

    const handleDeleteQuiz = async (quizId: string) => {
        console.log('Delete quiz clicked:', quizId);

        try {
            const response = await fetch(`/api/quizzes/${quizId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Quiz deleted successfully!');
                refetchQuizzes();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete quiz');
            }
        } catch (error) {
            console.error('Delete quiz error:', error);
            toast.error('Failed to delete quiz');
        }
    };

    const handleResetLeaderboard = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/leaderboard/reset', {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(`Weekly leaderboard reset! Archived ${data.archived?.topUsers || 0} top users.`);
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to reset leaderboard');
            }
        } catch (error) {
            console.error('Reset leaderboard error:', error);
            toast.error('Failed to reset leaderboard');
        } finally {
            setIsLoading(false);
            setIsResetDialogOpen(false);
        }
    };

    // Edit Topic handler
    const handleEditTopic = async () => {
        if (!editingTopic) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/topics/${editingTopic.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingTopic.title,
                    category: editingTopic.category,
                    difficulty: editingTopic.difficulty,
                    content: editingTopic.content,
                }),
            });

            if (response.ok) {
                toast.success('Topic updated successfully!');
                setIsEditTopicOpen(false);
                setEditingTopic(null);
                refetchTopics();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update topic');
            }
        } catch (error) {
            console.error('Edit topic error:', error);
            toast.error('Failed to update topic');
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle Topic Status (published/draft)
    const handleToggleStatus = async (topicId: string, currentStatus: string) => {
        const newLocked = currentStatus === 'published'; // if published, lock it (draft)

        try {
            const response = await fetch(`/api/topics/${topicId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locked: newLocked }),
            });

            if (response.ok) {
                toast.success(`Topic ${newLocked ? 'unpublished' : 'published'}!`);
                refetchTopics();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // Add Quiz handler
    const handleAddQuiz = async () => {
        if (!newQuiz.title || !newQuiz.topic_id) {
            toast.error('Please fill in title and select a topic');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuiz),
            });

            if (response.ok) {
                toast.success('Quiz created successfully!');
                setIsAddQuizOpen(false);
                setNewQuiz({ title: '', topic_id: '', time_limit: 300, xp_reward: 50 });
                refetchQuizzes();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to create quiz');
            }
        } catch (error) {
            console.error('Add quiz error:', error);
            toast.error('Failed to create quiz');
        } finally {
            setIsLoading(false);
        }
    };

    // Edit Quiz handler
    const handleEditQuiz = async () => {
        if (!editingQuiz) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/quizzes/${editingQuiz.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editingQuiz.title,
                    topic_id: editingQuiz.topicId,
                    time_limit: editingQuiz.timeLimit,
                    xp_reward: editingQuiz.xpReward,
                }),
            });

            if (response.ok) {
                toast.success('Quiz updated successfully!');
                setIsEditQuizOpen(false);
                setEditingQuiz(null);
                refetchQuizzes();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update quiz');
            }
        } catch (error) {
            console.error('Edit quiz error:', error);
            toast.error('Failed to update quiz');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch questions for a quiz
    const fetchQuestions = async (quizId: string) => {
        setQuestionsLoading(true);
        try {
            const response = await fetch(`/api/quiz-questions?quiz_id=${quizId}`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data.questions || []);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setQuestionsLoading(false);
        }
    };

    // Open manage questions dialog
    const openManageQuestions = async (quiz: any) => {
        setManagingQuiz(quiz);
        setIsManageQuestionsOpen(true);
        await fetchQuestions(quiz.id);
    };

    // Add new question
    const handleAddQuestion = async () => {
        if (!managingQuiz || !newQuestion.question.trim()) {
            toast.error('Please enter a question');
            return;
        }

        if (newQuestion.options.some((o: string) => !o.trim())) {
            toast.error('Please fill in all options');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/quiz-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quiz_id: managingQuiz.id,
                    question: newQuestion.question,
                    options: newQuestion.options,
                    correct_answer: newQuestion.correct_answer,
                    explanation: newQuestion.explanation || null,
                }),
            });

            if (response.ok) {
                toast.success('Question added!');
                setNewQuestion({
                    question: '',
                    options: ['', '', '', ''],
                    correct_answer: 0,
                    explanation: '',
                });
                await fetchQuestions(managingQuiz.id);
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to add question');
            }
        } catch (error) {
            toast.error('Failed to add question');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete question
    const handleDeleteQuestion = async (questionId: string) => {
        try {
            const response = await fetch(`/api/quiz-questions/${questionId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Question deleted!');
                if (managingQuiz) {
                    await fetchQuestions(managingQuiz.id);
                }
            } else {
                toast.error('Failed to delete question');
            }
        } catch (error) {
            toast.error('Failed to delete question');
        }
    };

    // Update question
    const handleUpdateQuestion = async () => {
        if (!editingQuestion) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/quiz-questions/${editingQuestion.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: editingQuestion.question,
                    options: editingQuestion.options,
                    correct_answer: editingQuestion.correct_answer,
                    explanation: editingQuestion.explanation,
                }),
            });

            if (response.ok) {
                toast.success('Question updated!');
                setEditingQuestion(null);
                if (managingQuiz) {
                    await fetchQuestions(managingQuiz.id);
                }
            } else {
                toast.error('Failed to update question');
            }
        } catch (error) {
            toast.error('Failed to update question');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        totalTopics: adminTopics.length,
        publishedTopics: adminTopics.filter((t) => t.status === 'published').length,
        totalQuizzes: quizzes.length,
        totalUsers: adminStats.totalUsers,
        activeToday: adminStats.activeToday,
    };

    return (
        <>
            <div className="min-h-screen bg-background">
                <Navbar />

                <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-8 h-8 text-amber-500" />
                            <h1 className="text-3xl font-bold">
                                <span className="text-gradient">Admin Panel</span>
                            </h1>
                        </div>
                        <p className="text-muted-foreground">
                            Manage topics, quizzes, and platform settings
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm">
                            <Shield className="w-4 h-4" />
                            Logged in as: {userEmail}
                        </div>
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
                            <TabsTrigger value="users">
                                <Users className="w-4 h-4 mr-2" />
                                Users
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
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(topic.id, topic.status)}
                                                            title={topic.status === 'published' ? 'Click to unpublish' : 'Click to publish'}
                                                            className={cn(
                                                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                                                                'transition-all duration-200 cursor-pointer border',
                                                                'hover:scale-105 hover:shadow-md active:scale-95',
                                                                topic.status === 'published'
                                                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
                                                                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50'
                                                            )}
                                                        >
                                                            {topic.status === 'published' ? (
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                            ) : (
                                                                <Ban className="w-3.5 h-3.5" />
                                                            )}
                                                            {topic.status === 'published' ? 'Published' : 'Draft'}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell>{topic.studentsCompleted}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setEditingTopic(topic);
                                                                    setIsEditTopicOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive"
                                                                onClick={() => handleDeleteTopic(topic.id)}
                                                            >
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
                                                        <Input
                                                            id="quiz-title"
                                                            placeholder="e.g., Linear Regression Quiz"
                                                            value={newQuiz.title}
                                                            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Associated Topic</Label>
                                                        <Select
                                                            value={newQuiz.topic_id}
                                                            onValueChange={(value) => setNewQuiz({ ...newQuiz, topic_id: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select topic" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {adminTopicsRaw.map((topic: AdminTopic) => (
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
                                                            <Input
                                                                id="time-limit"
                                                                type="number"
                                                                value={newQuiz.time_limit}
                                                                onChange={(e) => setNewQuiz({ ...newQuiz, time_limit: parseInt(e.target.value) || 300 })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="xp-reward">XP Reward</Label>
                                                            <Input
                                                                id="xp-reward"
                                                                type="number"
                                                                value={newQuiz.xp_reward}
                                                                onChange={(e) => setNewQuiz({ ...newQuiz, xp_reward: parseInt(e.target.value) || 50 })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsAddQuizOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleAddQuiz} disabled={isLoading}>
                                                        {isLoading ? 'Creating...' : 'Create Quiz'}
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
                                            {quizzes.map((quiz) => {
                                                return (
                                                    <TableRow key={quiz.id}>
                                                        <TableCell className="font-medium">{quiz.title}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {quiz.topic?.title || '-'}
                                                        </TableCell>
                                                        <TableCell>{quiz.questionCount}</TableCell>
                                                        <TableCell>{Math.floor(quiz.timeLimit / 60)}m</TableCell>
                                                        <TableCell className="text-primary">+{quiz.xpReward} XP</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Manage Questions"
                                                                    onClick={() => openManageQuestions(quiz)}
                                                                >
                                                                    <BookOpen className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        setEditingQuiz(quiz);
                                                                        setIsEditQuizOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                                                >
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
                                            <p className="text-2xl font-bold">{adminStats.topUser}</p>
                                            <p className="text-sm text-muted-foreground">Current #1</p>
                                        </div>
                                        <div className="glass-card p-4 text-center">
                                            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{adminStats.competitorCount.toLocaleString()}</p>
                                            <p className="text-sm text-muted-foreground">Active Competitors</p>
                                        </div>
                                        <div className="glass-card p-4 text-center">
                                            <BarChart3 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{adminStats.highestXP.toLocaleString()}</p>
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
                                    <CardTitle>System Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {settingsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span className="ml-2">Loading settings...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                                                        <div>
                                                            <h4 className="font-medium">Maintenance Mode</h4>
                                                            <p className="text-sm text-muted-foreground">Temporarily disable access for maintenance</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.maintenance_mode}
                                                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                                                        <div>
                                                            <h4 className="font-medium">Allow New Registrations</h4>
                                                            <p className="text-sm text-muted-foreground">Enable or disable new user sign-ups</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.allow_registration}
                                                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allow_registration: checked }))}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                                                        <div>
                                                            <h4 className="font-medium">Session Time Tracking</h4>
                                                            <p className="text-sm text-muted-foreground">Track time users spend on the platform</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.session_time_tracking}
                                                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, session_time_tracking: checked }))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                                                        <div>
                                                            <h4 className="font-medium">Auto Weekly Reset</h4>
                                                            <p className="text-sm text-muted-foreground">Automatically reset weekly leaderboard</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.auto_weekly_reset}
                                                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_weekly_reset: checked }))}
                                                        />
                                                    </div>
                                                    <div className="space-y-2 p-4 rounded-lg border border-border/50 bg-card/50">
                                                        <Label htmlFor="reset-day">Weekly Reset Day</Label>
                                                        <select
                                                            id="reset-day"
                                                            className="w-full p-2 rounded-md border border-input bg-background"
                                                            value={settings.weekly_reset_day}
                                                            onChange={(e) => setSettings(prev => ({ ...prev, weekly_reset_day: e.target.value }))}
                                                        >
                                                            <option value="sunday">Sunday</option>
                                                            <option value="monday">Monday</option>
                                                            <option value="saturday">Saturday</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                                                        <div>
                                                            <h4 className="font-medium">Email Notifications</h4>
                                                            <p className="text-sm text-muted-foreground">Send weekly summary emails</p>
                                                        </div>
                                                        <Switch
                                                            checked={settings.email_notifications}
                                                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    className="bg-gradient-primary"
                                                    onClick={handleSaveSettings}
                                                    disabled={settingsSaving}
                                                >
                                                    {settingsSaving ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        'Save Settings'
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Users Tab */}
                        <TabsContent value="users">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>User Management</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search users..."
                                                    className="pl-9 w-64"
                                                    value={userSearch}
                                                    onChange={(e) => setUserSearch(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={async () => {
                                                    setUsersLoading(true);
                                                    try {
                                                        const res = await fetch(`/api/admin/users?search=${userSearch}`);
                                                        if (res.ok) {
                                                            const data = await res.json();
                                                            setUsersList(data.users);
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                    } finally {
                                                        setUsersLoading(false);
                                                    }
                                                }}
                                            >
                                                <RefreshCw className={cn("w-4 h-4", usersLoading && "animate-spin")} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {usersList.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">No users found. Click refresh to load users.</p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>XP</TableHead>
                                                    <TableHead>Level</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {usersList.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                                                                    {user.username?.charAt(0).toUpperCase() || '?'}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{user.username}</p>
                                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={cn(
                                                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                                                                user.role === 'admin'
                                                                    ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                                                                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                                                            )}>
                                                                {user.role === 'admin' ? (
                                                                    <Shield className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <UserCheck className="w-3.5 h-3.5" />
                                                                )}
                                                                {user.role}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{user.xp.toLocaleString()}</TableCell>
                                                        <TableCell>{user.level}</TableCell>
                                                        <TableCell>
                                                            <span className={cn(
                                                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                                                                'transition-all duration-200',
                                                                user.blocked
                                                                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                                                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                            )}>
                                                                {user.blocked ? (
                                                                    <Ban className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                                )}
                                                                {user.blocked ? 'Blocked' : 'Active'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {user.role !== 'admin' && (
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        type="button"
                                                                        title={user.blocked ? 'Click to unblock user' : 'Click to block user'}
                                                                        className={cn(
                                                                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                                                                            'transition-all duration-200 cursor-pointer border',
                                                                            'hover:scale-105 hover:shadow-md active:scale-95',
                                                                            user.blocked
                                                                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
                                                                                : 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50'
                                                                        )}
                                                                        onClick={async () => {
                                                                            try {
                                                                                const res = await fetch('/api/admin/users', {
                                                                                    method: 'PATCH',
                                                                                    headers: { 'Content-Type': 'application/json' },
                                                                                    body: JSON.stringify({ userId: user.id, blocked: !user.blocked })
                                                                                });
                                                                                if (res.ok) {
                                                                                    toast.success(user.blocked ? 'User unblocked' : 'User blocked');
                                                                                    setUsersList(prev => prev.map(u =>
                                                                                        u.id === user.id ? { ...u, blocked: !u.blocked } : u
                                                                                    ));
                                                                                }
                                                                            } catch (e) {
                                                                                console.error(e);
                                                                                toast.error('Failed to update user');
                                                                            }
                                                                        }}
                                                                    >
                                                                        {user.blocked ? (
                                                                            <><UserCheck className="w-3.5 h-3.5" /> Unblock</>
                                                                        ) : (
                                                                            <><Ban className="w-3.5 h-3.5" /> Block</>
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        title="Delete user"
                                                                        className={cn(
                                                                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                                                                            'transition-all duration-200 cursor-pointer border',
                                                                            'hover:scale-105 hover:shadow-md active:scale-95',
                                                                            'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50'
                                                                        )}
                                                                        onClick={() => setDeleteUserId(user.id)}
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* Edit Topic Dialog */}
            <Dialog open={isEditTopicOpen} onOpenChange={setIsEditTopicOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                        <DialogDescription>Update topic details</DialogDescription>
                    </DialogHeader>
                    {editingTopic && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-topic-title">Title</Label>
                                <Input
                                    id="edit-topic-title"
                                    value={editingTopic.title}
                                    onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-topic-category">Category</Label>
                                <Input
                                    id="edit-topic-category"
                                    value={editingTopic.category}
                                    onChange={(e) => setEditingTopic({ ...editingTopic, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select
                                    value={editingTopic.difficulty}
                                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                                        setEditingTopic({ ...editingTopic, difficulty: value })}
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
                            <div className="space-y-2">
                                <Label htmlFor="edit-topic-content">Theory Content (JSON)</Label>
                                <textarea
                                    id="edit-topic-content"
                                    className="w-full h-64 p-3 rounded-md border border-border bg-background text-foreground font-mono text-sm resize-none"
                                    value={JSON.stringify(editingTopic.content || [], null, 2)}
                                    onChange={(e) => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            setEditingTopic({ ...editingTopic, content: parsed });
                                        } catch {
                                            // Invalid JSON, keep current value for display
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Content is stored as JSON array. Each item represents a section.
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditTopicOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditTopic} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Quiz Dialog */}
            <Dialog open={isEditQuizOpen} onOpenChange={setIsEditQuizOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Quiz</DialogTitle>
                        <DialogDescription>Update quiz details</DialogDescription>
                    </DialogHeader>
                    {editingQuiz && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-quiz-title">Title</Label>
                                <Input
                                    id="edit-quiz-title"
                                    value={editingQuiz.title}
                                    onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Associated Topic</Label>
                                <Select
                                    value={editingQuiz.topicId}
                                    onValueChange={(value) => setEditingQuiz({ ...editingQuiz, topicId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {adminTopicsRaw.map((topic: AdminTopic) => (
                                            <SelectItem key={topic.id} value={topic.id}>
                                                {topic.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-time-limit">Time Limit (seconds)</Label>
                                    <Input
                                        id="edit-time-limit"
                                        type="number"
                                        value={editingQuiz.timeLimit}
                                        onChange={(e) => setEditingQuiz({ ...editingQuiz, timeLimit: parseInt(e.target.value) || 300 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-xp-reward">XP Reward</Label>
                                    <Input
                                        id="edit-xp-reward"
                                        type="number"
                                        value={editingQuiz.xpReward}
                                        onChange={(e) => setEditingQuiz({ ...editingQuiz, xpReward: parseInt(e.target.value) || 50 })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditQuizOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditQuiz} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manage Questions Dialog */}
            <Dialog open={isManageQuestionsOpen} onOpenChange={setIsManageQuestionsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Manage Questions - {managingQuiz?.title}</DialogTitle>
                        <DialogDescription>Add, edit, or delete quiz questions</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Question List */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Existing Questions ({questions.length})</h4>
                            {questionsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : questions.length === 0 ? (
                                <p className="text-muted-foreground text-sm py-4 text-center">No questions yet. Add one below.</p>
                            ) : (
                                <div className="space-y-2">
                                    {questions.map((q: any, index: number) => (
                                        <div key={q.id} className="p-3 rounded-md border border-border bg-muted/30">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">Q{index + 1}: {q.question}</p>
                                                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                                                        {q.options?.map((opt: string, i: number) => (
                                                            <div key={i} className={i === q.correct_answer ? 'text-green-500 font-medium' : ''}>
                                                                {String.fromCharCode(65 + i)}) {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => setEditingQuestion(q)}
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive"
                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-border pt-4">
                            {/* Add/Edit Question Form */}
                            <h4 className="text-sm font-medium mb-3">
                                {editingQuestion ? 'Edit Question' : 'Add New Question'}
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="q-text">Question</Label>
                                    <Input
                                        id="q-text"
                                        placeholder="Enter question text"
                                        value={editingQuestion?.question ?? newQuestion.question}
                                        onChange={(e) => editingQuestion
                                            ? setEditingQuestion({ ...editingQuestion, question: e.target.value })
                                            : setNewQuestion({ ...newQuestion, question: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div key={i}>
                                            <Label>Option {String.fromCharCode(65 + i)}</Label>
                                            <Input
                                                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                value={(editingQuestion?.options ?? newQuestion.options)[i]}
                                                onChange={(e) => {
                                                    const opts = [...(editingQuestion?.options ?? newQuestion.options)];
                                                    opts[i] = e.target.value;
                                                    editingQuestion
                                                        ? setEditingQuestion({ ...editingQuestion, options: opts })
                                                        : setNewQuestion({ ...newQuestion, options: opts });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <Label>Correct Answer</Label>
                                    <Select
                                        value={String(editingQuestion?.correct_answer ?? newQuestion.correct_answer)}
                                        onValueChange={(val) => editingQuestion
                                            ? setEditingQuestion({ ...editingQuestion, correct_answer: parseInt(val) })
                                            : setNewQuestion({ ...newQuestion, correct_answer: parseInt(val) })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">A</SelectItem>
                                            <SelectItem value="1">B</SelectItem>
                                            <SelectItem value="2">C</SelectItem>
                                            <SelectItem value="3">D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Explanation (optional)</Label>
                                    <Input
                                        placeholder="Explain why this is the correct answer"
                                        value={editingQuestion?.explanation ?? newQuestion.explanation}
                                        onChange={(e) => editingQuestion
                                            ? setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                                            : setNewQuestion({ ...newQuestion, explanation: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {editingQuestion ? (
                                        <>
                                            <Button onClick={handleUpdateQuestion} disabled={isLoading}>
                                                {isLoading ? 'Saving...' : 'Update Question'}
                                            </Button>
                                            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleAddQuestion} disabled={isLoading}>
                                            {isLoading ? 'Adding...' : 'Add Question'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsManageQuestionsOpen(false);
                            setManagingQuiz(null);
                            setQuestions([]);
                            setEditingQuestion(null);
                        }}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Dialog */}
            <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                            All their data including progress, quiz attempts, and badges will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        <p className="text-sm">This action is irreversible!</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteUserId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (!deleteUserId) return;
                                try {
                                    const res = await fetch(`/api/admin/users?userId=${deleteUserId}`, {
                                        method: 'DELETE'
                                    });
                                    if (res.ok) {
                                        toast.success('User deleted successfully');
                                        setUsersList(prev => prev.filter(u => u.id !== deleteUserId));
                                        setDeleteUserId(null);
                                    } else {
                                        const data = await res.json();
                                        toast.error(data.error || 'Failed to delete user');
                                    }
                                } catch (e) {
                                    console.error(e);
                                    toast.error('Failed to delete user');
                                }
                            }}
                        >
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

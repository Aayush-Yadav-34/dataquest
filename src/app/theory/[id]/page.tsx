'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Star,
    Zap,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { useTopic } from '@/hooks/useTopics';
import { useUserStore } from '@/store/userStore';
import { useUserData } from '@/hooks/useUserData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface TheorySection {
    title: string;
    content: string;
    code?: string;
}

export default function TheoryTopicPage() {
    const params = useParams();
    const router = useRouter();
    const topicId = params.id as string;

    // Fetch topic from API
    const { topic, isLoading, error } = useTopic(topicId);
    const { addXP } = useUserStore();
    const { refetch: refetchUserData } = useUserData();

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showXPAnimation, setShowXPAnimation] = useState(false);

    // Parse content from topic - handle both string (JSON) and array formats
    const parseContent = (): TheorySection[] => {
        if (!topic?.content) return [];

        // If it's already an array, use it directly
        if (Array.isArray(topic.content)) {
            return topic.content as TheorySection[];
        }

        // If it's a string, try to parse it as JSON
        if (typeof topic.content === 'string') {
            try {
                const parsed = JSON.parse(topic.content);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }

        return [];
    };

    const sections: TheorySection[] = parseContent();

    const currentSection = sections[currentSectionIndex];
    const progress = sections.length > 0
        ? ((currentSectionIndex + 1) / sections.length) * 100
        : 0;
    const isLastSection = currentSectionIndex === sections.length - 1;

    useEffect(() => {
        if (error) {
            router.push('/theory');
        }
    }, [error, router]);

    // Save partial progress whenever section changes (for Continue Learning feature)
    useEffect(() => {
        if (!topic?.id || sections.length === 0) return;

        // Don't save at 0% (just opened) or 100% (completed - handled by handleComplete)
        const currentProgress = Math.round(((currentSectionIndex + 1) / sections.length) * 100);
        if (currentSectionIndex === 0 || currentProgress === 100) return;

        // Save progress in background (don't await)
        fetch('/api/user/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topicId: topic.id,
                progressPercent: currentProgress,
                completed: false,
            }),
        }).catch(err => console.error('Error saving progress:', err));
    }, [topic?.id, currentSectionIndex, sections.length]);

    const handleComplete = async () => {
        if (!topic) return;

        setIsCompleting(true);

        // Call API to add XP and save progress
        try {
            // Save XP
            const xpResponse = await fetch('/api/users/xp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: topic.xp_reward,
                    action: {
                        type: 'theory',
                        title: `Completed ${topic.title}`,
                        description: `Mastered the ${topic.title} module`,
                    }
                }),
            });

            // Save progress to database
            await fetch('/api/user/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topicId: topic.id,
                    progressPercent: 100,
                    completed: true,
                }),
            });

            if (xpResponse.ok) {
                // Show XP animation
                setShowXPAnimation(true);
                await refetchUserData();

                toast.success('Topic Completed!', {
                    description: `You earned ${topic.xp_reward} XP!`,
                });

                setTimeout(() => {
                    setShowXPAnimation(false);
                    router.push('/theory');
                }, 2000);
            } else {
                toast.error('Could not save progress');
                setIsCompleting(false);
            }
        } catch (err) {
            console.error('Error completing topic:', err);
            toast.error('Could not save progress');
            setIsCompleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center pt-32">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!topic || sections.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-20 pb-24 md:pb-12 px-2 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-x-hidden">
                    <div className="text-center py-20">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h2 className="text-xl font-semibold mb-2">Content Coming Soon</h2>
                        <p className="text-muted-foreground mb-6">
                            The content for this topic is being prepared.
                        </p>
                        <Button onClick={() => router.push('/theory')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Topics
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* XP Animation Overlay */}
            <AnimatePresence>
                {showXPAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center glow"
                            >
                                <Zap className="w-16 h-16 text-white" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-bold text-gradient mb-2"
                            >
                                +{topic.xp_reward} XP
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-muted-foreground"
                            >
                                Great job! Topic completed.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-20 pb-12 px-2 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/theory')}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Topics
                    </Button>

                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl flex-shrink-0">
                            {topic.icon}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {topic.estimated_time} min
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-primary" />
                                    +{topic.xp_reward} XP
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    {sections.length} sections
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                                Section {currentSectionIndex + 1} of {sections.length}
                            </span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    key={currentSectionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-3 sm:p-8 mb-8"
                >
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{currentSection.title}</h2>

                    {/* Content */}
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                        <MarkdownContent content={currentSection.content} />
                    </div>

                    {/* Code Block if present */}
                    {currentSection.code && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Code Example</h3>
                            <pre className="bg-muted/50 rounded-lg p-2 sm:p-4 overflow-x-auto">
                                <code className="text-xs sm:text-sm text-muted-foreground whitespace-pre">
                                    {currentSection.code}
                                </code>
                            </pre>
                        </div>
                    )}

                    {/* Interactive Visualizations based on topic */}
                    {topic.title.toLowerCase().includes('regression') && currentSectionIndex === 1 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Interactive Visualization</h3>
                            <RegressionPlot />
                        </div>
                    )}

                    {topic.title.toLowerCase().includes('clustering') && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Clustering Visualization</h3>
                            <ClusteringPlot />
                        </div>
                    )}

                    {topic.title.toLowerCase().includes('pca') && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">PCA 2D Projection</h3>
                            <PCAPlot />
                        </div>
                    )}
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentSectionIndex((i) => Math.max(0, i - 1))}
                        disabled={currentSectionIndex === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {isLastSection ? (
                        <Button
                            onClick={handleComplete}
                            disabled={isCompleting}
                            className="bg-gradient-primary hover:opacity-90 glow"
                        >
                            {isCompleting ? (
                                'Completing...'
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Completed
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentSectionIndex((i) => Math.min(sections.length - 1, i + 1))}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>

                {/* Section Navigation Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {sections.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSectionIndex(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                index === currentSectionIndex
                                    ? "bg-primary w-6"
                                    : index < currentSectionIndex
                                        ? "bg-primary/50"
                                        : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

// Simple Markdown-like content renderer
function MarkdownContent({ content }: { content: string }) {
    if (!content) return null;

    const lines = content.trim().split('\n');

    return (
        <div className="space-y-4">
            {lines.map((line, index) => {
                // Headers
                if (line.startsWith('### ')) {
                    return <h4 key={index} className="text-lg font-semibold mt-6">{line.slice(4)}</h4>;
                }
                if (line.startsWith('## ')) {
                    return <h3 key={index} className="text-xl font-semibold mt-6">{line.slice(3)}</h3>;
                }
                // List items
                if (line.startsWith('- ')) {
                    return (
                        <li key={index} className="ml-4 text-muted-foreground">
                            {line.slice(2)}
                        </li>
                    );
                }
                // Regular paragraph
                if (line.trim()) {
                    return <p key={index} className="text-muted-foreground leading-relaxed">{line}</p>;
                }
                return null;
            })}
        </div>
    );
}

// Interactive Regression Plot
function RegressionPlot() {
    const [slope, setSlope] = useState(1);
    const [intercept, setIntercept] = useState(0);

    // Generate sample data
    const xData = Array.from({ length: 20 }, (_, i) => i * 0.5);
    const yData = xData.map(x => 2 * x + 1 + (Math.random() - 0.5) * 3);
    const lineY = xData.map(x => slope * x + intercept);

    return (
        <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
                <Plot
                    data={[
                        {
                            x: xData,
                            y: yData,
                            type: 'scatter',
                            mode: 'markers',
                            name: 'Data Points',
                            marker: { color: '#8b5cf6', size: 10 },
                        },
                        {
                            x: xData,
                            y: lineY,
                            type: 'scatter',
                            mode: 'lines',
                            name: 'Regression Line',
                            line: { color: '#06b6d4', width: 3 },
                        },
                    ]}
                    layout={{
                        title: 'Interactive Linear Regression',
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        font: { color: '#a1a1aa' },
                        xaxis: { title: 'X', gridcolor: '#27272a' },
                        yaxis: { title: 'Y', gridcolor: '#27272a' },
                        showlegend: true,
                        legend: { x: 0, y: 1 },
                        margin: { t: 50, r: 20, b: 50, l: 50 },
                    } as any}
                    config={{ displayModeBar: false }}
                    style={{ width: '100%', height: 400 }}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-muted-foreground">Slope: {slope.toFixed(2)}</label>
                    <input
                        type="range"
                        min="-3"
                        max="5"
                        step="0.1"
                        value={slope}
                        onChange={(e) => setSlope(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="text-sm text-muted-foreground">Intercept: {intercept.toFixed(2)}</label>
                    <input
                        type="range"
                        min="-5"
                        max="10"
                        step="0.1"
                        value={intercept}
                        onChange={(e) => setIntercept(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}

// Clustering Plot
function ClusteringPlot() {
    // Generate clustered data
    const generateCluster = (cx: number, cy: number, n: number) => {
        return Array.from({ length: n }, () => ({
            x: cx + (Math.random() - 0.5) * 2,
            y: cy + (Math.random() - 0.5) * 2,
        }));
    };

    const cluster1 = generateCluster(2, 2, 30);
    const cluster2 = generateCluster(7, 7, 30);
    const cluster3 = generateCluster(2, 8, 30);

    return (
        <div className="bg-muted/50 rounded-lg p-4">
            <Plot
                data={[
                    {
                        x: cluster1.map(p => p.x),
                        y: cluster1.map(p => p.y),
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Cluster 1',
                        marker: { color: '#8b5cf6', size: 10 },
                    },
                    {
                        x: cluster2.map(p => p.x),
                        y: cluster2.map(p => p.y),
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Cluster 2',
                        marker: { color: '#06b6d4', size: 10 },
                    },
                    {
                        x: cluster3.map(p => p.x),
                        y: cluster3.map(p => p.y),
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Cluster 3',
                        marker: { color: '#f97316', size: 10 },
                    },
                ]}
                layout={{
                    title: 'K-Means Clustering Example',
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#a1a1aa' },
                    xaxis: { title: 'Feature 1', gridcolor: '#27272a' },
                    yaxis: { title: 'Feature 2', gridcolor: '#27272a' },
                    showlegend: true,
                    margin: { t: 50, r: 20, b: 50, l: 50 },
                } as any}
                config={{ displayModeBar: false }}
                style={{ width: '100%', height: 400 }}
            />
        </div>
    );
}

// PCA Plot
function PCAPlot() {
    // Simulated 2D PCA projection
    const generatePCAData = () => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            const category = i % 3;
            const pc1 = (Math.random() - 0.5) * 4 + (category - 1) * 3;
            const pc2 = (Math.random() - 0.5) * 2 + (category === 1 ? 1 : -1);
            data.push({ pc1, pc2, category });
        }
        return data;
    };

    const pcaData = generatePCAData();

    return (
        <div className="bg-muted/50 rounded-lg p-4">
            <Plot
                data={[0, 1, 2].map(cat => ({
                    x: pcaData.filter(d => d.category === cat).map(d => d.pc1),
                    y: pcaData.filter(d => d.category === cat).map(d => d.pc2),
                    type: 'scatter',
                    mode: 'markers',
                    name: `Class ${cat + 1}`,
                    marker: {
                        color: ['#8b5cf6', '#06b6d4', '#f97316'][cat],
                        size: 8,
                        opacity: 0.7,
                    },
                }))}
                layout={{
                    title: 'PCA 2D Projection',
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#a1a1aa' },
                    xaxis: { title: 'Principal Component 1', gridcolor: '#27272a' },
                    yaxis: { title: 'Principal Component 2', gridcolor: '#27272a' },
                    showlegend: true,
                    margin: { t: 50, r: 20, b: 50, l: 50 },
                } as any}
                config={{ displayModeBar: false }}
                style={{ width: '100%', height: 400 }}
            />
        </div>
    );
}

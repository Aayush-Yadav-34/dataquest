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
    ArrowRight,
    CheckCircle,
    Clock,
    Star,
    Zap,
    BookOpen,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { mockTopics, mockTheoryModules } from '@/lib/mockData';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function TheoryTopicPage() {
    const params = useParams();
    const router = useRouter();
    const topicId = params.id as string;
    const { addXP, addActivity } = useUserStore();

    const topic = mockTopics.find((t) => t.id === topicId);
    const theoryModule = mockTheoryModules[topicId];

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showXPAnimation, setShowXPAnimation] = useState(false);

    useEffect(() => {
        if (!topic) {
            router.push('/theory');
        }
    }, [topic, router]);

    if (!topic || !theoryModule) {
        return null;
    }

    const currentSection = theoryModule.sections[currentSectionIndex];
    const progress = ((currentSectionIndex + 1) / theoryModule.sections.length) * 100;
    const isLastSection = currentSectionIndex === theoryModule.sections.length - 1;

    const handleComplete = async () => {
        setIsCompleting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show XP animation
        setShowXPAnimation(true);
        addXP(topic.xpReward);
        addActivity({
            type: 'theory',
            title: `Completed ${topic.title}`,
            description: `Mastered the ${topic.title} module`,
            xpEarned: topic.xpReward,
        });

        toast.success('Topic Completed!', {
            description: `You earned ${topic.xpReward} XP!`,
        });

        setTimeout(() => {
            setShowXPAnimation(false);
            router.push('/theory');
        }, 2000);
    };

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
                                +{topic.xpReward} XP
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

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
                                    {topic.estimatedTime} min
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-primary" />
                                    +{topic.xpReward} XP
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    {theoryModule.sections.length} sections
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                                Section {currentSectionIndex + 1} of {theoryModule.sections.length}
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
                    className="glass-card p-8 mb-8"
                >
                    <h2 className="text-xl font-semibold mb-6">{currentSection.title}</h2>

                    {/* Markdown Content */}
                    <div className="prose prose-invert max-w-none">
                        <MarkdownContent content={currentSection.content} />
                    </div>

                    {/* Interactive Visualization */}
                    {currentSectionIndex === 1 && topicId === 'linear-regression' && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Interactive Visualization</h3>
                            <RegressionPlot />
                        </div>
                    )}

                    {topicId === 'clustering' && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Clustering Visualization</h3>
                            <ClusteringPlot />
                        </div>
                    )}

                    {topicId === 'pca' && (
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
                            onClick={() => setCurrentSectionIndex((i) => Math.min(theoryModule.sections.length - 1, i + 1))}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>

                {/* Section Navigation Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {theoryModule.sections.map((_, index) => (
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
    const lines = content.trim().split('\n');

    return (
        <div className="space-y-4">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                if (trimmed.startsWith('# ')) {
                    return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{trimmed.slice(2)}</h1>;
                }
                if (trimmed.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-semibold mt-5 mb-3">{trimmed.slice(3)}</h2>;
                }
                if (trimmed.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-medium mt-4 mb-2">{trimmed.slice(4)}</h3>;
                }
                if (trimmed.startsWith('- ')) {
                    return (
                        <li key={i} className="flex items-start gap-2 ml-4">
                            <span className="text-primary mt-1">•</span>
                            <span>{trimmed.slice(2)}</span>
                        </li>
                    );
                }
                if (trimmed.startsWith('```')) {
                    return null; // Skip code block markers
                }
                if (trimmed.length === 0) {
                    return <div key={i} className="h-2" />;
                }

                // Handle inline formatting
                const formatted = trimmed
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
                    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>');

                return (
                    <p
                        key={i}
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatted }}
                    />
                );
            })}
        </div>
    );
}

// Interactive Regression Plot
function RegressionPlot() {
    // Generate sample data
    const x = Array.from({ length: 50 }, (_, i) => i + Math.random() * 10);
    const y = x.map((xi) => 2 * xi + 10 + (Math.random() - 0.5) * 20);

    // Calculate regression line
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const lineX = [0, 60];
    const lineY = lineX.map((xi) => slope * xi + intercept);

    return (
        <div className="rounded-xl overflow-hidden bg-card/50 border border-border/50">
            <Plot
                data={[
                    {
                        x,
                        y,
                        mode: 'markers',
                        type: 'scatter',
                        name: 'Data Points',
                        marker: {
                            color: 'rgb(139, 92, 246)',
                            size: 8,
                            opacity: 0.7,
                        },
                    },
                    {
                        x: lineX,
                        y: lineY,
                        mode: 'lines',
                        type: 'scatter',
                        name: 'Regression Line',
                        line: {
                            color: 'rgb(34, 211, 238)',
                            width: 3,
                        },
                    },
                ]}
                layout={{
                    title: {
                        text: 'Linear Regression Visualization',
                        font: { color: '#e5e5e5' },
                    },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'rgba(0,0,0,0.2)',
                    xaxis: {
                        title: 'X',
                        gridcolor: 'rgba(255,255,255,0.1)',
                        color: '#a3a3a3',
                    },
                    yaxis: {
                        title: 'Y',
                        gridcolor: 'rgba(255,255,255,0.1)',
                        color: '#a3a3a3',
                    },
                    legend: {
                        font: { color: '#e5e5e5' },
                    },
                    margin: { t: 50, b: 50, l: 50, r: 30 },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '400px' }}
            />
        </div>
    );
}

// Clustering Plot
function ClusteringPlot() {
    // Generate clustered data
    const generateCluster = (cx: number, cy: number, n: number) => {
        return Array.from({ length: n }, () => ({
            x: cx + (Math.random() - 0.5) * 3,
            y: cy + (Math.random() - 0.5) * 3,
        }));
    };

    const cluster1 = generateCluster(2, 2, 30);
    const cluster2 = generateCluster(8, 8, 30);
    const cluster3 = generateCluster(2, 8, 30);

    return (
        <div className="rounded-xl overflow-hidden bg-card/50 border border-border/50">
            <Plot
                data={[
                    {
                        x: cluster1.map((p) => p.x),
                        y: cluster1.map((p) => p.y),
                        mode: 'markers',
                        type: 'scatter',
                        name: 'Cluster 1',
                        marker: { color: 'rgb(139, 92, 246)', size: 10 },
                    },
                    {
                        x: cluster2.map((p) => p.x),
                        y: cluster2.map((p) => p.y),
                        mode: 'markers',
                        type: 'scatter',
                        name: 'Cluster 2',
                        marker: { color: 'rgb(34, 211, 238)', size: 10 },
                    },
                    {
                        x: cluster3.map((p) => p.x),
                        y: cluster3.map((p) => p.y),
                        mode: 'markers',
                        type: 'scatter',
                        name: 'Cluster 3',
                        marker: { color: 'rgb(52, 211, 153)', size: 10 },
                    },
                ]}
                layout={{
                    title: {
                        text: 'K-Means Clustering',
                        font: { color: '#e5e5e5' },
                    },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'rgba(0,0,0,0.2)',
                    xaxis: { gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                    yaxis: { gridcolor: 'rgba(255,255,255,0.1)', color: '#a3a3a3' },
                    legend: { font: { color: '#e5e5e5' } },
                    margin: { t: 50, b: 50, l: 50, r: 30 },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '400px' }}
            />
        </div>
    );
}

// PCA Plot
function PCAPlot() {
    // Simulated 2D PCA projection
    const generatePCAData = () => {
        const data = [];
        const classes = ['Class A', 'Class B', 'Class C'];
        const colors = ['rgb(139, 92, 246)', 'rgb(34, 211, 238)', 'rgb(251, 146, 60)'];

        for (let c = 0; c < 3; c++) {
            const cx = (c - 1) * 3;
            const cy = Math.sin(c * 2) * 2;

            data.push({
                x: Array.from({ length: 40 }, () => cx + (Math.random() - 0.5) * 4),
                y: Array.from({ length: 40 }, () => cy + (Math.random() - 0.5) * 4),
                mode: 'markers',
                type: 'scatter',
                name: classes[c],
                marker: { color: colors[c], size: 8, opacity: 0.8 },
            });
        }
        return data;
    };

    return (
        <div className="rounded-xl overflow-hidden bg-card/50 border border-border/50">
            <Plot
                data={generatePCAData() as Plotly.Data[]}
                layout={{
                    title: {
                        text: 'PCA 2D Projection',
                        font: { color: '#e5e5e5' },
                    },
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'rgba(0,0,0,0.2)',
                    xaxis: {
                        title: 'Principal Component 1',
                        gridcolor: 'rgba(255,255,255,0.1)',
                        color: '#a3a3a3',
                    },
                    yaxis: {
                        title: 'Principal Component 2',
                        gridcolor: 'rgba(255,255,255,0.1)',
                        color: '#a3a3a3',
                    },
                    legend: { font: { color: '#e5e5e5' } },
                    margin: { t: 50, b: 50, l: 60, r: 30 },
                }}
                config={{ responsive: true, displayModeBar: false }}
                style={{ width: '100%', height: '400px' }}
            />
        </div>
    );
}

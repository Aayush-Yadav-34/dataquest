'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    ArrowRight,
    Timer,
    CheckCircle,
    XCircle,
    Trophy,
    Zap,
    Target,
    RefreshCw,
    ChevronRight,
    Clock,
    Star,
    Brain,
} from 'lucide-react';
import { mockQuizzes, mockQuizQuestions, mockTopics } from '@/lib/mockData';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { QuizQuestion } from '@/types';

type QuizState = 'selection' | 'in-progress' | 'completed';

export default function QuizPage() {
    const { updateXP, addActivity } = useUserStore();
    const [quizState, setQuizState] = useState<QuizState>('selection');
    const [selectedQuiz, setSelectedQuiz] = useState<typeof mockQuizzes[0] | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showXPAnimation, setShowXPAnimation] = useState(false);

    // Timer effect
    useEffect(() => {
        if (quizState !== 'in-progress' || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleQuizComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizState, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startQuiz = (quiz: typeof mockQuizzes[0]) => {
        setSelectedQuiz(quiz);
        setQuizState('in-progress');
        setCurrentQuestionIndex(0);
        setSelectedAnswers(new Array(quiz.questions.length).fill(null));
        setTimeLeft(quiz.timeLimit);
        setShowExplanation(false);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (showExplanation) return;

        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = answerIndex;
        setSelectedAnswers(newAnswers);
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        setShowExplanation(false);
        if (currentQuestionIndex < (selectedQuiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            handleQuizComplete();
        }
    };

    const handleQuizComplete = useCallback(() => {
        if (!selectedQuiz) return;

        setQuizState('completed');

        // Calculate results
        const correctCount = selectedAnswers.filter(
            (answer, i) => answer === selectedQuiz.questions[i].correctAnswer
        ).length;
        const accuracy = (correctCount / selectedQuiz.questions.length) * 100;
        const passed = accuracy >= selectedQuiz.passingScore;
        const xpEarned = passed ? selectedQuiz.xpReward : Math.floor(selectedQuiz.xpReward * 0.3);

        // Award XP
        if (passed) {
            setShowXPAnimation(true);
            setTimeout(() => setShowXPAnimation(false), 2000);
        }

        updateXP(xpEarned);
        addActivity({
            id: Date.now().toString(),
            type: 'quiz',
            title: `${passed ? 'Passed' : 'Completed'} ${selectedQuiz.title}`,
            description: `Scored ${accuracy.toFixed(0)}% (${correctCount}/${selectedQuiz.questions.length})`,
            xpEarned,
            timestamp: new Date(),
        });

        toast.success(passed ? 'Quiz Passed!' : 'Quiz Completed', {
            description: `You earned ${xpEarned} XP!`,
        });
    }, [selectedQuiz, selectedAnswers, updateXP, addActivity]);

    const resetQuiz = () => {
        setQuizState('selection');
        setSelectedQuiz(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setTimeLeft(0);
        setShowExplanation(false);
    };

    // Calculate results for completed state
    const results = selectedQuiz ? {
        correctCount: selectedAnswers.filter(
            (answer, i) => answer === selectedQuiz.questions[i].correctAnswer
        ).length,
        totalQuestions: selectedQuiz.questions.length,
        accuracy: (selectedAnswers.filter(
            (answer, i) => answer === selectedQuiz.questions[i].correctAnswer
        ).length / selectedQuiz.questions.length) * 100,
        passed: (selectedAnswers.filter(
            (answer, i) => answer === selectedQuiz.questions[i].correctAnswer
        ).length / selectedQuiz.questions.length) * 100 >= selectedQuiz.passingScore,
        xpEarned: (selectedAnswers.filter(
            (answer, i) => answer === selectedQuiz.questions[i].correctAnswer
        ).length / selectedQuiz.questions.length) * 100 >= selectedQuiz.passingScore
            ? selectedQuiz.xpReward
            : Math.floor(selectedQuiz.xpReward * 0.3),
    } : null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* XP Animation Overlay */}
            <AnimatePresence>
                {showXPAnimation && selectedQuiz && (
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
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center glow"
                            >
                                <Trophy className="w-16 h-16 text-white" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-bold text-gradient mb-2"
                            >
                                Quiz Passed!
                            </motion.h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Quiz Selection */}
                {quizState === 'selection' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                <span className="text-gradient">Quiz Arena</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Test your knowledge and earn XP!
                            </p>
                        </div>

                        {/* Quick Quiz */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-primary" />
                                Quick Quizzes
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {mockQuizzes.map((quiz) => {
                                    const topic = mockTopics.find((t) => t.id === quiz.topicId);
                                    return (
                                        <motion.div
                                            key={quiz.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => startQuiz(quiz)}
                                            className="glass-card p-6 cursor-pointer hover:border-primary/50 transition-all"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl flex-shrink-0">
                                                    {topic?.icon || '❓'}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1">{quiz.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Target className="w-4 h-4" />
                                                            {quiz.questions.length} questions
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {Math.floor(quiz.timeLimit / 60)}m
                                                        </span>
                                                        <span className="flex items-center gap-1 text-primary">
                                                            <Star className="w-4 h-4" />
                                                            +{quiz.xpReward} XP
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* All Questions Quiz */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Challenge Mode
                            </h2>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => startQuiz({
                                    id: 'challenge',
                                    topicId: 'all',
                                    title: 'Ultimate ML Challenge',
                                    description: 'Test all your ML knowledge',
                                    questions: mockQuizQuestions,
                                    timeLimit: 600,
                                    xpReward: 200,
                                    passingScore: 70,
                                })}
                                className="glass-card p-6 cursor-pointer hover:border-primary/50 transition-all border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-3xl glow">
                                        🏆
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-1">Ultimate ML Challenge</h3>
                                        <p className="text-muted-foreground mb-2">
                                            All questions, more time, bigger rewards!
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-4 h-4" />
                                                {mockQuizQuestions.length} questions
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                10 min
                                            </span>
                                            <span className="flex items-center gap-1 text-primary font-semibold">
                                                <Zap className="w-4 h-4" />
                                                +200 XP
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-primary" />
                                </div>
                            </motion.div>
                        </section>
                    </motion.div>
                )}

                {/* In Progress */}
                {quizState === 'in-progress' && selectedQuiz && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">{selectedQuiz.title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                                </p>
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold",
                                timeLeft <= 30 ? "bg-red-500/20 text-red-500" : "bg-primary/20 text-primary"
                            )}>
                                <Timer className="w-5 h-5" />
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Progress */}
                        <Progress
                            value={((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}
                            className="h-2"
                        />

                        {/* Question Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <QuestionCard
                                    question={selectedQuiz.questions[currentQuestionIndex]}
                                    selectedAnswer={selectedAnswers[currentQuestionIndex]}
                                    showExplanation={showExplanation}
                                    onSelectAnswer={handleAnswerSelect}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Button
                                    onClick={handleNextQuestion}
                                    className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90"
                                >
                                    {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                                        <>Next Question <ArrowRight className="w-5 h-5 ml-2" /></>
                                    ) : (
                                        <>View Results <Trophy className="w-5 h-5 ml-2" /></>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Completed */}
                {quizState === 'completed' && selectedQuiz && results && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="glass-card p-8">
                            {/* Result Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className={cn(
                                    "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6",
                                    results.passed ? "bg-emerald-500/20" : "bg-amber-500/20"
                                )}
                            >
                                {results.passed ? (
                                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                                ) : (
                                    <Target className="w-12 h-12 text-amber-500" />
                                )}
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-2">
                                {results.passed ? 'Congratulations!' : 'Quiz Complete!'}
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                {results.passed
                                    ? 'You passed the quiz with flying colors!'
                                    : 'Keep practicing to improve your score.'}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="glass-card p-4">
                                    <div className="text-3xl font-bold text-primary">{results.accuracy.toFixed(0)}%</div>
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                </div>
                                <div className="glass-card p-4">
                                    <div className="text-3xl font-bold text-accent">
                                        {results.correctCount}/{results.totalQuestions}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Correct</p>
                                </div>
                                <div className="glass-card p-4">
                                    <div className="text-3xl font-bold text-gradient flex items-center justify-center gap-1">
                                        <Zap className="w-6 h-6" />
                                        {results.xpEarned}
                                    </div>
                                    <p className="text-sm text-muted-foreground">XP Earned</p>
                                </div>
                            </div>

                            {/* Question Summary */}
                            <div className="flex justify-center gap-2 mb-8">
                                {selectedQuiz.questions.map((q, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                                            selectedAnswers[i] === q.correctAnswer
                                                ? "bg-emerald-500/20 text-emerald-500"
                                                : "bg-red-500/20 text-red-500"
                                        )}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="outline" onClick={resetQuiz}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Another Quiz
                                </Button>
                                <Button
                                    onClick={() => startQuiz(selectedQuiz)}
                                    className="bg-gradient-primary hover:opacity-90"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Retry This Quiz
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

interface QuestionCardProps {
    question: QuizQuestion;
    selectedAnswer: number | null;
    showExplanation: boolean;
    onSelectAnswer: (index: number) => void;
}

function QuestionCard({ question, selectedAnswer, showExplanation, onSelectAnswer }: QuestionCardProps) {
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-6">
                {/* Difficulty Badge */}
                <span className={cn(
                    "inline-block text-xs px-2 py-1 rounded-full",
                    question.difficulty === 'easy' && "bg-emerald-500/20 text-emerald-500",
                    question.difficulty === 'medium' && "bg-amber-500/20 text-amber-500",
                    question.difficulty === 'hard' && "bg-red-500/20 text-red-500",
                )}>
                    {question.difficulty}
                </span>

                {/* Question */}
                <h3 className="text-xl font-semibold">{question.question}</h3>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrectAnswer = index === question.correctAnswer;

                        return (
                            <motion.button
                                key={index}
                                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                                onClick={() => onSelectAnswer(index)}
                                disabled={showExplanation}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                                    !showExplanation && "hover:border-primary/50 cursor-pointer",
                                    showExplanation && isCorrectAnswer && "border-emerald-500 bg-emerald-500/10",
                                    showExplanation && isSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10",
                                    !showExplanation && isSelected && "border-primary bg-primary/10",
                                    !showExplanation && !isSelected && "border-border hover:bg-muted/50",
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0",
                                    showExplanation && isCorrectAnswer && "bg-emerald-500 text-white",
                                    showExplanation && isSelected && !isCorrectAnswer && "bg-red-500 text-white",
                                    !showExplanation && isSelected && "bg-primary text-white",
                                    ((!showExplanation && !isSelected) || (showExplanation && !isCorrectAnswer && !isSelected)) && "bg-muted",
                                )}>
                                    {showExplanation && isCorrectAnswer ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : showExplanation && isSelected && !isCorrectAnswer ? (
                                        <XCircle className="w-5 h-5" />
                                    ) : (
                                        String.fromCharCode(65 + index)
                                    )}
                                </div>
                                <span className="flex-1">{option}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={cn(
                                "p-4 rounded-xl border",
                                isCorrect
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-amber-500/10 border-amber-500/30"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <p className={cn(
                                        "font-semibold mb-1",
                                        isCorrect ? "text-emerald-500" : "text-amber-500"
                                    )}>
                                        {isCorrect ? 'Correct!' : 'Not quite right'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{question.explanation}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
    id: string;
    title: string;
    timeLimit: number;
    xpReward: number;
    topicId: string;
    passingScore: number;
    questionCount: number;
    topic?: {
        id: string;
        title: string;
        icon: string;
        category: string;
        difficulty: string;
    };
    questions?: QuizQuestion[];
}

export interface QuizSubmitResult {
    success: boolean;
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    xpEarned: number;
    newXP: number;
    newLevel: number;
    newBadges?: { id: string; name: string; icon: string; description: string }[];
}

interface UseQuizzesReturn {
    quizzes: Quiz[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useQuizzes(topicId?: string): UseQuizzesReturn {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchQuizzes = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const url = topicId
                ? `/api/quizzes?topicId=${topicId}`
                : '/api/quizzes';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch quizzes');
            }

            const data = await response.json();
            setQuizzes(data.quizzes || []);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, [topicId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    return { quizzes, isLoading, error, refetch: fetchQuizzes };
}

interface UseQuizReturn {
    quiz: Quiz | null;
    isLoading: boolean;
    error: Error | null;
    submitQuiz: (answers: number[], timeTaken: number) => Promise<QuizSubmitResult | null>;
}

export function useQuiz(quizId: string | null): UseQuizReturn {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!quizId) {
            setQuiz(null);
            return;
        }

        const fetchQuiz = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/quizzes/${quizId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch quiz');
                }

                const data = await response.json();
                setQuiz(data.quiz);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const submitQuiz = useCallback(async (answers: number[], timeTaken: number): Promise<QuizSubmitResult | null> => {
        if (!quizId) return null;

        try {
            const response = await fetch(`/api/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers, timeTaken }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }

            const result = await response.json();

            // Show badge toasts for newly earned badges
            if (result.newBadges && result.newBadges.length > 0) {
                setTimeout(() => {
                    result.newBadges.forEach((badge: any, index: number) => {
                        setTimeout(() => {
                            toast.success(`${badge.icon} Badge Earned: ${badge.name}`, {
                                description: badge.description,
                                duration: 5000,
                            });
                        }, index * 1000);
                    });
                }, 1500); // Delay so quiz result renders first
            }

            return result;
        } catch (err) {
            console.error('Error submitting quiz:', err);
            return null;
        }
    }, [quizId]);

    return { quiz, isLoading, error, submitQuiz };
}

'use client';

import { useState, useEffect } from 'react';

interface TopicProgress {
    id: string;
    topic_id: string;
    completed: boolean;
    progress: number;
    last_accessed: string;
    topics: {
        id: string;
        title: string;
        icon: string;
    };
}

interface QuizAttempt {
    id: string;
    quiz_id: string;
    score: number;
    total_questions: number;
    completed_at: string;
    quizzes: {
        id: string;
        title: string;
        topic_id: string;
    };
}

interface ProgressData {
    progress: {
        topics: TopicProgress[];
        quizAttempts: QuizAttempt[];
    };
    stats: {
        completedTopics: number;
        totalTopics: number;
        passedQuizzes: number;
        totalQuizzes: number;
        totalQuizAttempts: number;
        averageAccuracy: number;
    };
}

interface SkillData {
    topic: string;
    icon: string;
    score: number;
}

interface AccuracyTrend {
    date: string;
    accuracy: number;
}

interface TimeSpentData {
    topic: string;
    hours: number;
}

interface StatsData {
    skillsData: SkillData[];
    accuracyTrend: AccuracyTrend[];
    timeSpentData: TimeSpentData[];
    summary: {
        completedTopics: number;
        totalTopics: number;
        totalQuizzes: number;
        averageAccuracy: number;
        totalHours: number;
    };
}

export function useUserProgress() {
    const [data, setData] = useState<ProgressData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProgress = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/user/progress');

            if (!response.ok) {
                throw new Error('Failed to fetch progress');
            }

            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch progress');
        } finally {
            setIsLoading(false);
        }
    };

    const updateTopicProgress = async (
        topicId: string,
        progressPercent: number,
        completed: boolean
    ) => {
        try {
            const response = await fetch('/api/user/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topicId, progressPercent, completed }),
            });

            if (!response.ok) {
                throw new Error('Failed to update progress');
            }

            // Refetch to update state
            await fetchProgress();
            return true;
        } catch (err) {
            console.error('Error updating progress:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    return {
        progress: data?.progress,
        stats: data?.stats,
        isLoading,
        error,
        refetch: fetchProgress,
        updateTopicProgress,
    };
}

export function useUserStats() {
    const [data, setData] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/user/stats');

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        skillsData: data?.skillsData || [],
        accuracyTrend: data?.accuracyTrend || [],
        timeSpentData: data?.timeSpentData || [],
        summary: data?.summary,
        isLoading,
        error,
        refetch: fetchStats,
    };
}

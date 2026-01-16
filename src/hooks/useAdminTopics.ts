'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AdminTopic {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    icon: string;
    xp_reward: number;
    estimated_time: number;
    content: unknown[];
    order_index: number;
    locked: boolean;
    questionsCount: number;
    studentsCompleted: number;
}

export function useAdminTopics() {
    const [topics, setTopics] = useState<AdminTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopics = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/topics');

            if (response.ok) {
                const data = await response.json();
                setTopics(data.topics);
            } else if (response.status === 401 || response.status === 403) {
                setError('Admin access required');
            } else {
                throw new Error('Failed to fetch topics');
            }
        } catch (err) {
            console.error('Error fetching admin topics:', err);
            setError('Failed to load topics');
            setTopics([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    return { topics, isLoading, error, refetch: fetchTopics };
}

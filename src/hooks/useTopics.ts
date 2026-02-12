'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface Topic {
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
    // Frontend-specific fields
    progress?: number;
    locked?: boolean;
}

interface UseTopicsOptions {
    category?: string;
    difficulty?: string;
}

export function useTopics(options?: UseTopicsOptions) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopics = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Try API route first
            const params = new URLSearchParams();
            if (options?.category) params.set('category', options.category);
            if (options?.difficulty) params.set('difficulty', options.difficulty);

            const response = await fetch(`/api/topics?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();
                // Add frontend-specific fields, preserve locked from database
                const enrichedTopics = data.topics.map((topic: Topic) => ({
                    ...topic,
                    progress: topic.progress ?? 0,
                    locked: topic.locked ?? false,
                }));
                setTopics(enrichedTopics);
            } else {
                throw new Error('Failed to fetch topics');
            }
        } catch (err) {
            console.error('Error fetching topics:', err);
            setError('Failed to load topics');
            // Fallback to empty array
            setTopics([]);
        } finally {
            setIsLoading(false);
        }
    }, [options?.category, options?.difficulty]);

    useEffect(() => {
        fetchTopics();
    }, [fetchTopics]);

    return { topics, isLoading, error, refetch: fetchTopics };
}

export function useTopic(id: string) {
    const [topic, setTopic] = useState<Topic | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTopic() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/topics/${id}`);

                if (response.ok) {
                    const data = await response.json();
                    setTopic(data.topic);
                } else if (response.status === 404) {
                    setError('Topic not found');
                } else {
                    throw new Error('Failed to fetch topic');
                }
            } catch (err) {
                console.error('Error fetching topic:', err);
                setError('Failed to load topic');
            } finally {
                setIsLoading(false);
            }
        }

        if (id) {
            fetchTopic();
        }
    }, [id]);

    return { topic, isLoading, error };
}

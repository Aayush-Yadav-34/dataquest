'use client';

import { useState, useEffect, useCallback } from 'react';

export interface LeaderboardUser {
    id: string;
    username: string;
    avatar_url?: string;
    xp: number;
    weekly_xp?: number;
    level: number;
    streak: number;
    rank: number;
    rankChange?: number;
    isCurrentUser?: boolean;
}

interface UseLeaderboardOptions {
    type?: 'global' | 'weekly';
    limit?: number;
}

export function useLeaderboard(options?: UseLeaderboardOptions) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options?.type) params.set('type', options.type);
            if (options?.limit) params.set('limit', options.limit.toString());

            const response = await fetch(`/api/leaderboard?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data.leaderboard || []);
                setCurrentUserRank(data.currentUserRank || null);
            } else {
                throw new Error('Failed to fetch leaderboard');
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard');
            setLeaderboard([]);
        } finally {
            setIsLoading(false);
        }
    }, [options?.type, options?.limit]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    return {
        leaderboard,
        currentUserRank,
        isLoading,
        error,
        refetch: fetchLeaderboard
    };
}

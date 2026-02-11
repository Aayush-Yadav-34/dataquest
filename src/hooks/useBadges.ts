'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    criteria_type: string;
    criteria_value: number;
    earned: boolean;
    earned_at: string | null;
}

interface NewBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export function useBadges() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBadges = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/badges');

            if (!response.ok) {
                throw new Error('Failed to fetch badges');
            }

            const data = await response.json();
            setBadges(data.badges || []);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch badges');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const checkAndAwardBadges = useCallback(async () => {
        try {
            const response = await fetch('/api/badges/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) return [];

            const data = await response.json();
            const newBadges: NewBadge[] = data.newBadges || [];

            // Show toast for each new badge
            newBadges.forEach((badge) => {
                toast.success(`🎉 Badge Earned: ${badge.name}`, {
                    description: badge.description,
                    duration: 5000,
                    icon: badge.icon,
                });
            });

            // Refetch badges to update state
            if (newBadges.length > 0) {
                await fetchBadges();
            }

            return newBadges;
        } catch (err) {
            console.error('Error checking badges:', err);
            return [];
        }
    }, [fetchBadges]);

    useEffect(() => {
        fetchBadges();
    }, [fetchBadges]);

    return {
        badges,
        earnedBadges: badges.filter((b) => b.earned),
        lockedBadges: badges.filter((b) => !b.earned),
        isLoading,
        error,
        refetch: fetchBadges,
        checkAndAwardBadges,
    };
}

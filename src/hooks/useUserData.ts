'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserData {
    username: string;
    email: string;
    avatar_url?: string;
    xp: number;
    level: number;
    streak: number;
    xpProgress: number;
    xpToNextLevel: number;
}

interface UseUserDataReturn {
    userData: UserData | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook to fetch fresh user data from the database
 * This should be used instead of session data for user display
 * as session data is only set at login time
 */
export function useUserData(): UseUserDataReturn {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/users/xp');

            if (!response.ok) {
                if (response.status === 401) {
                    // Not authenticated - this is expected for non-logged-in users
                    setUserData(null);
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserData({
                username: data.username,
                email: data.email,
                avatar_url: data.avatar_url,
                xp: data.xp,
                level: data.level,
                streak: data.streak,
                xpProgress: data.xpProgress,
                xpToNextLevel: data.xpToNextLevel,
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return {
        userData,
        isLoading,
        error,
        refetch: fetchUserData,
    };
}

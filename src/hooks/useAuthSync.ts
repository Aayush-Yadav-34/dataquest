'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUserStore } from '@/store/userStore';

/**
 * Hook to sync NextAuth session with Zustand store
 * This allows both mock login and real OAuth to work together
 */
export function useAuthSync() {
    const { data: session, status } = useSession();
    const { setProfile, setAuthenticated, setLoading, profile } = useUserStore();

    useEffect(() => {
        // If NextAuth has a session, sync it to the store
        if (status === 'authenticated' && session?.user) {
            const sessionUser = session.user;

            // Only update if different from current profile
            if (!profile || profile.email !== sessionUser.email) {
                setProfile({
                    id: sessionUser.id || 'session-user',
                    email: sessionUser.email || '',
                    username: sessionUser.username || sessionUser.name || 'User',
                    avatar: sessionUser.image || undefined,
                    xp: sessionUser.xp || 0,
                    level: sessionUser.level || 1,
                    streak: sessionUser.streak || 0,
                    role: (sessionUser.role as 'user' | 'admin') || 'user',
                    joinedDate: new Date().toISOString(),
                });
            }
        }

        // Update loading state
        setLoading(status === 'loading');
    }, [session, status, profile, setProfile, setAuthenticated, setLoading]);

    // Combined logout function
    const logout = async () => {
        // Clear Zustand store
        useUserStore.getState().logout();

        // Sign out from NextAuth
        await signOut({ redirect: false });
    };

    return {
        session,
        status,
        isAuthenticated: status === 'authenticated' || useUserStore.getState().isAuthenticated,
        logout,
    };
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, profile, isLoading } = useUserStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Wait for zustand hydration
        const timer = setTimeout(() => {
            setIsHydrated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isHydrated || isLoading) return;

        if (!isAuthenticated) {
            toast.error('Please login first', {
                description: 'You need to be logged in to access this page.',
            });
            router.push('/login');
        } else if (requireAdmin && profile?.role !== 'admin') {
            toast.error('Access Denied', {
                description: 'You do not have permission to access this page.',
            });
            router.push('/dashboard');
        }
    }, [isAuthenticated, profile, requireAdmin, router, isHydrated, isLoading]);

    // Show loading while checking auth
    if (!isHydrated || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Show access denied for non-authenticated users
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center glass-card p-12 max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Login Required</h1>
                    <p className="text-muted-foreground mb-6">
                        Please login to access this page.
                    </p>
                    <Button onClick={() => router.push('/login')}>
                        Go to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Show access denied for non-admin users trying to access admin pages
    if (requireAdmin && profile?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center glass-card p-12 max-w-md"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">
                        You do not have permission to access this page.
                    </p>
                    <Button onClick={() => router.push('/dashboard')}>
                        Go to Dashboard
                    </Button>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}

export default AuthGuard;

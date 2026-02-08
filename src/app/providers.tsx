'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wrench, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProvidersProps {
    children: ReactNode;
}

function MaintenanceWrapper({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);

    // Pages that should always be accessible during maintenance
    const bypassPaths = ['/login', '/api'];

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                // Check public settings for maintenance mode
                const settingsRes = await fetch('/api/settings/public');
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setMaintenanceMode(data.settings?.maintenance_mode === true);
                }

                // Check if user is admin
                if (status === 'authenticated' && session?.user?.email) {
                    const userRes = await fetch('/api/user/profile');
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setIsAdmin(userData.user?.role === 'admin');
                    }
                }
            } catch (error) {
                console.error('Error checking maintenance status:', error);
            } finally {
                setChecking(false);
            }
        };

        if (status !== 'loading') {
            checkMaintenance();
        }
    }, [status, session]);

    // Show nothing while checking
    if (checking || status === 'loading') {
        return <>{children}</>;
    }

    // Allow bypass paths (login, api routes)
    const shouldBypass = bypassPaths.some(path => pathname?.startsWith(path));

    // If maintenance mode is on and user is not admin and not on bypass path, show maintenance page
    if (maintenanceMode && !isAdmin && !shouldBypass) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md px-6"
                >
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Wrench className="w-12 h-12 text-amber-500 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-amber-500/10 animate-ping" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Under Maintenance</h1>
                    <p className="text-muted-foreground mb-8">
                        We're currently performing scheduled maintenance to improve your experience.
                        Please check back shortly.
                    </p>

                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh Page
                    </Button>

                    <p className="text-sm text-muted-foreground mt-8">
                        We apologize for any inconvenience.
                    </p>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <MaintenanceWrapper>
                {children}
            </MaintenanceWrapper>
        </SessionProvider>
    );
}


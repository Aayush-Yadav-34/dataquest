'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Wrench } from 'lucide-react';

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    if (data.settings && typeof data.settings.maintenance_mode !== 'undefined') {
                        setIsMaintenanceMode(data.settings.maintenance_mode === true || data.settings.maintenance_mode === 'true');
                    }
                }
            } catch (error) {
                console.error('Failed to check maintenance mode:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkMaintenance();

        // Re-check every minute
        const interval = setInterval(checkMaintenance, 60000);
        return () => clearInterval(interval);
    }, []);

    // Allow access to login, admin, and api routes even in maintenance mode
    // (Admin routes are protected by server-side checks anyway, but we want admins to be able to login)
    // Actually, we want to block everything for non-admins except login.
    const isPublicRoute = pathname === '/login' || pathname.startsWith('/api/auth');
    const isAdmin = session?.user?.role === 'admin';

    if (isLoading) {
        return <>{children}</>;
    }

    if (isMaintenanceMode && !isAdmin && !isPublicRoute) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Wrench className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto mb-8">
                    We are currently performing scheduled maintenance to improve your experience. Please check back soon.
                </p>
                <div className="text-sm text-muted-foreground">
                    Estimated duration: ~1 hour
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

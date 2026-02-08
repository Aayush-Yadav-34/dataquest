'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { MaintenanceCheck } from '@/components/auth/MaintenanceCheck';
import { SessionTracker } from '@/components/auth/SessionTracker';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <MaintenanceCheck>
                <SessionTracker>
                    {children}
                </SessionTracker>
            </MaintenanceCheck>
        </SessionProvider>
    );
}

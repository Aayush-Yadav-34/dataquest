'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

export function SessionTracker({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [isActive, setIsActive] = useState(false);
    const lastActivityRef = useRef<number>(Date.now());
    const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const accumulatedSecondsRef = useRef<number>(0);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Activity listeners
    useEffect(() => {
        if (!session?.user) return;

        const handleActivity = () => {
            lastActivityRef.current = Date.now();
            if (!isActive) {
                setIsActive(true);
            }
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, handleActivity));

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [session, isActive]);

    // Check activity status periodically (e.g., every 5 seconds)
    useEffect(() => {
        if (!session?.user) return;

        trackingIntervalRef.current = setInterval(() => {
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivityRef.current;

            // If active within last 5 minutes (300000ms)
            if (timeSinceLastActivity < 300000) {
                setIsActive(true);
                accumulatedSecondsRef.current += 5; // Add 5 seconds
            } else {
                setIsActive(false);
            }
        }, 5000);

        return () => {
            if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
        };
    }, [session]);

    // Send heartbeat every minute
    useEffect(() => {
        if (!session?.user) return;

        const sendHeartbeat = async () => {
            const seconds = accumulatedSecondsRef.current;
            if (seconds > 0) {
                try {
                    await fetch('/api/user/session/heartbeat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ seconds }),
                    });
                    accumulatedSecondsRef.current = 0; // Reset after successful send
                } catch (error) {
                    console.error('Failed to send session heartbeat', error);
                }
            }
        };

        heartbeatIntervalRef.current = setInterval(sendHeartbeat, 60000); // Every minute

        // Send remaining time on unmount or tab close
        const handleUnamt = () => {
            if (accumulatedSecondsRef.current > 0) {
                const data = JSON.stringify({ seconds: accumulatedSecondsRef.current });
                if (navigator.sendBeacon) {
                    const blob = new Blob([data], { type: 'application/json' });
                    navigator.sendBeacon('/api/user/session/heartbeat', blob);
                }
            }
        };

        window.addEventListener('beforeunload', handleUnamt);

        return () => {
            if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
            window.removeEventListener('beforeunload', handleUnamt);
        };
    }, [session]);

    // Lazy cron trigger for weekly reset
    useEffect(() => {
        if (!session?.user) return;

        const checkCron = async () => {
            const lastCheck = localStorage.getItem('last_cron_check');
            const now = Date.now();

            // Check at most once per hour per client
            if (!lastCheck || now - parseInt(lastCheck) > 3600000) {
                try {
                    // Fire and forget
                    fetch('/api/cron/weekly-reset');
                    localStorage.setItem('last_cron_check', now.toString());
                } catch (e) {
                    // Ignore errors
                }
            }
        };

        checkCron();
    }, [session]);

    return <>{children}</>;
}

'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
    variant?: 'card' | 'list' | 'table' | 'chart' | 'profile';
    count?: number;
    className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className }: LoadingSkeletonProps) {
    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <div className={cn(
            'grid gap-4',
            variant === 'card' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            variant === 'list' && 'grid-cols-1',
            className
        )}>
            {items.map((i) => {
                switch (variant) {
                    case 'card':
                        return <CardSkeleton key={i} />;
                    case 'list':
                        return <ListItemSkeleton key={i} />;
                    case 'table':
                        return <TableRowSkeleton key={i} />;
                    case 'chart':
                        return <ChartSkeleton key={i} />;
                    case 'profile':
                        return <ProfileSkeleton key={i} />;
                    default:
                        return <CardSkeleton key={i} />;
                }
            })}
        </div>
    );
}

function CardSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-border/50 p-6 space-y-4"
        >
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
        </motion.div>
    );
}

function ListItemSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 rounded-xl border border-border/50 p-4"
        >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-20" />
        </motion.div>
    );
}

function TableRowSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 py-3 border-b border-border/30"
        >
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-4 w-16" />
        </motion.div>
    );
}

function ChartSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-border/50 p-6 space-y-4"
        >
            <Skeleton className="h-5 w-40" />
            <div className="flex items-end justify-between h-48 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1"
                        style={{ height: `${30 + Math.random() * 60}%` }}
                    />
                ))}
            </div>
        </motion.div>
    );
}

function ProfileSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
            </div>
        </motion.div>
    );
}

// Page loading component
export function PageLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <span className="text-2xl">⚡</span>
                </motion.div>
                <p className="text-sm text-muted-foreground">Loading...</p>
            </motion.div>
        </div>
    );
}

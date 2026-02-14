'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        positive: boolean;
    };
    variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
    className?: string;
}

const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary/10 border-primary/20',
    accent: 'bg-accent/10 border-accent/20',
    success: 'bg-emerald-500/10 border-emerald-500/20',
    warning: 'bg-orange-500/10 border-orange-500/20',
};

const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
    success: 'bg-emerald-500/20 text-emerald-500',
    warning: 'bg-orange-500/20 text-orange-500',
};

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
    className,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                'relative overflow-hidden rounded-2xl border p-4 sm:p-6 transition-all hover:shadow-lg',
                variantStyles[variant],
                className
            )}
        >
            {/* Background glow effect */}
            {variant !== 'default' && (
                <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            )}

            <div className="relative flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</h3>
                        {trend && (
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    trend.positive ? 'text-emerald-500' : 'text-red-500'
                                )}
                            >
                                {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                <div className={cn('rounded-xl p-3', iconStyles[variant])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </motion.div>
    );
}

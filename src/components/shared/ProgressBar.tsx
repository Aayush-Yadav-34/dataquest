'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XPProgressBarProps {
    currentXP: number;
    level: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
    className?: string;
}

export function XPProgressBar({
    currentXP,
    level,
    showLabel = true,
    size = 'md',
    animated = true,
    className,
}: XPProgressBarProps) {
    // Calculate XP thresholds
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    const sizeStyles = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Level {level}</span>
                        <span className="text-xs text-muted-foreground">
                            {xpInCurrentLevel.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP
                        </span>
                    </div>
                    <span className="text-sm font-medium text-primary">
                        Level {level + 1}
                    </span>
                </div>
            )}

            <div className={cn(
                'relative w-full overflow-hidden rounded-full bg-muted/50',
                sizeStyles[size]
            )}>
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full"
                    initial={animated ? { width: 0 } : false}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </div>
    );
}

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    showPercentage?: boolean;
    label?: string;
    className?: string;
}

export function CircularProgress({
    progress,
    size = 120,
    strokeWidth = 8,
    showPercentage = true,
    label,
    className,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-muted/30"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="oklch(0.65 0.28 290)" />
                        <stop offset="100%" stopColor="oklch(0.75 0.18 180)" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {showPercentage && (
                    <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                )}
                {label && (
                    <span className="text-xs text-muted-foreground">{label}</span>
                )}
            </div>
        </div>
    );
}

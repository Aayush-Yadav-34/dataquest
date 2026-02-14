'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeDisplayProps {
    name: string;
    icon: string;
    description?: string;
    locked?: boolean;
    size?: 'sm' | 'md' | 'lg';
    earnedAt?: Date;
    showTooltip?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
};

export function BadgeDisplay({
    name,
    icon,
    description,
    locked = false,
    size = 'md',
    earnedAt,
    showTooltip = true,
    className,
}: BadgeDisplayProps) {
    const badge = (
        <motion.div
            whileHover={{ scale: locked ? 1 : 1.1 }}
            whileTap={{ scale: locked ? 1 : 0.95 }}
            className={cn(
                'relative flex items-center justify-center rounded-2xl border transition-all overflow-hidden',
                locked
                    ? 'bg-muted/50 border-muted text-muted-foreground grayscale opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 cursor-pointer hover:shadow-lg hover:glow-sm',
                sizeStyles[size],
                className
            )}
        >
            {locked ? (
                <Lock className="w-1/3 h-1/3" />
            ) : (
                <span>{icon}</span>
            )}

            {/* Shine effect for unlocked badges */}
            {!locked && (
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.15) 55%, transparent 70%)',
                    }}
                    initial={{ x: '-100%', y: '-100%' }}
                    animate={{ x: '100%', y: '100%' }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            )}
        </motion.div>
    );

    if (!showTooltip) return badge;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{badge}</TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-center">
                    <p className="font-semibold">{name}</p>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                    {earnedAt && !locked && (
                        <p className="text-xs text-primary mt-1">
                            Earned {earnedAt.toLocaleDateString()}
                        </p>
                    )}
                    {locked && (
                        <p className="text-xs text-muted-foreground mt-1">🔒 Locked</p>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

interface BadgeGridProps {
    badges: {
        id: string;
        name: string;
        icon: string;
        description?: string;
        locked: boolean;
        earnedAt?: Date;
    }[];
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    badgeClassName?: string;
}

export function BadgeGrid({ badges, size = 'md', className, badgeClassName }: BadgeGridProps) {
    const hasGridCols = className?.includes('grid-cols');
    return (
        <div className={cn('grid gap-4', className)} style={hasGridCols ? undefined : {
            gridTemplateColumns: `repeat(auto-fill, minmax(${size === 'sm' ? '48px' : size === 'md' ? '64px' : '80px'}, 1fr))`,
        }}>
            {badges.map((badge, index) => (
                <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <BadgeDisplay
                        name={badge.name}
                        icon={badge.icon}
                        description={badge.description}
                        locked={badge.locked}
                        earnedAt={badge.earnedAt}
                        size={size}
                        className={badgeClassName}
                    />
                </motion.div>
            ))}
        </div>
    );
}

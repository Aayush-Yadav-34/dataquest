'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Home,
    BookOpen,
    Upload,
    Target,
    Trophy,
    BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavLinks = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/theory', label: 'Learn', icon: BookOpen },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/quiz', label: 'Quiz', icon: Target },
    { href: '/leaderboard', label: 'Rank', icon: Trophy },
    { href: '/progress', label: 'Stats', icon: BarChart3 },
];

export function BottomNav() {
    const pathname = usePathname();
    const { status } = useSession();

    // Only show for authenticated users and not on landing/login/register pages
    const hiddenPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
    if (status !== 'authenticated' || hiddenPaths.includes(pathname)) {
        return null;
    }

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{ position: 'fixed' }}
        >
            <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-2px_16px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-around px-1 py-1">
                    {bottomNavLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors duration-150 min-w-[3rem]',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground active:text-foreground'
                                )}
                            >
                                <link.icon className={cn(
                                    'w-5 h-5',
                                    isActive && 'text-primary'
                                )} />
                                <span className={cn(
                                    'text-[10px] mt-0.5 leading-tight',
                                    isActive ? 'font-semibold text-primary' : 'font-medium'
                                )}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                {/* Safe area bottom for notched phones */}
                <div className="h-[env(safe-area-inset-bottom)]" />
            </div>
        </nav>
    );
}

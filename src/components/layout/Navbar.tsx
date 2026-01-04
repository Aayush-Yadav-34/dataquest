'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    BookOpen,
    Upload,
    Trophy,
    BarChart3,
    User,
    LogOut,
    Menu,
    X,
    Zap,
    Flame,
    GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/theory', label: 'Learn', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: GraduationCap },
    { href: '/upload', label: 'Dataset', icon: Upload },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { profile } = useUserStore();

    // Calculate XP progress to next level
    const currentLevelXP = profile ? Math.pow(profile.level - 1, 2) * 100 : 0;
    const nextLevelXP = profile ? Math.pow(profile.level, 2) * 100 : 100;
    const xpProgress = profile ? ((profile.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 0;

    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isLandingPage = pathname === '/';

    if (isAuthPage) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={isLandingPage ? '/' : '/dashboard'} className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm group-hover:glow transition-shadow">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient hidden sm:block">DataQuest</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {!isLandingPage && (
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link key={link.href} href={link.href}>
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn(
                                                'relative px-4',
                                                isActive && 'bg-primary/10 text-primary'
                                            )}
                                        >
                                            <link.icon className="w-4 h-4 mr-2" />
                                            {link.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* Right Side - User Menu / Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {isLandingPage ? (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-gradient-primary hover:opacity-90">Get Started</Button>
                                </Link>
                            </>
                        ) : profile ? (
                            <>
                                {/* XP & Streak Display (Desktop) */}
                                <div className="hidden lg:flex items-center gap-4">
                                    {/* Streak */}
                                    <div className="flex items-center gap-1.5 text-orange-400">
                                        <Flame className="w-5 h-5" />
                                        <span className="font-bold">{profile.streak}</span>
                                    </div>

                                    {/* XP Progress */}
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <div className="text-xs text-muted-foreground">Level {profile.level}</div>
                                            <div className="text-sm font-semibold text-primary">{profile.xp.toLocaleString()} XP</div>
                                        </div>
                                        <div className="w-24">
                                            <Progress value={xpProgress} className="h-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10 border-2 border-primary/50">
                                                <AvatarImage src={profile.avatar} alt={profile.username} />
                                                <AvatarFallback className="bg-gradient-primary text-white">
                                                    {profile.username.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{profile.username}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {profile.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/progress" className="cursor-pointer">
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                My Progress
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Mobile Menu */}
                                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                    <SheetTrigger asChild className="md:hidden">
                                        <Button variant="ghost" size="icon">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-80">
                                        <div className="flex flex-col h-full py-6">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                                                <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                    <AvatarImage src={profile.avatar} alt={profile.username} />
                                                    <AvatarFallback className="bg-gradient-primary text-white">
                                                        {profile.username.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{profile.username}</p>
                                                    <p className="text-sm text-muted-foreground">Level {profile.level}</p>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="glass-card p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                                                        <Zap className="w-4 h-4" />
                                                        <span className="font-bold">{profile.xp}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Total XP</p>
                                                </div>
                                                <div className="glass-card p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                                                        <Flame className="w-4 h-4" />
                                                        <span className="font-bold">{profile.streak}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Day Streak</p>
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            <nav className="flex-1 space-y-1">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            <Button
                                                                variant={isActive ? 'secondary' : 'ghost'}
                                                                className={cn(
                                                                    'w-full justify-start',
                                                                    isActive && 'bg-primary/10 text-primary'
                                                                )}
                                                            >
                                                                <link.icon className="w-5 h-5 mr-3" />
                                                                {link.label}
                                                            </Button>
                                                        </Link>
                                                    );
                                                })}
                                            </nav>

                                            {/* Logout */}
                                            <Button variant="ghost" className="justify-start text-destructive mt-4">
                                                <LogOut className="w-5 h-5 mr-3" />
                                                Log out
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-gradient-primary hover:opacity-90">Sign In</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
    Zap,
    Menu,
    Home,
    BookOpen,
    Upload,
    Trophy,
    BarChart3,
    User,
    Settings,
    LogOut,
    Flame,
    Target,
    Shield,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/theory', label: 'Theory', icon: BookOpen },
    { href: '/upload', label: 'Upload', icon: Upload },
    { href: '/quiz', label: 'Quiz', icon: Target },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, isAuthenticated, logout } = useUserStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out', {
            description: 'You have been successfully logged out.',
        });
        router.push('/');
    };

    // Calculate XP progress to next level
    const xpForCurrentLevel = profile ? ((profile.level - 1) ** 2) * 100 : 0;
    const xpForNextLevel = profile ? (profile.level ** 2) * 100 : 100;
    const xpProgress = profile
        ? ((profile.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
        : 0;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled ? 'glass border-b shadow-lg' : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm group-hover:glow transition-shadow">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient hidden sm:block">DataQuest</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                                return (
                                    <Link key={link.href} href={link.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                'relative px-4 transition-colors',
                                                isActive
                                                    ? 'text-primary'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            )}
                                        >
                                            <link.icon className="w-4 h-4 mr-2" />
                                            {link.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-primary rounded-full"
                                                />
                                            )}
                                        </Button>
                                    </Link>
                                );
                            })}
                            {/* Admin Link */}
                            {profile?.role === 'admin' && (
                                <Link href="/admin">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            'relative px-4 transition-colors text-amber-500 hover:text-amber-400',
                                            pathname === '/admin' && 'bg-amber-500/10'
                                        )}
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        Admin
                                    </Button>
                                </Link>
                            )}
                        </nav>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated && profile ? (
                            <>
                                {/* Streak */}
                                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500">
                                    <Flame className="w-4 h-4" />
                                    <span className="text-sm font-bold">{profile.streak}</span>
                                </div>

                                {/* XP Progress */}
                                <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-muted/50">
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-sm font-semibold">{profile.xp.toLocaleString()} XP</span>
                                    </div>
                                    <div className="w-24">
                                        <Progress value={xpProgress} className="h-1.5" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Lv. {profile.level}</span>
                                </div>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10 border-2 border-primary/50">
                                                <AvatarImage src={profile.avatar} />
                                                <AvatarFallback className="bg-gradient-primary text-white">
                                                    {profile.username.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">{profile.username}</p>
                                                <p className="text-xs text-muted-foreground">{profile.email}</p>
                                                {profile.role === 'admin' && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                                                        <Shield className="w-3 h-3" />
                                                        Administrator
                                                    </span>
                                                )}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="flex items-center cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/progress" className="flex items-center cursor-pointer">
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                My Progress
                                            </Link>
                                        </DropdownMenuItem>
                                        {profile.role === 'admin' && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin" className="flex items-center cursor-pointer text-amber-500">
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Admin Panel
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="flex items-center cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-destructive cursor-pointer"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Mobile Menu */}
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild className="md:hidden">
                                        <Button variant="ghost" size="icon">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-80">
                                        <div className="flex flex-col h-full">
                                            {/* User Info */}
                                            <div className="flex items-center gap-3 pb-6 border-b">
                                                <Avatar className="h-12 w-12 border-2 border-primary/50">
                                                    <AvatarImage src={profile.avatar} />
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
                                            <div className="flex gap-4 py-4 border-b">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <Zap className="w-4 h-4" />
                                                    <span className="font-semibold">{profile.xp.toLocaleString()}</span>
                                                    <span className="text-xs text-muted-foreground">XP</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-orange-500">
                                                    <Flame className="w-4 h-4" />
                                                    <span className="font-semibold">{profile.streak}</span>
                                                    <span className="text-xs text-muted-foreground">Streak</span>
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            <nav className="flex-1 py-4 space-y-1">
                                                {navLinks.map((link) => {
                                                    const isActive = pathname === link.href;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
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
                                                {profile.role === 'admin' && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <Button
                                                            variant={pathname === '/admin' ? 'secondary' : 'ghost'}
                                                            className={cn(
                                                                'w-full justify-start text-amber-500',
                                                                pathname === '/admin' && 'bg-amber-500/10'
                                                            )}
                                                        >
                                                            <Shield className="w-5 h-5 mr-3" />
                                                            Admin Panel
                                                        </Button>
                                                    </Link>
                                                )}
                                            </nav>

                                            {/* Logout */}
                                            <div className="pt-4 border-t">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-destructive hover:text-destructive"
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                >
                                                    <LogOut className="w-5 h-5 mr-3" />
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </>
                        ) : (
                            /* Not Authenticated */
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

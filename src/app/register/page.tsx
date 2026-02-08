'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useUserStore();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationAllowed, setRegistrationAllowed] = useState(true);
    const [checkingSettings, setCheckingSettings] = useState(true);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    // Check registration setting
    useEffect(() => {
        const checkSettings = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    if (data.settings && typeof data.settings.allow_registration !== 'undefined') {
                        setRegistrationAllowed(data.settings.allow_registration === true || data.settings.allow_registration === 'true');
                    }
                }
            } catch (error) {
                console.error('Failed to check settings:', error);
            } finally {
                setCheckingSettings(false);
            }
        };
        checkSettings();
    }, []);

    // Password requirements
    const passwordRequirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Contains a number', met: /\d/.test(password) },
    ];

    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!allRequirementsMet) {
            setError('Please meet all password requirements');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call registration API
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Account created!', {
                    description: 'Please login with your credentials.',
                });
                router.push('/login');
            } else {
                setError(data.error || 'Registration failed');
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (err) {
            toast.error('Failed to sign up with Google');
            setIsSubmitting(false);
        }
    };

    if (checkingSettings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!registrationAllowed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Registration Closed</h1>
                        <p className="text-muted-foreground mt-2">
                            New user registrations are currently disabled. Please check back later or contact an administrator.
                        </p>
                    </div>
                    <Button asChild className="w-full">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent/20 via-background to-primary/20 items-center justify-center p-12 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-glow opacity-30" />
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative text-center"
                >
                    <div className="glass-card p-12 max-w-md">
                        <div className="text-6xl mb-6">🎓</div>
                        <h2 className="text-2xl font-bold mb-4">Start Your Journey</h2>
                        <p className="text-muted-foreground">
                            Join thousands of learners mastering Data Science through gamified learning
                        </p>
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-gradient">50K+</p>
                                <p className="text-xs text-muted-foreground">Learners</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gradient">100+</p>
                                <p className="text-xs text-muted-foreground">Topics</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gradient">95%</p>
                                <p className="text-xs text-muted-foreground">Completion</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-6"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm group-hover:glow transition-shadow">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gradient">DataQuest</span>
                    </Link>

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-muted-foreground mt-2">
                            Start your data science journey today
                        </p>
                    </div>

                    {/* Google Signup */}
                    <Button
                        variant="outline"
                        className="w-full h-12 text-base border-border/50 hover:bg-muted/50"
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        Sign up with Google
                    </Button>

                    <div className="relative">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
                            or continue with email
                        </span>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    className="pl-10 h-12"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    minLength={3}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10 h-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="pl-10 h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Requirements */}
                        {password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="grid grid-cols-2 gap-2"
                            >
                                {passwordRequirements.map((req, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'flex items-center gap-2 text-xs',
                                            req.met ? 'text-emerald-500' : 'text-muted-foreground'
                                        )}
                                    >
                                        {req.met ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <X className="w-3 h-3" />
                                        )}
                                        {req.label}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className={cn(
                                        'pl-10 h-12',
                                        confirmPassword && !passwordsMatch && 'border-destructive'
                                    )}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <p className="text-xs text-destructive">Passwords do not match</p>
                            )}
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-destructive"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base bg-gradient-primary hover:opacity-90 glow-sm"
                            disabled={isSubmitting || isLoading || !allRequirementsMet || !passwordsMatch}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-xs text-center text-muted-foreground">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

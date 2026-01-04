'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
];

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const allRequirementsMet = passwordRequirements.every((req) => req.test(formData.password));
        if (!allRequirementsMet) {
            setError('Please meet all password requirements');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('Account created!', {
            description: 'Welcome to DataQuest. Let\'s start learning!',
        });
        router.push('/dashboard');
    };

    const handleGoogleRegister = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Account created!', {
            description: 'Welcome to DataQuest. Let\'s start learning!',
        });
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-bl from-accent/20 via-background to-primary/20 items-center justify-center p-12 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-glow opacity-30" />
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative text-center"
                >
                    <div className="glass-card p-12 max-w-md">
                        <div className="text-6xl mb-6">🎮</div>
                        <h2 className="text-2xl font-bold mb-4">Learn Like Never Before</h2>
                        <p className="text-muted-foreground mb-8">
                            Join thousands of students mastering data science through gamified learning.
                        </p>
                        <div className="space-y-4 text-left">
                            {[
                                '✨ Interactive lessons with visualizations',
                                '🏆 Compete on global leaderboards',
                                '📊 Upload and analyze real datasets',
                                '🎯 Track progress with detailed analytics',
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    {feature}
                                </motion.div>
                            ))}
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
                        <h1 className="text-3xl font-bold">Create your account</h1>
                        <p className="text-muted-foreground mt-2">
                            Start your data science journey today
                        </p>
                    </div>

                    {/* Google Register */}
                    <Button
                        variant="outline"
                        className="w-full h-12 text-base border-border/50 hover:bg-muted/50"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
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
                                    placeholder="datawizard"
                                    className="pl-10 h-12"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
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
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Password Requirements */}
                            <div className="space-y-1 mt-2">
                                {passwordRequirements.map((req, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-2 text-xs ${req.test(formData.password)
                                                ? 'text-emerald-500'
                                                : 'text-muted-foreground'
                                            }`}
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        {req.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="pl-10 h-12"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                            disabled={isLoading}
                        >
                            {isLoading ? (
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
                    <p className="text-center text-muted-foreground text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-xs text-muted-foreground">
                        By creating an account, you agree to our{' '}
                        <Link href="#" className="text-primary hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="#" className="text-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    User,
    Mail,
    Lock,
    Shield,
    Trash2,
    Save,
    Loader2,
    Check,
    AlertTriangle,
    Upload,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useUserData } from '@/hooks/useUserData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { profile, isAuthenticated: storeAuth } = useUserStore();
    const { userData, refetch: refetchUserData, isLoading: userDataLoading } = useUserData();

    const isAuthenticated = status === 'authenticated' || storeAuth;
    // Wait for both session AND userData to prevent flash of stale username
    const isLoading = status === 'loading' || (isAuthenticated && userDataLoading);

    // Get user info - prefer fresh data from useUserData
    const user = userData ? {
        username: userData.username,
        email: userData.email,
        name: userData.username,
        avatar_url: userData.avatar_url,
    } : session?.user ? {
        username: session.user.username || session.user.name || '',
        email: session.user.email || '',
        name: session.user.name || '',
        avatar_url: session.user.image,
    } : profile ? {
        username: profile.username,
        email: profile.email,
        name: profile.username,
        avatar_url: profile.avatar,
    } : null;

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [isSaving, setIsSaving] = useState(false);
    const [savedSection, setSavedSection] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username || user.name || '');
            setEmail(user.email || '');
            setAvatarUrl(user.avatar_url || undefined);
        }
    }, [user?.username, user?.email, user?.name, user?.avatar_url]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleSaveProfile = async () => {
        setIsSaving(true);

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username }),
            });

            if (response.ok) {
                setSavedSection('profile');
                setTimeout(() => setSavedSection(null), 2000);
                toast.success('Profile updated successfully!');
                // Refetch user data to update the UI with new username
                await refetchUserData();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/user/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                setSavedSection('security');
                setTimeout(() => setSavedSection(null), 2000);
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to change password');
            }
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 2MB.');
            return;
        }

        setIsUploadingAvatar(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/avatar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setAvatarUrl(data.avatar_url);
                toast.success('Avatar updated successfully!');
                await refetchUserData();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to upload avatar');
            }
        } catch (error) {
            toast.error('Failed to upload avatar');
        } finally {
            setIsUploadingAvatar(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error('Please enter your password');
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: deletePassword }),
            });

            if (response.ok) {
                toast.success('Account deleted successfully');
                await signOut({ callbackUrl: '/' });
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete account');
            }
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            <span className="text-gradient">Settings</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Settings Tabs */}
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid grid-cols-2 w-full max-w-xs">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>Security</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Update your personal information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <Avatar className="w-20 h-20 border-2 border-primary/50">
                                            <AvatarImage src={avatarUrl || user.avatar_url} />
                                            <AvatarFallback className="bg-gradient-primary text-white text-xl">
                                                {(user.username || user.name || 'U').slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/webp"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploadingAvatar}
                                            >
                                                {isUploadingAvatar ? (
                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                                                ) : (
                                                    <><Upload className="w-4 h-4 mr-2" /> Change Avatar</>
                                                )}
                                            </Button>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                JPG, PNG or GIF. Max 2MB
                                            </p>
                                        </div>
                                    </div>

                                    {/* Username */}
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="pl-10"
                                                placeholder="Your username"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                value={email}
                                                className="pl-10"
                                                disabled
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Email cannot be changed
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="bg-gradient-primary hover:opacity-90"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : savedSection === 'profile' ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        {savedSection === 'profile' ? 'Saved!' : 'Save Changes'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>
                                        Manage your password and security preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="currentPassword"
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="pl-10"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="newPassword"
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="pl-10"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="pl-10"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleChangePassword}
                                        disabled={isSaving || !currentPassword || !newPassword}
                                        className="bg-gradient-primary hover:opacity-90"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : savedSection === 'security' ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Lock className="w-4 h-4 mr-2" />
                                        )}
                                        {savedSection === 'security' ? 'Password Changed!' : 'Change Password'}
                                    </Button>

                                    <div className="pt-6 border-t">
                                        <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Once you delete your account, there is no going back.
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setShowDeleteDialog(true)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </motion.div>
            </main>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Delete Account
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. All your data including progress,
                            quiz attempts, and badges will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm text-destructive">
                                ⚠️ Warning: This will permanently delete your account and all associated data.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="delete-password">
                                Enter your password to confirm
                            </Label>
                            <Input
                                id="delete-password"
                                type="password"
                                placeholder="Your password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                For OAuth accounts (Google login), type DELETE to confirm.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setDeletePassword('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || !deletePassword}
                        >
                            {isDeleting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
                            ) : (
                                <><Trash2 className="w-4 h-4 mr-2" /> Delete Account</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

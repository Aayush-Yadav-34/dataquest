import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

// DELETE /api/user/delete - Delete user account
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required to delete account' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get user with password hash
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, password_hash, role')
            .eq('email', session.user.email)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Don't allow deleting admin accounts
        if (userData.role === 'admin') {
            return NextResponse.json(
                { error: 'Admin accounts cannot be deleted' },
                { status: 403 }
            );
        }

        // Verify password
        if (userData.password_hash) {
            const isValid = await bcrypt.compare(password, userData.password_hash);
            if (!isValid) {
                return NextResponse.json(
                    { error: 'Incorrect password' },
                    { status: 401 }
                );
            }
        } else {
            // User logged in via OAuth (no password) - allow deletion with any confirm text
            // For OAuth users, we'll use a simpler confirmation
            if (password !== 'DELETE') {
                return NextResponse.json(
                    { error: 'Type DELETE to confirm account deletion' },
                    { status: 400 }
                );
            }
        }

        // Delete related data first (cascade should handle most, but be explicit)
        // Delete user progress
        await supabase.from('user_progress').delete().eq('user_id', userData.id);

        // Delete quiz attempts
        await supabase.from('quiz_attempts').delete().eq('user_id', userData.id);

        // Delete leaderboard history
        await supabase.from('leaderboard_history').delete().eq('user_id', userData.id);

        // Finally, delete the user
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userData.id);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete account' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

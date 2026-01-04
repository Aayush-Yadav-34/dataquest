import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/users/profile - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, username, avatar_url, xp, level, streak, last_active, role, created_at')
            .eq('email', session.user.email)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/users/profile - Update current user profile
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { username, avatar_url } = await request.json();

        const supabase = createServiceRoleClient();

        // Get user ID
        const { data: currentUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if new username is taken by another user
        if (username) {
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .neq('id', currentUser.id)
                .single();

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Username already taken' },
                    { status: 409 }
                );
            }
        }

        // Update user
        const updateData: Record<string, unknown> = {};
        if (username) updateData.username = username;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', currentUser.id)
            .select('id, email, username, avatar_url, xp, level, streak, role')
            .single();

        if (error) {
            console.error('Error updating user:', error);
            return NextResponse.json(
                { error: 'Failed to update profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

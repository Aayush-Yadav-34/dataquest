import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name, avatar_url, role, xp, created_at')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error in profile GET:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, avatar_url } = body;

        // Build update object
        const updates: Record<string, any> = {};

        if (name !== undefined) {
            if (name.length < 2 || name.length > 50) {
                return NextResponse.json(
                    { error: 'Name must be between 2 and 50 characters' },
                    { status: 400 }
                );
            }
            updates.name = name;
        }

        if (avatar_url !== undefined) {
            updates.avatar_url = avatar_url;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No valid fields to update' },
                { status: 400 }
            );
        }

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', session.user.id)
            .select('id, email, name, avatar_url, role, xp, created_at')
            .single();

        if (error) {
            console.error('Error updating user:', error);
            return NextResponse.json(
                { error: 'Failed to update profile' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error in profile PATCH:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

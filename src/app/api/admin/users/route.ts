import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Type for user data
interface UserData {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    xp: number;
    level: number;
    streak: number;
    role: string;
    blocked: boolean;
    last_active: string | null;
    created_at: string;
}

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.role || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '50');

        const supabase = createServiceRoleClient();

        let query = supabase
            .from('users')
            .select('id, email, username, avatar_url, xp, level, streak, role, blocked, last_active, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        // Add search filter if provided
        if (search) {
            query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data: usersData, error } = await query;
        const users = usersData as UserData[] | null;

        if (error) {
            console.error('Error fetching users:', error);
            return NextResponse.json(
                { error: 'Failed to fetch users' },
                { status: 500 }
            );
        }

        return NextResponse.json({ users: users || [] });
    } catch (error) {
        console.error('Error in admin users API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/users - Block/unblock user
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.role || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { userId, blocked } = body;

        if (!userId || typeof blocked !== 'boolean') {
            return NextResponse.json(
                { error: 'userId and blocked status required' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Don't allow blocking admins
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        const user = userData as { role: string } | null;

        if (user?.role === 'admin') {
            return NextResponse.json(
                { error: 'Cannot block admin users' },
                { status: 400 }
            );
        }

        const { error } = await (supabase
            .from('users') as any)
            .update({ blocked })
            .eq('id', userId);

        if (error) {
            console.error('Error updating user:', error);
            return NextResponse.json(
                { error: 'Failed to update user' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: blocked ? 'User blocked' : 'User unblocked'
        });
    } catch (error) {
        console.error('Error in admin users PATCH:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/users - Remove user
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.role || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId required' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Don't allow deleting admins
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', userId)
            .single();

        const user = userData as { role: string } | null;

        if (user?.role === 'admin') {
            return NextResponse.json(
                { error: 'Cannot delete admin users' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting user:', error);
            return NextResponse.json(
                { error: 'Failed to delete user' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('Error in admin users DELETE:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

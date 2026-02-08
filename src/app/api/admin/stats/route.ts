import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Type for top user
interface TopUser {
    username: string;
    xp: number;
}

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is admin
        if (!session?.user?.role || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get total user count (excluding admins)
        const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .neq('role', 'admin');

        if (usersError) {
            console.error('Error fetching user count:', usersError);
            return NextResponse.json(
                { error: 'Failed to fetch statistics' },
                { status: 500 }
            );
        }

        // Get users active today (last_active within 24 hours)
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { count: activeToday, error: activeError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('last_active', twentyFourHoursAgo.toISOString());

        if (activeError) {
            console.error('Error fetching active users:', activeError);
            return NextResponse.json(
                { error: 'Failed to fetch statistics' },
                { status: 500 }
            );
        }

        // Get leaderboard stats for admin panel
        // Top user (excluding admins)
        const { data: topUserData } = await supabase
            .from('users')
            .select('username, xp')
            .neq('role', 'admin')
            .order('xp', { ascending: false })
            .limit(1)
            .single();

        const topUser = topUserData as TopUser | null;

        // Count of competitors (non-admin users)
        const { count: competitorCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .neq('role', 'admin');

        return NextResponse.json({
            totalUsers: totalUsers || 0,
            activeToday: activeToday || 0,
            // Leaderboard stats
            topUser: topUser?.username || 'No users',
            highestXP: topUser?.xp || 0,
            competitorCount: competitorCount || 0,
        });
    } catch (error) {
        console.error('Error in admin stats API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

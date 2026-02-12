import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// POST /api/admin/leaderboard/reset - Reset weekly leaderboard
export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const supabase = createServiceRoleClient();
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('email', session.user.email)
            .single() as any;

        if (userData?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Get top 10 users before reset for archiving
        const { data: topUsers } = await supabase
            .from('users')
            .select('id, username, weekly_xp')
            .neq('role', 'admin')
            .order('weekly_xp', { ascending: false })
            .limit(10);

        // Count total participants (users with weekly_xp > 0)
        const { count: totalParticipants } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gt('weekly_xp', 0);

        // Archive the weekly results
        await (supabase.from('weekly_reset_history') as any).insert({
            top_users: topUsers || [],
            total_participants: totalParticipants || 0,
        });

        // Reset all users' weekly_xp to 0
        const { error: resetError } = await (supabase
            .from('users') as any)
            .update({
                weekly_xp: 0,
                last_weekly_reset: new Date().toISOString()
            })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all users

        if (resetError) {
            console.error('Reset error:', resetError);
            return NextResponse.json(
                { error: 'Failed to reset weekly leaderboard' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Weekly leaderboard reset successfully',
            archived: {
                topUsers: topUsers?.length || 0,
                totalParticipants: totalParticipants || 0,
            }
        });
    } catch (error) {
        console.error('Weekly reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

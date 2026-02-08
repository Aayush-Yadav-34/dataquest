import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { resetWeeklyLeaderboard } from '@/lib/reset';

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
            .single();

        if (userData?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const result = await resetWeeklyLeaderboard();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Weekly leaderboard reset successfully',
                archived: result.archived
            });
        } else {
            return NextResponse.json(
                { error: result.error || 'Failed to reset weekly leaderboard' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Weekly reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/user/activity - Get weekly activity data (past 7 days)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get user
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userId = (userData as { id: string }).id;

        // Get the past 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch session logs for the past 7 days
        const { data: sessions } = await supabase
            .from('session_logs')
            .select('started_at, duration_seconds')
            .eq('user_id', userId)
            .gte('started_at', sevenDaysAgo.toISOString())
            .order('started_at', { ascending: true });

        // Fetch activities (XP earned) for the past 7 days
        const { data: activities } = await supabase
            .from('activities')
            .select('created_at, xp_earned')
            .eq('user_id', userId)
            .gte('created_at', sevenDaysAgo.toISOString());

        // Build daily aggregation
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyData: Record<string, { minutes: number; xp: number }> = {};

        // Initialize all 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            dailyData[dateKey] = { minutes: 0, xp: 0 };
        }

        // Aggregate session durations
        ((sessions as any[]) || []).forEach((s: any) => {
            const dateKey = new Date(s.started_at).toISOString().split('T')[0];
            if (dailyData[dateKey] !== undefined) {
                dailyData[dateKey].minutes += Math.round((s.duration_seconds || 0) / 60);
            }
        });

        // Aggregate XP earned
        ((activities as any[]) || []).forEach((a: any) => {
            const dateKey = new Date(a.created_at).toISOString().split('T')[0];
            if (dailyData[dateKey] !== undefined) {
                dailyData[dateKey].xp += a.xp_earned || 0;
            }
        });

        // Convert to ordered array with day names
        const weeklyActivity = Object.entries(dailyData).map(([dateKey, data]) => {
            const date = new Date(dateKey + 'T00:00:00');
            return {
                day: dayNames[date.getDay()],
                date: dateKey,
                minutes: data.minutes,
                xp: data.xp,
            };
        });

        return NextResponse.json({ weeklyActivity });
    } catch (error) {
        console.error('Error in activity API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

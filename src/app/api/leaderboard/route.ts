import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'global'; // global, weekly
        const limit = parseInt(searchParams.get('limit') || '100');

        let query = supabase
            .from('users')
            .select('id, username, avatar_url, xp, level, streak')
            .order('xp', { ascending: false })
            .limit(limit);

        const { data: users, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard' },
                { status: 500 }
            );
        }

        // Add rank to each user
        const leaderboard = users?.map((user, index) => ({
            ...user,
            rank: index + 1,
            rankChange: Math.floor(Math.random() * 5) - 2, // Mock rank change for now
        }));

        return NextResponse.json({ leaderboard, type });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

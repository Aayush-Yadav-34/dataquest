import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/leaderboard - Get leaderboard data
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();
        const session = await getServerSession(authOptions);
        const currentUserId = session?.user?.id;

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'global'; // global, weekly
        const limit = parseInt(searchParams.get('limit') || '100');

        // Get all non-admin users for leaderboard
        let query = supabase
            .from('users')
            .select('id, username, avatar_url, xp, level, streak, role')
            .neq('role', 'admin') // Exclude admin users from leaderboard
            .order('xp', { ascending: false })
            .limit(limit);

        const { data: users, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard' },
                { status: 500 }
            );
        }

        // Add rank to each user and mark current user
        const leaderboard = users?.map((user, index) => ({
            ...user,
            rank: index + 1,
            rankChange: Math.floor(Math.random() * 5) - 2, // Mock rank change for now
            isCurrentUser: user.id === currentUserId,
        }));

        // Find current user's rank even if they're admin (query separately)
        let currentUserRank = null;
        if (currentUserId) {
            const { data: currentUser } = await supabase
                .from('users')
                .select('id, username, avatar_url, xp, level, streak, role')
                .eq('id', currentUserId)
                .single();

            if (currentUser) {
                // Count how many users have more XP than the current user
                const { count } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .gt('xp', currentUser.xp);

                currentUserRank = {
                    ...currentUser,
                    rank: (count || 0) + 1,
                    isCurrentUser: true,
                };
            }
        }

        return NextResponse.json({
            leaderboard,
            type,
            currentUserId,
            currentUserRank,
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

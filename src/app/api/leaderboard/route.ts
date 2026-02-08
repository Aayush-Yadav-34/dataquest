import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Type for leaderboard history entry
interface LeaderboardHistoryEntry {
    user_id: string;
    rank: number;
}

// Type for user from database
interface LeaderboardUser {
    id: string;
    username: string;
    avatar_url: string | null;
    xp: number;
    weekly_xp: number;
    level: number;
    streak: number;
    role: string;
}

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
        const orderField = type === 'weekly' ? 'weekly_xp' : 'xp';
        const query = supabase
            .from('users')
            .select('id, username, avatar_url, xp, weekly_xp, level, streak, role')
            .neq('role', 'admin') // Exclude admin users from leaderboard
            .order(orderField, { ascending: false })
            .limit(limit);

        const { data: usersData, error } = await query;
        const users = usersData as LeaderboardUser[] | null;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch leaderboard' },
                { status: 500 }
            );
        }

        // Get yesterday's date for rank history lookup
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Fetch yesterday's rank history
        const { data: historyRaw } = await supabase
            .from('leaderboard_history')
            .select('user_id, rank')
            .eq('recorded_at', yesterdayStr);

        const historyData = historyRaw as LeaderboardHistoryEntry[] | null;

        // Create a map of user_id to previous rank
        const previousRanks = new Map<string, number>();
        historyData?.forEach(entry => {
            previousRanks.set(entry.user_id, entry.rank);
        });

        // Add rank to each user and calculate rank change
        const leaderboard = users?.map((user, index) => {
            const currentRank = index + 1;
            const previousRank = previousRanks.get(user.id);
            // rankChange: positive = moved up, negative = moved down
            const rankChange = previousRank !== undefined
                ? previousRank - currentRank
                : 0; // New users have no change

            return {
                ...user,
                rank: currentRank,
                rankChange,
                isCurrentUser: user.id === currentUserId,
            };
        });

        // Find current user's rank even if they're admin (query separately)
        let currentUserRank = null;
        if (currentUserId) {
            const { data: currentUserData } = await supabase
                .from('users')
                .select('id, username, avatar_url, xp, weekly_xp, level, streak, role')
                .eq('id', currentUserId)
                .single();

            const currentUser = currentUserData as LeaderboardUser | null;

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

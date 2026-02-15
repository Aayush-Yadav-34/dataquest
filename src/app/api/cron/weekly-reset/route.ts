import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/cron/weekly-reset — Vercel Cron handler
// Runs every Sunday at midnight UTC to reset the weekly leaderboard
export async function GET(request: Request) {
    try {
        // Verify cron secret to prevent unauthorized access
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        // 1. Snapshot current rankings into leaderboard_history
        const today = new Date().toISOString().split('T')[0];

        // Fetch all non-admin users ordered by weekly XP
        const { data: users, error: fetchError } = await supabase
            .from('users')
            .select('id, xp, weekly_xp')
            .neq('role', 'admin')
            .order('xp', { ascending: false });

        if (fetchError) {
            console.error('Error fetching users for weekly reset:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch users' },
                { status: 500 }
            );
        }

        // Archive current global rankings to leaderboard_history
        if (users && users.length > 0) {
            const historyEntries = users.map((user: any, index: number) => ({
                user_id: user.id,
                rank: index + 1,
                xp_snapshot: user.xp,
                weekly_xp_snapshot: user.weekly_xp || 0,
                recorded_at: today,
            }));

            const { error: insertError } = await (supabase
                .from('leaderboard_history') as any)
                .upsert(historyEntries, {
                    onConflict: 'user_id,recorded_at',
                    ignoreDuplicates: true,
                });

            if (insertError) {
                console.error('Error archiving leaderboard:', insertError);
                // Continue with reset even if archiving fails
            }
        }

        // 2. Reset weekly_xp for all users
        const { error: resetError } = await (supabase
            .from('users') as any)
            .update({ weekly_xp: 0 })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows

        if (resetError) {
            console.error('Error resetting weekly XP:', resetError);
            return NextResponse.json(
                { error: 'Failed to reset weekly XP' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Weekly leaderboard reset completed. ${users?.length || 0} users archived.`,
            archivedDate: today,
        });
    } catch (error) {
        console.error('Weekly reset cron error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

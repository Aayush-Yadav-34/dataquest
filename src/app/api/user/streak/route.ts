import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/user/streak - Update user's daily streak
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createServiceRoleClient();

        // Get user with last_active and streak
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, streak, last_active')
            .eq('email', session.user.email)
            .single() as any;

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = (user as any).id;
        const currentStreak = (user as any).streak || 0;
        const lastActive = (user as any).last_active ? new Date((user as any).last_active) : null;
        const now = new Date();

        // Get date strings for comparison (in user's timezone would be ideal, but using UTC for simplicity)
        const today = now.toISOString().split('T')[0];
        const lastActiveDate = lastActive ? lastActive.toISOString().split('T')[0] : null;

        let newStreak = currentStreak;

        if (!lastActiveDate) {
            // First activity ever
            newStreak = 1;
        } else if (lastActiveDate === today) {
            // Already active today, don't change streak
            newStreak = currentStreak || 1;
        } else {
            // Check if last activity was yesterday
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastActiveDate === yesterdayStr) {
                // Consecutive day - increment streak
                newStreak = currentStreak + 1;
            } else {
                // Missed a day - reset streak to 1 (starting fresh today)
                newStreak = 1;
            }
        }

        // Update streak and last_active
        const { error: updateError } = await (supabase
            .from('users') as any)
            .update({
                streak: newStreak,
                last_active: now.toISOString(),
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating streak:', updateError);
            return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            streak: newStreak,
            previousStreak: currentStreak,
            streakChanged: newStreak !== currentStreak,
        });
    } catch (error) {
        console.error('Streak update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET /api/user/streak - Get current streak
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createServiceRoleClient();

        const { data: user, error } = await supabase
            .from('users')
            .select('streak, last_active')
            .eq('email', session.user.email)
            .single() as any;

        if (error || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            streak: (user as any).streak || 0,
            lastActive: (user as any).last_active,
        });
    } catch (error) {
        console.error('Get streak error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

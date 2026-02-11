import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    criteria_type: string;
    criteria_value: number;
}

// POST /api/badges/check - Check and award eligible badges
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get user data
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, xp, streak')
            .eq('email', session.user.email)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = userData as { id: string; xp: number; streak: number };

        // Get all badges
        const { data: badgesData } = await supabase
            .from('badges')
            .select('*');

        const badges = (badgesData as Badge[]) || [];

        // Get already earned badges
        const { data: earnedData } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', user.id);

        const earnedIds = new Set(
            ((earnedData as any[]) || []).map((ub: any) => ub.badge_id)
        );

        // Get user stats for criteria checking
        const { count: quizCount } = await supabase
            .from('quiz_attempts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);

        const { count: topicCount } = await supabase
            .from('user_progress')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true);

        // Check each badge
        const newlyEarned: Badge[] = [];

        for (const badge of badges) {
            // Skip if already earned
            if (earnedIds.has(badge.id)) continue;

            let eligible = false;

            switch (badge.criteria_type) {
                case 'xp':
                    eligible = user.xp >= badge.criteria_value;
                    break;
                case 'quizzes':
                    eligible = (quizCount || 0) >= badge.criteria_value;
                    break;
                case 'topics':
                    eligible = (topicCount || 0) >= badge.criteria_value;
                    break;
                case 'streak':
                    eligible = user.streak >= badge.criteria_value;
                    break;
            }

            if (eligible) {
                // Award the badge
                const { error: insertError } = await supabase
                    .from('user_badges')
                    .insert({
                        user_id: user.id,
                        badge_id: badge.id,
                    });

                if (!insertError) {
                    newlyEarned.push(badge);
                }
            }
        }

        return NextResponse.json({
            newBadges: newlyEarned,
            totalNewBadges: newlyEarned.length,
        });
    } catch (error) {
        console.error('Error in badge check:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

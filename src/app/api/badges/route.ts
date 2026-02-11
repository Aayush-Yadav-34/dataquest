import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/badges - List all badges with user's earned status
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

        // Get user ID
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

        // Fetch all badges
        const { data: badges, error: badgesError } = await supabase
            .from('badges')
            .select('*')
            .order('criteria_value', { ascending: true });

        if (badgesError) {
            console.error('Error fetching badges:', badgesError);
            return NextResponse.json(
                { error: 'Failed to fetch badges' },
                { status: 500 }
            );
        }

        // Fetch user's earned badges
        const { data: userBadges, error: ubError } = await supabase
            .from('user_badges')
            .select('badge_id, earned_at')
            .eq('user_id', userId);

        if (ubError) {
            console.error('Error fetching user badges:', ubError);
        }

        const earnedMap = new Map(
            ((userBadges as any[]) || []).map((ub: any) => [ub.badge_id, ub.earned_at])
        );

        // Combine: mark each badge as earned or locked
        const allBadges = ((badges as any[]) || []).map((badge: any) => ({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            criteria_type: badge.criteria_type,
            criteria_value: badge.criteria_value,
            earned: earnedMap.has(badge.id),
            earned_at: earnedMap.get(badge.id) || null,
        }));

        return NextResponse.json({ badges: allBadges });
    } catch (error) {
        console.error('Error in badges API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

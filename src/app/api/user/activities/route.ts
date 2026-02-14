import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/user/activities - Get user's activity timeline
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
            .single() as any;

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userId = userData.id;

        // Fetch recent activities (last 50)
        const { data: activities, error: activitiesError } = await (supabase
            .from('activities') as any)
            .select('id, type, title, description, xp_earned, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (activitiesError) {
            console.error('Error fetching activities:', activitiesError);
            return NextResponse.json(
                { error: 'Failed to fetch activities' },
                { status: 500 }
            );
        }

        return NextResponse.json({ activities: activities || [] });
    } catch (error) {
        console.error('Error in activities API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

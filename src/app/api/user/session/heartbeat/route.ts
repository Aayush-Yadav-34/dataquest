import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { seconds } = await request.json();

        if (!seconds || typeof seconds !== 'number' || seconds <= 0) {
            return NextResponse.json(
                { error: 'Invalid seconds value' },
                { status: 400 }
            );
        }

        // Limit update to reasonable amount (e.g. max 5 minutes at once)
        const secondsToAdd = Math.min(seconds, 300);

        const supabase = createServiceRoleClient();

        // Use RPC or raw SQL to atomic increment if possible, but Simple update is fine for MVP
        // Since Supabase JS client doesn't support atomic increment easily on update without stored procedure,
        // we will fetch first. For higher concurrency, a stored procedure `increment_time_spent` would be better.
        // But for this use case (one user updating their own time occasionally), fetch+update is acceptable risk.

        // Actually, let's try to use a stored procedure if we had one, but we don't.
        // Let's just update for now. 
        // Better yet, use the `rpc` if we create one, but I didn't create one.
        // Let's stick to fetch and update for now, or just update directly if we trust the previous value in session? No.

        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('total_time_spent')
            .eq('email', session.user.email)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentTotal = userData.total_time_spent || 0;
        const newTotal = currentTotal + secondsToAdd;

        const { error: updateError } = await supabase
            .from('users')
            .update({
                total_time_spent: newTotal,
                last_active: new Date().toISOString()
            })
            .eq('email', session.user.email);

        if (updateError) {
            console.error('Error updating session time:', updateError);
            return NextResponse.json(
                { error: 'Failed to update time' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, total_time_spent: newTotal });
    } catch (error) {
        console.error('Session heartbeat error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

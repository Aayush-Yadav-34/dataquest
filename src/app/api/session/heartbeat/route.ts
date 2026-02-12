import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/session/heartbeat - Track user session activity
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createServiceRoleClient();

        // Get user
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single() as any;

        if (userError || !userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = (userData as { id: string }).id;

        // Check if session tracking is enabled
        const { data: settingsData } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'session_time_tracking')
            .single() as any;

        if ((settingsData as { value: string } | null)?.value !== 'true') {
            return NextResponse.json({ message: 'Session tracking disabled' });
        }

        const body = await request.json();
        const { action, sessionId } = body;

        if (action === 'start') {
            // Start a new session
            const { data: newSession, error } = await supabase
                .from('session_logs' as any)
                .insert({
                    user_id: userId,
                    session_start: new Date().toISOString(),
                } as any)
                .select('id')
                .single();

            if (error) {
                console.error('Error starting session:', error);
                return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
            }

            // Update last_active
            await (supabase
                .from('users') as any)
                .update({ last_active: new Date().toISOString() })
                .eq('id', userId);

            return NextResponse.json({ sessionId: (newSession as any)?.id });

        } else if (action === 'heartbeat' && sessionId) {
            // Update last_active timestamp
            await (supabase
                .from('users') as any)
                .update({ last_active: new Date().toISOString() })
                .eq('id', userId);

            return NextResponse.json({ success: true });

        } else if (action === 'end' && sessionId) {
            // End session and calculate duration
            const { data: sessionData } = await supabase
                .from('session_logs' as any)
                .select('session_start')
                .eq('id', sessionId)
                .single();

            if (sessionData) {
                const startTime = new Date((sessionData as any).session_start);
                const endTime = new Date();
                const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

                // Update session log
                await (supabase
                    .from('session_logs' as any) as any)
                    .update({
                        session_end: endTime.toISOString(),
                        duration_seconds: durationSeconds,
                    })
                    .eq('id', sessionId);

                // Update user's total time spent
                await (supabase.rpc as any)('increment_time_spent', {
                    user_id_param: userId,
                    seconds_param: durationSeconds,
                });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Session heartbeat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

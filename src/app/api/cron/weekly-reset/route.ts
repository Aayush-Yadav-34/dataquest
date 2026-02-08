import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { resetWeeklyLeaderboard } from '@/lib/reset';

// GET /api/cron/weekly-reset - Check and trigger weekly reset
// This endpoint is public but protected by internal checks (lazy cron)
// Or we can add a secret key check if using Vercel Cron.
// Since we are using "lazy cron" triggered by users, we need to be careful not to spam.
// We'll rely on DB checks to ensure it only runs once per week.

export async function GET() {
    try {
        const supabase = createServiceRoleClient();

        // 1. Check settings
        const { data: settingsData, error } = await supabase
            .from('app_settings')
            .select('key, value')
            .in('key', ['auto_weekly_reset', 'weekly_reset_day', 'last_weekly_reset_date']);

        if (error) {
            console.error('Error fetching settings for cron:', error);
            return NextResponse.json({ error: 'Failed' }, { status: 500 });
        }

        const settings: Record<string, string | boolean> = {};
        settingsData?.forEach((s: { key: string; value: unknown }) => {
            let val = s.value;
            if (val === 'true') val = true;
            else if (val === 'false') val = false;
            else if (typeof val === 'string' && val.startsWith('"')) {
                val = val.replace(/"/g, '');
            }
            settings[s.key] = val as string | boolean;
        });

        const autoReset = settings['auto_weekly_reset'] === true;

        if (!autoReset) {
            return NextResponse.json({ message: 'Auto reset disabled' });
        }

        const resetDay = (settings['weekly_reset_day'] as string || 'monday').toLowerCase();
        const lastResetStr = settings['last_weekly_reset_date'] as string;

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Check if today is the reset day
        if (currentDay !== resetDay) {
            return NextResponse.json({ message: 'Not reset day' });
        }

        // Check if already reset today
        if (lastResetStr) {
            const lastReset = new Date(lastResetStr);
            // Check if last reset was less than 6 days ago (to be safe)
            const diffTime = Math.abs(now.getTime() - lastReset.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 6) {
                return NextResponse.json({ message: 'Already reset this week' });
            }
        }

        // Trigger reset
        const result = await resetWeeklyLeaderboard();

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Weekly reset triggered', result });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

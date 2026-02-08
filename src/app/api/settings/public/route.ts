import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/settings/public - Fetch public settings (no auth required)
export async function GET() {
    try {
        const supabase = createServiceRoleClient();

        // Fetch settings that affect the public experience
        const { data: settingsData, error } = await supabase
            .from('app_settings')
            .select('key, value')
            .in('key', ['maintenance_mode', 'allow_registration']);

        if (error) {
            console.error('Error fetching public settings:', error);
            return NextResponse.json(
                { error: 'Failed to fetch settings' },
                { status: 500 }
            );
        }

        // Convert to object format
        const settings: Record<string, unknown> = {};
        settingsData?.forEach((setting: { key: string; value: unknown }) => {
            // Parse JSON values
            let value = setting.value;
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (typeof value === 'string' && value.startsWith('"')) {
                value = value.replace(/"/g, '');
            }
            settings[setting.key] = value;
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Public settings fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

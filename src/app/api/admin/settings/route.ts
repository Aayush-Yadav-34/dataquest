import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Settings type
interface AppSettings {
    maintenance_mode: boolean;
    allow_registration: boolean;
    session_time_tracking: boolean;
    auto_weekly_reset: boolean;
    weekly_reset_day: string;
    email_notifications: boolean;
}

// GET /api/admin/settings - Fetch all settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        // Check if user is admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('email', session.user.email)
            .single();

        if (userData?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Fetch all settings
        const { data: settingsData, error } = await supabase
            .from('app_settings')
            .select('key, value');

        if (error) {
            console.error('Error fetching settings:', error);
            return NextResponse.json(
                { error: 'Failed to fetch settings' },
                { status: 500 }
            );
        }

        // Convert to object format
        const settings: Record<string, unknown> = {};
        settingsData?.forEach((setting: { key: string; value: unknown }) => {
            settings[setting.key] = setting.value;
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        // Check if user is admin
        const { data: userData } = await supabase
            .from('users')
            .select('id, role')
            .eq('email', session.user.email)
            .single();

        if (userData?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { settings } = body as { settings: Partial<AppSettings> };

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json(
                { error: 'Invalid settings data' },
                { status: 400 }
            );
        }

        // Update each setting
        const updates = Object.entries(settings).map(async ([key, value]) => {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key,
                    value: JSON.stringify(value),
                    updated_at: new Date().toISOString(),
                    updated_by: userData.id,
                });

            if (error) {
                console.error(`Error updating ${key}:`, error);
                return { key, success: false };
            }
            return { key, success: true };
        });

        const results = await Promise.all(updates);
        const failed = results.filter(r => !r.success);

        if (failed.length > 0) {
            return NextResponse.json(
                { error: `Failed to update: ${failed.map(f => f.key).join(', ')}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

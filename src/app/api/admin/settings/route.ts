import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Settings interface
interface AppSettings {
    maintenance_mode: boolean;
    allow_registration: boolean;
    session_time_tracking: boolean;
    auto_weekly_reset: boolean;
    weekly_reset_day: string;
    email_notifications: boolean;
}

// GET /api/admin/settings - Get all settings
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

        // Get all settings
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

        // Convert to object
        const settings: Record<string, string | boolean> = {};
        settingsData?.forEach((row: { key: string; value: string }) => {
            // Convert string booleans to actual booleans
            if (row.value === 'true' || row.value === 'false') {
                settings[row.key] = row.value === 'true';
            } else {
                settings[row.key] = row.value;
            }
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
            const stringValue = typeof value === 'boolean' ? value.toString() : String(value);

            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key,
                    value: stringValue,
                    updated_at: new Date().toISOString(),
                    updated_by: userData.id,
                }, { onConflict: 'key' });

            if (error) {
                console.error(`Error updating setting ${key}:`, error);
                throw error;
            }
        });

        await Promise.all(updates);

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}

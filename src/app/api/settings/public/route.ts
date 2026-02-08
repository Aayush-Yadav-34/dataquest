import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/settings/public - Get public settings (no auth required)
export async function GET() {
    try {
        const supabase = createServiceRoleClient();

        // Get specific public settings
        const { data: settingsData, error } = await supabase
            .from('app_settings')
            .select('key, value')
            .in('key', ['allow_registration', 'maintenance_mode']);

        if (error) {
            console.error('Error fetching public settings:', error);
            // Return defaults if table doesn't exist
            return NextResponse.json({
                settings: {
                    allow_registration: true,
                    maintenance_mode: false,
                }
            });
        }

        // Convert to object
        const settings: Record<string, boolean> = {
            allow_registration: true,
            maintenance_mode: false,
        };

        settingsData?.forEach((row: { key: string; value: string }) => {
            settings[row.key] = row.value === 'true';
        });

        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Public settings fetch error:', error);
        // Return defaults on error
        return NextResponse.json({
            settings: {
                allow_registration: true,
                maintenance_mode: false,
            }
        });
    }
}

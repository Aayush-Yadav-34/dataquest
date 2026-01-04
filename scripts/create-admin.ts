/**
 * Script to create an admin user in the database
 * Run with: npx tsx scripts/create-admin.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
    const email = 'admin@dataquest.com';
    const password = 'Admin@123'; // Secure password
    const username = 'admin';

    console.log('Creating admin user...');

    // Check if admin already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        console.log('Admin user already exists. Updating password...');

        const passwordHash = await bcrypt.hash(password, 12);

        const { error } = await supabase
            .from('users')
            .update({ password_hash: passwordHash })
            .eq('email', email);

        if (error) {
            console.error('Error updating admin password:', error);
            process.exit(1);
        }

        console.log('✅ Admin password updated successfully!');
    } else {
        // Create new admin user
        const passwordHash = await bcrypt.hash(password, 12);

        const { error } = await supabase.from('users').insert({
            email,
            username,
            password_hash: passwordHash,
            role: 'admin',
            xp: 0,
            level: 1,
            streak: 0,
        });

        if (error) {
            console.error('Error creating admin user:', error);
            process.exit(1);
        }

        console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\nYou can now login with these credentials.');
}

createAdminUser().catch(console.error);

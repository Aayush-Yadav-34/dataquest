// Database seed script for DataQuest
// Run: npx tsx scripts/seed-database.ts

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables!');
    console.error('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initial topics data
const topics = [
    {
        title: 'Linear Regression',
        description: 'Learn the fundamentals of linear regression and how to apply it to predict continuous values.',
        category: 'Machine Learning',
        difficulty: 'beginner',
        icon: '📈',
        xp_reward: 100,
        estimated_time: 30,
        content: JSON.stringify([
            { type: 'text', content: '# Introduction to Linear Regression\n\nLinear regression is one of the most fundamental algorithms in machine learning...' },
            { type: 'visualization', visualizationType: 'regression' },
        ]),
        order_index: 1,
    },
    {
        title: 'Decision Trees',
        description: 'Understand how decision trees work and when to use them for classification and regression.',
        category: 'Machine Learning',
        difficulty: 'beginner',
        icon: '🌳',
        xp_reward: 100,
        estimated_time: 25,
        content: JSON.stringify([]),
        order_index: 2,
    },
    {
        title: 'Random Forests',
        description: 'Master ensemble learning with Random Forests for robust predictions.',
        category: 'Machine Learning',
        difficulty: 'intermediate',
        icon: '🌲',
        xp_reward: 150,
        estimated_time: 35,
        content: JSON.stringify([]),
        order_index: 3,
    },
    {
        title: 'K-Means Clustering',
        description: 'Learn unsupervised learning with K-Means clustering algorithm.',
        category: 'Unsupervised Learning',
        difficulty: 'intermediate',
        icon: '🎯',
        xp_reward: 150,
        estimated_time: 40,
        content: JSON.stringify([]),
        order_index: 4,
    },
    {
        title: 'Neural Networks',
        description: 'Dive into deep learning with neural networks fundamentals.',
        category: 'Deep Learning',
        difficulty: 'advanced',
        icon: '🧠',
        xp_reward: 200,
        estimated_time: 60,
        content: JSON.stringify([]),
        order_index: 5,
    },
    {
        title: 'Principal Component Analysis',
        description: 'Learn dimensionality reduction with PCA.',
        category: 'Unsupervised Learning',
        difficulty: 'advanced',
        icon: '📊',
        xp_reward: 200,
        estimated_time: 45,
        content: JSON.stringify([]),
        order_index: 6,
    },
];

// Initial badges data
const badges = [
    { name: 'First Steps', description: 'Complete your first topic', icon: '🎯', criteria_type: 'topics', criteria_value: 1 },
    { name: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🏆', criteria_type: 'quiz_perfect', criteria_value: 1 },
    { name: 'Data Explorer', description: 'Upload your first dataset', icon: '📊', criteria_type: 'uploads', criteria_value: 1 },
    { name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', criteria_type: 'streak', criteria_value: 7 },
    { name: 'Rising Star', description: 'Reach Level 10', icon: '⭐', criteria_type: 'level', criteria_value: 10 },
    { name: 'Algorithm Ace', description: 'Complete all ML algorithms', icon: '🤖', criteria_type: 'category', criteria_value: 10 },
];

async function seed() {
    console.log('🌱 Starting database seed...');
    console.log('URL:', supabaseUrl);

    // Insert topics
    console.log('\nCreating topics...');
    for (const topic of topics) {
        const { error } = await supabase
            .from('topics')
            .upsert(topic, { onConflict: 'title' });

        if (error) {
            console.error(`  ❌ Error creating topic "${topic.title}":`, error.message);
        } else {
            console.log(`  ✅ ${topic.title}`);
        }
    }

    // Insert badges
    console.log('\nCreating badges...');
    for (const badge of badges) {
        const { error } = await supabase
            .from('badges')
            .upsert(badge, { onConflict: 'name' });

        if (error) {
            console.error(`  ❌ Error creating badge "${badge.name}":`, error.message);
        } else {
            console.log(`  ✅ ${badge.name}`);
        }
    }

    console.log('\n🎉 Database seed complete!');
}

// Run
seed().catch(console.error);

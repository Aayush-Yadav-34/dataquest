/**
 * Script to seed quizzes and quiz questions to the database
 * Run with: npx tsx scripts/seed-quizzes.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Quiz data with questions
const quizData = [
    {
        title: 'Linear Regression Fundamentals',
        topic_title: 'Linear Regression',
        time_limit: 300,
        xp_reward: 100,
        passing_score: 70,
        questions: [
            {
                question: 'What does the slope (m) in y = mx + b represent?',
                options: ['The y-intercept', 'The rate of change of y with respect to x', 'The error term', 'The predicted value'],
                correct_answer: 1,
                explanation: 'The slope represents how much y changes for each unit change in x.',
                difficulty: 'easy'
            },
            {
                question: 'Which method is commonly used to find the best-fitting line in linear regression?',
                options: ['Gradient Boosting', 'Least Squares', 'K-Means', 'Random Forest'],
                correct_answer: 1,
                explanation: 'Least Squares minimizes the sum of squared differences between predicted and actual values.',
                difficulty: 'easy'
            },
            {
                question: 'What is R² (coefficient of determination)?',
                options: ['The correlation coefficient', 'The proportion of variance explained by the model', 'The error rate', 'The learning rate'],
                correct_answer: 1,
                explanation: 'R² indicates how well the model explains the variability in the dependent variable.',
                difficulty: 'medium'
            },
        ],
    },
    {
        title: 'Decision Trees Quiz',
        topic_title: 'Decision Trees',
        time_limit: 300,
        xp_reward: 100,
        passing_score: 70,
        questions: [
            {
                question: 'What metric measures the impurity of a node in a decision tree?',
                options: ['R-squared', 'Gini impurity', 'F1 score', 'Learning rate'],
                correct_answer: 1,
                explanation: 'Gini impurity measures the probability of incorrectly classifying a random sample.',
                difficulty: 'easy'
            },
            {
                question: 'What is pruning in decision trees?',
                options: ['Adding more nodes', 'Removing nodes to prevent overfitting', 'Increasing depth', 'Splitting data'],
                correct_answer: 1,
                explanation: 'Pruning removes nodes that provide little power to classify instances, reducing overfitting.',
                difficulty: 'medium'
            },
            {
                question: 'Which is NOT an advantage of decision trees?',
                options: ['Easy to interpret', 'Handles non-linear relationships', 'Requires feature scaling', 'Works with categorical data'],
                correct_answer: 2,
                explanation: 'Decision trees do NOT require feature scaling, unlike many other algorithms.',
                difficulty: 'medium'
            },
        ],
    },
    {
        title: 'Random Forests Challenge',
        topic_title: 'Random Forests',
        time_limit: 360,
        xp_reward: 150,
        passing_score: 70,
        questions: [
            {
                question: 'What technique does Random Forest use to train individual trees?',
                options: ['Boosting', 'Bagging (Bootstrap Aggregating)', 'Stacking', 'Blending'],
                correct_answer: 1,
                explanation: 'Random Forest uses bagging to create diverse training sets for each tree.',
                difficulty: 'easy'
            },
            {
                question: 'How does Random Forest make predictions for classification?',
                options: ['Uses the first tree only', 'Majority voting from all trees', 'Weighted average of trees', 'Only the deepest tree'],
                correct_answer: 1,
                explanation: 'Each tree votes and the class with the most votes wins.',
                difficulty: 'easy'
            },
            {
                question: 'What is the purpose of feature randomness in Random Forest?',
                options: ['Speed up training', 'Reduce correlation between trees', 'Increase accuracy', 'Reduce memory usage'],
                correct_answer: 1,
                explanation: 'Feature randomness decorrelates trees, making errors cancel out when aggregated.',
                difficulty: 'hard'
            },
            {
                question: 'What is Out-of-Bag (OOB) error?',
                options: ['Training error', 'Validation error using samples not in bootstrap', 'Test set error', 'Cross-validation error'],
                correct_answer: 1,
                explanation: 'OOB error uses samples that weren\'t selected in the bootstrap sample for validation.',
                difficulty: 'hard'
            },
        ],
    },
    {
        title: 'K-Means Clustering Quiz',
        topic_title: 'K-Means Clustering',
        time_limit: 360,
        xp_reward: 150,
        passing_score: 70,
        questions: [
            {
                question: 'What type of learning is K-Means clustering?',
                options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Semi-supervised'],
                correct_answer: 1,
                explanation: 'K-Means is unsupervised because it finds patterns without labeled data.',
                difficulty: 'easy'
            },
            {
                question: 'What does the "K" in K-Means represent?',
                options: ['Number of features', 'Number of clusters', 'Number of iterations', 'Number of samples'],
                correct_answer: 1,
                explanation: 'K is the number of clusters the algorithm will create.',
                difficulty: 'easy'
            },
            {
                question: 'What is the Elbow Method used for?',
                options: ['Choosing optimal features', 'Choosing optimal K value', 'Measuring accuracy', 'Reducing dimensions'],
                correct_answer: 1,
                explanation: 'The Elbow Method helps find the optimal number of clusters by plotting WCSS.',
                difficulty: 'medium'
            },
            {
                question: 'What does WCSS (Within-Cluster Sum of Squares) measure?',
                options: ['Distance between clusters', 'Compactness of clusters', 'Number of iterations', 'Feature importance'],
                correct_answer: 1,
                explanation: 'WCSS measures how compact the clusters are - lower is better.',
                difficulty: 'medium'
            },
        ],
    },
    {
        title: 'Neural Networks Basics',
        topic_title: 'Neural Networks',
        time_limit: 420,
        xp_reward: 200,
        passing_score: 70,
        questions: [
            {
                question: 'What is the purpose of an activation function?',
                options: ['Initialize weights', 'Introduce non-linearity', 'Reduce overfitting', 'Speed up training'],
                correct_answer: 1,
                explanation: 'Activation functions add non-linearity, allowing networks to learn complex patterns.',
                difficulty: 'easy'
            },
            {
                question: 'Which activation function is most commonly used in hidden layers?',
                options: ['Sigmoid', 'ReLU', 'Softmax', 'Linear'],
                correct_answer: 1,
                explanation: 'ReLU (Rectified Linear Unit) is popular for its simplicity and effectiveness.',
                difficulty: 'easy'
            },
            {
                question: 'What is backpropagation?',
                options: ['Forward pass of data', 'Algorithm to calculate gradients for weight updates', 'Data augmentation technique', 'Regularization method'],
                correct_answer: 1,
                explanation: 'Backpropagation calculates gradients of the loss function with respect to weights.',
                difficulty: 'medium'
            },
            {
                question: 'What is the vanishing gradient problem?',
                options: ['Gradients become too large', 'Gradients become near zero in deep networks', 'Training is too fast', 'Overfitting issue'],
                correct_answer: 1,
                explanation: 'In deep networks with sigmoid/tanh, gradients can become very small, slowing learning.',
                difficulty: 'hard'
            },
            {
                question: 'What does dropout do during training?',
                options: ['Removes layers', 'Randomly sets neurons to zero', 'Increases learning rate', 'Adds noise to data'],
                correct_answer: 1,
                explanation: 'Dropout randomly deactivates neurons during training to prevent overfitting.',
                difficulty: 'medium'
            },
        ],
    },
    {
        title: 'PCA and Dimensionality Reduction',
        topic_title: 'Principal Component Analysis',
        time_limit: 420,
        xp_reward: 200,
        passing_score: 70,
        questions: [
            {
                question: 'What is the main goal of PCA?',
                options: ['Increase dimensions', 'Reduce dimensions while preserving variance', 'Classify data', 'Cluster data'],
                correct_answer: 1,
                explanation: 'PCA reduces dimensionality while keeping as much variance as possible.',
                difficulty: 'easy'
            },
            {
                question: 'What are principal components?',
                options: ['Original features', 'New axes that capture maximum variance', 'Outliers', 'Cluster centers'],
                correct_answer: 1,
                explanation: 'Principal components are new orthogonal axes ordered by variance captured.',
                difficulty: 'easy'
            },
            {
                question: 'Why is data standardization important before PCA?',
                options: ['Speed up computation', 'Ensure all features contribute equally', 'Reduce noise', 'Increase accuracy'],
                correct_answer: 1,
                explanation: 'Without standardization, features with larger scales would dominate PCA.',
                difficulty: 'medium'
            },
            {
                question: 'What does explained variance ratio tell you?',
                options: ['Model accuracy', 'Proportion of information captured by each component', 'Training time', 'Number of features'],
                correct_answer: 1,
                explanation: 'It shows how much of the original variance each principal component explains.',
                difficulty: 'medium'
            },
        ],
    },
];

async function seedQuizzes() {
    console.log('🧩 Seeding quizzes to database...\n');

    // First, get all topics to match quiz to topic
    const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, title');

    if (topicsError) {
        console.error('Error fetching topics:', topicsError);
        return;
    }

    for (const quiz of quizData) {
        // Find matching topic
        const topic = topics?.find(t => t.title === quiz.topic_title);

        if (!topic) {
            console.log(`⚠️  Topic "${quiz.topic_title}" not found, skipping quiz`);
            continue;
        }

        // Insert quiz
        const { data: insertedQuiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                topic_id: topic.id,
                title: quiz.title,
                time_limit: quiz.time_limit,
                xp_reward: quiz.xp_reward,
            })
            .select('id')
            .single();

        if (quizError) {
            console.error(`❌ Error creating quiz "${quiz.title}":`, quizError.message);
            continue;
        }

        console.log(`✅ Quiz: ${quiz.title}`);

        // Insert questions
        for (const question of quiz.questions) {
            const { error: questionError } = await supabase
                .from('quiz_questions')
                .insert({
                    quiz_id: insertedQuiz.id,
                    question: question.question,
                    options: question.options,
                    correct_answer: question.correct_answer,
                    explanation: question.explanation,
                });

            if (questionError) {
                console.error(`   ❌ Error adding question:`, questionError.message);
            } else {
                console.log(`   📝 Added question: ${question.question.substring(0, 40)}...`);
            }
        }
    }

    console.log('\n🎉 Quiz seeding complete!');
}

seedQuizzes().catch(console.error);

import { Topic, Quiz, QuizQuestion, LeaderboardEntry, TheoryModule } from '@/types';

// Mock Topics Data
export const mockTopics: Topic[] = [
    {
        id: 'linear-regression',
        title: 'Linear Regression',
        description: 'Learn the fundamentals of linear regression and how to predict continuous outcomes.',
        difficulty: 'beginner',
        category: 'Machine Learning',
        xpReward: 100,
        estimatedTime: 30,
        locked: false,
        completed: true,
        progress: 100,
        icon: '📈',
    },
    {
        id: 'logistic-regression',
        title: 'Logistic Regression',
        description: 'Master binary classification using logistic regression models.',
        difficulty: 'beginner',
        category: 'Machine Learning',
        xpReward: 100,
        estimatedTime: 35,
        locked: false,
        completed: true,
        progress: 100,
        icon: '🎯',
    },
    {
        id: 'decision-trees',
        title: 'Decision Trees',
        description: 'Understand tree-based models for classification and regression.',
        difficulty: 'intermediate',
        category: 'Machine Learning',
        xpReward: 150,
        estimatedTime: 45,
        locked: false,
        completed: false,
        progress: 65,
        icon: '🌳',
    },
    {
        id: 'random-forests',
        title: 'Random Forests',
        description: 'Learn ensemble methods and bagging with random forests.',
        difficulty: 'intermediate',
        category: 'Machine Learning',
        xpReward: 150,
        estimatedTime: 50,
        locked: false,
        completed: false,
        progress: 30,
        icon: '🌲',
        prerequisites: ['decision-trees'],
    },
    {
        id: 'neural-networks',
        title: 'Neural Networks',
        description: 'Introduction to artificial neural networks and deep learning basics.',
        difficulty: 'advanced',
        category: 'Deep Learning',
        xpReward: 200,
        estimatedTime: 60,
        locked: false,
        completed: false,
        progress: 0,
        icon: '🧠',
    },
    {
        id: 'cnn',
        title: 'Convolutional Neural Networks',
        description: 'Master CNNs for image recognition and computer vision tasks.',
        difficulty: 'advanced',
        category: 'Deep Learning',
        xpReward: 250,
        estimatedTime: 75,
        locked: true,
        completed: false,
        progress: 0,
        icon: '🖼️',
        prerequisites: ['neural-networks'],
    },
    {
        id: 'clustering',
        title: 'Clustering Algorithms',
        description: 'Explore K-Means, DBSCAN, and hierarchical clustering.',
        difficulty: 'intermediate',
        category: 'Unsupervised Learning',
        xpReward: 150,
        estimatedTime: 40,
        locked: false,
        completed: false,
        progress: 0,
        icon: '🎨',
    },
    {
        id: 'pca',
        title: 'Principal Component Analysis',
        description: 'Learn dimensionality reduction with PCA.',
        difficulty: 'intermediate',
        category: 'Unsupervised Learning',
        xpReward: 150,
        estimatedTime: 35,
        locked: false,
        completed: false,
        progress: 0,
        icon: '📊',
    },
    {
        id: 'data-preprocessing',
        title: 'Data Preprocessing',
        description: 'Master data cleaning, normalization, and feature engineering.',
        difficulty: 'beginner',
        category: 'Data Science Fundamentals',
        xpReward: 80,
        estimatedTime: 25,
        locked: false,
        completed: true,
        progress: 100,
        icon: '🧹',
    },
    {
        id: 'eda',
        title: 'Exploratory Data Analysis',
        description: 'Learn to explore and visualize datasets effectively.',
        difficulty: 'beginner',
        category: 'Data Science Fundamentals',
        xpReward: 80,
        estimatedTime: 30,
        locked: false,
        completed: true,
        progress: 100,
        icon: '🔍',
    },
    {
        id: 'nlp-basics',
        title: 'NLP Fundamentals',
        description: 'Introduction to Natural Language Processing concepts.',
        difficulty: 'advanced',
        category: 'Natural Language Processing',
        xpReward: 200,
        estimatedTime: 55,
        locked: true,
        completed: false,
        progress: 0,
        icon: '📝',
    },
    {
        id: 'time-series',
        title: 'Time Series Analysis',
        description: 'Learn to analyze and forecast time-based data.',
        difficulty: 'advanced',
        category: 'Time Series',
        xpReward: 200,
        estimatedTime: 50,
        locked: true,
        completed: false,
        progress: 0,
        icon: '⏰',
    },
];

// Mock Quizzes Data
export const mockQuizQuestions: QuizQuestion[] = [
    {
        id: 'q1',
        question: 'What is the primary goal of linear regression?',
        options: [
            'To classify data into categories',
            'To predict continuous numerical values',
            'To cluster similar data points',
            'To reduce dimensionality',
        ],
        correctAnswer: 1,
        explanation: 'Linear regression is used to predict continuous numerical values based on input features.',
        difficulty: 'easy',
    },
    {
        id: 'q2',
        question: 'Which loss function is commonly used in linear regression?',
        options: [
            'Cross-entropy loss',
            'Hinge loss',
            'Mean Squared Error (MSE)',
            'Log loss',
        ],
        correctAnswer: 2,
        explanation: 'MSE measures the average squared difference between predicted and actual values.',
        difficulty: 'medium',
    },
    {
        id: 'q3',
        question: 'What does R² (coefficient of determination) measure?',
        options: [
            'The slope of the regression line',
            'The y-intercept of the model',
            'The proportion of variance explained by the model',
            'The number of features used',
        ],
        correctAnswer: 2,
        explanation: 'R² indicates how well the model explains the variability in the target variable.',
        difficulty: 'medium',
    },
    {
        id: 'q4',
        question: 'In K-Means clustering, what does K represent?',
        options: [
            'The number of features',
            'The number of data points',
            'The number of clusters',
            'The learning rate',
        ],
        correctAnswer: 2,
        explanation: 'K represents the number of clusters the algorithm will form.',
        difficulty: 'easy',
    },
    {
        id: 'q5',
        question: 'What is the purpose of an activation function in neural networks?',
        options: [
            'To initialize weights',
            'To introduce non-linearity',
            'To reduce overfitting',
            'To normalize inputs',
        ],
        correctAnswer: 1,
        explanation: 'Activation functions introduce non-linearity, allowing networks to learn complex patterns.',
        difficulty: 'hard',
    },
];

export const mockQuizzes: Quiz[] = [
    {
        id: 'quiz-ml-basics',
        topicId: 'linear-regression',
        title: 'ML Fundamentals Quiz',
        description: 'Test your knowledge of machine learning basics',
        questions: mockQuizQuestions.slice(0, 3),
        timeLimit: 300,
        xpReward: 100,
        passingScore: 70,
    },
    {
        id: 'quiz-clustering',
        topicId: 'clustering',
        title: 'Clustering Concepts',
        description: 'Master clustering algorithms',
        questions: mockQuizQuestions.slice(3, 5),
        timeLimit: 180,
        xpReward: 80,
        passingScore: 70,
    },
];

// Mock Leaderboard Data
export const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 'u1', username: 'MLMaster', avatar: '/avatars/1.png', xp: 15420, level: 38, college: 'Stanford', change: 0 },
    { rank: 2, userId: 'u2', username: 'DataNinja', avatar: '/avatars/2.png', xp: 14850, level: 36, college: 'MIT', change: 1 },
    { rank: 3, userId: 'u3', username: 'AIWizard', avatar: '/avatars/3.png', xp: 14200, level: 35, college: 'CMU', change: -1 },
    { rank: 4, userId: 'u4', username: 'NeuralKing', avatar: '/avatars/4.png', xp: 13600, level: 34, college: 'Berkeley', change: 2 },
    { rank: 5, userId: 'u5', username: 'DeepDiver', avatar: '/avatars/5.png', xp: 12900, level: 33, college: 'Harvard', change: 0 },
    { rank: 6, userId: 'u6', username: 'CodeQueen', avatar: '/avatars/6.png', xp: 12300, level: 32, college: 'Caltech', change: -2 },
    { rank: 7, userId: 'u7', username: 'PyGenius', avatar: '/avatars/7.png', xp: 11800, level: 31, college: 'Princeton', change: 1 },
    { rank: 8, userId: 'u8', username: 'StatsPro', avatar: '/avatars/8.png', xp: 11200, level: 30, college: 'Yale', change: -1 },
    { rank: 9, userId: 'u9', username: 'AlgoAce', avatar: '/avatars/9.png', xp: 10600, level: 29, college: 'Columbia', change: 3 },
    { rank: 10, userId: 'u10', username: 'CloudML', avatar: '/avatars/10.png', xp: 10000, level: 28, college: 'UCLA', change: 0 },
    // Current user
    { rank: 42, userId: 'user-1', username: 'DataWizard', avatar: '/avatars/default.png', xp: 2450, level: 15, college: 'MIT', isCurrentUser: true, change: 5 },
];

// Mock Theory Content
export const mockTheoryModules: Record<string, TheoryModule> = {
    'linear-regression': {
        topicId: 'linear-regression',
        sections: [
            {
                id: 'intro',
                title: 'Introduction to Linear Regression',
                content: `
# Linear Regression

Linear regression is one of the most fundamental algorithms in machine learning and statistics. It's used to model the relationship between a **dependent variable** and one or more **independent variables**.

## The Basic Concept

The goal is to find the best-fitting straight line through the data points. This line is called the **regression line**.

### The Equation

For simple linear regression with one variable:

\`\`\`
y = mx + b
\`\`\`

Where:
- **y** is the predicted value
- **m** is the slope (coefficient)
- **x** is the input feature
- **b** is the y-intercept (bias)

## When to Use Linear Regression

Use linear regression when:
- You want to predict a continuous outcome
- You believe there's a linear relationship between variables
- You need an interpretable model
`,
            },
            {
                id: 'visualization',
                title: 'Visualizing Linear Regression',
                content: `
# Visualizing the Regression Line

Understanding linear regression is much easier when you can see it in action. The interactive visualization below shows how the regression line fits through data points.

## Key Observations

1. **Best Fit**: The line minimizes the total distance from all points
2. **Residuals**: The vertical distances from points to the line
3. **Slope Impact**: Steeper slopes indicate stronger relationships
`,
            },
            {
                id: 'practice',
                title: 'Practice Problems',
                content: `
# Practice Your Skills

Now it's time to apply what you've learned!

## Exercise 1: House Price Prediction

Given a dataset of house sizes and prices, can you:
1. Identify the relationship between size and price?
2. Predict the price of a 2000 sq ft house?

## Key Takeaways

- Linear regression is great for continuous predictions
- Always check your R² value
- Visualize your data before modeling
`,
            },
        ],
    },
    'clustering': {
        topicId: 'clustering',
        sections: [
            {
                id: 'intro',
                title: 'Introduction to Clustering',
                content: `
# Clustering Algorithms

Clustering is an **unsupervised learning** technique used to group similar data points together without pre-defined labels.

## Popular Clustering Algorithms

### 1. K-Means
The most popular clustering algorithm. It partitions data into K clusters where each point belongs to the cluster with the nearest centroid.

### 2. DBSCAN
Density-Based Spatial Clustering of Applications with Noise. Great for finding clusters of arbitrary shapes.

### 3. Hierarchical Clustering
Creates a tree of clusters, useful when you want to see relationships between clusters.

## Applications
- Customer segmentation
- Image compression
- Anomaly detection
- Document categorization
`,
            },
        ],
    },
    'pca': {
        topicId: 'pca',
        sections: [
            {
                id: 'intro',
                title: 'Understanding PCA',
                content: `
# Principal Component Analysis (PCA)

PCA is a **dimensionality reduction** technique that transforms high-dimensional data into a lower-dimensional space while preserving as much variance as possible.

## Why Use PCA?

1. **Reduce Complexity**: Simplify datasets with many features
2. **Visualization**: Project high-dimensional data to 2D/3D for visualization
3. **Remove Noise**: Focus on the most important patterns
4. **Speed Up Training**: Fewer features = faster algorithms

## How It Works

1. Standardize the data
2. Compute the covariance matrix
3. Find eigenvectors and eigenvalues
4. Select top k eigenvectors (principal components)
5. Transform the original data

The visualization below shows how PCA reduces a 3D dataset to 2D while maintaining the cluster structure.
`,
            },
        ],
    },
};

// Sample dataset for demo
export const sampleDataset = [
    { id: 1, age: 25, income: 50000, spending_score: 45, category: 'A' },
    { id: 2, age: 32, income: 75000, spending_score: 72, category: 'B' },
    { id: 3, age: 41, income: 120000, spending_score: 85, category: 'A' },
    { id: 4, age: 28, income: 55000, spending_score: 52, category: 'C' },
    { id: 5, age: 35, income: 95000, spending_score: 78, category: 'B' },
    { id: 6, age: 22, income: 35000, spending_score: 38, category: 'C' },
    { id: 7, age: 48, income: 150000, spending_score: 92, category: 'A' },
    { id: 8, age: 30, income: 68000, spending_score: 65, category: 'B' },
    { id: 9, age: 38, income: 88000, spending_score: 70, category: 'A' },
    { id: 10, age: 26, income: 42000, spending_score: 48, category: 'C' },
];

// Skills for radar chart
export const skillsData = [
    { skill: 'Regression', value: 85, fullMark: 100 },
    { skill: 'Classification', value: 72, fullMark: 100 },
    { skill: 'Clustering', value: 65, fullMark: 100 },
    { skill: 'Neural Networks', value: 45, fullMark: 100 },
    { skill: 'NLP', value: 30, fullMark: 100 },
    { skill: 'Data Viz', value: 90, fullMark: 100 },
];

// Accuracy trend data
export const accuracyTrendData = [
    { week: 'Week 1', accuracy: 65 },
    { week: 'Week 2', accuracy: 68 },
    { week: 'Week 3', accuracy: 72 },
    { week: 'Week 4', accuracy: 70 },
    { week: 'Week 5', accuracy: 75 },
    { week: 'Week 6', accuracy: 78 },
    { week: 'Week 7', accuracy: 82 },
    { week: 'Week 8', accuracy: 78 },
];

// Time spent per topic
export const timeSpentData = [
    { topic: 'Linear Regression', hours: 8 },
    { topic: 'Logistic Regression', hours: 6 },
    { topic: 'Decision Trees', hours: 10 },
    { topic: 'Random Forests', hours: 4 },
    { topic: 'Data Preprocessing', hours: 5 },
    { topic: 'EDA', hours: 7 },
];

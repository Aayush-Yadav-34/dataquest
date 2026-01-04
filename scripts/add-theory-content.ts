/**
 * Script to add theory content to topics in the database
 * Run with: npx tsx scripts/add-theory-content.ts
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

// Theory content for each topic
const theoryContent: Record<string, object[]> = {
    'Linear Regression': [
        {
            type: 'section',
            title: 'What is Linear Regression?',
            content: `Linear regression is one of the most fundamental and widely used algorithms in machine learning and statistics. It's a supervised learning technique that models the relationship between a dependent variable (y) and one or more independent variables (x).

The goal is to find the best-fitting straight line through the data points. This line is called the **regression line** or **line of best fit**.`,
        },
        {
            type: 'section',
            title: 'The Math Behind It',
            content: `The equation for simple linear regression is:

**y = mx + b**

Where:
- **y** = predicted value (dependent variable)
- **x** = input feature (independent variable)
- **m** = slope of the line (how much y changes for each unit change in x)
- **b** = y-intercept (value of y when x = 0)

For multiple linear regression with multiple features:
**y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ**`,
        },
        {
            type: 'code',
            title: 'Python Implementation',
            language: 'python',
            content: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

print(f"Slope: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")`,
        },
        {
            type: 'section',
            title: 'When to Use Linear Regression',
            content: `Linear regression works best when:

✅ The relationship between variables is **linear**
✅ The dependent variable is **continuous**
✅ Features are **not highly correlated** with each other
✅ Data has **minimal outliers**

Common applications:
- Predicting house prices
- Sales forecasting
- Risk assessment
- Stock price prediction`,
        },
        {
            type: 'quiz',
            title: 'Quick Check',
            questions: [
                {
                    question: 'In the equation y = mx + b, what does "m" represent?',
                    options: ['Y-intercept', 'Slope', 'Predicted value', 'Error term'],
                    correct: 1,
                },
                {
                    question: 'Linear regression is best suited for predicting:',
                    options: ['Categories', 'Continuous values', 'Binary outcomes', 'Text'],
                    correct: 1,
                },
            ],
        },
    ],
    'Decision Trees': [
        {
            type: 'section',
            title: 'Understanding Decision Trees',
            content: `Decision Trees are powerful, intuitive machine learning algorithms that make decisions by splitting data based on feature values. Think of it like a flowchart where each internal node represents a decision based on a feature.

The tree structure consists of:
- **Root Node**: The topmost node representing the entire dataset
- **Internal Nodes**: Decision points that split data
- **Leaf Nodes**: Terminal nodes that represent the final prediction`,
        },
        {
            type: 'section',
            title: 'How Splits Are Made',
            content: `The algorithm chooses the best feature to split on using metrics like:

**1. Gini Impurity**
Measures the probability of incorrectly classifying a random sample.
Formula: Gini = 1 - Σ(pᵢ)²

**2. Information Gain (Entropy)**
Measures the reduction in uncertainty after a split.
Entropy = -Σ(pᵢ × log₂(pᵢ))

The feature that provides the **maximum information gain** (or minimum impurity) is selected for the split.`,
        },
        {
            type: 'code',
            title: 'Python Implementation',
            language: 'python',
            content: `from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree

# Load data
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

# Create and train model
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
accuracy = clf.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")

# Visualize the tree
plt.figure(figsize=(20, 10))
plot_tree(clf, feature_names=iris.feature_names, 
          class_names=iris.target_names, filled=True)
plt.show()`,
        },
        {
            type: 'section',
            title: 'Pros and Cons',
            content: `**Advantages:**
✅ Easy to understand and interpret
✅ Handles both numerical and categorical data
✅ Requires minimal data preprocessing
✅ Can capture non-linear relationships

**Disadvantages:**
❌ Prone to overfitting
❌ Can be unstable (small changes in data → different tree)
❌ Biased towards features with more levels
❌ May not generalize well on new data`,
        },
    ],
    'Random Forests': [
        {
            type: 'section',
            title: 'Ensemble Learning with Random Forests',
            content: `Random Forest is an ensemble learning method that combines multiple decision trees to create a more robust and accurate model. It's like crowdsourcing predictions - instead of relying on one expert, you ask many experts and take their collective vote.

**Key Concepts:**
- **Bagging (Bootstrap Aggregating)**: Each tree is trained on a random subset of data
- **Feature Randomness**: Each split considers only a random subset of features
- **Voting/Averaging**: Final prediction is the majority vote (classification) or average (regression)`,
        },
        {
            type: 'section',
            title: 'Why Random Forests Work',
            content: `The power of Random Forests comes from **diversity**:

1. **Different training data** - Each tree sees a different bootstrap sample
2. **Different features** - Each split considers random features
3. **Decorrelated trees** - Trees make different errors, which cancel out

This combination reduces:
- **Variance** - By averaging multiple trees
- **Overfitting** - By limiting what each tree can learn
- **Bias** - By combining many weak learners`,
        },
        {
            type: 'code',
            title: 'Python Implementation',
            language: 'python',
            content: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=20,
                           n_informative=10, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Create Random Forest with 100 trees
rf = RandomForestClassifier(
    n_estimators=100,    # Number of trees
    max_depth=10,        # Maximum depth per tree
    min_samples_split=5, # Minimum samples to split
    random_state=42
)

rf.fit(X_train, y_train)

# Get feature importance
importance = rf.feature_importances_
print("Top 5 important features:")
for i in sorted(range(len(importance)), key=lambda i: importance[i], reverse=True)[:5]:
    print(f"  Feature {i}: {importance[i]:.4f}")

print(f"\\nAccuracy: {rf.score(X_test, y_test):.2%}")`,
        },
        {
            type: 'section',
            title: 'Hyperparameter Tuning',
            content: `Key hyperparameters to tune:

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| n_estimators | Number of trees | 100-1000 |
| max_depth | Max depth per tree | 5-50 or None |
| min_samples_split | Min samples to split | 2-20 |
| max_features | Features per split | "sqrt", "log2", or int |

**Tips:**
- Start with 100 trees and increase if needed
- Use cross-validation for tuning
- More trees = better accuracy but slower training`,
        },
    ],
    'K-Means Clustering': [
        {
            type: 'section',
            title: 'Introduction to K-Means',
            content: `K-Means is an unsupervised learning algorithm used to partition data into K distinct clusters. Unlike supervised learning, there are no labels - the algorithm discovers patterns on its own.

**The Goal:** Group similar data points together while keeping different groups as separate as possible.

**Real-world Applications:**
- Customer segmentation
- Image compression
- Anomaly detection
- Document clustering`,
        },
        {
            type: 'section',
            title: 'How K-Means Works',
            content: `The algorithm follows these steps:

**1. Initialization**
Randomly place K centroids in the feature space

**2. Assignment**
Assign each point to the nearest centroid

**3. Update**
Recalculate centroid positions as the mean of assigned points

**4. Repeat**
Continue steps 2-3 until centroids stop moving (convergence)

The algorithm minimizes the **Within-Cluster Sum of Squares (WCSS)**:
WCSS = Σ Σ ||xᵢ - μₖ||²`,
        },
        {
            type: 'code',
            title: 'Python Implementation',
            language: 'python',
            content: `from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt

# Generate sample data with 4 clusters
X, true_labels = make_blobs(n_samples=300, centers=4, 
                            cluster_std=0.6, random_state=42)

# Run K-Means
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
predicted_labels = kmeans.fit_predict(X)

# Get cluster centers
centers = kmeans.cluster_centers_
print(f"Inertia (WCSS): {kmeans.inertia_:.2f}")

# Visualize
plt.figure(figsize=(10, 6))
plt.scatter(X[:, 0], X[:, 1], c=predicted_labels, cmap='viridis', alpha=0.6)
plt.scatter(centers[:, 0], centers[:, 1], c='red', marker='X', s=200)
plt.title("K-Means Clustering Result")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()`,
        },
        {
            type: 'section',
            title: 'Choosing the Right K',
            content: `The **Elbow Method** helps determine optimal K:

1. Run K-Means for K = 1, 2, 3, ... n
2. Calculate WCSS for each K
3. Plot K vs WCSS
4. Look for the "elbow" - where WCSS starts decreasing slowly

**Other methods:**
- **Silhouette Score**: Measures how similar points are to their own cluster vs others
- **Gap Statistic**: Compares WCSS to null reference distribution
- **Domain knowledge**: Sometimes you know how many clusters make sense`,
        },
    ],
    'Neural Networks': [
        {
            type: 'section',
            title: 'What are Neural Networks?',
            content: `Neural Networks are computational models inspired by the human brain. They consist of interconnected nodes (neurons) organized in layers that can learn complex patterns from data.

**Architecture:**
- **Input Layer**: Receives the raw data
- **Hidden Layers**: Process and transform the data
- **Output Layer**: Produces the final prediction

Each connection has a **weight** that is learned during training. The network learns by adjusting these weights to minimize prediction error.`,
        },
        {
            type: 'section',
            title: 'How Neurons Work',
            content: `Each neuron performs two operations:

**1. Weighted Sum**
z = Σ(wᵢ × xᵢ) + b
- w = weights
- x = inputs
- b = bias

**2. Activation Function**
a = f(z)

Common activation functions:
- **ReLU**: f(x) = max(0, x) - most popular for hidden layers
- **Sigmoid**: f(x) = 1/(1+e⁻ˣ) - output between 0 and 1
- **Softmax**: Converts outputs to probabilities (multi-class)`,
        },
        {
            type: 'code',
            title: 'Building a Neural Network with PyTorch',
            language: 'python',
            content: `import torch
import torch.nn as nn
import torch.optim as optim

# Define a simple neural network
class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_size, hidden_size)
        self.layer3 = nn.Linear(hidden_size, output_size)
        self.softmax = nn.Softmax(dim=1)
    
    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.softmax(self.layer3(x))
        return x

# Create model
model = SimpleNN(input_size=10, hidden_size=64, output_size=3)

# Loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop (simplified)
# for epoch in range(epochs):
#     outputs = model(inputs)
#     loss = criterion(outputs, labels)
#     optimizer.zero_grad()
#     loss.backward()
#     optimizer.step()`,
        },
        {
            type: 'section',
            title: 'Training Neural Networks',
            content: `**Backpropagation** is how neural networks learn:

1. **Forward Pass**: Input flows through network, producing prediction
2. **Calculate Loss**: Measure difference between prediction and actual value
3. **Backward Pass**: Calculate gradients of loss with respect to weights
4. **Update Weights**: Adjust weights to minimize loss (gradient descent)

**Key concepts:**
- **Learning Rate**: How big are the weight updates
- **Batch Size**: How many samples to process at once
- **Epochs**: How many times to see the entire dataset
- **Regularization**: Prevent overfitting (dropout, L2)`,
        },
    ],
    'Principal Component Analysis': [
        {
            type: 'section',
            title: 'What is PCA?',
            content: `Principal Component Analysis (PCA) is an unsupervised dimensionality reduction technique. It transforms high-dimensional data into a lower-dimensional space while preserving as much variance (information) as possible.

**Why reduce dimensions?**
- 📉 Reduce computational cost
- 📊 Visualize high-dimensional data
- 🎯 Remove noise and redundancy
- 🚀 Improve model performance`,
        },
        {
            type: 'section',
            title: 'How PCA Works',
            content: `PCA finds new axes (principal components) that capture the most variance:

**Step 1: Standardize the data**
Center data to zero mean and unit variance

**Step 2: Compute covariance matrix**
Shows how features vary together

**Step 3: Calculate eigenvectors and eigenvalues**
Eigenvectors = directions of maximum variance
Eigenvalues = amount of variance in each direction

**Step 4: Select top k components**
Keep the components that explain most variance

**Step 5: Project data**
Transform data onto new axes`,
        },
        {
            type: 'code',
            title: 'Python Implementation',
            language: 'python',
            content: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris
import matplotlib.pyplot as plt

# Load and standardize data
iris = load_iris()
X = StandardScaler().fit_transform(iris.data)

# Apply PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Explained variance
print("Explained variance ratio:", pca.explained_variance_ratio_)
print("Total variance explained:", sum(pca.explained_variance_ratio_))

# Visualize
plt.figure(figsize=(10, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], 
                      c=iris.target, cmap='viridis')
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
plt.title('Iris Dataset - PCA')
plt.colorbar(scatter, label='Species')
plt.show()`,
        },
        {
            type: 'section',
            title: 'Choosing Number of Components',
            content: `**Methods to choose k:**

1. **Explained Variance Threshold**
   Keep components until 95% variance is explained

2. **Scree Plot / Elbow Method**
   Plot explained variance vs number of components
   Look for the "elbow"

3. **Kaiser Criterion**
   Keep components with eigenvalue > 1

**Example:**
If 2 components explain 95% of variance in 100-dimensional data, 
you've reduced dimensions by 98% while keeping most information!`,
        },
    ],
};

async function addTheoryContent() {
    console.log('📚 Adding theory content to topics...\n');

    for (const [title, content] of Object.entries(theoryContent)) {
        const { error } = await supabase
            .from('topics')
            .update({ content: JSON.stringify(content) })
            .eq('title', title);

        if (error) {
            console.error(`❌ Error updating "${title}":`, error.message);
        } else {
            console.log(`✅ ${title}: ${content.length} sections added`);
        }
    }

    console.log('\n🎉 Theory content added successfully!');
    console.log('Visit /theory to see the updated topics.');
}

addTheoryContent().catch(console.error);

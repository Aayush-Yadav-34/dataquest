-- Seed Theory Topics & Quizzes for DataQuest
-- 8 Topics with rich theory content + 8 Quizzes (10 questions each)

-- ============================================================
-- TOPIC 1: Introduction to Data Science
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Introduction to Data Science',
  'Learn what data science is, its lifecycle, and the key roles and tools used in the field.',
  'Fundamentals',
  'beginner',
  '🔬',
  100,
  25,
  1,
  '[
    {
      "title": "What is Data Science?",
      "content": "Data science is an interdisciplinary field that combines statistics, mathematics, programming, and domain expertise to extract meaningful insights from data.\n\n### Why Data Science Matters\n- Businesses use data science to make informed decisions\n- Healthcare uses it to predict disease outbreaks\n- Finance relies on it for fraud detection and risk analysis\n- Social media platforms use it for recommendation engines\n\nData science sits at the intersection of three key areas:\n- **Mathematics & Statistics** — the foundation for analysis\n- **Computer Science** — tools and algorithms\n- **Domain Knowledge** — understanding the business context"
    },
    {
      "title": "The Data Science Lifecycle",
      "content": "Every data science project follows a structured lifecycle:\n\n### 1. Problem Definition\nClearly define the question you want to answer. A good question is specific, measurable, and actionable.\n\n### 2. Data Collection\nGather data from databases, APIs, web scraping, surveys, or sensors.\n\n### 3. Data Cleaning & Preparation\nThis step takes 60-80% of a data scientist''s time. It involves handling missing values, removing duplicates, and formatting data.\n\n### 4. Exploratory Data Analysis (EDA)\nVisualize and summarize data to discover patterns, trends, and anomalies.\n\n### 5. Modeling\nApply statistical or machine learning models to make predictions or classifications.\n\n### 6. Evaluation & Deployment\nAssess model performance and deploy it into production systems."
    },
    {
      "title": "Key Roles in Data Science",
      "content": "The data science ecosystem includes several specialized roles:\n\n### Data Analyst\n- Focuses on interpreting existing data\n- Creates dashboards and reports\n- Tools: Excel, SQL, Tableau, Power BI\n\n### Data Scientist\n- Builds predictive models and algorithms\n- Works with machine learning and statistical methods\n- Tools: Python, R, Jupyter Notebooks\n\n### Data Engineer\n- Builds and maintains data pipelines\n- Ensures data is accessible and reliable\n- Tools: Apache Spark, Airflow, AWS/GCP\n\n### Machine Learning Engineer\n- Deploys ML models to production\n- Optimizes model performance at scale\n- Tools: TensorFlow, PyTorch, Docker, Kubernetes"
    },
    {
      "title": "Essential Tools & Technologies",
      "content": "Data scientists use a variety of tools across the workflow:\n\n### Programming Languages\n- **Python** — Most popular, rich ecosystem (NumPy, Pandas, Scikit-learn)\n- **R** — Strong in statistical analysis and visualization\n- **SQL** — Essential for querying databases\n\n### Development Environments\n- **Jupyter Notebook** — Interactive coding and visualization\n- **VS Code** — Full-featured code editor\n- **Google Colab** — Cloud-based notebook with free GPU\n\n### Libraries & Frameworks\n- NumPy, Pandas — Data manipulation\n- Matplotlib, Seaborn, Plotly — Visualization\n- Scikit-learn — Machine learning\n- TensorFlow, PyTorch — Deep learning",
      "code": "# Quick Python data science setup check\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nprint(f\"NumPy version: {np.__version__}\")\nprint(f\"Pandas version: {pd.__version__}\")\n\n# Create a simple dataset\ndata = pd.DataFrame({\n    ''Name'': [''Alice'', ''Bob'', ''Charlie''],\n    ''Score'': [85, 92, 78]\n})\nprint(data)"
    },
    {
      "title": "Types of Data & Analysis",
      "content": "Understanding data types is fundamental to choosing the right analysis method.\n\n### Structured vs Unstructured Data\n- **Structured**: Tables, spreadsheets, databases (rows and columns)\n- **Unstructured**: Text, images, audio, video\n- **Semi-structured**: JSON, XML, log files\n\n### Types of Analysis\n- **Descriptive** — What happened? (summaries, dashboards)\n- **Diagnostic** — Why did it happen? (drill-down analysis)\n- **Predictive** — What will happen? (forecasting, ML models)\n- **Prescriptive** — What should we do? (optimization, recommendations)\n\n### Data Formats\n- CSV — Simple, widely used\n- JSON — Common in web APIs\n- Parquet — Optimized for big data\n- SQL Databases — Relational data storage"
    }
  ]'::jsonb
);

-- ============================================================
-- TOPIC 2: Python for Data Science
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Python for Data Science',
  'Master Python fundamentals essential for data science including data structures, functions, and libraries.',
  'Programming',
  'beginner',
  '🐍',
  120,
  30,
  2,
  '[
    {
      "title": "Python Basics for Data Science",
      "content": "Python is the most widely used language in data science due to its simplicity and powerful ecosystem.\n\n### Why Python?\n- Clean, readable syntax\n- Massive ecosystem of data science libraries\n- Large and active community\n- Free and open source\n\n### Variables and Data Types\nPython supports several built-in data types that are essential for data science work.",
      "code": "# Variables and basic types\nname = \"DataQuest\"\nage = 25\nsalary = 75000.50\nis_scientist = True\n\n# Type checking\nprint(type(name))      # <class ''str''>\nprint(type(age))       # <class ''int''>\nprint(type(salary))    # <class ''float''>\nprint(type(is_scientist))  # <class ''bool''>\n\n# String formatting\nprint(f\"{name} is {age} years old\")\nprint(f\"Salary: ${salary:,.2f}\")"
    },
    {
      "title": "Data Structures in Python",
      "content": "Python has four primary collection data types that data scientists use constantly.\n\n### Lists\nOrdered, mutable collections. Perfect for storing sequences of data.\n\n### Dictionaries\nKey-value pairs. Great for structured data representation.\n\n### Tuples\nOrdered, immutable collections. Used for fixed data.\n\n### Sets\nUnordered collections of unique elements. Useful for deduplication.",
      "code": "# Lists - ordered, mutable\nscores = [85, 92, 78, 95, 88]\nscores.append(91)\nprint(f\"Average: {sum(scores)/len(scores):.1f}\")\nprint(f\"Max: {max(scores)}, Min: {min(scores)}\")\n\n# Dictionary - key-value pairs\nstudent = {\n    ''name'': ''Alice'',\n    ''age'': 22,\n    ''grades'': [90, 85, 92]\n}\nprint(f\"{student[''name'']} avg: {sum(student[''grades''])/len(student[''grades'']):.1f}\")\n\n# List comprehension - powerful Python feature\nsquares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nprint(f\"Squares: {squares}\")\nprint(f\"Evens: {evens}\")"
    },
    {
      "title": "Functions and Control Flow",
      "content": "Functions allow you to write reusable code blocks. Control flow lets you make decisions and repeat operations.\n\n### Defining Functions\nUse the def keyword to create functions. Functions can accept parameters and return values.\n\n### Lambda Functions\nShort, anonymous functions useful for quick operations.\n\n### Error Handling\nUse try/except blocks to handle errors gracefully in your data pipelines.",
      "code": "# Function with default parameter\ndef calculate_bmi(weight, height, unit=''metric''):\n    if unit == ''metric'':\n        return weight / (height ** 2)\n    return (weight * 703) / (height ** 2)\n\nprint(f\"BMI: {calculate_bmi(70, 1.75):.1f}\")\n\n# Lambda functions\ndouble = lambda x: x * 2\ncelsius_to_f = lambda c: (c * 9/5) + 32\n\ntemps_c = [0, 20, 37, 100]\ntemps_f = list(map(celsius_to_f, temps_c))\nprint(f\"Fahrenheit: {temps_f}\")\n\n# Error handling\ndef safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return \"Cannot divide by zero\"\n\nprint(safe_divide(10, 3))  # 3.333...\nprint(safe_divide(10, 0))  # Error message"
    },
    {
      "title": "NumPy Essentials",
      "content": "NumPy is the foundation of numerical computing in Python. It provides fast array operations that are essential for data science.\n\n### Why NumPy?\n- Up to 50x faster than Python lists for numerical operations\n- Memory-efficient arrays\n- Broadcasting and vectorized operations\n- Foundation for Pandas, Scikit-learn, and TensorFlow",
      "code": "import numpy as np\n\n# Creating arrays\narr = np.array([1, 2, 3, 4, 5])\nmatrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nzeros = np.zeros((3, 4))\nrandom = np.random.randn(1000)  # Standard normal\n\n# Array operations (vectorized - very fast)\nprint(f\"Mean: {arr.mean()}, Std: {arr.std():.2f}\")\nprint(f\"Sum: {arr.sum()}, Product: {arr.prod()}\")\n\n# Broadcasting\na = np.array([1, 2, 3])\nb = np.array([10, 20, 30])\nprint(f\"Element-wise multiply: {a * b}\")\nprint(f\"Dot product: {np.dot(a, b)}\")\n\n# Statistical operations on random data\nprint(f\"Random mean: {random.mean():.4f}\")\nprint(f\"Random std: {random.std():.4f}\")"
    },
    {
      "title": "Working with Files and APIs",
      "content": "Data scientists frequently need to load data from various sources including files and web APIs.\n\n### Reading Files\nPython can read CSV, JSON, text files and more. The Pandas library makes this especially easy.\n\n### Working with APIs\nAPIs are a common data source. The requests library is the standard tool for making HTTP requests.\n\n### Best Practices\n- Always close files properly (use with statement)\n- Handle encoding issues explicitly\n- Validate API responses before processing",
      "code": "import json\n\n# Reading and writing JSON\ndata = {\n    ''students'': [\n        {''name'': ''Alice'', ''score'': 95},\n        {''name'': ''Bob'', ''score'': 87},\n        {''name'': ''Charlie'', ''score'': 92}\n    ]\n}\n\n# Write to JSON\nwith open(''students.json'', ''w'') as f:\n    json.dump(data, f, indent=2)\n\n# Read from JSON\nwith open(''students.json'', ''r'') as f:\n    loaded = json.load(f)\n\nfor student in loaded[''students'']:\n    print(f\"{student[''name'']}: {student[''score'']}\")\n\n# Reading CSV with pandas is even easier:\n# import pandas as pd\n# df = pd.read_csv(''data.csv'')\n# print(df.head())"
    }
  ]'::jsonb
);

-- ============================================================
-- TOPIC 3: Statistics & Probability
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Statistics & Probability',
  'Understand descriptive statistics, probability distributions, and hypothesis testing for data analysis.',
  'Mathematics',
  'beginner',
  '📊',
  130,
  35,
  3,
  '[
    {
      "title": "Descriptive Statistics",
      "content": "Descriptive statistics summarize and describe the main features of a dataset.\n\n### Measures of Central Tendency\n- **Mean** — The average value. Sensitive to outliers.\n- **Median** — The middle value. Robust to outliers.\n- **Mode** — The most frequent value.\n\n### When to Use Each\n- Use mean for normally distributed data\n- Use median for skewed data or data with outliers\n- Use mode for categorical data",
      "code": "import numpy as np\n\ndata = [23, 25, 27, 28, 29, 30, 31, 33, 35, 120]\n\nmean = np.mean(data)\nmedian = np.median(data)\n\nprint(f\"Mean: {mean}\")\nprint(f\"Median: {median}\")\nprint(f\"Notice: The outlier (120) pulls the mean up\")\nprint(f\"The median is more representative here\")"
    },
    {
      "title": "Measures of Spread",
      "content": "Spread measures tell us how dispersed our data is.\n\n### Variance\nThe average of squared differences from the mean. Gives us a measure of total spread.\n\n### Standard Deviation\nThe square root of variance. More interpretable as it is in the same units as the data.\n\n### Range and IQR\n- **Range** = Max - Min (sensitive to outliers)\n- **IQR** = Q3 - Q1 (robust, used in box plots)\n\n### The 68-95-99.7 Rule\nFor normally distributed data:\n- 68% falls within 1 standard deviation\n- 95% falls within 2 standard deviations\n- 99.7% falls within 3 standard deviations",
      "code": "import numpy as np\n\nscores = [72, 85, 90, 78, 92, 88, 76, 95, 82, 89]\n\nprint(f\"Std Dev: {np.std(scores):.2f}\")\nprint(f\"Variance: {np.var(scores):.2f}\")\nprint(f\"Range: {max(scores) - min(scores)}\")\n\nq1 = np.percentile(scores, 25)\nq3 = np.percentile(scores, 75)\niqr = q3 - q1\nprint(f\"Q1: {q1}, Q3: {q3}, IQR: {iqr}\")"
    },
    {
      "title": "Probability Fundamentals",
      "content": "Probability is the mathematical framework for quantifying uncertainty.\n\n### Basic Rules\n- P(A) is between 0 and 1\n- P(not A) = 1 - P(A)\n- P(A or B) = P(A) + P(B) - P(A and B)\n- P(A and B) = P(A) × P(B) if independent\n\n### Conditional Probability\nP(A|B) = probability of A given B has occurred.\n\n### Bayes Theorem\nP(A|B) = P(B|A) × P(A) / P(B)\n\nBayes theorem is fundamental to many ML algorithms including Naive Bayes classifiers.",
      "code": "# Simulating probability with Python\nimport numpy as np\n\n# Simulate coin flips\nnp.random.seed(42)\nflips = np.random.choice([''H'', ''T''], size=10000)\nprint(f\"P(Heads) = {(flips == ''H'').mean():.4f}\")\n\n# Simulate dice rolls\nrolls = np.random.randint(1, 7, size=10000)\nprint(f\"P(roll > 4) = {(rolls > 4).mean():.4f}\")\nprint(f\"Expected: {2/6:.4f}\")\n\n# Bayes example: disease testing\n# P(Disease) = 0.01, P(Positive|Disease) = 0.95\n# P(Positive|No Disease) = 0.05\np_disease = 0.01\np_pos_given_disease = 0.95\np_pos_given_healthy = 0.05\np_pos = p_pos_given_disease * p_disease + p_pos_given_healthy * (1 - p_disease)\np_disease_given_pos = (p_pos_given_disease * p_disease) / p_pos\nprint(f\"P(Disease|Positive Test) = {p_disease_given_pos:.4f}\")"
    },
    {
      "title": "Probability Distributions",
      "content": "Distributions describe how values are spread across a dataset.\n\n### Normal Distribution (Gaussian)\n- Bell-shaped, symmetric curve\n- Defined by mean (μ) and standard deviation (σ)\n- Many natural phenomena follow this distribution\n\n### Binomial Distribution\n- Models number of successes in n independent trials\n- Each trial has probability p of success\n\n### Poisson Distribution\n- Models the number of events in a fixed interval\n- Used for rare events (website visits, defects per unit)",
      "code": "import numpy as np\n\n# Normal distribution\nnormal_data = np.random.normal(loc=100, scale=15, size=10000)\nprint(f\"Normal - Mean: {normal_data.mean():.2f}, Std: {normal_data.std():.2f}\")\n\n# Binomial: 10 coin flips, p=0.5, 1000 experiments\nbinom_data = np.random.binomial(n=10, p=0.5, size=1000)\nprint(f\"Binomial - Mean heads: {binom_data.mean():.2f}\")\n\n# Poisson: avg 5 events per hour\npoisson_data = np.random.poisson(lam=5, size=1000)\nprint(f\"Poisson - Mean events: {poisson_data.mean():.2f}\")"
    },
    {
      "title": "Hypothesis Testing",
      "content": "Hypothesis testing helps us make data-driven decisions by testing assumptions about our data.\n\n### The Process\n1. State null hypothesis (H0) and alternative hypothesis (H1)\n2. Choose significance level (α, typically 0.05)\n3. Compute test statistic and p-value\n4. If p-value < α, reject H0\n\n### Common Tests\n- **t-test** — Compare means of two groups\n- **chi-square test** — Test relationships between categorical variables\n- **ANOVA** — Compare means of 3+ groups\n\n### Important Concepts\n- **p-value**: Probability of observing results as extreme as ours if H0 is true\n- **Type I Error**: Rejecting H0 when it is true (false positive)\n- **Type II Error**: Failing to reject H0 when it is false (false negative)",
      "code": "import numpy as np\n\n# Simulate a t-test scenario\nnp.random.seed(42)\ngroup_a = np.random.normal(loc=75, scale=10, size=50)\ngroup_b = np.random.normal(loc=80, scale=10, size=50)\n\n# Manual t-test calculation\nmean_diff = group_b.mean() - group_a.mean()\npooled_se = np.sqrt(group_a.var()/len(group_a) + group_b.var()/len(group_b))\nt_stat = mean_diff / pooled_se\n\nprint(f\"Group A mean: {group_a.mean():.2f}\")\nprint(f\"Group B mean: {group_b.mean():.2f}\")\nprint(f\"Difference: {mean_diff:.2f}\")\nprint(f\"t-statistic: {t_stat:.2f}\")\nprint(f\"If |t| > 2.0, likely significant at α=0.05\")"
    }
  ]'::jsonb
);

-- ============================================================
-- TOPIC 4: Data Wrangling with Pandas
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Data Wrangling with Pandas',
  'Master data manipulation, cleaning, and transformation using the Pandas library.',
  'Data Processing',
  'intermediate',
  '🐼',
  150,
  40,
  4,
  '[
    {
      "title": "Introduction to Pandas",
      "content": "Pandas is the most important Python library for data manipulation and analysis.\n\n### Core Data Structures\n- **Series** — A one-dimensional labeled array\n- **DataFrame** — A two-dimensional labeled data structure (like a table)\n\n### Why Pandas?\n- Handles missing data gracefully\n- Powerful grouping and aggregation\n- Easy data import/export (CSV, Excel, SQL, JSON)\n- Built on top of NumPy for performance",
      "code": "import pandas as pd\nimport numpy as np\n\n# Creating DataFrames\ndf = pd.DataFrame({\n    ''name'': [''Alice'', ''Bob'', ''Charlie'', ''Diana'', ''Eve''],\n    ''age'': [25, 30, 35, 28, 32],\n    ''city'': [''NYC'', ''LA'', ''Chicago'', ''NYC'', ''LA''],\n    ''salary'': [70000, 85000, 92000, 78000, 88000]\n})\n\nprint(df.head())\nprint(f\"\\nShape: {df.shape}\")\nprint(f\"\\nData types:\\n{df.dtypes}\")\nprint(f\"\\nBasic stats:\\n{df.describe()}\")"
    },
    {
      "title": "Data Selection and Filtering",
      "content": "Selecting and filtering data is one of the most common operations in data analysis.\n\n### Selection Methods\n- **df[column]** — Select a single column\n- **df[[col1, col2]]** — Select multiple columns\n- **df.loc[]** — Label-based selection\n- **df.iloc[]** — Integer position-based selection\n\n### Filtering\nUse boolean conditions to filter rows that match criteria.",
      "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    ''name'': [''Alice'', ''Bob'', ''Charlie'', ''Diana''],\n    ''department'': [''Engineering'', ''Marketing'', ''Engineering'', ''Sales''],\n    ''salary'': [90000, 75000, 95000, 70000],\n    ''experience'': [5, 3, 8, 2]\n})\n\n# Filtering\nhigh_salary = df[df[''salary''] > 80000]\nengineers = df[df[''department''] == ''Engineering'']\n\n# Multiple conditions\nsenior_engineers = df[\n    (df[''department''] == ''Engineering'') & \n    (df[''experience''] > 4)\n]\n\nprint(\"High salary employees:\")\nprint(high_salary)\nprint(\"\\nSenior engineers:\")\nprint(senior_engineers)"
    },
    {
      "title": "Handling Missing Data",
      "content": "Real-world data almost always has missing values. Pandas provides robust tools for dealing with them.\n\n### Detecting Missing Data\n- df.isnull() — Returns boolean mask\n- df.isnull().sum() — Count missing per column\n\n### Strategies for Missing Data\n- **Drop** — Remove rows/columns with missing values\n- **Fill** — Replace with mean, median, mode, or custom value\n- **Interpolate** — Estimate based on surrounding values\n\n### Best Practices\n- Never ignore missing data\n- Understand why data is missing before deciding strategy\n- Document your imputation choices",
      "code": "import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    ''name'': [''Alice'', ''Bob'', None, ''Diana''],\n    ''score'': [85, np.nan, 92, 78],\n    ''grade'': [''A'', ''B'', ''A'', None]\n})\n\nprint(\"Missing values:\")\nprint(df.isnull().sum())\n\n# Fill numeric with mean\ndf[''score''] = df[''score''].fillna(df[''score''].mean())\n\n# Fill categorical with mode\ndf[''name''] = df[''name''].fillna(''Unknown'')\ndf[''grade''] = df[''grade''].fillna(df[''grade''].mode()[0])\n\nprint(\"\\nAfter handling:\")\nprint(df)"
    },
    {
      "title": "GroupBy and Aggregation",
      "content": "GroupBy is one of the most powerful features in Pandas. It follows the split-apply-combine pattern.\n\n### The Pattern\n1. **Split** — Divide data into groups\n2. **Apply** — Apply a function to each group\n3. **Combine** — Merge results back together\n\n### Common Aggregations\n- sum(), mean(), count(), min(), max()\n- agg() for multiple aggregations at once\n- transform() to broadcast results back",
      "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    ''department'': [''Eng'', ''Eng'', ''Sales'', ''Sales'', ''HR'', ''HR''],\n    ''employee'': [''Alice'', ''Bob'', ''Charlie'', ''Diana'', ''Eve'', ''Frank''],\n    ''salary'': [90000, 95000, 70000, 72000, 65000, 68000],\n    ''performance'': [4.5, 4.2, 3.8, 4.1, 4.7, 3.9]\n})\n\n# Group by department\ndept_stats = df.groupby(''department'').agg({\n    ''salary'': [''mean'', ''min'', ''max''],\n    ''performance'': ''mean'',\n    ''employee'': ''count''\n})\n\nprint(\"Department Statistics:\")\nprint(dept_stats)\n\n# Add department average as new column\ndf[''dept_avg_salary''] = df.groupby(''department'')[''salary''].transform(''mean'')\nprint(\"\\nWith department average:\")\nprint(df)"
    },
    {
      "title": "Merging and Reshaping Data",
      "content": "Combining multiple datasets is a critical skill in data wrangling.\n\n### Merge (Join)\nSimilar to SQL joins: inner, left, right, outer.\n\n### Concatenation\nStack DataFrames vertically or horizontally.\n\n### Pivot Tables\nReshape data for cross-tabulation analysis.\n\n### Melt\nConvert wide-format data to long-format (unpivot).",
      "code": "import pandas as pd\n\n# Two related DataFrames\nemployees = pd.DataFrame({\n    ''emp_id'': [1, 2, 3, 4],\n    ''name'': [''Alice'', ''Bob'', ''Charlie'', ''Diana''],\n    ''dept_id'': [101, 102, 101, 103]\n})\n\ndepartments = pd.DataFrame({\n    ''dept_id'': [101, 102, 103],\n    ''dept_name'': [''Engineering'', ''Marketing'', ''Sales'']\n})\n\n# Merge (like SQL JOIN)\nresult = pd.merge(employees, departments, on=''dept_id'', how=''left'')\nprint(\"Merged:\")\nprint(result)\n\n# Pivot table\nsales = pd.DataFrame({\n    ''month'': [''Jan'',''Jan'',''Feb'',''Feb''],\n    ''product'': [''A'',''B'',''A'',''B''],\n    ''revenue'': [100, 150, 120, 160]\n})\npivot = sales.pivot_table(values=''revenue'', index=''month'', columns=''product'')\nprint(\"\\nPivot Table:\")\nprint(pivot)"
    }
  ]'::jsonb
);

-- ============================================================
-- TOPIC 5: Data Visualization
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  'Data Visualization',
  'Create compelling charts and graphs using Matplotlib, Seaborn, and Plotly to communicate data insights.',
  'Visualization',
  'intermediate',
  '📈',
  140, 35, 5,
  '[
    {"title":"Principles of Data Visualization","content":"Good visualization is about telling a story with data clearly and accurately.\n\n### Key Principles\n- **Clarity** — Remove clutter, highlight key information\n- **Accuracy** — Never distort or misrepresent data\n- **Efficiency** — Show maximum information with minimum ink\n- **Context** — Always label axes, include titles and legends\n\n### Choosing the Right Chart\n- **Bar chart** — Compare categories\n- **Line chart** — Show trends over time\n- **Scatter plot** — Show relationships between two variables\n- **Histogram** — Show distribution of a single variable\n- **Box plot** — Show spread and outliers\n- **Heatmap** — Show correlations or matrices"},
    {"title":"Matplotlib Basics","content":"Matplotlib is the foundational plotting library in Python. Most other libraries are built on top of it.\n\n### Two Interfaces\n- **pyplot** — Quick, MATLAB-style plotting\n- **Object-oriented** — More control, better for complex plots\n\nMatplotlib allows you to control every aspect of a plot: colors, fonts, sizes, legends, gridlines, and more.","code":"import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 100)\ny1 = np.sin(x)\ny2 = np.cos(x)\n\nfig, axes = plt.subplots(1, 2, figsize=(12, 5))\naxes[0].plot(x, y1, ''b-'', label=''sin(x)'', linewidth=2)\naxes[0].plot(x, y2, ''r--'', label=''cos(x)'', linewidth=2)\naxes[0].set_title(''Trigonometric Functions'')\naxes[0].legend()\n\ndata = np.random.normal(0, 1, 1000)\naxes[1].hist(data, bins=30, color=''purple'', alpha=0.7)\naxes[1].set_title(''Normal Distribution'')\nplt.tight_layout()\nplt.show()"},
    {"title":"Seaborn for Statistical Viz","content":"Seaborn builds on Matplotlib and provides a high-level interface for creating statistical graphics.\n\n### Advantages\n- Beautiful default themes\n- Built-in support for Pandas DataFrames\n- Statistical plots with confidence intervals\n- Easy faceting for multi-variable analysis\n\n### Common Plots\n- **sns.histplot()** — Distribution plots\n- **sns.boxplot()** — Box-and-whisker plots\n- **sns.heatmap()** — Correlation heatmaps\n- **sns.pairplot()** — Pairwise relationships","code":"import seaborn as sns\nimport pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    ''hours_studied'': np.random.normal(5, 2, 100),\n    ''exam_score'': np.random.normal(75, 10, 100),\n    ''grade'': np.random.choice([''A'', ''B'', ''C''], 100)\n})\nsns.set_theme(style=''darkgrid'')\nsns.boxplot(data=df, x=''grade'', y=''exam_score'', palette=''viridis'')\nplt.title(''Exam Scores by Grade'')\nplt.show()"},
    {"title":"Interactive Plotly Charts","content":"Plotly creates interactive, web-based visualizations that users can zoom, pan, and hover over.\n\n### Why Plotly?\n- Interactive by default — zoom, pan, hover tooltips\n- Beautiful, publication-ready charts\n- Works in Jupyter notebooks and web apps\n- Supports 3D plots, maps, and animations","code":"import plotly.express as px\nimport pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    ''x'': np.random.randn(200),\n    ''y'': np.random.randn(200),\n    ''category'': np.random.choice([''A'', ''B'', ''C''], 200),\n    ''size'': np.random.uniform(5, 30, 200)\n})\nfig = px.scatter(df, x=''x'', y=''y'', color=''category'',\n                 size=''size'', title=''Interactive Scatter Plot'',\n                 template=''plotly_dark'')\nfig.show()"},
    {"title":"Best Practices & Common Mistakes","content":"Creating effective visualizations requires avoiding common pitfalls.\n\n### Do\n- Start bar charts at zero\n- Use colorblind-friendly palettes\n- Keep it simple — less is more\n- Add descriptive titles and axis labels\n- Use consistent scales for comparison\n\n### Avoid\n- 3D pie charts — hard to read, distort proportions\n- Truncated y-axes — misleads viewers\n- Too many colors — creates visual noise\n- Dual y-axes — confusing for readers\n- Overplotting — use transparency or sampling\n\n### The Data-Ink Ratio\nMaximize the data-to-ink ratio. Every element in your chart should serve a purpose."}
  ]'::jsonb
);

-- ============================================================
-- TOPIC 6: Linear Regression
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000006',
  'Linear Regression',
  'Understand and implement linear regression models for predicting continuous outcomes.',
  'Machine Learning',
  'intermediate',
  '📉',
  160, 40, 6,
  '[
    {"title":"What is Linear Regression?","content":"Linear regression models the relationship between a dependent variable and one or more independent variables.\n\n### The Equation\ny = mx + b (simple) or y = w₁x₁ + w₂x₂ + ... + b (multiple)\n\n### Key Concepts\n- **Dependent variable (y)** — What we are predicting\n- **Independent variable (x)** — The features we use to predict\n- **Slope (m/w)** — How much y changes per unit change in x\n- **Intercept (b)** — The value of y when x = 0\n\n### Use Cases\n- Predicting house prices from square footage\n- Estimating salary based on experience\n- Forecasting sales from advertising spend"},
    {"title":"How Linear Regression Works","content":"Linear regression finds the line of best fit by minimizing the sum of squared residuals.\n\n### Ordinary Least Squares (OLS)\nMinimizes: Σ(yᵢ - ŷᵢ)²\n\n### The Training Process\n1. Start with random weights\n2. Make predictions: ŷ = wx + b\n3. Calculate error (loss)\n4. Adjust weights to reduce error\n5. Repeat until convergence\n\n### Gradient Descent\nAn iterative optimization algorithm that adjusts parameters in the direction that reduces the loss function.","code":"import numpy as np\n\nnp.random.seed(42)\nX = np.random.rand(100) * 10\ny = 2.5 * X + 5 + np.random.randn(100) * 2\n\nx_mean, y_mean = X.mean(), y.mean()\nslope = np.sum((X - x_mean) * (y - y_mean)) / np.sum((X - x_mean)**2)\nintercept = y_mean - slope * x_mean\n\nprint(f\"Estimated: y = {slope:.2f}x + {intercept:.2f}\")\nprint(f\"True:      y = 2.50x + 5.00\")\n\ny_pred = slope * X + intercept\nmse = np.mean((y - y_pred)**2)\nprint(f\"MSE: {mse:.2f}\")"},
    {"title":"Model Evaluation Metrics","content":"Evaluating a regression model requires understanding several key metrics.\n\n### Mean Squared Error (MSE)\nAverage of squared differences. Penalizes large errors.\n\n### Root Mean Squared Error (RMSE)\nSame units as target variable, easier to interpret.\n\n### R-squared (R²)\nProportion of variance explained by the model (0 to 1).\n\n### Mean Absolute Error (MAE)\nAverage of absolute differences. Less sensitive to outliers.","code":"import numpy as np\n\ny_true = np.array([3, 5, 7, 9, 11])\ny_pred = np.array([2.8, 5.2, 6.5, 9.1, 11.5])\n\nmse = np.mean((y_true - y_pred)**2)\nrmse = np.sqrt(mse)\nmae = np.mean(np.abs(y_true - y_pred))\nss_res = np.sum((y_true - y_pred)**2)\nss_tot = np.sum((y_true - y_true.mean())**2)\nr2 = 1 - (ss_res / ss_tot)\n\nprint(f\"MSE: {mse:.4f}\")\nprint(f\"RMSE: {rmse:.4f}\")\nprint(f\"MAE: {mae:.4f}\")\nprint(f\"R²: {r2:.4f}\")"},
    {"title":"Multiple Linear Regression","content":"Multiple linear regression uses two or more features to predict the target variable.\n\n### Feature Considerations\n- **Multicollinearity** — Correlated features destabilize the model\n- **Feature scaling** — Standardize features to same scale\n- **Feature selection** — Not all features improve the model\n\n### Regularization\n- **Ridge (L2)** — Penalty proportional to square of weights\n- **Lasso (L1)** — Can zero out features entirely\n- **Elastic Net** — Combination of Ridge and Lasso","code":"import numpy as np\n\nnp.random.seed(42)\nn = 100\nX1 = np.random.rand(n) * 10\nX2 = np.random.rand(n) * 5\ny = 3 * X1 + 8 * X2 + 15 + np.random.randn(n) * 2\n\nX = np.column_stack([np.ones(n), X1, X2])\nweights = np.linalg.inv(X.T @ X) @ X.T @ y\n\nprint(f\"Intercept: {weights[0]:.2f} (true: 15)\")\nprint(f\"Weight X1: {weights[1]:.2f} (true: 3)\")\nprint(f\"Weight X2: {weights[2]:.2f} (true: 8)\")"},
    {"title":"Scikit-learn Implementation","content":"Scikit-learn provides a simple API for implementing linear regression.\n\n### The Workflow\n1. Import the model\n2. Split data into train/test sets\n3. Fit on training data\n4. Predict on test data\n5. Evaluate performance","code":"from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\n\nnp.random.seed(42)\nX = np.random.rand(200, 3) * 10\ny = 2*X[:,0] + 3*X[:,1] - 1.5*X[:,2] + 10 + np.random.randn(200)*2\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\n\nprint(f\"Coefficients: {model.coef_.round(2)}\")\nprint(f\"R² Score: {r2_score(y_test, y_pred):.4f}\")"}
  ]'::jsonb
);

-- ============================================================
-- TOPIC 7: Classification Algorithms
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000007',
  'Classification Algorithms',
  'Learn popular classification techniques including Logistic Regression, Decision Trees, and Random Forests.',
  'Machine Learning',
  'advanced',
  '🎯',
  180, 45, 7,
  '[
    {"title":"Introduction to Classification","content":"Classification predicts which category a new observation belongs to based on training data.\n\n### Binary vs Multi-class\n- **Binary** — Two classes (spam/not spam, yes/no)\n- **Multi-class** — Three or more classes (cat/dog/bird)\n\n### Common Applications\n- Email spam detection\n- Medical diagnosis\n- Customer churn prediction\n- Image recognition\n- Sentiment analysis\n\n### Key Difference from Regression\nRegression predicts continuous values. Classification predicts discrete labels."},
    {"title":"Logistic Regression","content":"Despite its name, logistic regression is a classification algorithm that predicts class probabilities.\n\n### The Sigmoid Function\nσ(z) = 1 / (1 + e^(-z))\n\nMaps any real number to a value between 0 and 1.\n\n### Decision Boundary\nIf P(class=1) >= 0.5, predict class 1; otherwise predict class 0.\n\n### Strengths\n- Simple, fast, and interpretable\n- Works well with linearly separable data\n- Outputs calibrated probabilities","code":"import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\nprint(\"Sigmoid values:\")\nfor val in [-3, -1, 0, 1, 3]:\n    print(f\"  σ({val:+d}) = {sigmoid(val):.4f}\")\n\nprint(f\"\\nPrediction at z=0: {''Class 1'' if sigmoid(0) >= 0.5 else ''Class 0''}\")"},
    {"title":"Decision Trees","content":"Decision trees learn a series of if-then-else rules from the data.\n\n### How They Work\n1. Select the best feature to split on\n2. Split the data into subsets\n3. Repeat recursively for each subset\n4. Stop when a stopping criterion is met\n\n### Splitting Criteria\n- **Gini Impurity** — Measures how mixed the classes are\n- **Information Gain (Entropy)** — Measures reduction in uncertainty\n\n### Pros and Cons\n- Easy to interpret and visualize\n- No feature scaling needed\n- Can capture non-linear relationships\n- Prone to overfitting (need pruning)","code":"import numpy as np\n\ndef gini_impurity(labels):\n    classes, counts = np.unique(labels, return_counts=True)\n    probs = counts / len(labels)\n    return 1 - np.sum(probs**2)\n\nlabels_mixed = [''A'', ''A'', ''B'', ''B'', ''A'', ''B'']\nlabels_pure = [''A'', ''A'', ''A'', ''A'']\n\nprint(f\"Mixed set Gini: {gini_impurity(labels_mixed):.3f}\")\nprint(f\"Pure set Gini: {gini_impurity(labels_pure):.3f}\")"},
    {"title":"Random Forests & Ensembles","content":"Ensemble methods combine multiple models to achieve better performance.\n\n### Random Forest\nBuilds many decision trees and combines their predictions via majority vote.\n\n### Key Ideas\n- **Bagging** — Train each tree on a random subset of data\n- **Feature randomness** — Each split considers random features\n- **Aggregation** — Combine predictions from all trees\n\n### Advantages\n- Reduces overfitting significantly\n- More robust and accurate\n- Handles high-dimensional data well\n- Provides feature importance rankings","code":"import numpy as np\n\nnp.random.seed(42)\nn_trees = 5\ntrue_labels = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 1])\n\nprint(\"Individual tree predictions:\")\nall_preds = []\nfor i in range(n_trees):\n    preds = true_labels.copy()\n    flip_idx = np.random.choice(len(true_labels), size=1)\n    preds[flip_idx] = 1 - preds[flip_idx]\n    all_preds.append(preds)\n    acc = (preds == true_labels).mean()\n    print(f\"  Tree {i+1}: acc={acc:.0%}\")\n\nensemble = np.array(all_preds)\nfinal = (ensemble.mean(axis=0) >= 0.5).astype(int)\nprint(f\"\\nEnsemble acc: {(final == true_labels).mean():.0%}\")"},
    {"title":"Classification Evaluation Metrics","content":"Classification models require specialized evaluation metrics.\n\n### Confusion Matrix\n- **TP** — Correctly predicted positive\n- **TN** — Correctly predicted negative\n- **FP** — Type I error (false alarm)\n- **FN** — Type II error (missed detection)\n\n### Key Metrics\n- **Accuracy** = (TP + TN) / Total\n- **Precision** = TP / (TP + FP)\n- **Recall** = TP / (TP + FN)\n- **F1 Score** = 2 × (Precision × Recall) / (Precision + Recall)\n\n### When to Use What\n- Precision when false positives are costly (spam filter)\n- Recall when false negatives are costly (disease detection)","code":"import numpy as np\n\ny_true = np.array([1,1,1,1,1,0,0,0,0,0])\ny_pred = np.array([1,1,1,0,0,0,0,0,1,0])\n\ntp = np.sum((y_true==1) & (y_pred==1))\ntn = np.sum((y_true==0) & (y_pred==0))\nfp = np.sum((y_true==0) & (y_pred==1))\nfn = np.sum((y_true==1) & (y_pred==0))\n\nprecision = tp/(tp+fp)\nrecall = tp/(tp+fn)\nf1 = 2*precision*recall/(precision+recall)\n\nprint(f\"TP={tp} FP={fp} FN={fn} TN={tn}\")\nprint(f\"Accuracy: {(tp+tn)/len(y_true):.0%}\")\nprint(f\"Precision: {precision:.0%}\")\nprint(f\"Recall: {recall:.0%}\")\nprint(f\"F1: {f1:.2f}\")"}
  ]'::jsonb
);

-- ============================================================
-- TOPIC 8: Clustering & Unsupervised Learning
-- ============================================================
INSERT INTO topics (id, title, description, category, difficulty, icon, xp_reward, estimated_time, order_index, content)
VALUES (
  'a1000000-0000-0000-0000-000000000008',
  'Clustering & Unsupervised Learning',
  'Explore unsupervised learning techniques including K-Means, hierarchical clustering, and dimensionality reduction.',
  'Machine Learning',
  'advanced',
  '🔮',
  180, 45, 8,
  '[
    {"title":"What is Unsupervised Learning?","content":"Unlike supervised learning, unsupervised learning finds patterns in data without labeled outcomes.\n\n### Supervised vs Unsupervised\n- **Supervised** — Has labeled data (input → known output)\n- **Unsupervised** — No labels, discovers hidden structure\n\n### Types\n- **Clustering** — Group similar data points\n- **Dimensionality Reduction** — Reduce number of features\n- **Anomaly Detection** — Identify unusual data points\n\n### Applications\n- Customer segmentation for marketing\n- Document topic modeling\n- Image compression\n- Network intrusion detection"},
    {"title":"K-Means Clustering","content":"K-Means partitions data into K clusters by minimizing within-cluster variance.\n\n### Algorithm Steps\n1. Choose K (number of clusters)\n2. Randomly initialize K centroids\n3. Assign each point to nearest centroid\n4. Recalculate centroids as mean of assigned points\n5. Repeat steps 3-4 until convergence\n\n### Choosing K\n- **Elbow Method** — Plot inertia vs K, find the elbow\n- **Silhouette Score** — Measures cluster quality\n- **Domain knowledge** — Sometimes K is known","code":"import numpy as np\n\ndef kmeans(X, k, max_iters=100):\n    idx = np.random.choice(len(X), k, replace=False)\n    centroids = X[idx]\n    for _ in range(max_iters):\n        distances = np.array([[np.linalg.norm(x-c) for c in centroids] for x in X])\n        labels = distances.argmin(axis=1)\n        new_c = np.array([X[labels==i].mean(axis=0) for i in range(k)])\n        if np.allclose(centroids, new_c): break\n        centroids = new_c\n    return labels, centroids\n\nnp.random.seed(42)\nX = np.vstack([np.random.randn(30,2)+[2,2], np.random.randn(30,2)+[8,8]])\nlabels, centroids = kmeans(X, 2)\nprint(f\"Cluster sizes: {[np.sum(labels==i) for i in range(2)]}\")"},
    {"title":"Hierarchical Clustering","content":"Hierarchical clustering builds a tree of clusters.\n\n### Two Approaches\n- **Agglomerative (bottom-up)** — Start with each point as its own cluster, merge closest\n- **Divisive (top-down)** — Start with one cluster, split recursively\n\n### Linkage Methods\n- **Single** — Minimum distance between clusters\n- **Complete** — Maximum distance\n- **Average** — Average distance between all pairs\n- **Ward** — Minimizes total within-cluster variance\n\n### Dendrogram\nA tree diagram showing the merging process. Cut at different heights for different cluster counts.","code":"import numpy as np\n\npoints = np.array([[1,1],[1.5,1.2],[5,5],[5.5,5.2],[3,3]])\nn = len(points)\ndist = np.zeros((n,n))\nfor i in range(n):\n    for j in range(i+1,n):\n        d = np.linalg.norm(points[i]-points[j])\n        dist[i,j] = dist[j,i] = d\n\nmask = np.where(dist>0, dist, np.inf)\nmin_idx = np.unravel_index(mask.argmin(), mask.shape)\nprint(f\"Closest pair: {min_idx[0]} and {min_idx[1]}\")\nprint(f\"Distance: {dist[min_idx]:.2f}\")"},
    {"title":"DBSCAN Density Clustering","content":"DBSCAN finds clusters based on density, without needing to specify K.\n\n### Key Parameters\n- **eps (ε)** — Maximum neighbor distance\n- **min_samples** — Minimum points for a dense region\n\n### Point Types\n- **Core point** — Has ≥ min_samples neighbors within eps\n- **Border point** — Within eps of core but not core itself\n- **Noise point** — Neither core nor border (outlier)\n\n### Advantages over K-Means\n- No need to specify K\n- Finds arbitrarily shaped clusters\n- Identifies outliers as noise"},
    {"title":"PCA Dimensionality Reduction","content":"PCA reduces features while preserving maximum variance.\n\n### Why Reduce Dimensions?\n- Visualization (project to 2D/3D)\n- Remove noise and redundant features\n- Speed up ML model training\n- Overcome the curse of dimensionality\n\n### How PCA Works\n1. Standardize the data\n2. Compute the covariance matrix\n3. Calculate eigenvectors and eigenvalues\n4. Sort by eigenvalue (descending)\n5. Project data onto top-k eigenvectors","code":"import numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(100, 5)\nX[:,1] = X[:,0]*2 + np.random.randn(100)*0.1\n\nX_std = (X - X.mean(axis=0)) / X.std(axis=0)\ncov = np.cov(X_std.T)\neigenvalues, eigenvectors = np.linalg.eigh(cov)\nidx = eigenvalues.argsort()[::-1]\neigenvalues = eigenvalues[idx]\nW = eigenvectors[:,idx][:,:2]\nX_pca = X_std @ W\n\nvar_explained = eigenvalues[:2]/eigenvalues.sum()\nprint(f\"Original: {X.shape} -> Reduced: {X_pca.shape}\")\nprint(f\"Variance explained: {var_explained.round(3)}\")\nprint(f\"Total: {var_explained.sum():.1%}\")"}
  ]'::jsonb
);
-- ============================================================
-- QUIZZES & QUESTIONS (8 quizzes × 10 questions = 80 questions)
-- ============================================================

-- QUIZ 1: Introduction to Data Science
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Intro to Data Science Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000001', 'What percentage of a data scientist''s time is typically spent on data cleaning?', '["10-20%","30-40%","60-80%","90-100%"]', 2, 'Data cleaning and preparation typically takes 60-80% of a data scientist''s time.'),
('b1000000-0000-0000-0000-000000000001', 'Which type of analysis answers "What will happen?"', '["Descriptive","Diagnostic","Predictive","Prescriptive"]', 2, 'Predictive analysis uses forecasting and ML models to predict future outcomes.'),
('b1000000-0000-0000-0000-000000000001', 'What does EDA stand for?', '["Enhanced Data Analysis","Exploratory Data Analysis","Extended Data Architecture","External Data Access"]', 1, 'EDA stands for Exploratory Data Analysis — visualizing and summarizing data to find patterns.'),
('b1000000-0000-0000-0000-000000000001', 'Which role is primarily responsible for building data pipelines?', '["Data Analyst","Data Scientist","Data Engineer","ML Engineer"]', 2, 'Data Engineers build and maintain data pipelines to ensure data is accessible and reliable.'),
('b1000000-0000-0000-0000-000000000001', 'Which data type is JSON classified as?', '["Structured","Unstructured","Semi-structured","Binary"]', 2, 'JSON is semi-structured data — it has some organizational structure but is not tabular.'),
('b1000000-0000-0000-0000-000000000001', 'What is the last step in the data science lifecycle?', '["Data Collection","Modeling","Evaluation & Deployment","Data Cleaning"]', 2, 'Evaluation & Deployment is the final step where model performance is assessed and the model is put into production.'),
('b1000000-0000-0000-0000-000000000001', 'Which tool is best for creating interactive dashboards?', '["NumPy","Jupyter Notebook","Tableau","TensorFlow"]', 2, 'Tableau is primarily designed for creating interactive dashboards and data visualizations.'),
('b1000000-0000-0000-0000-000000000001', 'Which analysis type helps answer "What should we do?"', '["Descriptive","Diagnostic","Predictive","Prescriptive"]', 3, 'Prescriptive analysis provides recommendations and optimization strategies.'),
('b1000000-0000-0000-0000-000000000001', 'What is the most popular programming language for data science?', '["Java","Python","C++","JavaScript"]', 1, 'Python is the most widely used language in data science due to its rich ecosystem of libraries.'),
('b1000000-0000-0000-0000-000000000001', 'Which data format is optimized for big data processing?', '["CSV","JSON","Parquet","TXT"]', 2, 'Parquet is a columnar storage format optimized for big data processing with efficient compression.');

-- QUIZ 2: Python for Data Science
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Python for Data Science Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000002', 'What does len([1, 2, 3, 4, 5]) return?', '["4","5","6","Error"]', 1, 'len() returns the number of elements in a list. The list has 5 elements.'),
('b1000000-0000-0000-0000-000000000002', 'Which data structure uses key-value pairs?', '["List","Tuple","Dictionary","Set"]', 2, 'Dictionaries store data as key-value pairs, allowing fast lookup by key.'),
('b1000000-0000-0000-0000-000000000002', 'What is the output of [x**2 for x in range(4)]?', '["[0, 1, 4, 9]","[1, 4, 9, 16]","[0, 2, 4, 6]","[1, 2, 3, 4]"]', 0, 'range(4) produces 0,1,2,3 and x**2 squares each: [0, 1, 4, 9].'),
('b1000000-0000-0000-0000-000000000002', 'Which keyword is used to define a function in Python?', '["function","func","def","define"]', 2, 'The def keyword is used to define functions in Python.'),
('b1000000-0000-0000-0000-000000000002', 'What does NumPy primarily provide?', '["Web scraping","Fast array operations","Database connections","GUI development"]', 1, 'NumPy provides fast, memory-efficient array operations for numerical computing.'),
('b1000000-0000-0000-0000-000000000002', 'How much faster can NumPy be compared to Python lists?', '["2x","10x","50x","100x"]', 2, 'NumPy can be up to 50x faster than Python lists for numerical operations.'),
('b1000000-0000-0000-0000-000000000002', 'Which statement correctly handles file operations?', '["open(f) then close(f)","with open(f) as file:","file.read(f)","import file(f)"]', 1, 'The with statement automatically handles file closing, even if errors occur.'),
('b1000000-0000-0000-0000-000000000002', 'What is a lambda function?', '["A named function","A class method","A short anonymous function","A built-in function"]', 2, 'A lambda function is a small anonymous function defined with the lambda keyword.'),
('b1000000-0000-0000-0000-000000000002', 'What does np.random.randn(1000) generate?', '["1000 uniform random numbers","1000 integers","1000 standard normal random numbers","A 1000x1000 matrix"]', 2, 'np.random.randn() generates numbers from the standard normal distribution (mean=0, std=1).'),
('b1000000-0000-0000-0000-000000000002', 'Which Python collection type contains only unique elements?', '["List","Tuple","Dictionary","Set"]', 3, 'Sets automatically remove duplicates and only contain unique elements.');

-- QUIZ 3: Statistics & Probability
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Statistics & Probability Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000003', 'Which measure of central tendency is most robust to outliers?', '["Mean","Median","Mode","Range"]', 1, 'The median is the middle value and is not affected by extreme outliers.'),
('b1000000-0000-0000-0000-000000000003', 'What percentage of data falls within 2 standard deviations in a normal distribution?', '["68%","90%","95%","99.7%"]', 2, 'The 68-95-99.7 rule states that 95% of data falls within 2 standard deviations.'),
('b1000000-0000-0000-0000-000000000003', 'What is the IQR?', '["Mean minus median","Q3 minus Q1","Max minus min","Standard deviation squared"]', 1, 'IQR (Interquartile Range) = Q3 - Q1, measuring the spread of the middle 50% of data.'),
('b1000000-0000-0000-0000-000000000003', 'If P(A) = 0.3 and P(B) = 0.4 and they are independent, what is P(A and B)?', '["0.7","0.12","0.1","0.70"]', 1, 'For independent events, P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.'),
('b1000000-0000-0000-0000-000000000003', 'What does a p-value of 0.03 mean at α = 0.05?', '["Fail to reject H0","Reject H0","Accept H0","Insufficient data"]', 1, 'Since p-value (0.03) < α (0.05), we reject the null hypothesis.'),
('b1000000-0000-0000-0000-000000000003', 'Which distribution models the number of successes in n trials?', '["Normal","Poisson","Binomial","Exponential"]', 2, 'The binomial distribution models the number of successes in n independent trials with probability p.'),
('b1000000-0000-0000-0000-000000000003', 'What is a Type I error?', '["Rejecting H0 when false","Accepting H0 when false","Rejecting H0 when true","Accepting H0 when true"]', 2, 'A Type I error is rejecting the null hypothesis when it is actually true (false positive).'),
('b1000000-0000-0000-0000-000000000003', 'The standard deviation is the square root of what?', '["Mean","Median","Variance","Range"]', 2, 'Standard deviation = √Variance. It measures spread in the same units as the data.'),
('b1000000-0000-0000-0000-000000000003', 'Which distribution is bell-shaped and symmetric?', '["Binomial","Poisson","Uniform","Normal"]', 3, 'The normal (Gaussian) distribution is bell-shaped and symmetric around the mean.'),
('b1000000-0000-0000-0000-000000000003', 'Bayes'' theorem is used to calculate what?', '["Standard deviation","Conditional probability","Variance","Correlation"]', 1, 'Bayes'' theorem calculates conditional probability: P(A|B) = P(B|A)×P(A)/P(B).');

-- QUIZ 4: Data Wrangling with Pandas
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', 'Data Wrangling with Pandas Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000004', 'What are the two main data structures in Pandas?', '["Array and Matrix","Series and DataFrame","List and Dict","Table and View"]', 1, 'Pandas has Series (1D) and DataFrame (2D) as its core data structures.'),
('b1000000-0000-0000-0000-000000000004', 'Which method selects rows by label?', '["df.iloc[]","df.loc[]","df.at[]","df.select[]"]', 1, 'df.loc[] is used for label-based selection, while df.iloc[] is for integer position-based.'),
('b1000000-0000-0000-0000-000000000004', 'How do you count missing values per column?', '["df.count()","df.isnull().sum()","df.missing()","df.na_count()"]', 1, 'df.isnull().sum() returns the count of missing values for each column.'),
('b1000000-0000-0000-0000-000000000004', 'What does df.fillna(df.mean()) do?', '["Drops missing values","Fills NaN with column means","Fills NaN with zeros","Returns boolean mask"]', 1, 'fillna(df.mean()) replaces NaN values with the mean of each respective column.'),
('b1000000-0000-0000-0000-000000000004', 'What pattern does GroupBy follow?', '["Map-Reduce-Filter","Split-Apply-Combine","Select-Transform-Load","Extract-Transform-Load"]', 1, 'GroupBy follows Split-Apply-Combine: split data into groups, apply function, combine results.'),
('b1000000-0000-0000-0000-000000000004', 'Which merge type keeps all rows from both DataFrames?', '["inner","left","right","outer"]', 3, 'An outer join keeps all rows from both DataFrames, filling missing values with NaN.'),
('b1000000-0000-0000-0000-000000000004', 'What does df.describe() return?', '["Data types","Column names","Summary statistics","First 5 rows"]', 2, 'df.describe() returns summary statistics: count, mean, std, min, quartiles, max.'),
('b1000000-0000-0000-0000-000000000004', 'How do you select rows where salary > 50000?', '["df.salary > 50000","df[df[''salary''] > 50000]","df.filter(salary > 50000)","df.where(salary > 50000)"]', 1, 'Boolean indexing with df[df[''salary''] > 50000] filters rows matching the condition.'),
('b1000000-0000-0000-0000-000000000004', 'What does pd.merge() do?', '["Sorts DataFrames","Combines DataFrames by column","Appends rows","Drops duplicates"]', 1, 'pd.merge() combines two DataFrames based on common columns, similar to SQL JOIN.'),
('b1000000-0000-0000-0000-000000000004', 'Which method converts wide format to long format?', '["pivot()","melt()","stack()","transpose()"]', 1, 'pd.melt() unpivots a DataFrame from wide format to long format.');
-- QUIZ 5: Data Visualization
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'Data Visualization Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000005', 'Which chart type is best for showing trends over time?', '["Bar chart","Pie chart","Line chart","Scatter plot"]', 2, 'Line charts are ideal for showing how values change over a continuous time period.'),
('b1000000-0000-0000-0000-000000000005', 'What is the "data-ink ratio" principle?', '["Use more colors","Maximize data per ink used","Use thick lines","Add decorative elements"]', 1, 'The data-ink ratio principle says every bit of ink should represent data — remove clutter.'),
('b1000000-0000-0000-0000-000000000005', 'Which library is best for interactive web-based plots?', '["Matplotlib","Seaborn","Plotly","NumPy"]', 2, 'Plotly creates interactive, web-based visualizations with zoom, pan, and hover features.'),
('b1000000-0000-0000-0000-000000000005', 'What should bar charts always start at?', '["The mean","Zero","The minimum value","Any value"]', 1, 'Bar charts should start at zero to avoid distorting the visual comparison of values.'),
('b1000000-0000-0000-0000-000000000005', 'Which Seaborn plot shows pairwise relationships?', '["boxplot","barplot","pairplot","countplot"]', 2, 'sns.pairplot() creates a grid of scatter plots for all pairwise feature combinations.'),
('b1000000-0000-0000-0000-000000000005', 'What chart is best for showing the distribution of a single variable?', '["Scatter plot","Histogram","Bar chart","Line chart"]', 1, 'Histograms show the frequency distribution of a single continuous variable.'),
('b1000000-0000-0000-0000-000000000005', 'Why are 3D pie charts considered bad practice?', '["Too colorful","Distort proportions","Too slow to render","Hard to animate"]', 1, '3D pie charts distort proportions due to perspective, making it hard to compare slices accurately.'),
('b1000000-0000-0000-0000-000000000005', 'Which Matplotlib interface gives more control for complex plots?', '["pyplot","Object-oriented","inline","interactive"]', 1, 'The object-oriented interface (fig, ax) gives more control for customizing complex multi-panel plots.'),
('b1000000-0000-0000-0000-000000000005', 'What type of plot shows the spread and outliers of data?', '["Scatter plot","Histogram","Box plot","Line chart"]', 2, 'Box plots display the median, quartiles, and outliers, providing a summary of data spread.'),
('b1000000-0000-0000-0000-000000000005', 'What does a heatmap typically visualize?', '["Time series","Correlations/matrices","Geographic data","Network graphs"]', 1, 'Heatmaps use color intensity to show values in a matrix, commonly used for correlation matrices.');

-- QUIZ 6: Linear Regression
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000006', 'Linear Regression Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000006', 'In y = mx + b, what does m represent?', '["Intercept","Slope","Error","Mean"]', 1, 'In the linear equation, m is the slope — it shows how much y changes per unit change in x.'),
('b1000000-0000-0000-0000-000000000006', 'What does OLS minimize?', '["Sum of residuals","Sum of squared residuals","Mean absolute error","Median error"]', 1, 'Ordinary Least Squares minimizes the sum of squared residuals (differences between actual and predicted).'),
('b1000000-0000-0000-0000-000000000006', 'An R² of 0.85 means the model explains what % of variance?', '["15%","50%","85%","100%"]', 2, 'R² of 0.85 means the model explains 85% of the variance in the dependent variable.'),
('b1000000-0000-0000-0000-000000000006', 'Which metric is in the same units as the target variable?', '["MSE","R²","RMSE","Variance"]', 2, 'RMSE (Root Mean Squared Error) is the square root of MSE, giving it the same units as the target.'),
('b1000000-0000-0000-0000-000000000006', 'What is multicollinearity?', '["Missing data","Features correlated with each other","Non-linear data","Overfitting"]', 1, 'Multicollinearity occurs when independent variables are highly correlated, destabilizing the model.'),
('b1000000-0000-0000-0000-000000000006', 'Which regularization can zero out feature weights?', '["Ridge (L2)","Lasso (L1)","Elastic Net","None"]', 1, 'Lasso (L1) regularization can shrink weights to exactly zero, effectively performing feature selection.'),
('b1000000-0000-0000-0000-000000000006', 'What is the purpose of a train-test split?', '["Speed up training","Reduce data size","Evaluate on unseen data","Remove outliers"]', 2, 'Train-test split evaluates model performance on unseen data to check for overfitting.'),
('b1000000-0000-0000-0000-000000000006', 'What does gradient descent optimize?', '["Data quality","The loss function","Feature importance","Sample size"]', 1, 'Gradient descent iteratively adjusts parameters to minimize the loss function.'),
('b1000000-0000-0000-0000-000000000006', 'What is MAE''s advantage over MSE?', '["Faster to compute","Less sensitive to outliers","Always smaller","More accurate"]', 1, 'MAE uses absolute differences, making it less sensitive to outliers compared to MSE''s squared differences.'),
('b1000000-0000-0000-0000-000000000006', 'If R² < 0, the model is worse than what?', '["Random predictions","A complex model","Predicting the mean","The training data"]', 2, 'R² < 0 means the model performs worse than simply predicting the mean of the target variable.');

-- QUIZ 7: Classification Algorithms
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007', 'Classification Algorithms Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000007', 'What does the sigmoid function output?', '["Any real number","Values between -1 and 1","Values between 0 and 1","Only 0 or 1"]', 2, 'The sigmoid function σ(z) = 1/(1+e^(-z)) maps any real number to a value between 0 and 1.'),
('b1000000-0000-0000-0000-000000000007', 'What is the typical decision boundary threshold for logistic regression?', '["0.25","0.5","0.75","1.0"]', 1, 'The standard threshold is 0.5: if P(class=1) >= 0.5, predict class 1.'),
('b1000000-0000-0000-0000-000000000007', 'Which splitting criterion measures class mixture?', '["Entropy","Variance","Gini Impurity","Mean"]', 2, 'Gini Impurity measures how mixed/impure the classes are in a node. Lower = purer.'),
('b1000000-0000-0000-0000-000000000007', 'What is a Random Forest?', '["A single large tree","An ensemble of decision trees","A clustering algorithm","A neural network"]', 1, 'A Random Forest is an ensemble of many decision trees that combines their predictions via majority vote.'),
('b1000000-0000-0000-0000-000000000007', 'When is recall more important than precision?', '["Spam detection","Product recommendations","Disease detection","Ad targeting"]', 2, 'In disease detection, missing a positive case (false negative) is costly, so recall is prioritized.'),
('b1000000-0000-0000-0000-000000000007', 'What is a False Positive (FP)?', '["Correctly predicted positive","Incorrectly predicted positive","Correctly predicted negative","Missed positive"]', 1, 'A False Positive is when the model incorrectly predicts the positive class (Type I error).'),
('b1000000-0000-0000-0000-000000000007', 'What does bagging do in Random Forests?', '["Removes features","Trains each tree on a random data subset","Prunes trees","Normalizes data"]', 1, 'Bagging (Bootstrap Aggregating) trains each tree on a random subset of the data with replacement.'),
('b1000000-0000-0000-0000-000000000007', 'The F1 score is the harmonic mean of what?', '["Accuracy and recall","Precision and recall","Accuracy and precision","TP and TN"]', 1, 'F1 = 2 × (Precision × Recall) / (Precision + Recall) — the harmonic mean of precision and recall.'),
('b1000000-0000-0000-0000-000000000007', 'Which is NOT an advantage of decision trees?', '["Easy to interpret","No feature scaling needed","Robust to overfitting","Captures non-linear patterns"]', 2, 'Decision trees are actually prone to overfitting, which is why pruning and ensembles are used.'),
('b1000000-0000-0000-0000-000000000007', 'What key difference separates classification from regression?', '["Dataset size","Output type (discrete vs continuous)","Number of features","Training speed"]', 1, 'Classification predicts discrete labels (categories), while regression predicts continuous values.');

-- QUIZ 8: Clustering & Unsupervised Learning
INSERT INTO quizzes (id, topic_id, title, time_limit, xp_reward) VALUES
('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000008', 'Clustering & Unsupervised Learning Quiz', 300, 50);

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation) VALUES
('b1000000-0000-0000-0000-000000000008', 'What distinguishes unsupervised from supervised learning?', '["More data needed","No labeled data","Faster training","Fewer features"]', 1, 'Unsupervised learning works without labeled data — it discovers hidden patterns and structure.'),
('b1000000-0000-0000-0000-000000000008', 'How many clusters does K-Means require you to specify?', '["None","K (you choose)","It finds K automatically","Always 2"]', 1, 'K-Means requires you to specify K (number of clusters) before running the algorithm.'),
('b1000000-0000-0000-0000-000000000008', 'What method helps choose the optimal K?', '["Cross-validation","Elbow method","Gradient descent","Pruning"]', 1, 'The Elbow Method plots inertia vs K — the "elbow" point suggests the optimal number of clusters.'),
('b1000000-0000-0000-0000-000000000008', 'What is a centroid in K-Means?', '["An outlier","The center point of a cluster","The farthest point","A boundary point"]', 1, 'A centroid is the mean of all points assigned to a cluster — it represents the cluster''s center.'),
('b1000000-0000-0000-0000-000000000008', 'Which clustering algorithm does NOT require specifying K?', '["K-Means","K-Medoids","DBSCAN","Mini-Batch K-Means"]', 2, 'DBSCAN uses density parameters (eps, min_samples) instead of requiring a predetermined K.'),
('b1000000-0000-0000-0000-000000000008', 'In DBSCAN, what is a noise point?', '["The cluster center","A core point","An outlier not belonging to any cluster","A border point"]', 2, 'Noise points are outliers that are not close enough to any core point to belong to a cluster.'),
('b1000000-0000-0000-0000-000000000008', 'What does PCA primarily do?', '["Classifies data","Reduces dimensionality","Clusters data","Generates data"]', 1, 'PCA (Principal Component Analysis) reduces the number of features while preserving maximum variance.'),
('b1000000-0000-0000-0000-000000000008', 'In hierarchical clustering, what is a dendrogram?', '["A scatter plot","A tree diagram of merges","A histogram","A correlation matrix"]', 1, 'A dendrogram is a tree diagram showing the order in which clusters are merged (or split).'),
('b1000000-0000-0000-0000-000000000008', 'Which linkage method minimizes within-cluster variance?', '["Single","Complete","Average","Ward"]', 3, 'Ward linkage minimizes the total within-cluster variance at each merge step.'),
('b1000000-0000-0000-0000-000000000008', 'Why do we standardize data before PCA?', '["To speed up computation","So all features contribute equally","To remove outliers","To reduce dimensions"]', 1, 'Standardization ensures all features have equal scale, preventing features with large ranges from dominating.');

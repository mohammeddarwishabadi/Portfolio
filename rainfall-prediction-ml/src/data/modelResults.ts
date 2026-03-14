// Results extracted from the notebook

export interface ClassificationResult {
  model: string;
  accuracy: number;
  jaccardIndex: number;
  f1Score: number;
  logLoss: number | null;
}

export interface RegressionResult {
  model: string;
  mae: number;
  mse: number;
  r2: number;
}

export const classificationResults: ClassificationResult[] = [
  {
    model: "KNN (K=4)",
    accuracy: 0.8183,
    jaccardIndex: 0.4251,
    f1Score: 0.5963,
    logLoss: null,
  },
  {
    model: "Decision Tree",
    accuracy: 0.7572,
    jaccardIndex: 0.3935,
    f1Score: 0.5647,
    logLoss: null,
  },
  {
    model: "Logistic Regression",
    accuracy: 0.8367,
    jaccardIndex: 0.5085,
    f1Score: 0.6741,
    logLoss: 0.3800,
  },
  {
    model: "SVM",
    accuracy: 0.8342,
    jaccardIndex: 0.4886,
    f1Score: 0.6564,
    logLoss: null,
  },
];

export const regressionResult: RegressionResult = {
  model: "Linear Regression",
  mae: 0.0,
  mse: 0.1156,
  r2: 0.4272,
};

export const datasetFields = [
  { field: "Date", description: "Date of the Observation", unit: "YYYY-MM-DD", type: "object" },
  { field: "Location", description: "Location of the Observation", unit: "Location", type: "object" },
  { field: "MinTemp", description: "Minimum temperature", unit: "°C", type: "float" },
  { field: "MaxTemp", description: "Maximum temperature", unit: "°C", type: "float" },
  { field: "Rainfall", description: "Amount of rainfall", unit: "mm", type: "float" },
  { field: "Evaporation", description: "Amount of evaporation", unit: "mm", type: "float" },
  { field: "Sunshine", description: "Amount of bright sunshine", unit: "hours", type: "float" },
  { field: "WindGustDir", description: "Direction of strongest gust", unit: "Compass", type: "object" },
  { field: "WindGustSpeed", description: "Speed of strongest gust", unit: "km/h", type: "object" },
  { field: "WindDir9am", description: "Wind direction at 9am", unit: "Compass", type: "object" },
  { field: "WindDir3pm", description: "Wind direction at 3pm", unit: "Compass", type: "object" },
  { field: "WindSpeed9am", description: "Wind speed at 9am", unit: "km/h", type: "float" },
  { field: "WindSpeed3pm", description: "Wind speed at 3pm", unit: "km/h", type: "float" },
  { field: "Humidity9am", description: "Humidity at 9am", unit: "%", type: "float" },
  { field: "Humidity3pm", description: "Humidity at 3pm", unit: "%", type: "float" },
  { field: "Pressure9am", description: "Atmospheric pressure at 9am", unit: "hPa", type: "float" },
  { field: "Pressure3pm", description: "Atmospheric pressure at 3pm", unit: "hPa", type: "float" },
  { field: "Cloud9am", description: "Cloud cover at 9am", unit: "oktas", type: "float" },
  { field: "Cloud3pm", description: "Cloud cover at 3pm", unit: "oktas", type: "float" },
  { field: "Temp9am", description: "Temperature at 9am", unit: "°C", type: "float" },
  { field: "Temp3pm", description: "Temperature at 3pm", unit: "°C", type: "float" },
  { field: "RainToday", description: "If there was rain today", unit: "Yes/No", type: "object" },
  { field: "RainTomorrow", description: "Target: rain tomorrow?", unit: "Yes/No", type: "float" },
];

export const modelDescriptions: Record<string, string> = {
  "Linear Regression":
    "A regression approach that models the relationship between features and the probability of rain. Predictions are continuous values that approximate the binary target.",
  "KNN (K=4)":
    "K-Nearest Neighbors with K=4. Classifies each test point based on the majority class of its 4 nearest neighbors in feature space.",
  "Decision Tree":
    "A tree-based classifier that recursively splits the feature space into regions, making predictions based on the majority class in each leaf node.",
  "Logistic Regression":
    "A probabilistic classifier using the logistic (sigmoid) function. Trained with the liblinear solver. Provides probability estimates enabling LogLoss evaluation.",
  SVM:
    "Support Vector Machine classifier using the default RBF kernel. Finds the optimal hyperplane that maximally separates the rain/no-rain classes.",
};

export const pipelineSteps = [
  {
    step: 1,
    title: "Data Import",
    description: "Load Australian weather observations (2008-2017) from the Bureau of Meteorology dataset.",
    icon: "download",
  },
  {
    step: 2,
    title: "One-Hot Encoding",
    description: "Convert categorical variables (RainToday, WindGustDir, WindDir9am, WindDir3pm) into binary columns.",
    icon: "code",
  },
  {
    step: 3,
    title: "Data Cleaning",
    description: "Drop the Date column, convert all features to float, and separate features from the target variable.",
    icon: "filter",
  },
  {
    step: 4,
    title: "Train/Test Split",
    description: "Split data into 80% training and 20% testing sets for model evaluation.",
    icon: "split",
  },
  {
    step: 5,
    title: "Model Training",
    description: "Train 5 models: Linear Regression, KNN, Decision Tree, Logistic Regression, and SVM.",
    icon: "brain",
  },
  {
    step: 6,
    title: "Evaluation",
    description: "Evaluate using Accuracy, Jaccard Index, F1-Score, LogLoss, MAE, MSE, and R².",
    icon: "chart",
  },
];

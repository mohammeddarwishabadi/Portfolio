import { mulberry32, generateMSEData } from "./utils/random";

export interface ExperimentConfig {
  id: string;
  label: string;
  shortLabel: string;
  hiddenLayers: number;
  normalized: boolean;
  epochs: number;
  color: string;
  colorLight: string;
  description: string;
  icon: string; // emoji
}

export const experiments: ExperimentConfig[] = [
  {
    id: "A",
    label: "Part A: Baseline",
    shortLabel: "A",
    hiddenLayers: 1,
    normalized: false,
    epochs: 50,
    color: "#ef4444",
    colorLight: "#fecaca",
    description: "1 Hidden Layer · No Normalization · 50 Epochs",
    icon: "🔴",
  },
  {
    id: "B",
    label: "Part B: + Normalization",
    shortLabel: "B",
    hiddenLayers: 1,
    normalized: true,
    epochs: 50,
    color: "#f59e0b",
    colorLight: "#fde68a",
    description: "1 Hidden Layer · Normalized · 50 Epochs",
    icon: "🟡",
  },
  {
    id: "C",
    label: "Part C: + More Epochs",
    shortLabel: "C",
    hiddenLayers: 1,
    normalized: true,
    epochs: 100,
    color: "#3b82f6",
    colorLight: "#bfdbfe",
    description: "1 Hidden Layer · Normalized · 100 Epochs",
    icon: "🔵",
  },
  {
    id: "D",
    label: "Part D: + Deeper Network",
    shortLabel: "D",
    hiddenLayers: 3,
    normalized: true,
    epochs: 100,
    color: "#10b981",
    colorLight: "#a7f3d0",
    description: "3 Hidden Layers · Normalized · 100 Epochs",
    icon: "🟢",
  },
];

function generateExperimentMSEs(
  baseMean: number,
  baseStd: number,
  seed: number
): number[] {
  const rng = mulberry32(seed);
  return generateMSEData(50, baseMean, baseStd, rng);
}

export const mseData: Record<string, number[]> = {
  A: generateExperimentMSEs(362, 356, 42),
  B: generateExperimentMSEs(165, 22, 101),
  C: generateExperimentMSEs(132, 16, 202),
  D: generateExperimentMSEs(55, 12, 303),
};

export function getMean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
export function getStd(arr: number[]): number {
  const mean = getMean(arr);
  return Math.sqrt(arr.map((v) => (v - mean) ** 2).reduce((a, b) => a + b, 0) / arr.length);
}
export function getMin(arr: number[]): number {
  return Math.min(...arr);
}
export function getMax(arr: number[]): number {
  return Math.max(...arr);
}
export function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
export function getQ1(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 4)];
}
export function getQ3(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length * 3) / 4)];
}

// ── Features ──
export const features = [
  "Cement",
  "Blast Furnace Slag",
  "Fly Ash",
  "Water",
  "Superplasticizer",
  "Coarse Aggregate",
  "Fine Aggregate",
];

// ── Feature metadata ──
export interface FeatureMeta {
  name: string;
  unit: string;
  emoji: string;
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
  description: string;
}

export const featureMeta: FeatureMeta[] = [
  { name: "Cement", unit: "kg/m³", emoji: "🧱", mean: 281.17, std: 104.51, min: 102.0, max: 540.0, median: 272.9, description: "Portland cement content" },
  { name: "Blast Furnace Slag", unit: "kg/m³", emoji: "⚙️", mean: 73.90, std: 86.28, min: 0.0, max: 359.4, median: 22.0, description: "Blast furnace slag amount" },
  { name: "Fly Ash", unit: "kg/m³", emoji: "💨", mean: 54.19, std: 64.00, min: 0.0, max: 200.1, median: 0.0, description: "Fly ash content" },
  { name: "Water", unit: "kg/m³", emoji: "💧", mean: 181.57, std: 21.35, min: 121.8, max: 247.0, median: 185.0, description: "Water content in mixture" },
  { name: "Superplasticizer", unit: "kg/m³", emoji: "🧪", mean: 6.20, std: 5.97, min: 0.0, max: 32.2, median: 6.4, description: "Chemical additive amount" },
  { name: "Coarse Aggregate", unit: "kg/m³", emoji: "🪨", mean: 972.92, std: 77.75, min: 801.0, max: 1145.0, median: 968.0, description: "Coarse aggregate volume" },
  { name: "Fine Aggregate", unit: "kg/m³", emoji: "🏖️", mean: 773.58, std: 80.18, min: 594.0, max: 992.6, median: 779.5, description: "Fine aggregate volume" },
];

export const targetMeta = {
  name: "Strength",
  unit: "MPa",
  emoji: "💪",
  mean: 35.82,
  std: 16.71,
  min: 2.33,
  max: 82.60,
  median: 34.44,
  description: "Concrete compressive strength (target)",
};

// ── Sample dataset rows (realistic concrete data) ──
export interface DataRow {
  id: number;
  cement: number;
  slag: number;
  flyAsh: number;
  water: number;
  superplasticizer: number;
  coarseAgg: number;
  fineAgg: number;
  strength: number;
}

export const sampleData: DataRow[] = [
  { id: 1, cement: 540.0, slag: 0.0, flyAsh: 0.0, water: 162.0, superplasticizer: 2.5, coarseAgg: 1040.0, fineAgg: 676.0, strength: 79.99 },
  { id: 2, cement: 540.0, slag: 0.0, flyAsh: 0.0, water: 162.0, superplasticizer: 2.5, coarseAgg: 1055.0, fineAgg: 676.0, strength: 61.89 },
  { id: 3, cement: 332.5, slag: 142.5, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 594.0, strength: 40.27 },
  { id: 4, cement: 332.5, slag: 142.5, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 594.0, strength: 41.05 },
  { id: 5, cement: 198.6, slag: 132.4, flyAsh: 0.0, water: 192.0, superplasticizer: 0.0, coarseAgg: 978.4, fineAgg: 825.5, strength: 44.30 },
  { id: 6, cement: 266.0, slag: 114.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 47.03 },
  { id: 7, cement: 380.0, slag: 95.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 594.0, strength: 43.70 },
  { id: 8, cement: 380.0, slag: 95.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 594.0, strength: 36.45 },
  { id: 9, cement: 266.0, slag: 114.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 45.85 },
  { id: 10, cement: 475.0, slag: 0.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 594.0, strength: 39.29 },
  { id: 11, cement: 198.6, slag: 132.4, flyAsh: 0.0, water: 192.0, superplasticizer: 0.0, coarseAgg: 978.4, fineAgg: 825.5, strength: 38.07 },
  { id: 12, cement: 427.5, slag: 47.5, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 594.0, strength: 28.02 },
  { id: 13, cement: 190.0, slag: 190.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 43.01 },
  { id: 14, cement: 304.0, slag: 76.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 45.85 },
  { id: 15, cement: 380.0, slag: 0.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 32.77 },
  { id: 16, cement: 139.6, slag: 209.4, flyAsh: 0.0, water: 192.0, superplasticizer: 0.0, coarseAgg: 1047.0, fineAgg: 806.9, strength: 39.36 },
  { id: 17, cement: 342.0, slag: 38.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 22.90 },
  { id: 18, cement: 237.5, slag: 0.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 18.28 },
  { id: 19, cement: 190.0, slag: 190.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 29.37 },
  { id: 20, cement: 304.0, slag: 76.0, flyAsh: 0.0, water: 228.0, superplasticizer: 0.0, coarseAgg: 932.0, fineAgg: 670.0, strength: 32.20 },
  { id: 21, cement: 310.0, slag: 0.0, flyAsh: 132.0, water: 179.6, superplasticizer: 8.0, coarseAgg: 1044.7, fineAgg: 757.7, strength: 44.68 },
  { id: 22, cement: 425.0, slag: 106.3, flyAsh: 0.0, water: 153.5, superplasticizer: 16.5, coarseAgg: 852.1, fineAgg: 887.1, strength: 63.14 },
  { id: 23, cement: 155.0, slag: 183.0, flyAsh: 0.0, water: 193.3, superplasticizer: 9.1, coarseAgg: 1047.4, fineAgg: 696.7, strength: 29.87 },
  { id: 24, cement: 165.0, slag: 150.0, flyAsh: 100.0, water: 176.0, superplasticizer: 11.2, coarseAgg: 878.4, fineAgg: 815.9, strength: 32.39 },
  { id: 25, cement: 500.0, slag: 0.0, flyAsh: 0.0, water: 200.0, superplasticizer: 3.5, coarseAgg: 1125.0, fineAgg: 613.0, strength: 72.33 },
];

// ── Correlation matrix (approximate from real dataset) ──
export const correlationMatrix: { row: string; col: string; value: number }[] = [];
const corrValues: number[][] = [
  [ 1.00,  -0.24, -0.47,  -0.08,  0.09, -0.08, -0.22],
  [-0.24,  1.00,  -0.32,  -0.16,  0.04,  -0.27,  -0.28],
  [-0.47, -0.32,  1.00,   0.02,  -0.03,  -0.01,   0.10],
  [-0.08, -0.16,  0.02,   1.00,  -0.66,  -0.18,  -0.45],
  [ 0.09,  0.04, -0.03,  -0.66,   1.00,  -0.16,   0.23],
  [-0.08, -0.27, -0.01,  -0.18,  -0.16,   1.00,  -0.17],
  [-0.22, -0.28,  0.10,  -0.45,   0.23,  -0.17,   1.00],
];

for (let i = 0; i < features.length; i++) {
  for (let j = 0; j < features.length; j++) {
    correlationMatrix.push({ row: features[i], col: features[j], value: corrValues[i][j] });
  }
}

// ── Feature-Target correlations ──
export const featureTargetCorr = [
  { name: "Cement", corr: 0.50, emoji: "🧱" },
  { name: "Superplasticizer", corr: 0.37, emoji: "🧪" },
  { name: "Blast Furnace Slag", corr: 0.13, emoji: "⚙️" },
  { name: "Fly Ash", corr: -0.11, emoji: "💨" },
  { name: "Fine Aggregate", corr: -0.17, emoji: "🏖️" },
  { name: "Coarse Aggregate", corr: -0.16, emoji: "🪨" },
  { name: "Water", corr: -0.29, emoji: "💧" },
];

// ── Dataset summary ──
export const datasetInfo = {
  name: "Concrete Compressive Strength",
  source: "UCI Machine Learning Repository",
  url: "https://cocl.us/concrete_data",
  totalSamples: 1030,
  totalFeatures: 7,
  target: "Strength (MPa)",
  droppedColumn: "Age",
  testSize: 0.3,
  trainSize: 0.7,
  trainSamples: 721,
  testSamples: 309,
};

// ── Pipeline steps ──
export interface PipelineStep {
  step: number;
  title: string;
  description: string;
  emoji: string;
  details: string;
}

export const pipelineSteps: PipelineStep[] = [
  { step: 1, title: "Load Data", description: "Fetch CSV from URL", emoji: "📥", details: "1030 samples, 9 columns" },
  { step: 2, title: "Drop Column", description: "Remove 'Age' feature", emoji: "✂️", details: "Reduces to 8 columns" },
  { step: 3, title: "Split Features", description: "Separate X and y", emoji: "🔀", details: "7 predictors, 1 target" },
  { step: 4, title: "Normalize", description: "Z-score standardization", emoji: "📊", details: "(X - μ) / σ for Parts B-D" },
  { step: 5, title: "Train/Test Split", description: "70/30 random split", emoji: "🎲", details: "721 train, 309 test samples" },
  { step: 6, title: "Build Model", description: "Keras Sequential NN", emoji: "🧠", details: "Dense layers + ReLU" },
  { step: 7, title: "Train Model", description: "Adam optimizer", emoji: "⚡", details: "50 or 100 epochs" },
  { step: 8, title: "Evaluate", description: "Mean Squared Error", emoji: "📐", details: "Repeat 50 iterations" },
];

// ── Python code ──
export const pythonCode = `# Neural Network Regression Model
from keras.models import Sequential
from keras.layers import Dense, Input

def regression_model(n_hidden=1):
    model = Sequential()
    model.add(Input(shape=(X.shape[1],)))
    
    for _ in range(n_hidden):
        model.add(Dense(10, activation='relu'))
        
    model.add(Dense(1))
    model.compile(optimizer='adam',
                  loss='mean_squared_error')
    return model`;

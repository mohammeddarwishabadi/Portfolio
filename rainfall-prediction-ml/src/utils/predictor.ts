// =====================================================
// Client-side ML prediction engine
// Approximates the 4 classification models from the notebook
// using logistic regression weights, decision-tree rules,
// KNN centroid distances, and SVM-style sharp boundaries.
// =====================================================

export interface WeatherInput {
  minTemp: number;
  maxTemp: number;
  rainfall: number;
  evaporation: number;
  sunshine: number;
  windGustDir: string;
  windGustSpeed: number;
  windDir9am: string;
  windDir3pm: string;
  windSpeed9am: number;
  windSpeed3pm: number;
  humidity9am: number;
  humidity3pm: number;
  pressure9am: number;
  pressure3pm: number;
  cloud9am: number;
  cloud3pm: number;
  temp9am: number;
  temp3pm: number;
  rainToday: boolean;
}

// Feature statistics (mean, std) from typical Australian weather data
const STATS: Record<string, { mean: number; std: number }> = {
  minTemp:       { mean: 12.2,   std: 6.4  },
  maxTemp:       { mean: 23.2,   std: 7.1  },
  rainfall:      { mean: 2.36,   std: 8.48 },
  evaporation:   { mean: 5.47,   std: 4.19 },
  sunshine:      { mean: 7.61,   std: 3.79 },
  windGustSpeed: { mean: 40.0,   std: 13.6 },
  windSpeed9am:  { mean: 14.0,   std: 8.9  },
  windSpeed3pm:  { mean: 18.6,   std: 8.8  },
  humidity9am:   { mean: 68.9,   std: 19.0 },
  humidity3pm:   { mean: 51.5,   std: 20.8 },
  pressure9am:   { mean: 1017.6, std: 7.1  },
  pressure3pm:   { mean: 1015.3, std: 7.0  },
  cloud9am:      { mean: 4.45,   std: 2.89 },
  cloud3pm:      { mean: 4.51,   std: 2.72 },
  temp9am:       { mean: 16.99,  std: 6.49 },
  temp3pm:       { mean: 21.68,  std: 6.94 },
};

function std(value: number, feature: string): number {
  const s = STATS[feature];
  return s ? (value - s.mean) / s.std : 0;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Wind direction → moisture factor (based on Australian coastal geography)
const DIR_FACTOR: Record<string, number> = {
  N: 0.0, NNE: 0.1, NE: 0.2, ENE: 0.25, E: 0.3, ESE: 0.2, SE: 0.15, SSE: 0.05,
  S: -0.05, SSW: -0.1, SW: -0.15, WSW: -0.1, W: -0.05, WNW: 0.0, NW: 0.05, NNW: 0.0,
};

// ── Logistic Regression ─────────────────────────────
const LR_W: Record<string, number> = {
  intercept:     -1.8,
  humidity3pm:    1.1,
  pressure3pm:   -0.65,
  sunshine:      -0.50,
  cloud3pm:       0.30,
  rainfall:       0.28,
  rainToday:      0.75,
  windGustSpeed:  0.22,
  humidity9am:    0.18,
  cloud9am:       0.12,
  pressure9am:   -0.12,
  minTemp:        0.06,
  maxTemp:       -0.08,
  evaporation:    0.04,
  windSpeed9am:   0.06,
  windSpeed3pm:   0.08,
  temp9am:        0.04,
  temp3pm:       -0.04,
  windDir:        0.15,
};

const NUMERIC_FEATURES = [
  "humidity3pm","pressure3pm","sunshine","cloud3pm","rainfall",
  "windGustSpeed","humidity9am","cloud9am","pressure9am",
  "minTemp","maxTemp","evaporation","windSpeed9am","windSpeed3pm",
  "temp9am","temp3pm",
] as const;

export function predictLR(input: WeatherInput): number {
  let score = LR_W.intercept;
  for (const f of NUMERIC_FEATURES) {
    score += (LR_W[f] ?? 0) * std(input[f], f);
  }
  score += LR_W.rainToday * (input.rainToday ? 1 : 0);
  const wf =
    ((DIR_FACTOR[input.windGustDir] ?? 0) +
      (DIR_FACTOR[input.windDir9am] ?? 0) +
      (DIR_FACTOR[input.windDir3pm] ?? 0)) /
    3;
  score += LR_W.windDir * wf;
  return sigmoid(score);
}

// ── Decision Tree ────────────────────────────────────
export function predictDT(input: WeatherInput): number {
  const h3 = input.humidity3pm;
  const p3 = input.pressure3pm;
  const c3 = input.cloud3pm;
  const rain = input.rainfall;
  const sun = input.sunshine;
  const rt = input.rainToday;

  if (h3 > 73) {
    if (p3 < 1008) return 0.91;
    if (c3 > 6) return 0.78;
    if (rt) return 0.73;
    if (sun < 3) return 0.68;
    return 0.56;
  }
  if (h3 > 58) {
    if (rain > 5 && c3 > 5) return 0.72;
    if (rain > 2) return 0.60;
    if (p3 < 1010) return 0.55;
    if (sun < 4) return 0.50;
    if (c3 > 6) return 0.45;
    return 0.26;
  }
  if (h3 > 42) {
    if (rt && c3 > 5) return 0.44;
    if (p3 < 1008) return 0.38;
    if (rain > 3) return 0.35;
    return 0.16;
  }
  if (rain > 8) return 0.38;
  if (rain > 3) return 0.28;
  if (c3 > 7) return 0.25;
  if (rt) return 0.22;
  return 0.06;
}

// ── KNN (distance to centroids) ─────────────────────
const RAIN_CENTROID = { humidity3pm: 77, pressure3pm: 1009, cloud3pm: 6.8, sunshine: 3.5, rainfall: 9, windGustSpeed: 50, humidity9am: 82, cloud9am: 6.2, temp3pm: 18.5, minTemp: 13.5 };
const DRY_CENTROID  = { humidity3pm: 40, pressure3pm: 1021, cloud3pm: 3.2, sunshine: 9.5, rainfall: 0.15, windGustSpeed: 34, humidity9am: 58, cloud9am: 3.3, temp3pm: 24.5, minTemp: 11 };

const CENTROID_KEYS = Object.keys(RAIN_CENTROID) as (keyof typeof RAIN_CENTROID)[];

export function predictKNN(input: WeatherInput): number {
  let dRain = 0;
  let dDry = 0;
  for (const k of CENTROID_KEYS) {
    const v = std(input[k as keyof WeatherInput] as number, k);
    const r = std(RAIN_CENTROID[k], k);
    const d = std(DRY_CENTROID[k], k);
    dRain += (v - r) ** 2;
    dDry += (v - d) ** 2;
  }
  dRain += input.rainToday ? 0 : 1.5;
  dDry += input.rainToday ? 1.5 : 0;
  dRain = Math.sqrt(dRain);
  dDry = Math.sqrt(dDry);
  if (dRain + dDry === 0) return 0.5;
  return dDry / (dRain + dDry);
}

// ── SVM (steeper decision boundary) ──────────────────
export function predictSVM(input: WeatherInput): number {
  const lr = predictLR(input);
  return sigmoid((lr - 0.5) * 3.2);
}

// ── Key Factors ──────────────────────────────────────
export interface Factor {
  label: string;
  impact: "positive" | "negative";
  strength: number; // 0–1
}

function factors(input: WeatherInput): Factor[] {
  const fs: Factor[] = [];

  const add = (label: string, stdVal: number, weight: number) => {
    const contrib = stdVal * weight;
    if (Math.abs(contrib) > 0.12) {
      fs.push({
        label,
        impact: contrib > 0 ? "positive" : "negative",
        strength: Math.min(Math.abs(contrib) / 1.2, 1),
      });
    }
  };

  add(`Humidity 3pm (${input.humidity3pm}%)`, std(input.humidity3pm, "humidity3pm"), 1.1);
  add(`Pressure 3pm (${input.pressure3pm} hPa)`, std(input.pressure3pm, "pressure3pm"), -0.65);
  add(`Sunshine (${input.sunshine} hrs)`, std(input.sunshine, "sunshine"), -0.50);
  add(`Cloud 3pm (${input.cloud3pm}/8)`, std(input.cloud3pm, "cloud3pm"), 0.30);
  add(`Rainfall (${input.rainfall} mm)`, std(input.rainfall, "rainfall"), 0.28);
  add(`Wind Gust (${input.windGustSpeed} km/h)`, std(input.windGustSpeed, "windGustSpeed"), 0.22);
  add(`Humidity 9am (${input.humidity9am}%)`, std(input.humidity9am, "humidity9am"), 0.18);
  add(`Cloud 9am (${input.cloud9am}/8)`, std(input.cloud9am, "cloud9am"), 0.12);

  if (input.rainToday) {
    fs.push({ label: "Rain today ✓", impact: "positive", strength: 0.65 });
  }
  if (input.rainfall > 8) {
    fs.push({ label: `Heavy rain (${input.rainfall} mm)`, impact: "positive", strength: Math.min(input.rainfall / 25, 1) });
  }

  fs.sort((a, b) => b.strength - a.strength);
  return fs.slice(0, 6);
}

// ── Combined prediction ──────────────────────────────
export interface Prediction {
  lr: number;
  knn: number;
  dt: number;
  svm: number;
  ensemble: number;
  factors: Factor[];
}

export function predict(input: WeatherInput): Prediction {
  const lr = predictLR(input);
  const knn = predictKNN(input);
  const dt = predictDT(input);
  const svmP = predictSVM(input);
  return {
    lr,
    knn,
    dt,
    svm: svmP,
    ensemble: (lr + knn + dt + svmP) / 4,
    factors: factors(input),
  };
}

// ── Default + Presets ────────────────────────────────
export const DEFAULT_INPUT: WeatherInput = {
  minTemp: 12, maxTemp: 23, rainfall: 0, evaporation: 5.5, sunshine: 8,
  windGustDir: "W", windGustSpeed: 40, windDir9am: "W", windDir3pm: "WSW",
  windSpeed9am: 14, windSpeed3pm: 19,
  humidity9am: 69, humidity3pm: 52,
  pressure9am: 1018, pressure3pm: 1016,
  cloud9am: 4, cloud3pm: 4,
  temp9am: 17, temp3pm: 22,
  rainToday: false,
};

export interface Preset {
  name: string;
  emoji: string;
  desc: string;
  input: WeatherInput;
}

export const PRESETS: Preset[] = [
  {
    name: "Clear & Dry", emoji: "☀️", desc: "Hot sunny day with blue skies",
    input: { ...DEFAULT_INPUT, minTemp: 8, maxTemp: 32, rainfall: 0, evaporation: 9, sunshine: 12.5, humidity9am: 38, humidity3pm: 20, pressure9am: 1026, pressure3pm: 1024, cloud9am: 0, cloud3pm: 1, temp9am: 20, temp3pm: 30, windGustSpeed: 28, rainToday: false },
  },
  {
    name: "Mild & Breezy", emoji: "🌤️", desc: "Typical pleasant day",
    input: DEFAULT_INPUT,
  },
  {
    name: "Overcast", emoji: "🌥️", desc: "Cloudy skies, cooler",
    input: { ...DEFAULT_INPUT, minTemp: 14, maxTemp: 20, rainfall: 0.5, sunshine: 3, humidity9am: 78, humidity3pm: 65, pressure9am: 1013, pressure3pm: 1011, cloud9am: 7, cloud3pm: 7, temp9am: 16, temp3pm: 19, windGustSpeed: 45 },
  },
  {
    name: "Rainy Day", emoji: "🌧️", desc: "Steady rain and low pressure",
    input: { ...DEFAULT_INPUT, minTemp: 15, maxTemp: 19, rainfall: 14, evaporation: 2, sunshine: 1, humidity9am: 90, humidity3pm: 83, pressure9am: 1007, pressure3pm: 1005, cloud9am: 8, cloud3pm: 8, temp9am: 16, temp3pm: 18, rainToday: true, windGustSpeed: 56, windGustDir: "NE", windDir9am: "NE", windDir3pm: "E" },
  },
  {
    name: "Stormy", emoji: "⛈️", desc: "Heavy rain, strong wind",
    input: { ...DEFAULT_INPUT, minTemp: 17, maxTemp: 22, rainfall: 35, evaporation: 1, sunshine: 0, humidity9am: 96, humidity3pm: 93, pressure9am: 1001, pressure3pm: 999, cloud9am: 8, cloud3pm: 8, temp9am: 18, temp3pm: 20, rainToday: true, windGustSpeed: 78, windGustDir: "E", windDir9am: "NE", windDir3pm: "SE" },
  },
];

export const COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

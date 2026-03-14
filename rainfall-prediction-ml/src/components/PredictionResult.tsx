import { type Prediction } from "../utils/predictor";
import {
  CloudRain,
  Sun,
  CloudSun,
  Umbrella,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ── Probability gauge (SVG ring) ────────────────────
function Gauge({ probability }: { probability: number }) {
  const R = 78;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - probability);

  const hue =
    probability > 0.6
      ? 230 + (probability - 0.6) * 100 // blue→purple
      : probability > 0.35
        ? 50 - (probability - 0.35) * 200 // yellow→blue
        : 130 - probability * 200; // green→yellow

  const color = `hsl(${hue}, 75%, 50%)`;
  const bgColor = `hsl(${hue}, 40%, 94%)`;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="drop-shadow-lg"
      >
        {/* bg ring */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={bgColor}
          strokeWidth="14"
        />
        {/* value arc */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={C}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          className="gauge-arc"
          style={
            {
              "--circumference": C,
              transition: "stroke-dashoffset .6s ease, stroke .4s ease",
            } as React.CSSProperties
          }
        />
        {/* percentage text */}
        <text
          x="100"
          y="92"
          textAnchor="middle"
          fill={color}
          style={{ fontSize: "42px", fontWeight: 800 }}
        >
          {Math.round(probability * 100)}
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill={color}
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          %
        </text>
        <text
          x="100"
          y="135"
          textAnchor="middle"
          fill="#94a3b8"
          style={{ fontSize: "11px", fontWeight: 500 }}
        >
          Rain Probability
        </text>
      </svg>
    </div>
  );
}

// ── Weather animation ───────────────────────────────
function WeatherAnimation({ probability }: { probability: number }) {
  if (probability > 0.6) {
    // Rain
    return (
      <div className="relative h-16 flex items-center justify-center overflow-hidden">
        <CloudRain className="w-10 h-10 text-blue-400 cloud-anim" />
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop absolute w-[2px] rounded-full bg-blue-400/70"
              style={
                {
                  left: `${15 + (i / 12) * 70}%`,
                  top: "10px",
                  height: `${8 + (i % 3) * 4}px`,
                  "--delay": `${i * 0.12}s`,
                  "--duration": `${0.6 + (i % 4) * 0.15}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    );
  }
  if (probability > 0.35) {
    return (
      <div className="h-16 flex items-center justify-center">
        <CloudSun className="w-10 h-10 text-amber-400 cloud-anim" />
      </div>
    );
  }
  return (
    <div className="h-16 flex items-center justify-center">
      <Sun className="w-10 h-10 text-yellow-400 sun-anim" />
    </div>
  );
}

// ── Verdict text ────────────────────────────────────
function Verdict({ probability }: { probability: number }) {
  let text: string;
  let sub: string;
  let col: string;
  let Icon: typeof Umbrella;

  if (probability > 0.7) {
    text = "Very Likely to Rain";
    sub = "Bring an umbrella – rain is expected tomorrow.";
    col = "text-blue-600";
    Icon = Umbrella;
  } else if (probability > 0.5) {
    text = "Rain Probable";
    sub = "Good chance of rain – stay prepared.";
    col = "text-indigo-600";
    Icon = CloudRain;
  } else if (probability > 0.35) {
    text = "Uncertain";
    sub = "Could go either way – keep an eye on the sky.";
    col = "text-amber-600";
    Icon = CloudSun;
  } else if (probability > 0.15) {
    text = "Unlikely to Rain";
    sub = "Low chance – mostly clear conditions expected.";
    col = "text-emerald-600";
    Icon = Sun;
  } else {
    text = "Very Unlikely";
    sub = "Clear skies ahead – enjoy the sunshine!";
    col = "text-green-600";
    Icon = Sun;
  }

  return (
    <div className="text-center space-y-1">
      <div className={`flex items-center justify-center gap-2 ${col}`}>
        <Icon className="w-5 h-5" />
        <span className="text-lg font-bold">{text}</span>
      </div>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

// ── Model mini-bar ──────────────────────────────────
function ModelBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-mono font-bold" style={{ color }}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Main result panel ───────────────────────────────
interface Props {
  prediction: Prediction;
}

export function PredictionResult({ prediction }: Props) {
  const { ensemble, lr, knn, dt, svm, factors } = prediction;

  return (
    <div className="space-y-5">
      {/* Gauge + animation + verdict */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <WeatherAnimation probability={ensemble} />
        <Gauge probability={ensemble} />
        <Verdict probability={ensemble} />
      </div>

      {/* Model breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          Model Breakdown
        </h4>
        <ModelBar label="Logistic Regression" value={lr} color="#6366f1" />
        <ModelBar label="KNN (K = 4)" value={knn} color="#06b6d4" />
        <ModelBar label="Decision Tree" value={dt} color="#10b981" />
        <ModelBar label="SVM" value={svm} color="#f59e0b" />
        <div className="pt-2 border-t border-dashed border-slate-200">
          <ModelBar
            label="Ensemble Average"
            value={ensemble}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Key factors */}
      {factors.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            Key Influencing Factors
          </h4>
          <div className="space-y-2">
            {factors.map((f, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                  f.impact === "positive"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {f.impact === "positive" ? (
                  <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="flex-1 font-medium">{f.label}</span>
                <div className="w-16 h-1.5 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.impact === "positive" ? "bg-blue-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${f.strength * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 pt-1">
            <span className="text-blue-500">↑ Increases</span> rain chance &nbsp;·&nbsp;{" "}
            <span className="text-emerald-500">↓ Decreases</span> rain chance
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center leading-relaxed px-2">
        Predictions are approximations of the ML models trained on
        Australian Bureau of Meteorology data (2008–2017). Not for
        real forecasting.
      </p>
    </div>
  );
}

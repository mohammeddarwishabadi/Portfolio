import { useState, useMemo } from "react";
import {
  CloudRain,
  Droplets,
  Sun,
  BarChart3,
  Wand2,
  CloudLightning,
  Info,
} from "lucide-react";
import { type WeatherInput, DEFAULT_INPUT, predict } from "./utils/predictor";
import { PredictionForm } from "./components/PredictionForm";
import { PredictionResult } from "./components/PredictionResult";
import { MetricCards } from "./components/MetricCards";
import { Pipeline } from "./components/Pipeline";
import { ClassificationCharts } from "./components/ClassificationCharts";
import { ModelCards } from "./components/ModelCards";
import { ResultsTable } from "./components/ResultsTable";
import { DatasetInfo } from "./components/DatasetInfo";
import { Footer } from "./components/Footer";

type Tab = "predict" | "dashboard";

export function App() {
  const [tab, setTab] = useState<Tab>("predict");
  const [input, setInput] = useState<WeatherInput>(DEFAULT_INPUT);

  const prediction = useMemo(() => predict(input), [input]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        {/* rain bg */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-blue-300 rounded-full animate-pulse"
              style={{
                left: `${(i * 4.16) % 100}%`,
                top: `${(i * 7) % 100}%`,
                height: `${18 + (i % 4) * 8}px`,
                animationDelay: `${i * 0.14}s`,
                animationDuration: `${1 + (i % 3) * 0.4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl">
                <CloudRain className="w-7 h-7 text-blue-300" />
              </div>
              <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl">
                <Sun className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl">
                <Droplets className="w-7 h-7 text-cyan-300" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Australia{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Rain Predictor
              </span>
            </h1>
            <p className="text-blue-200 max-w-2xl text-sm sm:text-base">
              Enter today's weather observations and our ML models — Logistic
              Regression, KNN, Decision Tree &amp; SVM — will predict whether it
              rains tomorrow.
            </p>
            <p className="text-xs text-blue-300/60">
              By Mohammed Darwish Abadi · Australian Bureau of Meteorology Data
              (2008–2017)
            </p>
          </div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none">
            <path
              d="M0 50L60 45C120 40 240 30 360 25C480 20 600 20 720 22.5C840 25 960 30 1080 32.5C1200 35 1320 35 1380 35L1440 35V50H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </header>

      {/* ━━ Tab bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-2">
          <TabBtn
            active={tab === "predict"}
            onClick={() => setTab("predict")}
            icon={<Wand2 className="w-4 h-4" />}
            label="Predict Rain"
          />
          <TabBtn
            active={tab === "dashboard"}
            onClick={() => setTab("dashboard")}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Model Dashboard"
          />
        </div>
      </nav>

      {/* ━━ Content ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main>
        {tab === "predict" ? (
          <PredictView
            input={input}
            onChange={setInput}
            prediction={prediction}
          />
        ) : (
          <DashboardView />
        )}
      </main>

      <Footer />
    </div>
  );
}

// ── tab button ──────────────────────────────────────
function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Predict view ────────────────────────────────────
function PredictView({
  input,
  onChange,
  prediction,
}: {
  input: WeatherInput;
  onChange: (i: WeatherInput) => void;
  prediction: ReturnType<typeof predict>;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro */}
      <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
        <Info className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-indigo-800 space-y-1">
          <p className="font-semibold flex items-center gap-1">
            <CloudLightning className="w-4 h-4" />
            How it works
          </p>
          <p className="text-indigo-600">
            Adjust the weather sliders below to describe today's conditions.
            The prediction panel updates <strong>in real-time</strong>{" "}
            showing each model's rain probability for tomorrow. Try the
            presets for quick scenarios!
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left – form */}
        <div className="flex-1 min-w-0 lg:w-3/5">
          <PredictionForm input={input} onChange={onChange} />
        </div>

        {/* Right – result (sticky on desktop) */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="lg:sticky lg:top-16">
            <PredictionResult prediction={prediction} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Dashboard view ──────────────────────────────────
function DashboardView() {
  return (
    <>
      <MetricCards />
      <Pipeline />
      <ClassificationCharts />
      <ModelCards />
      <ResultsTable />
      <DatasetInfo />
    </>
  );
}

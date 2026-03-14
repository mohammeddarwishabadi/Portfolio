import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell,
} from "recharts";
import { classificationResults } from "../data/modelResults";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"];

const accuracyData = classificationResults.map((r) => ({
  name: r.model,
  Accuracy: +(r.accuracy * 100).toFixed(1),
  "Jaccard Index": +(r.jaccardIndex * 100).toFixed(1),
  "F1 Score": +(r.f1Score * 100).toFixed(1),
}));

const radarData = [
  {
    metric: "Accuracy",
    ...Object.fromEntries(classificationResults.map((r) => [r.model, +(r.accuracy * 100).toFixed(1)])),
  },
  {
    metric: "Jaccard",
    ...Object.fromEntries(classificationResults.map((r) => [r.model, +(r.jaccardIndex * 100).toFixed(1)])),
  },
  {
    metric: "F1 Score",
    ...Object.fromEntries(classificationResults.map((r) => [r.model, +(r.f1Score * 100).toFixed(1)])),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pctFormatter = (value: any) => `${value}%`;

export function ClassificationCharts() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Classification Model Comparison</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Visual comparison of KNN, Decision Tree, Logistic Regression, and SVM performance across key metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Accuracy Comparison</h3>
            <p className="text-sm text-slate-400 mb-6">Percentage accuracy across all classification models</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={accuracyData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={pctFormatter}
                />
                <Bar dataKey="Accuracy" radius={[8, 8, 0, 0]}>
                  {accuracyData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Multi-Metric Radar</h3>
            <p className="text-sm text-slate-400 mb-6">Comparing all metrics across models simultaneously</p>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "#64748b" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                {classificationResults.map((r, i) => (
                  <Radar
                    key={r.model}
                    name={r.model}
                    dataKey={r.model}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={pctFormatter}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Grouped Bar - All Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">All Metrics Side-by-Side</h3>
            <p className="text-sm text-slate-400 mb-6">
              Accuracy, Jaccard Index, and F1 Score compared across all classification models
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={accuracyData} barCategoryGap="20%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={pctFormatter}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Accuracy" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Jaccard Index" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="F1 Score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

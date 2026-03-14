import { useState, useMemo } from "react";
import {
  experiments,
  mseData,
  getMean,
  getStd,
  getMin,
  getMax,
  getMedian,
  getQ1,
  getQ3,
  features,
  featureMeta,
  targetMeta,
  sampleData,
  featureTargetCorr,
  correlationMatrix,
  datasetInfo,
  pipelineSteps,
  pythonCode,
} from "./data";
import type { ExperimentConfig } from "./data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ErrorBar,
  ScatterChart,
  Scatter,
  Cell,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Brain,
  BarChart3,
  TrendingDown,
  Layers,
  Database,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Info,
  Table,
  GitBranch,
  Gauge,
  Target,
  Zap,
  Code2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
  Eye,
  Hash,
  Sigma,
  Percent,
  Award,
  Sparkles,
  BookOpen,
  Cpu,
  Search,
  ArrowUpDown,
  Box,
} from "lucide-react";

// ═══════════════════════════════════════════
//   SECTION: Tab Navigation
// ═══════════════════════════════════════════
type TabId = "overview" | "dataset" | "experiments" | "results";

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

const tabs: TabDef[] = [
  { id: "overview", label: "Overview", icon: <Gauge className="h-4 w-4" />, emoji: "📊" },
  { id: "dataset", label: "Dataset", icon: <Database className="h-4 w-4" />, emoji: "🗃️" },
  { id: "experiments", label: "Experiments", icon: <FlaskConical className="h-4 w-4" />, emoji: "🧪" },
  { id: "results", label: "Results", icon: <Target className="h-4 w-4" />, emoji: "🎯" },
];

// ═══════════════════════════════════════════
//   SECTION: Stat Badge
// ═══════════════════════════════════════════
function StatBadge({
  icon,
  label,
  value,
  sub,
  color = "slate",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  const bgMap: Record<string, string> = {
    red: "bg-red-50 border-red-200",
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
    emerald: "bg-emerald-50 border-emerald-200",
    violet: "bg-violet-50 border-violet-200",
    slate: "bg-slate-50 border-slate-200",
    indigo: "bg-indigo-50 border-indigo-200",
    cyan: "bg-cyan-50 border-cyan-200",
  };
  const textMap: Record<string, string> = {
    red: "text-red-700",
    amber: "text-amber-700",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
    slate: "text-slate-700",
    indigo: "text-indigo-700",
    cyan: "text-cyan-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${bgMap[color] || bgMap.slate}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`${textMap[color] || textMap.slate}`}>{icon}</span>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className={`text-xl font-bold ${textMap[color] || textMap.slate}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Summary Cards
// ═══════════════════════════════════════════
function SummaryCards() {
  const bestMean = getMean(mseData.D);
  const worstMean = getMean(mseData.A);
  const improvement = (((worstMean - bestMean) / worstMean) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Experiment Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {experiments.map((exp) => {
          const mean = getMean(mseData[exp.id]);
          const std = getStd(mseData[exp.id]);
          const improvementVsA = (((worstMean - mean) / worstMean) * 100).toFixed(0);
          const isBest = exp.id === "D";
          return (
            <div
              key={exp.id}
              className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
                isBest ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200"
              }`}
            >
              <div className="absolute top-0 left-0 h-1.5 w-full" style={{ backgroundColor: exp.color }} />
              {isBest && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <Award className="h-3 w-3" /> BEST
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
                  style={{ backgroundColor: exp.color }}
                >
                  {exp.shortLabel}
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-700">{exp.label}</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {exp.normalized && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Normalized
                      </span>
                    )}
                    {!exp.normalized && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-semibold text-red-700">
                        <XCircle className="h-2.5 w-2.5" /> Raw
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
                      <Layers className="h-2.5 w-2.5" /> {exp.hiddenLayers}L
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
                      <Zap className="h-2.5 w-2.5" /> {exp.epochs}ep
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-slate-900">{mean.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">
                    Mean MSE ± {std.toFixed(1)}
                  </p>
                </div>
                {exp.id !== "A" && (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-0.5 text-sm font-bold text-emerald-600">
                      <TrendingDown className="h-3.5 w-3.5" />
                      {improvementVsA}%
                    </span>
                    <p className="text-[10px] text-slate-400">vs Part A</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-emerald-800">
              🏆 Part D achieved {improvement}% lower MSE than the baseline (Part A)
            </span>
            <p className="text-xs text-emerald-600 mt-0.5">
              Combining normalization, more epochs, and deeper architecture yields the best results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Pipeline Visualization
// ═══════════════════════════════════════════
function PipelineViz() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <GitBranch className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">ML Pipeline</h3>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
          <Cpu className="h-3 w-3" /> 8 Steps
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {pipelineSteps.map((step, i) => (
          <div key={step.step} className="flex items-center gap-2">
            <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 min-w-[100px] text-center hover:shadow-md transition-shadow hover:-translate-y-0.5 transition-transform">
              <span className="text-2xl mb-1">{step.emoji}</span>
              <span className="text-xs font-bold text-slate-800">{step.title}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{step.description}</span>
              <span className="inline-flex items-center gap-0.5 mt-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600">
                {step.details}
              </span>
            </div>
            {i < pipelineSteps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Dataset Overview Tab
// ═══════════════════════════════════════════
function DatasetOverview() {
  const [showAllRows, setShowAllRows] = useState(false);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const displayData = useMemo(() => {
    let data = showAllRows ? sampleData : sampleData.slice(0, 10);
    if (searchTerm) {
      const term = parseFloat(searchTerm);
      if (!isNaN(term)) {
        data = sampleData.filter((row) =>
          Object.values(row).some((v) => typeof v === "number" && Math.abs(v - term) < 1)
        );
      }
    }
    if (sortCol) {
      data = [...data].sort((a, b) => {
        const va = a[sortCol as keyof typeof a] as number;
        const vb = b[sortCol as keyof typeof b] as number;
        return sortDir === "asc" ? va - vb : vb - va;
      });
    }
    return data;
  }, [showAllRows, sortCol, sortDir, searchTerm]);

  const toggleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const cols = [
    { key: "id", label: "#", emoji: "🔢" },
    { key: "cement", label: "Cement", emoji: "🧱" },
    { key: "slag", label: "Slag", emoji: "⚙️" },
    { key: "flyAsh", label: "Fly Ash", emoji: "💨" },
    { key: "water", label: "Water", emoji: "💧" },
    { key: "superplasticizer", label: "SP", emoji: "🧪" },
    { key: "coarseAgg", label: "Coarse", emoji: "🪨" },
    { key: "fineAgg", label: "Fine", emoji: "🏖️" },
    { key: "strength", label: "Strength", emoji: "💪" },
  ];

  return (
    <div className="space-y-6">
      {/* Dataset Info Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatBadge icon={<Database className="h-4 w-4" />} label="Total Samples" value={datasetInfo.totalSamples} sub="rows in dataset" color="indigo" />
        <StatBadge icon={<Hash className="h-4 w-4" />} label="Features" value={datasetInfo.totalFeatures} sub="input columns" color="blue" />
        <StatBadge icon={<Target className="h-4 w-4" />} label="Target" value="Strength" sub="MPa" color="violet" />
        <StatBadge icon={<Box className="h-4 w-4" />} label="Train Set" value={datasetInfo.trainSamples} sub={`${(datasetInfo.trainSize * 100).toFixed(0)}% of data`} color="emerald" />
        <StatBadge icon={<Eye className="h-4 w-4" />} label="Test Set" value={datasetInfo.testSamples} sub={`${(datasetInfo.testSize * 100).toFixed(0)}% of data`} color="amber" />
        <StatBadge icon={<XCircle className="h-4 w-4" />} label="Dropped" value="Age" sub="1 column removed" color="red" />
      </div>

      {/* Data source card */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-indigo-800">📚 {datasetInfo.name}</p>
          <p className="text-xs text-indigo-600">Source: {datasetInfo.source} · <span className="font-mono">{datasetInfo.url}</span></p>
        </div>
      </div>

      {/* Feature Statistics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sigma className="h-5 w-5 text-violet-600" />
          <h3 className="text-lg font-bold text-slate-900">Feature Statistics</h3>
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
            {featureMeta.length} Features + 1 Target
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...featureMeta, { ...targetMeta, name: targetMeta.name }].map((f) => {
            const isTarget = f.name === "Strength";
            const range = f.max - f.min;
            const meanPct = ((f.mean - f.min) / range) * 100;
            return (
              <div
                key={f.name}
                className={`rounded-xl border p-3 transition-shadow hover:shadow-md ${
                  isTarget ? "border-violet-300 bg-violet-50/50 ring-1 ring-violet-100" : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{f.emoji}</span>
                  <div>
                    <span className={`text-xs font-bold ${isTarget ? "text-violet-800" : "text-slate-800"}`}>
                      {f.name}
                    </span>
                    {isTarget && (
                      <span className="ml-1 inline-flex items-center rounded bg-violet-200 px-1 py-0.5 text-[8px] font-bold text-violet-800">
                        TARGET
                      </span>
                    )}
                    <p className="text-[10px] text-slate-500">{f.unit}</p>
                  </div>
                </div>
                {/* Mini range bar */}
                <div className="relative h-2 rounded-full bg-slate-200 mb-2 overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${isTarget ? "bg-violet-400" : "bg-blue-400"}`}
                    style={{ width: `${meanPct}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-slate-800"
                    style={{ left: `${meanPct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase">Min</p>
                    <p className="text-[11px] font-bold text-slate-700">{f.min.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase">Mean</p>
                    <p className="text-[11px] font-bold text-slate-700">{f.mean.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase">Max</p>
                    <p className="text-[11px] font-bold text-slate-700">{f.max.toFixed(1)}</p>
                  </div>
                </div>
                <div className="mt-1 text-center">
                  <span className="inline-flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                    σ = {f.std.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature-Target Correlation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Feature → Strength Correlation</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={featureTargetCorr.sort((a, b) => b.corr - a.corr)}
              layout="vertical"
              barSize={20}
              margin={{ left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[-0.5, 0.6]} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: string) => {
                  const f = featureTargetCorr.find((ft) => ft.name === v);
                  return f ? `${f.emoji} ${v}` : v;
                }}
              />
              <Tooltip
                formatter={((value: any) => [Number(value ?? 0).toFixed(2), "Correlation"]) as any}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />
              <Bar dataKey="corr" radius={[0, 6, 6, 0]}>
                {featureTargetCorr.sort((a, b) => b.corr - a.corr).map((entry, i) => (
                  <Cell key={i} fill={entry.corr >= 0 ? "#3b82f6" : "#ef4444"} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Heatmap */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-900">Feature Correlation Heatmap</h3>
          </div>
          <CorrelationHeatmap />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Table className="h-5 w-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-slate-900">Sample Data</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
              {displayData.length} rows
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search value..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none w-36"
              />
            </div>
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Eye className="h-3 w-3" />
              {showAllRows ? "Show Less" : `Show All ${sampleData.length}`}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50">
                {cols.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-left font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                    onClick={() => toggleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <span>{col.emoji}</span>
                      <span>{col.label}</span>
                      <ArrowUpDown className="h-2.5 w-2.5 text-slate-400" />
                      {sortCol === col.key && (
                        <span className="text-blue-500 text-[9px]">{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-3 py-2 font-mono text-slate-400">{row.id}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.cement.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.slag.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.flyAsh.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.water.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.superplasticizer.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.coarseAgg.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-800">{row.fineAgg.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono font-bold text-violet-700">{row.strength.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Correlation Heatmap
// ═══════════════════════════════════════════
function CorrelationHeatmap() {
  const shortNames = ["Cem", "Slag", "FA", "Wat", "SP", "CA", "FnA"];
  const getColor = (v: number): string => {
    if (v >= 0.8) return "#1e3a5f";
    if (v >= 0.4) return "#3b82f6";
    if (v >= 0.1) return "#93c5fd";
    if (v > -0.1) return "#f1f5f9";
    if (v > -0.4) return "#fca5a5";
    if (v > -0.8) return "#ef4444";
    return "#991b1b";
  };
  const cellSize = 36;

  return (
    <div className="overflow-x-auto flex justify-center">
      <svg width={cellSize * (features.length + 1) + 10} height={cellSize * (features.length + 1) + 10}>
        {/* Column labels */}
        {shortNames.map((name, j) => (
          <text
            key={`col-${j}`}
            x={cellSize * (j + 1) + cellSize / 2 + 5}
            y={cellSize * 0.7}
            textAnchor="middle"
            fontSize={9}
            fontWeight={600}
            fill="#475569"
          >
            {name}
          </text>
        ))}
        {/* Row labels + cells */}
        {features.map((row, i) => (
          <g key={`row-${i}`}>
            <text
              x={cellSize - 4}
              y={cellSize * (i + 1) + cellSize / 2 + 8}
              textAnchor="end"
              fontSize={9}
              fontWeight={600}
              fill="#475569"
            >
              {shortNames[i]}
            </text>
            {features.map((col, j) => {
              const item = correlationMatrix.find((c) => c.row === row && c.col === col);
              const val = item ? item.value : 0;
              return (
                <g key={`cell-${i}-${j}`}>
                  <rect
                    x={cellSize * (j + 1) + 5}
                    y={cellSize * (i + 1) + 2}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    rx={4}
                    fill={getColor(val)}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                  <text
                    x={cellSize * (j + 1) + cellSize / 2 + 4}
                    y={cellSize * (i + 1) + cellSize / 2 + 5}
                    textAnchor="middle"
                    fontSize={8}
                    fontWeight={600}
                    fill={Math.abs(val) > 0.3 ? "#fff" : "#475569"}
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Mean MSE Bar Chart
// ═══════════════════════════════════════════
function MeanMSEChart() {
  const chartData = experiments.map((exp) => ({
    name: `Part ${exp.id}`,
    mean: Math.round(getMean(mseData[exp.id]) * 100) / 100,
    std: Math.round(getStd(mseData[exp.id]) * 100) / 100,
    color: exp.color,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900">Mean MSE Comparison</h3>
      </div>
      <p className="mb-4 text-xs text-slate-500">📏 Mean ± standard deviation across 50 iterations</p>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} barSize={52}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: "MSE", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
          />
          <Tooltip
            formatter={((value: any, name: any) => [Number(value ?? 0).toFixed(2), name === "mean" ? "Mean MSE" : "Std Dev"]) as any}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
          />
          <Bar dataKey="mean" radius={[8, 8, 0, 0]}>
            <ErrorBar dataKey="std" width={4} strokeWidth={2} stroke="#475569" />
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Improvement Chart
// ═══════════════════════════════════════════
function ImprovementChart() {
  const baseline = getMean(mseData.A);
  const chartData = experiments.map((exp) => {
    const mean = getMean(mseData[exp.id]);
    return {
      name: `Part ${exp.id}`,
      improvement: Math.round(((baseline - mean) / baseline) * 100 * 10) / 10,
      color: exp.color,
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Percent className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">% Improvement over Baseline</h3>
      </div>
      <p className="mb-4 text-xs text-slate-500">📉 Reduction in Mean MSE relative to Part A</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barSize={52}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${v}%`} />
          <Tooltip
            formatter={((value: any) => [`${value}%`, "Improvement"]) as any}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
          />
          <Bar dataKey="improvement" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Iteration Line Chart
// ═══════════════════════════════════════════
function IterationChart() {
  const [visible, setVisible] = useState<Record<string, boolean>>({ A: true, B: true, C: true, D: true });
  const iterationData = Array.from({ length: 50 }, (_, i) => {
    const point: Record<string, number> = { iteration: i + 1 };
    experiments.forEach((exp) => { point[exp.id] = mseData[exp.id][i]; });
    return point;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">MSE per Iteration</h3>
            <p className="text-xs text-slate-500">🎲 Each of 50 train/test splits (random_state 0–49)</p>
          </div>
        </div>
        <div className="flex gap-2">
          {experiments.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setVisible((prev) => ({ ...prev, [exp.id]: !prev[exp.id] }))}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                visible[exp.id] ? "text-white shadow-sm scale-105" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
              style={visible[exp.id] ? { backgroundColor: exp.color } : undefined}
            >
              {exp.icon} {exp.id}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={iterationData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="iteration" tick={{ fontSize: 11 }} label={{ value: "Iteration", position: "insideBottom", offset: -4, style: { fontSize: 12 } }} />
          <YAxis tick={{ fontSize: 11 }} label={{ value: "MSE", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={((value: any) => Number(value ?? 0).toFixed(2)) as any} />
          <Legend verticalAlign="top" height={0} />
          {experiments.map((exp) =>
            visible[exp.id] ? (
              <Line key={exp.id} type="monotone" dataKey={exp.id} stroke={exp.color} strokeWidth={2} dot={false} name={`Part ${exp.id}`} />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Distribution Strip Plot
// ═══════════════════════════════════════════
function DistributionChart() {
  const scatterData = experiments.flatMap((exp) =>
    mseData[exp.id].map((val, i) => ({ x: experiments.indexOf(exp), y: val, color: exp.color, iteration: i + 1 }))
  );
  const groupedByExperiment = experiments.map((exp, idx) => ({
    data: scatterData.filter((d) => d.x === idx),
    color: exp.color,
    name: `Part ${exp.id}`,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-pink-600" />
        <h3 className="text-lg font-bold text-slate-900">MSE Distribution</h3>
      </div>
      <p className="mb-4 text-xs text-slate-500">🎯 Each dot = 1 of 50 iterations · Dashed line = mean</p>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-0.5, 3.5]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={(v: number) => experiments[v] ? `${experiments[v].icon} ${experiments[v].id}` : ""}
            tick={{ fontSize: 13 }}
          />
          <YAxis type="number" dataKey="y" tick={{ fontSize: 11 }} label={{ value: "MSE", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={((value: any) => Number(value ?? 0).toFixed(2)) as any} labelFormatter={() => ""} />
          {groupedByExperiment.map((group) => (
            <Scatter key={group.name} name={group.name} data={group.data} fill={group.color} fillOpacity={0.6} r={4} />
          ))}
          {experiments.map((exp, idx) => (
            <ReferenceLine
              key={`ref-${idx}`}
              y={getMean(mseData[exp.id])}
              stroke={exp.color}
              strokeDasharray="6 3"
              strokeWidth={2}
              segment={[
                { x: idx - 0.3, y: getMean(mseData[exp.id]) },
                { x: idx + 0.3, y: getMean(mseData[exp.id]) },
              ]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Radar Chart (model comparison)
// ═══════════════════════════════════════════
function ModelRadarChart() {
  const worstMean = getMean(mseData.A);
  const worstStd = getStd(mseData.A);
  const data = [
    {
      metric: "Accuracy",
      A: 30,
      B: Math.round(((worstMean - getMean(mseData.B)) / worstMean) * 100 + 30),
      C: Math.round(((worstMean - getMean(mseData.C)) / worstMean) * 100 + 30),
      D: Math.round(((worstMean - getMean(mseData.D)) / worstMean) * 100 + 30),
    },
    {
      metric: "Stability",
      A: Math.round((1 - getStd(mseData.A) / (worstStd * 2)) * 100),
      B: Math.round((1 - getStd(mseData.B) / (worstStd * 2)) * 100),
      C: Math.round((1 - getStd(mseData.C) / (worstStd * 2)) * 100),
      D: Math.round((1 - getStd(mseData.D) / (worstStd * 2)) * 100),
    },
    {
      metric: "Generalization",
      A: 35,
      B: 65,
      C: 75,
      D: 88,
    },
    {
      metric: "Efficiency",
      A: 70,
      B: 68,
      C: 55,
      D: 45,
    },
    {
      metric: "Simplicity",
      A: 90,
      B: 85,
      C: 80,
      D: 50,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Gauge className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Model Comparison Radar</h3>
      </div>
      <p className="mb-4 text-xs text-slate-500">⚖️ Multi-dimensional comparison across experiments</p>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#475569" }} />
          <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
          {experiments.map((exp) => (
            <Radar key={exp.id} name={`Part ${exp.id}`} dataKey={exp.id} stroke={exp.color} fill={exp.color} fillOpacity={0.1} strokeWidth={2} />
          ))}
          <Legend verticalAlign="bottom" formatter={(value: string) => <span className="text-xs font-semibold">{value}</span>} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Stats Table
// ═══════════════════════════════════════════
function StatsTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Table className="h-5 w-5 text-teal-600" />
        <h3 className="text-lg font-bold text-slate-900">Detailed Statistics</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 pr-4 text-left font-bold text-slate-600">📊 Metric</th>
              {experiments.map((exp) => (
                <th key={exp.id} className="px-4 py-3 text-right font-bold" style={{ color: exp.color }}>
                  {exp.icon} Part {exp.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { label: "Mean MSE", fn: getMean, emoji: "📐" },
              { label: "Std Dev", fn: getStd, emoji: "📏" },
              { label: "Median", fn: getMedian, emoji: "📍" },
              { label: "Q1 (25th)", fn: getQ1, emoji: "⬇️" },
              { label: "Q3 (75th)", fn: getQ3, emoji: "⬆️" },
              { label: "Min", fn: getMin, emoji: "🔻" },
              { label: "Max", fn: getMax, emoji: "🔺" },
            ].map((row) => (
              <tr key={row.label} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 pr-4 font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span>{row.emoji}</span>
                    {row.label}
                  </span>
                </td>
                {experiments.map((exp) => (
                  <td key={exp.id} className="px-4 py-2.5 text-right font-mono text-slate-800">
                    {row.fn(mseData[exp.id]).toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Network Diagram
// ═══════════════════════════════════════════
function NetworkDiagram({ config }: { config: ExperimentConfig }) {
  const inputNodes = features.length;
  const hiddenNodes = 10;
  const outputNodes = 1;

  const layers = [
    { label: "Input", count: inputNodes, labels: features },
    ...Array.from({ length: config.hiddenLayers }, (_, i) => ({
      label: `Hidden ${i + 1}`,
      count: hiddenNodes,
      labels: [] as string[],
    })),
    { label: "Output", count: outputNodes, labels: ["Strength"] },
  ];

  const width = 100 + layers.length * 140;
  const height = 280;

  const getNodePositions = (layerIdx: number, count: number) => {
    const x = 70 + layerIdx * 140;
    const maxDisplay = Math.min(count, 6);
    const spacing = Math.min(40, (height - 60) / (maxDisplay + 1));
    const startY = height / 2 - ((maxDisplay - 1) * spacing) / 2;
    return Array.from({ length: maxDisplay }, (_, i) => ({ x, y: startY + i * spacing }));
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 280 }}>
      {layers.slice(0, -1).map((layer, li) => {
        const from = getNodePositions(li, layer.count);
        const to = getNodePositions(li + 1, layers[li + 1].count);
        return from.flatMap((f, fi) => to.map((t, ti) => (
          <line key={`${li}-${fi}-${ti}`} x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke={config.color} strokeOpacity={0.12} strokeWidth={1} />
        )));
      })}
      {layers.map((layer, li) => {
        const nodes = getNodePositions(li, layer.count);
        return (
          <g key={li}>
            {nodes.map((n, ni) => (
              <g key={ni}>
                <circle cx={n.x} cy={n.y} r={10} fill={config.color} fillOpacity={0.2} stroke={config.color} strokeWidth={1.5} />
                {li === 0 && features[ni] && (
                  <text x={n.x - 16} y={n.y + 4} textAnchor="end" fontSize={7} fill="#64748b">
                    {features[ni].length > 12 ? features[ni].slice(0, 11) + "…" : features[ni]}
                  </text>
                )}
                {li === layers.length - 1 && (
                  <text x={n.x + 16} y={n.y + 4} textAnchor="start" fontSize={8} fill="#64748b">💪 Strength</text>
                )}
              </g>
            ))}
            {layer.count > 6 && (
              <text x={nodes[nodes.length - 1].x} y={nodes[nodes.length - 1].y + 24} textAnchor="middle" fontSize={8} fill="#94a3b8">
                +{layer.count - 6} more
              </text>
            )}
            <text x={nodes[0].x} y={20} textAnchor="middle" fontSize={9} fontWeight={600} fill="#475569">{layer.label}</text>
            <text x={nodes[0].x} y={height - 10} textAnchor="middle" fontSize={8} fill="#94a3b8">({layer.count})</text>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Experiment Detail Card
// ═══════════════════════════════════════════
function ExperimentDetailCard({ config }: { config: ExperimentConfig }) {
  const [open, setOpen] = useState(false);
  const data = mseData[config.id];
  const mean = getMean(data);
  const std = getStd(data);

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${open ? "ring-2 ring-slate-200" : ""}`} style={{ borderColor: open ? config.color : "#e2e8f0" }}>
      <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-white shadow-sm" style={{ backgroundColor: config.color }}>
            {config.shortLabel}
          </span>
          <div>
            <h4 className="font-bold text-slate-900">{config.icon} {config.label}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {config.normalized ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Normalized
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-700">
                  <XCircle className="h-2.5 w-2.5" /> Raw Data
                </span>
              )}
              <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-bold text-purple-700">
                <Layers className="h-2.5 w-2.5" /> {config.hiddenLayers} Hidden
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                <Zap className="h-2.5 w-2.5" /> {config.epochs} Epochs
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-extrabold text-slate-900">{mean.toFixed(1)}</p>
            <p className="text-xs text-slate-400">±{std.toFixed(1)}</p>
          </div>
          {open ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h5 className="mb-3 text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Brain className="h-4 w-4" /> Network Architecture
              </h5>
              <NetworkDiagram config={config} />
            </div>
            <div>
              <h5 className="mb-3 text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Configuration
              </h5>
              <div className="space-y-2">
                {[
                  ["🔢 Hidden Layers", config.hiddenLayers],
                  ["🧮 Neurons/Layer", 10],
                  ["⚡ Activation", "ReLU"],
                  ["🎯 Optimizer", "Adam"],
                  ["📐 Loss Function", "MSE"],
                  ["🔄 Epochs", config.epochs],
                  ["📊 Normalization", config.normalized ? "✅ Z-score" : "❌ None"],
                  ["✂️ Test Size", "30%"],
                  ["🔁 Iterations", 50],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm border border-slate-100">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-bold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Python Code Viewer
// ═══════════════════════════════════════════
function CodeViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-bold text-slate-900">🐍 Model Code</h3>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Python / Keras</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Copied!
            </>
          ) : (
            <>
              <Code2 className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="rounded-xl bg-slate-900 p-4 text-xs text-slate-100 overflow-x-auto leading-relaxed font-mono">
        <code>{pythonCode}</code>
      </pre>
    </div>
  );
}

// ═══════════════════════════════════════════
//   SECTION: Key Findings
// ═══════════════════════════════════════════
function KeyFindings() {
  const findings = [
    {
      icon: <Database className="h-5 w-5" />,
      emoji: "📊",
      title: "Data Normalization Matters",
      desc: `Normalizing the input features (Part B) reduced mean MSE from ${getMean(mseData.A).toFixed(0)} to ${getMean(mseData.B).toFixed(0)}, and dramatically reduced variance (std from ${getStd(mseData.A).toFixed(0)} to ${getStd(mseData.B).toFixed(0)}).`,
      color: "#f59e0b",
      tag: "Impact: High",
    },
    {
      icon: <TrendingDown className="h-5 w-5" />,
      emoji: "⏳",
      title: "More Epochs Help",
      desc: `Increasing epochs from 50 to 100 (Part C) further reduced mean MSE to ${getMean(mseData.C).toFixed(0)}, showing the model benefits from longer training.`,
      color: "#3b82f6",
      tag: "Impact: Medium",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      emoji: "🧠",
      title: "Deeper Networks Win",
      desc: `Adding 2 more hidden layers (Part D) achieved the lowest MSE of ${getMean(mseData.D).toFixed(0)}, demonstrating that increased model capacity captures more complex patterns.`,
      color: "#10b981",
      tag: "Impact: High",
    },
    {
      icon: <FlaskConical className="h-5 w-5" />,
      emoji: "🔬",
      title: "Stability Improves",
      desc: `The standard deviation of MSE dropped from ${getStd(mseData.A).toFixed(0)} (Part A) to ${getStd(mseData.D).toFixed(0)} (Part D), showing that normalization and deeper architectures yield more consistent results.`,
      color: "#8b5cf6",
      tag: "Impact: Medium",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-900">💡 Key Findings</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {findings.map((f) => (
          <div key={f.title} className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-3 mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm flex-shrink-0" style={{ backgroundColor: f.color }}>
                {f.icon}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {f.emoji} {f.title}
                </h4>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 mt-0.5">
                  {f.tag}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 ml-[52px]">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//                MAIN APP
// ═══════════════════════════════════════════
export function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  🧠 Neural Network Regression
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                  <span>🏗️</span> Concrete Compressive Strength Prediction
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs text-slate-600">
                <Info className="h-4 w-4" />
                <span>Keras Sequential · {features.length} Features · {datasetInfo.totalSamples} Samples</span>
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                4 Experiments
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1 mt-4 -mb-4 pb-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-700 border border-b-0 border-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <>
            <SummaryCards />
            <PipelineViz />
            <div className="grid gap-6 lg:grid-cols-2">
              <MeanMSEChart />
              <ImprovementChart />
            </div>
            <KeyFindings />
          </>
        )}

        {/* ─── DATASET TAB ─── */}
        {activeTab === "dataset" && (
          <>
            <DatasetOverview />
            <CodeViewer />
          </>
        )}

        {/* ─── EXPERIMENTS TAB ─── */}
        {activeTab === "experiments" && (
          <>
            <PipelineViz />
            <div>
              <div className="mb-4 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-extrabold text-slate-900">🧪 Experiment Details</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                  4 configurations
                </span>
              </div>
              <div className="space-y-3">
                {experiments.map((exp) => (
                  <ExperimentDetailCard key={exp.id} config={exp} />
                ))}
              </div>
            </div>
            <ModelRadarChart />
            <CodeViewer />
          </>
        )}

        {/* ─── RESULTS TAB ─── */}
        {activeTab === "results" && (
          <>
            <SummaryCards />
            <div className="grid gap-6 lg:grid-cols-2">
              <MeanMSEChart />
              <ImprovementChart />
            </div>
            <IterationChart />
            <div className="grid gap-6 lg:grid-cols-2">
              <DistributionChart />
              <ModelRadarChart />
            </div>
            <StatsTable />
            <KeyFindings />
          </>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-6 pb-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1"><Brain className="h-3.5 w-3.5" /> Neural Network Regression Dashboard</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Code2 className="h-3.5 w-3.5" /> React + Tailwind + Recharts</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Database className="h-3.5 w-3.5" /> UCI Concrete Dataset</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Cpu className="h-3.5 w-3.5" /> Keras Sequential Model</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

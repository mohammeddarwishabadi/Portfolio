import { modelDescriptions, classificationResults, regressionResult } from "../data/modelResults";
import { TrendingUp, Users, GitBranch, LogIn, Cpu } from "lucide-react";

const modelIcons: Record<string, React.ReactNode> = {
  "Linear Regression": <TrendingUp className="w-6 h-6" />,
  "KNN (K=4)": <Users className="w-6 h-6" />,
  "Decision Tree": <GitBranch className="w-6 h-6" />,
  "Logistic Regression": <LogIn className="w-6 h-6" />,
  SVM: <Cpu className="w-6 h-6" />,
};

const modelColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  "Linear Regression": {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    gradient: "from-rose-500 to-pink-600",
  },
  "KNN (K=4)": {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    gradient: "from-indigo-500 to-purple-600",
  },
  "Decision Tree": {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-200",
    gradient: "from-cyan-500 to-teal-600",
  },
  "Logistic Regression": {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-green-600",
  },
  SVM: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    gradient: "from-amber-500 to-orange-600",
  },
};

export function ModelCards() {
  const allModels = [
    {
      name: "Linear Regression",
      type: "Regression",
      metrics: [
        { label: "MAE", value: regressionResult.mae.toFixed(4) },
        { label: "MSE", value: regressionResult.mse.toFixed(4) },
        { label: "R²", value: regressionResult.r2.toFixed(4) },
      ],
    },
    ...classificationResults.map((r) => ({
      name: r.model,
      type: "Classification",
      metrics: [
        { label: "Accuracy", value: (r.accuracy * 100).toFixed(1) + "%" },
        { label: "Jaccard", value: (r.jaccardIndex * 100).toFixed(1) + "%" },
        { label: "F1", value: (r.f1Score * 100).toFixed(1) + "%" },
        ...(r.logLoss !== null ? [{ label: "LogLoss", value: r.logLoss.toFixed(4) }] : []),
      ],
    })),
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Model Deep Dive</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Individual model cards with descriptions and key performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allModels.map((model) => {
            const colors = modelColors[model.name];
            return (
              <div
                key={model.name}
                className={`group bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
                    {modelIcons[model.name]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{model.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                    >
                      {model.type}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-3">
                  {modelDescriptions[model.name]}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {model.metrics.map((m) => (
                    <div key={m.label} className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                        {m.label}
                      </p>
                      <p
                        className={`text-sm font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
                      >
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

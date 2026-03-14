import { Target, Percent, BarChart3, AlertCircle } from "lucide-react";
import { classificationResults, regressionResult } from "../data/modelResults";

function getBestModel(metric: keyof typeof classificationResults[0]) {
  return classificationResults.reduce((best, curr) => {
    const bv = best[metric];
    const cv = curr[metric];
    if (typeof bv === "number" && typeof cv === "number") {
      return cv > bv ? curr : best;
    }
    return best;
  });
}

const bestAccuracy = getBestModel("accuracy");
const bestF1 = getBestModel("f1Score");
const bestJaccard = getBestModel("jaccardIndex");
const lrModel = classificationResults.find((r) => r.logLoss !== null);

const cards = [
  {
    title: "Best Accuracy",
    value: `${(bestAccuracy.accuracy * 100).toFixed(1)}%`,
    model: bestAccuracy.model,
    icon: <Target className="w-5 h-5" />,
    gradient: "from-indigo-500 to-purple-600",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    title: "Best F1 Score",
    value: `${(bestF1.f1Score * 100).toFixed(1)}%`,
    model: bestF1.model,
    icon: <BarChart3 className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    title: "Best Jaccard Index",
    value: `${(bestJaccard.jaccardIndex * 100).toFixed(1)}%`,
    model: bestJaccard.model,
    icon: <Percent className="w-5 h-5" />,
    gradient: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    title: "LogLoss (LR)",
    value: lrModel?.logLoss?.toFixed(4) ?? "N/A",
    model: "Logistic Regression",
    icon: <AlertCircle className="w-5 h-5" />,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    title: "Linear Reg. R²",
    value: regressionResult.r2.toFixed(4),
    model: "Linear Regression",
    icon: <BarChart3 className="w-5 h-5" />,
    gradient: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    title: "Linear Reg. MSE",
    value: regressionResult.mse.toFixed(4),
    model: "Linear Regression",
    icon: <Target className="w-5 h-5" />,
    gradient: "from-violet-500 to-fuchsia-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
];

export function MetricCards() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Key Results</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Headline metrics highlighting the best-performing models and their scores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.textColor}`}>
                  {card.icon}
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {card.model}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <p
                className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

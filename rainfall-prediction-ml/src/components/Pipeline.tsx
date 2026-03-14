import { Download, Code, Filter, GitBranch, Brain, BarChart3 } from "lucide-react";
import { pipelineSteps } from "../data/modelResults";

const iconMap: Record<string, React.ReactNode> = {
  download: <Download className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  filter: <Filter className="w-6 h-6" />,
  split: <GitBranch className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  chart: <BarChart3 className="w-6 h-6" />,
};

const colors = [
  "from-blue-500 to-blue-600",
  "from-cyan-500 to-teal-600",
  "from-emerald-500 to-green-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-violet-600",
  "from-rose-500 to-pink-600",
];

export function Pipeline() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">ML Pipeline</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            The end-to-end workflow from raw weather data to model evaluation and comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelineSteps.map((step, i) => (
            <div
              key={step.step}
              className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${colors[i]} text-white flex items-center justify-center shadow-lg`}
                >
                  {iconMap[step.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

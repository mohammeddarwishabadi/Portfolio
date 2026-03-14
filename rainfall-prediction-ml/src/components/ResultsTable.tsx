import { classificationResults, regressionResult, modelDescriptions } from "../data/modelResults";
import { Trophy, Info } from "lucide-react";
import { useState } from "react";

export function ResultsTable() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const bestAccuracy = Math.max(...classificationResults.map((r) => r.accuracy));
  const bestJaccard = Math.max(...classificationResults.map((r) => r.jaccardIndex));
  const bestF1 = Math.max(...classificationResults.map((r) => r.f1Score));

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Detailed Results</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Complete evaluation metrics for all trained models. Best values are highlighted with a trophy icon.
          </p>
        </div>

        {/* Classification Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">Classification Models</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Jaccard Index
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    F1 Score
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Log Loss
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Info
                  </th>
                </tr>
              </thead>
              <tbody>
                {classificationResults.map((r) => (
                  <tr
                    key={r.model}
                    className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{r.model}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        {r.accuracy === bestAccuracy && (
                          <Trophy className="w-4 h-4 text-amber-500" />
                        )}
                        <span
                          className={`font-mono font-medium ${
                            r.accuracy === bestAccuracy ? "text-amber-600" : "text-slate-700"
                          }`}
                        >
                          {(r.accuracy * 100).toFixed(2)}%
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        {r.jaccardIndex === bestJaccard && (
                          <Trophy className="w-4 h-4 text-amber-500" />
                        )}
                        <span
                          className={`font-mono font-medium ${
                            r.jaccardIndex === bestJaccard ? "text-amber-600" : "text-slate-700"
                          }`}
                        >
                          {(r.jaccardIndex * 100).toFixed(2)}%
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        {r.f1Score === bestF1 && <Trophy className="w-4 h-4 text-amber-500" />}
                        <span
                          className={`font-mono font-medium ${
                            r.f1Score === bestF1 ? "text-amber-600" : "text-slate-700"
                          }`}
                        >
                          {(r.f1Score * 100).toFixed(2)}%
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                      {r.logLoss !== null ? r.logLoss.toFixed(4) : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setSelectedModel(selectedModel === r.model ? null : r.model)
                        }
                        className="p-1.5 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedModel && (
            <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-100 animate-fadeIn">
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">{selectedModel}:</span>{" "}
                {modelDescriptions[selectedModel]}
              </p>
            </div>
          )}
        </div>

        {/* Regression Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-semibold text-slate-900">Regression Model</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    MAE
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    MSE
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    R² Score
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {regressionResult.model}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                    {regressionResult.mae.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                    {regressionResult.mse.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                    {regressionResult.r2.toFixed(4)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

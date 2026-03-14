import { datasetFields } from "../data/modelResults";
import { Database, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function DatasetInfo() {
  const [expanded, setExpanded] = useState(false);
  const displayFields = expanded ? datasetFields : datasetFields.slice(0, 8);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Dataset Overview</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Australian weather observations from 2008–2017 sourced from the Bureau of Meteorology.
            The dataset contains {datasetFields.length} features describing daily weather conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats cards */}
          <div className="space-y-4">
            {[
              { label: "Time Period", value: "2008 – 2017", color: "bg-blue-500" },
              { label: "Total Features", value: "23 columns", color: "bg-emerald-500" },
              { label: "Target Variable", value: "RainTomorrow", color: "bg-purple-500" },
              { label: "Train/Test Split", value: "80% / 20%", color: "bg-amber-500" },
              { label: "Encoding", value: "One-Hot", color: "bg-rose-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-2 h-10 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Field table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">Dataset Fields</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Field
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayFields.map((f) => (
                    <tr
                      key={f.field}
                      className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${
                        f.field === "RainTomorrow" ? "bg-amber-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 font-mono text-sm font-semibold text-slate-900">
                        {f.field}
                        {f.field === "RainTomorrow" && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 rounded">
                            target
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">{f.description}</td>
                      <td className="px-4 py-2.5 text-center text-sm text-slate-500">{f.unit}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            f.type === "float"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {f.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 text-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {expanded ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show All {datasetFields.length} Fields <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

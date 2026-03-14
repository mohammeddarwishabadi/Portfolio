import { CloudRain, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CloudRain className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Rain Prediction Australia</span>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p className="text-sm">
              Built by <span className="text-white font-medium">Mohammed Darwish Abadi</span>
            </p>
            <p className="text-xs text-slate-500">
              Data source:{" "}
              <a
                href="http://www.bom.gov.au/climate/dwo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Bureau of Meteorology
              </a>
            </p>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
          Machine Learning Classification &amp; Regression Analysis • Scikit-learn • Python
        </div>
      </div>
    </footer>
  );
}

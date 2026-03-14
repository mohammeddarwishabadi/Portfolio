import { CloudRain, Droplets, Sun } from "lucide-react";

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {/* Animated rain drops background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 bg-blue-300 rounded-full animate-pulse"
            style={{
              left: `${(i * 3.3) % 100}%`,
              top: `${(i * 7) % 100}%`,
              height: `${20 + (i % 4) * 10}px`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1 + (i % 3) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl">
              <CloudRain className="w-10 h-10 text-blue-300" />
            </div>
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl">
              <Sun className="w-10 h-10 text-yellow-300" />
            </div>
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl">
              <Droplets className="w-10 h-10 text-cyan-300" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Rain Prediction in{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Australia
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-200 max-w-3xl leading-relaxed">
            Machine learning classification and regression analysis on Australian weather data
            (2008–2017) using KNN, Decision Trees, Logistic Regression, SVM, and Linear Regression.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {["Linear Regression", "KNN", "Decision Tree", "Logistic Regression", "SVM"].map(
              (model) => (
                <span
                  key={model}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors"
                >
                  {model}
                </span>
              )
            )}
          </div>

          <p className="text-sm text-blue-300/80 pt-2">By Mohammed Darwish Abadi</p>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L48 55C96 50 192 40 288 33.3C384 26.7 480 23.3 576 25C672 26.7 768 33.3 864 36.7C960 40 1056 40 1152 36.7C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </header>
  );
}

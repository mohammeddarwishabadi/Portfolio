import { type WeatherInput, COMPASS, PRESETS } from "../utils/predictor";
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Gauge,
  CloudRain,
  Sparkles,
} from "lucide-react";

// ── tiny reusable slider ────────────────────────────
function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-600">{label}</label>
        <span className="text-sm font-mono font-bold text-indigo-600">
          {value}
          <span className="text-slate-400 font-normal">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

// ── direction picker ────────────────────────────────
function DirSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition"
      >
        {COMPASS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── section wrapper ─────────────────────────────────
function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
        <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}

// ── main form ───────────────────────────────────────
interface Props {
  input: WeatherInput;
  onChange: (input: WeatherInput) => void;
}

export function PredictionForm({ input, onChange }: Props) {
  const set = <K extends keyof WeatherInput>(
    key: K,
    value: WeatherInput[K]
  ) => {
    onChange({ ...input, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* ── Presets ──────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-700">
            Quick Presets
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => onChange(p.input)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
              title={p.desc}
            >
              <span className="text-lg">{p.emoji}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Temperature ─────────────── */}
      <Section
        icon={<Thermometer className="w-5 h-5 text-red-500" />}
        title="Temperature"
        color="bg-red-50"
      >
        <Slider label="Min Temp" value={input.minTemp} min={-8} max={34} step={0.5} unit="°C" onChange={(v) => set("minTemp", v)} />
        <Slider label="Max Temp" value={input.maxTemp} min={0} max={48} step={0.5} unit="°C" onChange={(v) => set("maxTemp", v)} />
        <Slider label="Temp at 9 am" value={input.temp9am} min={-5} max={42} step={0.5} unit="°C" onChange={(v) => set("temp9am", v)} />
        <Slider label="Temp at 3 pm" value={input.temp3pm} min={0} max={46} step={0.5} unit="°C" onChange={(v) => set("temp3pm", v)} />
      </Section>

      {/* ── Moisture ────────────────── */}
      <Section
        icon={<Droplets className="w-5 h-5 text-blue-500" />}
        title="Moisture"
        color="bg-blue-50"
      >
        <Slider label="Rainfall" value={input.rainfall} min={0} max={80} step={0.5} unit=" mm" onChange={(v) => set("rainfall", v)} />
        <Slider label="Evaporation" value={input.evaporation} min={0} max={25} step={0.5} unit=" mm" onChange={(v) => set("evaporation", v)} />
        <Slider label="Humidity 9 am" value={input.humidity9am} min={0} max={100} step={1} unit="%" onChange={(v) => set("humidity9am", v)} />
        <Slider label="Humidity 3 pm" value={input.humidity3pm} min={0} max={100} step={1} unit="%" onChange={(v) => set("humidity3pm", v)} />
      </Section>

      {/* ── Sky ─────────────────────── */}
      <Section
        icon={<Sun className="w-5 h-5 text-amber-500" />}
        title="Sky Conditions"
        color="bg-amber-50"
      >
        <Slider label="Sunshine" value={input.sunshine} min={0} max={14.5} step={0.5} unit=" hrs" onChange={(v) => set("sunshine", v)} />
        <div />
        <Slider label="Cloud 9 am" value={input.cloud9am} min={0} max={8} step={1} unit=" /8" onChange={(v) => set("cloud9am", v)} />
        <Slider label="Cloud 3 pm" value={input.cloud3pm} min={0} max={8} step={1} unit=" /8" onChange={(v) => set("cloud3pm", v)} />
      </Section>

      {/* ── Wind ────────────────────── */}
      <Section
        icon={<Wind className="w-5 h-5 text-teal-500" />}
        title="Wind"
        color="bg-teal-50"
      >
        <DirSelect label="Gust Direction" value={input.windGustDir} onChange={(v) => set("windGustDir", v)} />
        <Slider label="Gust Speed" value={input.windGustSpeed} min={0} max={135} step={1} unit=" km/h" onChange={(v) => set("windGustSpeed", v)} />
        <DirSelect label="Dir 9 am" value={input.windDir9am} onChange={(v) => set("windDir9am", v)} />
        <DirSelect label="Dir 3 pm" value={input.windDir3pm} onChange={(v) => set("windDir3pm", v)} />
        <Slider label="Speed 9 am" value={input.windSpeed9am} min={0} max={80} step={1} unit=" km/h" onChange={(v) => set("windSpeed9am", v)} />
        <Slider label="Speed 3 pm" value={input.windSpeed3pm} min={0} max={85} step={1} unit=" km/h" onChange={(v) => set("windSpeed3pm", v)} />
      </Section>

      {/* ── Pressure ────────────────── */}
      <Section
        icon={<Gauge className="w-5 h-5 text-violet-500" />}
        title="Atmospheric Pressure"
        color="bg-violet-50"
      >
        <Slider label="Pressure 9 am" value={input.pressure9am} min={980} max={1040} step={0.5} unit=" hPa" onChange={(v) => set("pressure9am", v)} />
        <Slider label="Pressure 3 pm" value={input.pressure3pm} min={980} max={1040} step={0.5} unit=" hPa" onChange={(v) => set("pressure3pm", v)} />
      </Section>

      {/* ── Rain Today ──────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50">
              <CloudRain className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Rain Today?</h3>
              <p className="text-xs text-slate-400">Did it rain today?</p>
            </div>
          </div>
          <button
            onClick={() => set("rainToday", !input.rainToday)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              input.rainToday ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform ${
                input.rainToday ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

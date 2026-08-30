export default function Field({ label, unit, value, onChange, min, max, step = 1, type = "number", helpText }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
        {label}
        {unit ? <span className="text-xs font-normal text-slate-400">{unit}</span> : null}
      </span>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      {helpText ? <span className="mt-1 block text-xs text-slate-400">{helpText}</span> : null}
    </label>
  );
}

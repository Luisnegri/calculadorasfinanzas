export default function ResultStat({ label, value, emphasis = false }) {
  return (
    <div className={`rounded-lg p-4 ${emphasis ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-800"}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${emphasis ? "text-brand-100" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold ${emphasis ? "text-white" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

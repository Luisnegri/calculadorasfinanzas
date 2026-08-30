import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { amortizationSchedule } from "../lib/finance";
import { formatCurrency } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "amortizacion-credito");

export default function Amortizacion() {
  const [capital, setCapital] = useState(15000);
  const [tasa, setTasa] = useState(8.5);
  const [anos, setAnos] = useState(5);
  const [showFullTable, setShowFullTable] = useState(false);

  const result = useMemo(() => {
    if (capital <= 0 || anos <= 0) return null;
    return amortizationSchedule(capital, tasa, anos);
  }, [capital, tasa, anos]);

  const visibleRows = result ? (showFullTable ? result.schedule : result.schedule.slice(0, 12)) : [];

  return (
    <CalculatorLayout
      calc={calc}
      intro="Genera la tabla de amortización mensual de un préstamo o crédito personal: cuánto de cada cuota es capital y cuánto interés, y cómo baja el saldo pendiente."
      faq={[
        {
          q: "¿Qué es una tabla de amortización?",
          a: "Es el desglose mes a mes de cada cuota de un préstamo, mostrando cuánto se destina a pagar intereses y cuánto a reducir el capital pendiente (el saldo que aún debes).",
        },
        {
          q: "¿Por qué al principio pago más intereses que capital?",
          a: "En un préstamo de cuota constante (amortización francesa), los intereses se calculan sobre el saldo pendiente, que es mayor al inicio. Por eso, al principio la mayor parte de la cuota es interés y con el tiempo esa proporción se invierte.",
        },
        {
          q: "¿Sirve esta calculadora para cualquier tipo de crédito?",
          a: "Sí, funciona para cualquier préstamo con cuota fija: personales, de coche, hipotecarios o de estudios, siempre que uses el tipo de interés y el plazo correspondientes.",
        },
      ]}
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Capital del préstamo" unit="€" value={capital} min={0} step={100} onChange={setCapital} />
          <Field label="Tipo de interés" unit="% anual" value={tasa} min={0} max={30} step={0.1} onChange={setTasa} />
          <Field label="Plazo" unit="años" value={anos} min={1} max={40} step={1} onChange={setAnos} />
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResultStat label="Cuota mensual" value={formatCurrency(result.payment)} emphasis />
              <ResultStat label="Intereses totales" value={formatCurrency(result.totalInterest)} />
              <ResultStat label="Total a pagar" value={formatCurrency(result.totalPaid)} />
            </div>

            <div className="mt-8 overflow-x-auto">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Tabla de amortización mensual</p>
                <button
                  type="button"
                  onClick={() => setShowFullTable((v) => !v)}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  {showFullTable ? "Mostrar solo primer año" : `Mostrar los ${result.schedule.length} meses`}
                </button>
              </div>
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Mes</th>
                    <th className="py-2 pr-4">Cuota</th>
                    <th className="py-2 pr-4">Interés</th>
                    <th className="py-2 pr-4">Capital</th>
                    <th className="py-2">Saldo pendiente</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.month} className="border-b border-slate-100">
                      <td className="py-2 pr-4">{row.month}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.payment)}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.interest)}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.principal)}</td>
                      <td className="py-2">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce un capital y un plazo válidos para ver la tabla.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}

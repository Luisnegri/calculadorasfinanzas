import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { amortizationSchedule, amortizationYearlySummary } from "../lib/finance";
import { formatCurrency, formatPercent } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-hipoteca");

export default function Hipoteca() {
  const [precio, setPrecio] = useState(250000);
  const [entrada, setEntrada] = useState(50000);
  const [tasa, setTasa] = useState(3.2);
  const [anos, setAnos] = useState(30);

  const principal = Math.max(0, precio - entrada);

  const result = useMemo(() => {
    if (principal <= 0 || anos <= 0) return null;
    const { schedule, totalInterest, totalPaid, payment } = amortizationSchedule(principal, tasa, anos);
    return {
      payment,
      totalInterest,
      totalPaid,
      yearly: amortizationYearlySummary(schedule),
    };
  }, [principal, tasa, anos]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Calcula la cuota mensual de tu hipoteca, cuánto pagarás de intereses en total y cómo evoluciona el capital pendiente año a año."
      faq={[
        {
          q: "¿Cómo se calcula la cuota mensual de una hipoteca?",
          a: "Se usa la fórmula de amortización francesa (cuota constante): la cuota se mantiene igual cada mes, pero la parte que corresponde a intereses baja con el tiempo y la que amortiza capital sube.",
        },
        {
          q: "¿Qué es la TIN y la TAE?",
          a: "El TIN (tipo de interés nominal) es el que se usa para calcular la cuota. La TAE incluye además comisiones y gastos asociados, por lo que suele ser algo más alta que el TIN.",
        },
        {
          q: "¿Cuánta entrada necesito para una hipoteca?",
          a: "Los bancos suelen financiar hasta el 80% del valor de tasación o compra, por lo que necesitarás al menos un 20% de entrada más los gastos de compraventa (impuestos, notaría, registro).",
        },
      ]}
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Precio de la vivienda" unit="€" value={precio} min={0} step={1000} onChange={setPrecio} />
          <Field label="Entrada / ahorro" unit="€" value={entrada} min={0} step={1000} onChange={setEntrada} />
          <Field label="Tipo de interés (TIN)" unit="% anual" value={tasa} min={0} max={20} step={0.05} onChange={setTasa} />
          <Field label="Plazo" unit="años" value={anos} min={1} max={40} step={1} onChange={setAnos} />
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Capital a financiar: <strong className="text-slate-700">{formatCurrency(principal)}</strong>
        </p>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResultStat label="Cuota mensual" value={formatCurrency(result.payment)} emphasis />
              <ResultStat label="Intereses totales" value={formatCurrency(result.totalInterest)} />
              <ResultStat label="Total a pagar" value={formatCurrency(result.totalPaid)} />
            </div>

            <div className="mt-8 overflow-x-auto">
              <p className="mb-2 text-sm font-semibold text-slate-700">Resumen anual</p>
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Año</th>
                    <th className="py-2 pr-4">Capital amortizado</th>
                    <th className="py-2 pr-4">Intereses pagados</th>
                    <th className="py-2">Saldo pendiente</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearly.map((row) => (
                    <tr key={row.year} className="border-b border-slate-100">
                      <td className="py-2 pr-4">{row.year}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.principal)}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.interest)}</td>
                      <td className="py-2">{formatCurrency(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              El coste total de los intereses representa el{" "}
              {formatPercent(result.totalInterest / principal)} del capital financiado.
            </p>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce un precio y una entrada válidos para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}

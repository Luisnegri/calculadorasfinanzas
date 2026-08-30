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
        {
          q: "¿Hipoteca a tipo fijo o variable: cuál me conviene?",
          a: "La fija te da una cuota estable durante toda la vida del préstamo, útil si prefieres previsibilidad. La variable (ligada al Euríbor + diferencial) suele partir con un interés más bajo, pero tu cuota puede subir o bajar según el mercado. La mixta combina un periodo inicial fijo y después variable.",
        },
        {
          q: "¿Puedo amortizar mi hipoteca antes de tiempo?",
          a: "Sí. Puedes hacer amortizaciones parciales (para reducir cuota o plazo) o cancelar el préstamo por completo. Desde 2019 la ley limita las comisiones por amortización anticipada al 2% el primer año y al 1,5% después en hipotecas a tipo fijo (0,25%/0,15% en variable), y en muchos casos ya no se cobran.",
        },
        {
          q: "¿Qué otros gastos debo sumar al comprar una vivienda con hipoteca?",
          a: "Además de la entrada, cuenta con tasación, notaría, registro de la propiedad, gestoría y el Impuesto de Transmisiones Patrimoniales (en vivienda de segunda mano) o el IVA (en obra nueva). Desde 2018 el banco asume el Impuesto de Actos Jurídicos Documentados.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo interpretar estos resultados</h2>
          <p className="leading-relaxed text-slate-600">
            La cuota mensual es lo que pagarás cada mes durante todo el plazo si el tipo de interés se mantiene
            constante. Los intereses totales son el coste real de financiarte: cuanto más largo el plazo, más
            interés total pagarás aunque la cuota sea menor. La tabla de amortización te muestra, año a año, qué
            parte de cada cuota reduce el capital pendiente y qué parte es coste financiero — al principio la
            mayoría es interés, y esa proporción se invierte con el tiempo.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">3 formas de pagar menos por tu hipoteca</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Compara varias ofertas antes de firmar.</strong> Un TIN medio
              punto más bajo puede suponer miles de euros de diferencia en el total pagado a 30 años.
            </li>
            <li>
              <strong className="text-slate-800">Amortiza capital en cuanto puedas.</strong> Cada euro que
              adelantas deja de generar intereses el resto del plazo — es la forma más directa de reducir el
              coste total.
            </li>
            <li>
              <strong className="text-slate-800">
                Si puedes asumir una cuota mayor, acorta el plazo en vez de solo bajar la cuota.
              </strong>{" "}
              Un plazo más corto reduce mucho los intereses totales, aunque la cuota mensual sea más alta.
            </li>
          </ul>
        </>
      }
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

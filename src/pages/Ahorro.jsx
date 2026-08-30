import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { futureValueWithContributions, requiredMonthlyContribution } from "../lib/finance";
import { formatCurrency } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-ahorro");

export default function Ahorro() {
  const [meta, setMeta] = useState(10000);
  const [inicial, setInicial] = useState(1000);
  const [tasa, setTasa] = useState(3);
  const [anos, setAnos] = useState(5);

  const result = useMemo(() => {
    if (anos <= 0 || meta <= 0) return null;
    const { monthlyContribution, alreadyReached } = requiredMonthlyContribution(meta, inicial, tasa, anos);
    const projection = futureValueWithContributions(inicial, monthlyContribution, tasa, anos);
    return { monthlyContribution, alreadyReached, projection };
  }, [meta, inicial, tasa, anos]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Indica tu meta de ahorro, lo que ya tienes ahorrado y el plazo en el que quieres conseguirlo, y calcula cuánto necesitas apartar cada mes."
      faq={[
        {
          q: "¿Cómo calcula esta calculadora la aportación mensual?",
          a: "Parte de tu ahorro inicial y de la rentabilidad esperada, y calcula qué aportación constante cada mes, capitalizando mensualmente, hace que el saldo llegue exactamente a tu meta al final del plazo elegido.",
        },
        {
          q: "¿Qué pasa si mi ahorro inicial ya supera la meta?",
          a: "La calculadora te lo indica y muestra una aportación mensual de 0€: con la rentabilidad esperada, tu capital inicial ya crecería por encima de tu objetivo sin necesidad de aportar más.",
        },
        {
          q: "¿Qué rentabilidad debería usar si no lo sé?",
          a: "Si vas a ahorrar en una cuenta o depósito sin apenas riesgo, usa un porcentaje bajo (0-2%). Si vas a invertir en fondos o bolsa, una referencia histórica moderada para el largo plazo suele rondar el 4-7% anual, aunque no está garantizada y varía según el riesgo asumido.",
        },
        {
          q: "¿Por qué la aportación mensual necesaria baja tanto si alargo el plazo?",
          a: "Porque cuanto más tiempo tiene tu dinero para capitalizar, más peso ganan los intereses generados frente a lo que aportas tú directamente. Alargar el plazo unos años puede reducir mucho la aportación mensual necesaria.",
        },
        {
          q: "¿Es realista asumir una rentabilidad constante todos los años?",
          a: "No exactamente: en la práctica, la rentabilidad varía de un año a otro, sobre todo si inviertes en activos con riesgo. Esta calculadora asume una rentabilidad media constante como simplificación, útil para planificar, no como promesa de resultado.",
        },
        {
          q: "¿Esta calculadora descuenta la inflación o los impuestos?",
          a: "No. Muestra cifras nominales. Si quieres saber tu poder adquisitivo real, deberías restar la inflación esperada de la rentabilidad, y ten en cuenta que las ganancias de capital tributan en la declaración de la renta al retirar el dinero.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo usar esta proyección para planificar tu meta</h2>
          <p className="leading-relaxed text-slate-600">
            La aportación mensual que calculamos es la que, sumada a tu ahorro inicial y a la rentabilidad esperada,
            te lleva exactamente a tu meta al final del plazo. Si esa cifra te resulta inasumible, tienes tres
            palancas para ajustarla: alargar el plazo, reducir la meta, o aumentar tu ahorro inicial si es posible.
            Cualquiera de las tres reduce la exigencia mensual.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Consejos para llegar a tu meta de ahorro</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Automatiza la aportación:</strong> una transferencia programada el
              día que cobras evita que el ahorro dependa de la fuerza de voluntad cada mes.
            </li>
            <li>
              <strong className="text-slate-800">Revisa la meta periódicamente:</strong> si tus ingresos cambian o
              la rentabilidad real difiere de la estimada, recalcula la aportación necesaria en lugar de mantenerla
              fija indefinidamente.
            </li>
            <li>
              <strong className="text-slate-800">Separa el fondo de emergencia de otras metas:</strong> un colchón
              para imprevistos debería estar en algo líquido y seguro, aparte de tus metas de ahorro a más largo
              plazo.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Meta de ahorro" unit="€" value={meta} min={0} step={500} onChange={setMeta} />
          <Field label="Ahorro inicial" unit="€" value={inicial} min={0} step={100} onChange={setInicial} />
          <Field label="Rentabilidad esperada" unit="% anual" value={tasa} min={0} max={20} step={0.1} onChange={setTasa} />
          <Field label="Plazo" unit="años" value={anos} min={1} max={40} step={1} onChange={setAnos} />
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultStat
                label="Aportación mensual necesaria"
                value={result.alreadyReached ? "0 € (meta ya cubierta)" : formatCurrency(result.monthlyContribution)}
                emphasis
              />
              <ResultStat label="Total aportado en el plazo" value={formatCurrency(result.projection.totalContributed)} />
            </div>

            {result.alreadyReached ? (
              <p className="mt-4 text-sm text-slate-500">
                Con tu ahorro inicial y la rentabilidad indicada, tu capital ya superaría la meta al final del plazo
                sin necesidad de aportar nada más.
              </p>
            ) : null}

            <div className="mt-8 overflow-x-auto">
              <p className="mb-2 text-sm font-semibold text-slate-700">Evolución anual (estimada)</p>
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Año</th>
                    <th className="py-2 pr-4">Aportado acumulado</th>
                    <th className="py-2">Saldo total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projection.yearly.map((row) => (
                    <tr key={row.year} className="border-b border-slate-100">
                      <td className="py-2 pr-4">{row.year}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.totalContributed)}</td>
                      <td className="py-2">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce una meta y un plazo válidos para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}


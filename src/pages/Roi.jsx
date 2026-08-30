import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { futureValueWithContributions, roi } from "../lib/finance";
import { formatCurrency, formatPercent } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-roi-inversion");

export default function Roi() {
  const [inicial, setInicial] = useState(10000);
  const [aporte, setAporte] = useState(200);
  const [tasa, setTasa] = useState(7);
  const [anos, setAnos] = useState(10);

  const projection = useMemo(() => {
    if (anos <= 0) return null;
    return futureValueWithContributions(inicial, aporte, tasa, anos);
  }, [inicial, aporte, tasa, anos]);

  const result = useMemo(() => {
    if (!projection) return null;
    return roi(projection.totalContributed, projection.finalBalance, anos);
  }, [projection, anos]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Simula el crecimiento de una inversión con aportaciones periódicas y calcula el ROI (retorno de inversión) y el CAGR (rentabilidad anual compuesta)."
      faq={[
        {
          q: "¿Qué es el ROI?",
          a: "El ROI (Return On Investment) mide la ganancia obtenida respecto al capital invertido, expresada en porcentaje: (Valor final − Capital invertido) / Capital invertido.",
        },
        {
          q: "¿Qué diferencia hay entre ROI y CAGR?",
          a: "El ROI muestra la rentabilidad total del periodo completo. El CAGR (tasa de crecimiento anual compuesta) la anualiza, lo que permite comparar inversiones con distintos plazos.",
        },
        {
          q: "¿Esta calculadora tiene en cuenta la inflación o los impuestos?",
          a: "No. Los resultados son brutos y no descuentan inflación, comisiones ni impuestos sobre las plusvalías, que reducirán la rentabilidad real neta.",
        },
        {
          q: "¿Qué rentabilidad anual es realista esperar de una inversión?",
          a: "Depende totalmente del tipo de activo y del riesgo asumido. Como referencia histórica orientativa, la renta fija suele moverse en rangos bajos (1-4% anual) y un fondo indexado global de renta variable ha rondado el 6-8% anual a largo plazo, incluyendo años muy negativos. Rentabilidades pasadas no garantizan resultados futuros.",
        },
        {
          q: "¿Qué es el interés compuesto y por qué importa tanto a largo plazo?",
          a: "Es cuando los rendimientos generados también generan nuevos rendimientos, no solo el capital inicial. Por eso el efecto se nota poco los primeros años y se acelera con el tiempo: cuanto más largo el horizonte, mayor el peso de los intereses sobre las aportaciones.",
        },
        {
          q: "¿Debería descontar la inflación del resultado?",
          a: "Para saber tu poder adquisitivo real, sí. Si la inflación media del periodo es, por ejemplo, del 2,5% anual, tu rentabilidad real aproximada es tu rentabilidad nominal menos ese 2,5%. Esta calculadora muestra cifras nominales, sin descontar inflación ni impuestos.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo leer esta proyección</h2>
          <p className="leading-relaxed text-slate-600">
            El "valor final estimado" asume que la rentabilidad introducida se mantiene constante todos los años,
            algo que no ocurre en la realidad — los mercados varían de un año a otro. Úsalo como una estimación
            orientativa a largo plazo, no como una promesa. El ROI te dice la ganancia total del periodo completo;
            el CAGR la "anualiza" para que puedas comparar inversiones con plazos distintos en igualdad de
            condiciones.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Qué no captura esta calculadora</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Impuestos sobre las plusvalías</strong>, que en España van del
              19% al 30% según el tramo de la base del ahorro al vender o rescatar.
            </li>
            <li>
              <strong className="text-slate-800">Comisiones de gestión o custodia</strong>, que restan
              rentabilidad año a año de forma acumulativa.
            </li>
            <li>
              <strong className="text-slate-800">La volatilidad real del mercado:</strong> el camino hasta el
              valor final rara vez es una línea recta.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Inversión inicial" unit="€" value={inicial} min={0} step={500} onChange={setInicial} />
          <Field label="Aportación mensual" unit="€/mes" value={aporte} min={0} step={50} onChange={setAporte} />
          <Field label="Rentabilidad esperada" unit="% anual" value={tasa} min={-20} max={30} step={0.1} onChange={setTasa} />
          <Field label="Horizonte temporal" unit="años" value={anos} min={1} max={50} step={1} onChange={setAnos} />
        </div>

        {result && projection ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResultStat label="Valor final estimado" value={formatCurrency(projection.finalBalance)} emphasis />
              <ResultStat label="ROI total" value={formatPercent(result.roiPct / 100)} />
              <ResultStat label="CAGR (anualizado)" value={formatPercent(result.cagrPct / 100)} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultStat label="Total aportado" value={formatCurrency(projection.totalContributed)} />
              <ResultStat label="Ganancia total" value={formatCurrency(projection.totalGain)} />
            </div>

            <div className="mt-8 overflow-x-auto">
              <p className="mb-2 text-sm font-semibold text-slate-700">Evolución anual (estimada)</p>
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Año</th>
                    <th className="py-2 pr-4">Aportado acumulado</th>
                    <th className="py-2">Valor de la inversión</th>
                  </tr>
                </thead>
                <tbody>
                  {projection.yearly.map((row) => (
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
          <p className="mt-6 text-sm text-slate-500">Introduce un horizonte temporal válido para ver la proyección.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}

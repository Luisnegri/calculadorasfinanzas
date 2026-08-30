import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { futureValueWithContributions } from "../lib/finance";
import { formatCurrency, formatPercent } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-interes-compuesto");

export default function InteresCompuesto() {
  const [capital, setCapital] = useState(5000);
  const [aporte, setAporte] = useState(100);
  const [tasa, setTasa] = useState(6);
  const [anos, setAnos] = useState(15);

  const result = useMemo(() => {
    if (anos <= 0) return null;
    return futureValueWithContributions(capital, aporte, tasa, anos);
  }, [capital, aporte, tasa, anos]);

  const gainShare = result && result.finalBalance > 0 ? result.totalGain / result.finalBalance : 0;

  return (
    <CalculatorLayout
      calc={calc}
      intro="Introduce tu capital inicial, tus aportaciones mensuales y una rentabilidad anual estimada para ver cuánto puede crecer tu dinero gracias al interés compuesto."
      faq={[
        {
          q: "¿Qué es el interés compuesto?",
          a: "Es el interés que se calcula no solo sobre el capital inicial, sino también sobre los intereses ya generados en periodos anteriores. En la práctica significa que tu dinero genera rendimientos, y esos rendimientos generan a su vez nuevos rendimientos.",
        },
        {
          q: "¿Cuál es la fórmula del interés compuesto?",
          a: "La fórmula básica sin aportaciones es Valor final = Capital × (1 + tipo de interés)^número de periodos. Esta calculadora añade además aportaciones mensuales, capitalizando los intereses cada mes.",
        },
        {
          q: "¿Qué diferencia hay entre interés simple y compuesto?",
          a: "El interés simple se calcula siempre sobre el capital inicial, así que crece de forma lineal. El interés compuesto reinvierte los intereses generados, por lo que el crecimiento se acelera con el tiempo: cuanto más largo el plazo, mayor la diferencia entre ambos.",
        },
        {
          q: "¿Por qué importa tanto el horizonte temporal?",
          a: "Porque el efecto del interés compuesto es pequeño al principio y se acelera con los años. Los primeros años, la mayor parte del saldo procede de lo que aportas; con el tiempo, una proporción creciente procede de los propios intereses acumulados.",
        },
        {
          q: "¿Qué es la regla del 72?",
          a: "Es un atajo mental para estimar cada cuántos años se duplica un capital: divide 72 entre el tipo de interés anual. Por ejemplo, al 6% anual, tu dinero tardaría aproximadamente 72/6 = 12 años en duplicarse (sin contar aportaciones adicionales).",
        },
        {
          q: "¿Esta calculadora tiene en cuenta la inflación o los impuestos?",
          a: "No. Muestra una proyección nominal con una rentabilidad constante, sin descontar inflación, comisiones ni impuestos sobre las ganancias, que en España reducen la rentabilidad real neta obtenida.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Por qué el interés compuesto se acelera con el tiempo</h2>
          <p className="leading-relaxed text-slate-600">
            En los primeros años, casi todo el saldo acumulado procede de tu capital inicial y tus aportaciones. Con
            el paso del tiempo, los intereses generados empiezan a generar sus propios intereses, y esa parte del
            saldo crece cada vez más rápido. Por eso el interés compuesto se describe a menudo como un efecto que
            "no se nota" los primeros años y se dispara después: la clave no es tanto la cantidad aportada como el
            tiempo que ese dinero permanece invertido.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Cómo aprovecharlo mejor</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Empieza cuanto antes:</strong> unos pocos años más de horizonte
              pesan más que aportar cifras más altas durante menos tiempo.
            </li>
            <li>
              <strong className="text-slate-800">Automatiza aportaciones periódicas:</strong> aportar una cantidad
              fija cada mes suaviza los altibajos del mercado y mantiene la disciplina de ahorro.
            </li>
            <li>
              <strong className="text-slate-800">Revisa comisiones e impuestos:</strong> restan rentabilidad de
              forma acumulativa, así que un punto porcentual de comisión anual puede suponer una diferencia grande
              a largo plazo.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Capital inicial" unit="€" value={capital} min={0} step={100} onChange={setCapital} />
          <Field label="Aportación mensual" unit="€/mes" value={aporte} min={0} step={25} onChange={setAporte} />
          <Field label="Rentabilidad esperada" unit="% anual" value={tasa} min={-20} max={30} step={0.1} onChange={setTasa} />
          <Field label="Horizonte temporal" unit="años" value={anos} min={1} max={50} step={1} onChange={setAnos} />
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResultStat label="Valor final estimado" value={formatCurrency(result.finalBalance)} emphasis />
              <ResultStat label="Total aportado" value={formatCurrency(result.totalContributed)} />
              <ResultStat label="Intereses generados" value={formatCurrency(result.totalGain)} />
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-500">
                Los intereses representan el{" "}
                <strong className="text-slate-700">{formatPercent(gainShare)}</strong> del saldo final.
              </p>
            </div>

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
                  {result.yearly.map((row) => (
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


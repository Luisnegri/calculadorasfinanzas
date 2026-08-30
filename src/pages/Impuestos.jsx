import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { estimateIncomeTax } from "../lib/finance";
import { formatCurrency, formatPercent } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-impuestos-renta");

export default function Impuestos() {
  const [ingresos, setIngresos] = useState(35000);
  const [deducciones, setDeducciones] = useState(0);

  const result = useMemo(() => {
    if (ingresos <= 0) return null;
    const base = Math.max(0, ingresos - (deducciones || 0));
    return { ...estimateIncomeTax(base), base };
  }, [ingresos, deducciones]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Estima cuánto pagarás de IRPF sobre tus ingresos anuales, con el desglose por tramos y tu tipo impositivo efectivo y marginal."
      faq={[
        {
          q: "¿Qué es el tipo efectivo y el tipo marginal?",
          a: "El tipo efectivo es el porcentaje medio que pagas sobre el total de tu base imponible. El tipo marginal es el porcentaje que se aplica al último euro ganado, es decir, el tramo más alto que te corresponde.",
        },
        {
          q: "¿Por qué el IRPF se paga por tramos?",
          a: "Porque el impuesto es progresivo: cada tramo de renta tributa a un tipo distinto y creciente. No se aplica el tipo más alto a toda la renta, solo a la parte que entra en ese tramo.",
        },
        {
          q: "¿Qué son las deducciones en este cálculo?",
          a: "Puedes indicar gastos deducibles, aportaciones a planes de pensiones u otras reducciones que reduzcan tu base imponible antes de aplicar los tramos.",
        },
        {
          q: "¿Qué diferencia hay entre la base general y la base del ahorro?",
          a: "La base general incluye rendimientos del trabajo, alquileres y actividades económicas, y tributa por la escala progresiva de tramos que usa esta calculadora. La base del ahorro (intereses, dividendos, ganancias patrimoniales) tributa aparte, con tipos que van del 19% al 30% según el importe.",
        },
        {
          q: "¿Qué es el mínimo personal y familiar?",
          a: "Es la parte de tus ingresos que no tributa, pensada para cubrir necesidades básicas. Varía según tu edad, si tienes hijos o ascendientes a cargo, o si tienes alguna discapacidad reconocida. Esta calculadora usa un mínimo general aproximado, sin esas circunstancias personales.",
        },
        {
          q: "¿Por qué mi resultado no coincide exactamente con el simulador oficial de la Agencia Tributaria?",
          a: "Porque el IRPF real combina una escala estatal y una escala autonómica que varía según dónde vivas, además de tus circunstancias personales, deducciones y bonificaciones específicas. Esta calculadora usa una escala general orientativa; para tu caso exacto, usa el simulador de Renta Web de la Agencia Tributaria.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo funciona la tributación por tramos</h2>
          <p className="leading-relaxed text-slate-600">
            El IRPF es progresivo: no se aplica un único porcentaje a todos tus ingresos, sino que cada tramo de
            tu base imponible tributa a un tipo distinto y creciente. Por eso ganar un euro más nunca te hace
            "perder dinero" por cambiar de tramo — solo ese euro adicional tributa al tipo marginal, el resto
            sigue tributando como antes.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Qué puede reducir tu factura fiscal</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Aportaciones a planes de pensiones</strong>, hasta el límite
              legal anual.
            </li>
            <li>
              <strong className="text-slate-800">Deducciones autonómicas</strong> (alquiler, familia numerosa,
              donativos...) que varían mucho según tu comunidad.
            </li>
            <li>
              <strong className="text-slate-800">Tributación conjunta o individual</strong> en unidades
              familiares, según cuál salga más favorable en tu caso.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ingresos anuales" unit="€" value={ingresos} min={0} step={500} onChange={setIngresos} />
          <Field
            label="Deducciones / reducciones"
            unit="€"
            value={deducciones}
            min={0}
            step={100}
            onChange={setDeducciones}
            helpText="Planes de pensiones, gastos deducibles, etc."
          />
        </div>

        {result ? (
          <>
            <p className="mt-4 text-sm text-slate-500">
              Base imponible: <strong className="text-slate-700">{formatCurrency(result.base)}</strong>
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResultStat label="IRPF estimado" value={formatCurrency(result.tax)} emphasis />
              <ResultStat label="Tipo efectivo" value={formatPercent(result.effectiveRate)} />
              <ResultStat label="Tipo marginal" value={formatPercent(result.marginalRate)} />
            </div>

            <div className="mt-8 overflow-x-auto">
              <p className="mb-2 text-sm font-semibold text-slate-700">Desglose por tramos</p>
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Tramo</th>
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Base en tramo</th>
                    <th className="py-2">Cuota</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row) => (
                    <tr key={row.from} className="border-b border-slate-100">
                      <td className="py-2 pr-4">
                        {formatCurrency(row.from, { decimals: false })} –{" "}
                        {row.to === Infinity ? "en adelante" : formatCurrency(row.to, { decimals: false })}
                      </td>
                      <td className="py-2 pr-4">{formatPercent(row.rate)}</td>
                      <td className="py-2 pr-4">{formatCurrency(row.amount)}</td>
                      <td className="py-2">{formatCurrency(row.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Esta estimación usa una escala general orientativa (estatal +
              media autonómica) y un mínimo personal aproximado. Las tablas
              oficiales varían según comunidad autónoma y circunstancias
              personales o familiares.
            </p>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce unos ingresos válidos para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}

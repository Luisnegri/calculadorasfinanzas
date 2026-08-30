import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { estimateAutonomoQuota } from "../lib/finance";
import { formatCurrency } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-cuota-autonomo");

export default function CuotaAutonomo() {
  const [rendimientos, setRendimientos] = useState(1500);
  const [tarifaPlana, setTarifaPlana] = useState(false);

  const result = useMemo(() => {
    if (rendimientos < 0) return null;
    return estimateAutonomoQuota(rendimientos, { flatRate: tarifaPlana });
  }, [rendimientos, tarifaPlana]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Introduce tus rendimientos netos mensuales estimados (ingresos menos gastos deducibles) para calcular tu cuota mensual de autónomo según los tramos de cotización 2026."
      faq={[
        {
          q: "¿Qué son los 'rendimientos netos' a efectos de la cuota de autónomo?",
          a: "Son tus ingresos como autónomo menos los gastos deducibles de tu actividad, con un 7% adicional de deducción por gastos genéricos (3% si eres autónomo societario). Es una cifra distinta de tu facturación bruta.",
        },
        {
          q: "¿Puedo elegir pagar más de la cuota mínima de mi tramo?",
          a: "Sí. Cada tramo tiene una base de cotización mínima y máxima, y puedes elegir voluntariamente una base más alta dentro de ese rango (hasta 6 veces al año), lo que sube tu cuota pero también tu base reguladora para prestaciones futuras (jubilación, baja médica, paro).",
        },
        {
          q: "¿Qué es la tarifa plana de autónomos?",
          a: "Es una cuota reducida de 80€/mes durante los primeros 12 meses de actividad, con independencia de tus rendimientos reales, disponible para quienes se dan de alta por primera vez o no han estado de alta en los 2 años anteriores. Puede ampliarse otros 12 meses si tus rendimientos netos siguen por debajo del salario mínimo interprofesional.",
        },
        {
          q: "¿Qué pasa si mis ingresos varían mucho de un mes a otro?",
          a: "Desde la reforma del sistema de cotización por ingresos reales, puedes cambiar de tramo hasta 6 veces al año para ajustar tu cuota a una previsión de rendimientos que puede ir cambiando, y al final de año la Seguridad Social regulariza la diferencia entre lo cotizado y tus rendimientos reales declarados a Hacienda.",
        },
        {
          q: "¿Qué cubre la cuota de autónomo?",
          a: "Incluye contingencias comunes (sanidad, jubilación), contingencias profesionales (accidente de trabajo), cese de actividad (el equivalente al paro de los autónomos), formación profesional y el mecanismo de equidad intergeneracional (MEI), con un tipo conjunto aproximado del 30,5% sobre la base elegida.",
        },
        {
          q: "¿Estas cifras son exactas para 2026?",
          a: "Son una estimación orientativa basada en las tablas de tramos publicadas para 2026, contrastadas entre varias fuentes especializadas. Los importes exactos y la regularización final dependen de la normativa vigente en el momento y de tus datos concretos: consulta con una gestoría o con la Seguridad Social para tu caso.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo funciona la cotización por rendimientos reales</h2>
          <p className="leading-relaxed text-slate-600">
            Desde 2023, los autónomos cotizan según una previsión de sus rendimientos netos mensuales, agrupados en
            tramos: cuanto mayor es el tramo, mayor la base de cotización mínima obligatoria y, por tanto, mayor la
            cuota. A final de cada ejercicio, la Seguridad Social compara lo cotizado durante el año con los
            rendimientos netos reales declarados en la Renta, y regulariza la diferencia (puede haber que pagar más
            o recibir una devolución).
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Qué tener en cuenta al elegir tu base de cotización</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Cotizar por la base mínima</strong> reduce tu cuota mensual, pero
              también reduce tu base reguladora para prestaciones futuras: jubilación, incapacidad temporal o cese de
              actividad.
            </li>
            <li>
              <strong className="text-slate-800">Si tus ingresos son irregulares</strong>, aprovecha que puedes
              cambiar de tramo varias veces al año para ajustar la previsión y evitar sorpresas grandes en la
              regularización.
            </li>
            <li>
              <strong className="text-slate-800">La tarifa plana es temporal:</strong> planifica con antelación
              cuánto subirá tu cuota cuando termine, para que no sea un sobresalto en tu primer o segundo año de
              actividad.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Rendimientos netos mensuales"
            unit="€"
            value={rendimientos}
            min={0}
            step={50}
            onChange={setRendimientos}
          />
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
            <input
              type="checkbox"
              checked={tarifaPlana}
              onChange={(e) => setTarifaPlana(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            />
            <span className="text-sm text-slate-700">
              Soy nuevo autónomo (tarifa plana, primeros 12 meses)
            </span>
          </label>
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultStat label="Cuota mensual estimada" value={formatCurrency(result.quota)} emphasis />
              <ResultStat label="Cuota anual estimada" value={formatCurrency(result.quota * 12)} />
            </div>

            <p className="mt-4 text-sm text-slate-500">
              {result.isFlatRate ? (
                "Tarifa plana aplicada: cuota fija durante los primeros 12 meses de alta, con independencia de tus rendimientos reales."
              ) : (
                <>
                  Tramo aplicable: rendimientos netos entre{" "}
                  <strong className="text-slate-700">{formatCurrency(result.bracketMin)}</strong> y{" "}
                  <strong className="text-slate-700">
                    {Number.isFinite(result.bracketMax) ? formatCurrency(result.bracketMax) : "sin límite superior"}
                  </strong>{" "}
                  al mes.
                </>
              )}
            </p>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce unos rendimientos netos válidos para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}


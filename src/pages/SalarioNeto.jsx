import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { netSalaryFromGross } from "../lib/finance";
import { formatCurrency, formatPercent } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-salario-neto");

export default function SalarioNeto() {
  const [bruto, setBruto] = useState(30000);
  const [pagas, setPagas] = useState(14);

  const result = useMemo(() => {
    if (bruto <= 0) return null;
    return netSalaryFromGross(bruto, pagas || 12);
  }, [bruto, pagas]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Introduce tu salario bruto anual y estima cuánto cobrarás neto, descontando la cotización a la Seguridad Social y el IRPF."
      faq={[
        {
          q: "¿Qué diferencia hay entre salario bruto y neto?",
          a: "El salario bruto es el total pactado en tu contrato antes de deducciones. El neto es lo que realmente recibes en tu cuenta, tras descontar la Seguridad Social a cargo del trabajador y las retenciones de IRPF.",
        },
        {
          q: "¿Por qué 12 o 14 pagas cambia el resultado mensual?",
          a: "El bruto y el neto anual son los mismos; lo que cambia es en cuántos meses se reparte. Con 14 pagas, dos de ellas (las extras) suelen ser de importe similar a la mensual mientras que con 12 pagas el importe mensual es mayor porque las extras van prorrateadas.",
        },
        {
          q: "¿Es exacta esta estimación?",
          a: "Es una aproximación general (régimen general, sin hijos ni reducciones específicas, sin particularidades autonómicas). Tu nómina real puede variar según tu comunidad autónoma, situación familiar y convenio.",
        },
      ]}
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Salario bruto anual" unit="€" value={bruto} min={0} step={500} onChange={setBruto} />
          <Field label="Número de pagas" unit="pagas/año" value={pagas} min={12} max={14} step={1} onChange={setPagas} />
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultStat label={`Neto por pago (${result.paymentsPerYear} pagas)`} value={formatCurrency(result.netPerPayment)} emphasis />
              <ResultStat label="Neto anual" value={formatCurrency(result.annualNet)} />
              <ResultStat label="Seguridad Social (año)" value={formatCurrency(result.annualSS)} />
              <ResultStat label="IRPF estimado (año)" value={formatCurrency(result.annualIRPF)} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <p className="text-sm text-slate-500">
                Tipo efectivo de IRPF: <strong className="text-slate-700">{formatPercent(result.effectiveRate)}</strong>
              </p>
              <p className="text-sm text-slate-500">
                Tipo marginal: <strong className="text-slate-700">{formatPercent(result.marginalRate)}</strong>
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                <span>Bruto por pago</span>
                <span>{formatCurrency(result.grossPerPayment)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
                <span>− Seguridad Social</span>
                <span>−{formatCurrency(result.ssPerPayment)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
                <span>− IRPF (retención estimada)</span>
                <span>−{formatCurrency(result.irpfPerPayment)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                <span>= Neto por pago</span>
                <span>{formatCurrency(result.netPerPayment)}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce un salario bruto válido para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}

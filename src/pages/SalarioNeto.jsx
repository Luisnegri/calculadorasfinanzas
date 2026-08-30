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
      intro="Introduce tu sueldo bruto anual y estima cuánto cobrarás neto en tu nómina, descontando la cotización a la Seguridad Social y el IRPF."
      faq={[
        {
          q: "¿Qué diferencia hay entre sueldo bruto y neto?",
          a: "El sueldo (o salario) bruto es el total pactado en tu contrato antes de deducciones. El neto es lo que realmente recibes en tu cuenta —lo que verás como líquido a percibir en tu nómina—, tras descontar la Seguridad Social a cargo del trabajador y las retenciones de IRPF.",
        },
        {
          q: "¿Por qué 12 o 14 pagas cambia el resultado mensual?",
          a: "El bruto y el neto anual son los mismos; lo que cambia es en cuántos meses se reparte. Con 14 pagas, dos de ellas (las extras) suelen ser de importe similar a la mensual mientras que con 12 pagas el importe mensual es mayor porque las extras van prorrateadas.",
        },
        {
          q: "¿Es exacta esta estimación?",
          a: "Es una aproximación general (régimen general, sin hijos ni reducciones específicas, sin particularidades autonómicas). Tu nómina real puede variar según tu comunidad autónoma, situación familiar y convenio.",
        },
        {
          q: "¿Qué conceptos incluye la cotización a la Seguridad Social del trabajador?",
          a: "En el régimen general, el trabajador aporta alrededor de un 6,35% de su base de cotización, que cubre contingencias comunes, desempleo, formación profesional y el mecanismo de equidad intergeneracional (MEI). El resto de la cotización lo paga la empresa.",
        },
        {
          q: "¿Por qué me retienen menos IRPF en nómina del que luego pago en la Renta?",
          a: "La retención en nómina es un pago a cuenta calculado con estimaciones (situación familiar, tipo de contrato, etc.). El importe real de IRPF se ajusta al presentar la declaración de la Renta, donde puede salir a pagar o a devolver según cómo de ajustada estuviera la retención.",
        },
        {
          q: "¿Esta calculadora sirve para autónomos?",
          a: "No. Está pensada para trabajadores por cuenta ajena (régimen general). Los autónomos cotizan por bases distintas, elegidas dentro de unos tramos, y tienen otras reglas de IRPF con pagos fraccionados trimestrales.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo interpretar tu sueldo neto</h2>
          <p className="leading-relaxed text-slate-600">
            El bruto es el importe pactado en tu contrato o convenio; el neto es lo que realmente ingresas, lo que
            verás reflejado como líquido a percibir en tu nómina. La diferencia se reparte entre la cotización a
            la Seguridad Social —con un tope máximo mensual, así que a partir de cierto sueldo ese descuento deja
            de crecer al mismo ritmo— y la retención de IRPF, que depende de tu tramo de renta y de tu situación
            personal y familiar.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">
            Qué tener en cuenta al comparar ofertas de trabajo
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Compara siempre en bruto anual</strong>, no en un "neto mensual"
              que te digan de palabra: el neto depende de tus pagas, tu situación familiar y tu comunidad autónoma.
            </li>
            <li>
              <strong className="text-slate-800">12 o 14 pagas no cambian lo que cobras al año</strong>, solo cómo
              se reparte — aunque sí cambia tu liquidez mes a mes.
            </li>
            <li>
              <strong className="text-slate-800">Revisa qué incluye el bruto:</strong> salario base,
              complementos, y si las pagas extra están prorrateadas o se cobran aparte.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sueldo bruto anual" unit="€" value={bruto} min={0} step={500} onChange={setBruto} />
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
          <p className="mt-6 text-sm text-slate-500">Introduce un sueldo bruto válido para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}

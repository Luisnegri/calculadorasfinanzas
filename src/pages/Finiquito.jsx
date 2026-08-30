import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { SETTLEMENT_TERMINATION_TYPES, calculateSettlement } from "../lib/finance";
import { formatCurrency } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-finiquito");

export default function Finiquito() {
  const [bruto, setBruto] = useState(1500);
  const [pagas, setPagas] = useState(14);
  const [diasPendientes, setDiasPendientes] = useState(15);
  const [diasVacaciones, setDiasVacaciones] = useState(10);
  const [mesesProrrateo, setMesesProrrateo] = useState(6);
  const [tipoFin, setTipoFin] = useState("voluntaria");
  const [antiguedad, setAntiguedad] = useState(2);

  const result = useMemo(() => {
    if (bruto <= 0) return null;
    return calculateSettlement({
      monthlyGross: bruto,
      paymentsPerYear: pagas || 12,
      pendingDays: diasPendientes,
      vacationDays: diasVacaciones,
      extraProrationMonths: mesesProrrateo,
      terminationType: tipoFin,
      yearsWorked: antiguedad,
    });
  }, [bruto, pagas, diasPendientes, diasVacaciones, mesesProrrateo, tipoFin, antiguedad]);

  const rule = SETTLEMENT_TERMINATION_TYPES[tipoFin];

  return (
    <CalculatorLayout
      calc={calc}
      intro="Calcula el finiquito al terminar una relación laboral: parte proporcional de salario y pagas extra, vacaciones no disfrutadas, e indemnización si el tipo de fin de contrato la contempla."
      faq={[
        {
          q: "¿Qué es el finiquito?",
          a: "Es la liquidación de todo lo que la empresa te debe al terminar la relación laboral: los días trabajados y no cobrados todavía, las vacaciones generadas y no disfrutadas, la parte proporcional de las pagas extra si no están prorrateadas, y la indemnización por despido si corresponde según el tipo de extinción del contrato.",
        },
        {
          q: "¿Todos los fines de contrato dan derecho a indemnización?",
          a: "No. Una baja voluntaria del trabajador no genera indemnización. El fin de un contrato temporal, el despido procedente por causas objetivas y el despido improcedente sí la generan, pero con importes y topes muy distintos entre sí.",
        },
        {
          q: "¿Cuántos días de indemnización corresponden en cada caso?",
          a: "Como aproximación general: fin de contrato temporal, 12 días por año trabajado; despido procedente o por causas objetivas, 20 días por año con un tope de 12 mensualidades; despido improcedente, 33 días por año con un tope de 24 mensualidades. Los contratos anteriores a la reforma laboral de 2012 pueden tener un cálculo mixto que esta calculadora no contempla.",
        },
        {
          q: "¿Por qué me pide los meses desde la última paga extra?",
          a: "Si tus pagas extra no están prorrateadas en las 12 mensualidades (es decir, cobras 14 pagas), la empresa te debe la parte proporcional de esas pagas correspondiente al tiempo trabajado desde el último cobro. Si tus pagas ya están prorrateadas (12 pagas), este concepto no aplica porque ya lo has cobrado cada mes.",
        },
        {
          q: "¿Qué pasa si he disfrutado más vacaciones de las que me correspondían?",
          a: "En ese caso la empresa podría descontarte el exceso del finiquito. Esta calculadora asume que introduces los días de vacaciones pendientes de disfrutar (un número positivo a tu favor), no un exceso disfrutado.",
        },
        {
          q: "¿Esta calculadora sustituye el finiquito real que me dé la empresa?",
          a: "No. Es una estimación orientativa con reglas simplificadas. El finiquito real puede incluir conceptos específicos de tu convenio colectivo, complementos salariales, atrasos, o particularidades de tu contrato que esta calculadora no puede conocer.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo se compone el finiquito</h2>
          <p className="leading-relaxed text-slate-600">
            El finiquito casi siempre incluye la parte proporcional de los días trabajados en el último periodo y
            las vacaciones generadas y no disfrutadas, con independencia de por qué termina el contrato. A eso se
            suma, si tus pagas extra no están prorrateadas, la parte proporcional de esas pagas. La indemnización por
            despido es el concepto que más varía: depende por completo de si la empresa extingue el contrato, de qué
            forma, y de tu antigüedad.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Qué revisar al recibir tu finiquito real</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Comprueba el tipo de extinción</strong> que figura en tu carta de
              despido o en el certificado de empresa: determina si tienes derecho a indemnización y de qué cuantía.
            </li>
            <li>
              <strong className="text-slate-800">Revisa los días de vacaciones</strong> pendientes en tu recibo de
              nómina o pregunta a RRHH, porque es un cálculo fácil de omitir o de calcular mal.
            </li>
            <li>
              <strong className="text-slate-800">Si no estás de acuerdo con el finiquito</strong>, no firmes "no
              conforme" sin asesorarte antes: puedes firmar solo como recibí la cantidad, y reclamar la diferencia
              después ante el Servicio de Mediación, Arbitraje y Conciliación (SMAC) o la vía judicial.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Salario bruto mensual" unit="€" value={bruto} min={0} step={100} onChange={setBruto} />
          <Field label="Número de pagas" unit="pagas/año" value={pagas} min={12} max={14} step={1} onChange={setPagas} />
          <Field label="Días pendientes de cobro" unit="días" value={diasPendientes} min={0} max={31} step={1} onChange={setDiasPendientes} />
          <Field label="Vacaciones no disfrutadas" unit="días" value={diasVacaciones} min={0} max={31} step={1} onChange={setDiasVacaciones} />
          {pagas > 12 ? (
            <Field
              label="Meses desde la última paga extra"
              unit="meses"
              value={mesesProrrateo}
              min={0}
              max={12}
              step={1}
              onChange={setMesesProrrateo}
            />
          ) : null}
          <Field label="Antigüedad en la empresa" unit="años" value={antiguedad} min={0} max={45} step={0.5} onChange={setAntiguedad} />

          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-1 block text-sm font-medium text-slate-700">Tipo de fin de contrato</span>
            <select
              value={tipoFin}
              onChange={(e) => setTipoFin(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              {Object.entries(SETTLEMENT_TERMINATION_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultStat label="Total finiquito estimado" value={formatCurrency(result.total)} emphasis />
              <ResultStat
                label="Indemnización incluida"
                value={rule.daysPerYear > 0 ? formatCurrency(result.severanceAmount) : "No corresponde"}
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                <span>Parte proporcional días trabajados</span>
                <span>{formatCurrency(result.pendingSalary)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
                <span>+ Vacaciones no disfrutadas</span>
                <span>+{formatCurrency(result.vacationPay)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
                <span>+ Parte proporcional pagas extra</span>
                <span>+{formatCurrency(result.extraProrated)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
                <span>+ Indemnización ({rule.label.toLowerCase()})</span>
                <span>+{formatCurrency(result.severanceAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                <span>= Total finiquito</span>
                <span>{formatCurrency(result.total)}</span>
              </div>
            </div>

            {rule.daysPerYear > 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Indemnización calculada como {rule.daysPerYear} días por año trabajado
                {rule.capMonths ? ` (tope de ${rule.capMonths} mensualidades)` : ""}: {result.severanceDays.toFixed(1)} días
                en total.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce un salario bruto válido para ver el resultado.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}


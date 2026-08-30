import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { VAT_RATES, calculateVAT } from "../lib/finance";
import { formatCurrency } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-iva");

export default function Iva() {
  const [importe, setImporte] = useState(100);
  const [tipo, setTipo] = useState(21);
  const [modo, setModo] = useState("add");

  const result = useMemo(() => {
    if (importe <= 0) return null;
    return calculateVAT(importe, tipo, modo);
  }, [importe, tipo, modo]);

  return (
    <CalculatorLayout
      calc={calc}
      intro="Calcula el IVA de cualquier importe: añade el IVA a un precio sin impuestos, o extrae la base imponible de un precio final que ya lo incluye."
      faq={[
        {
          q: "¿Qué es el IVA?",
          a: "El Impuesto sobre el Valor Añadido (IVA) es un impuesto indirecto que grava el consumo de bienes y servicios en España. Lo paga el consumidor final, pero lo recaudan e ingresan las empresas en cada fase de la cadena de venta.",
        },
        {
          q: "¿Qué tipos de IVA existen en España?",
          a: "El tipo general es del 21% y se aplica a la mayoría de bienes y servicios. El tipo reducido del 10% se aplica, entre otros, a alimentos, hostelería y transporte de viajeros. El tipo superreducido del 4% se aplica a productos de primera necesidad como pan, leche, libros o medicamentos.",
        },
        {
          q: "¿Cómo se calcula el IVA de un precio sin impuestos?",
          a: "Se multiplica la base imponible por el tipo de IVA correspondiente: por ejemplo, 100€ al 21% de IVA generan una cuota de 21€, con lo que el precio final con IVA incluido es de 121€.",
        },
        {
          q: "¿Cómo se calcula la base sin IVA a partir de un precio final?",
          a: "Se divide el precio final entre (1 + tipo de IVA en decimal). Por ejemplo, un precio final de 121€ con IVA del 21% equivale a una base de 121 / 1,21 = 100€, con una cuota de IVA de 21€.",
        },
        {
          q: "¿Cuál es la diferencia entre precio con IVA y sin IVA?",
          a: "El precio sin IVA (o base imponible) es el importe que corresponde al vendedor antes de impuestos. El precio con IVA es el que realmente paga el consumidor, e incluye la base más la cuota de IVA correspondiente.",
        },
        {
          q: "¿Los autónomos y empresas pagan IVA?",
          a: "Lo repercuten a sus clientes y lo declaran a Hacienda, pero no lo soportan como coste: pueden deducirse el IVA que pagan en sus compras (IVA soportado) frente al que cobran en sus ventas (IVA repercutido), liquidando trimestralmente la diferencia.",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo interpretar el desglose de IVA</h2>
          <p className="leading-relaxed text-slate-600">
            La "base imponible" es el importe antes de impuestos; la "cuota de IVA" es lo que se añade en concepto de
            impuesto; y el "total" es la suma de ambos, el precio que efectivamente se cobra o se paga. Si conoces el
            precio sin IVA, esta calculadora te añade la cuota correspondiente. Si conoces el precio final (con IVA
            ya incluido, como en un ticket de compra), puedes extraer la base y la cuota que contiene.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Cuándo usar cada tipo de IVA</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">General (21%):</strong> la mayoría de productos y servicios:
              electrónica, ropa, servicios profesionales, combustible.
            </li>
            <li>
              <strong className="text-slate-800">Reducido (10%):</strong> alimentación en general, hostelería y
              restauración, transporte de viajeros, vivienda de nueva construcción.
            </li>
            <li>
              <strong className="text-slate-800">Superreducido (4%):</strong> productos de primera necesidad: pan,
              leche, huevos, frutas y verduras, libros, periódicos y medicamentos.
            </li>
          </ul>
        </>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
              Importe
              <span className="text-xs font-normal text-slate-400">€</span>
            </span>
            <input
              type="number"
              value={importe}
              min={0}
              step={1}
              onChange={(e) => setImporte(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Tipo de IVA</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              {VAT_RATES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">¿Qué quieres calcular?</span>
            <select
              value={modo}
              onChange={(e) => setModo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="add">Añadir IVA (el importe es sin IVA)</option>
              <option value="remove">Extraer IVA (el importe ya lo incluye)</option>
            </select>
          </label>
        </div>

        {result ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ResultStat label="Base imponible (sin IVA)" value={formatCurrency(result.base)} />
              <ResultStat label="Cuota de IVA" value={formatCurrency(result.vat)} />
              <ResultStat label="Total (con IVA)" value={formatCurrency(result.total)} emphasis />
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                <span>Base imponible</span>
                <span>{formatCurrency(result.base)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-sm text-slate-500">
                <span>+ Cuota de IVA</span>
                <span>+{formatCurrency(result.vat)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                <span>= Total con IVA</span>
                <span>{formatCurrency(result.total)}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Introduce un importe válido para ver el desglose de IVA.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}


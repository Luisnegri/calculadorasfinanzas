import { useMemo, useState } from "react";
import CalculatorLayout from "../components/CalculatorLayout";
import Field from "../components/Field";
import ResultStat from "../components/ResultStat";
import { CALCULATORS } from "../lib/calculators";
import { rentVsBuy } from "../lib/finance";
import { formatCurrency } from "../lib/format";

const calc = CALCULATORS.find((c) => c.slug === "calculadora-alquilar-vs-comprar");

export default function AlquilarVsComprar() {
  const [precio, setPrecio] = useState(220000);
  const [entrada, setEntrada] = useState(20);
  const [interes, setInteres] = useState(3);
  const [plazoHipoteca, setPlazoHipoteca] = useState(30);
  const [gastosCompra, setGastosCompra] = useState(10);
  const [gastosAnuales, setGastosAnuales] = useState(1.5);
  const [alquiler, setAlquiler] = useState(900);
  const [revalorizacion, setRevalorizacion] = useState(2);
  const [rentabilidadAlt, setRentabilidadAlt] = useState(5);
  const [horizonte, setHorizonte] = useState(20);

  const result = useMemo(() => {
    if (precio <= 0 || horizonte <= 0) return null;
    return rentVsBuy({
      price: precio,
      downPaymentPct: entrada,
      mortgageRatePct: interes,
      mortgageYears: plazoHipoteca,
      buyingCostsPct: gastosCompra,
      annualOwnCostsPct: gastosAnuales,
      monthlyRent: alquiler,
      homeAppreciationPct: revalorizacion,
      altReturnPct: rentabilidadAlt,
      horizonYears: horizonte,
    });
  }, [precio, entrada, interes, plazoHipoteca, gastosCompra, gastosAnuales, alquiler, revalorizacion, rentabilidadAlt, horizonte]);

  const buyerWins = result ? result.difference >= 0 : false;

  return (
    <CalculatorLayout
      calc={calc}
      intro="Compara el patrimonio que acumularías comprando una vivienda con hipoteca frente a alquilar e invertir la diferencia, a un horizonte temporal determinado."
      faq={[
        {
          q: "¿Cómo compara esta calculadora comprar y alquilar?",
          a: "Si compras, tu patrimonio final es el valor estimado de la vivienda menos la hipoteca pendiente (el equity). Si alquilas, se asume que inviertes lo que te habrías gastado en entrada y gastos de compra, más la diferencia mensual entre la cuota+gastos de la compra y tu alquiler, a la rentabilidad alternativa indicada.",
        },
        {
          q: "¿Qué gastos de compra debería incluir?",
          a: "En España, los gastos de comprar una vivienda (impuestos —ITP o IVA+AJD según sea de segunda mano o nueva—, notaría, registro y gestoría) suelen rondar el 10-12% del precio, aunque varían según la comunidad autónoma.",
        },
        {
          q: "¿Qué incluyen los 'gastos anuales de mantenimiento' de la vivienda?",
          a: "IBI, comunidad de propietarios, seguro de hogar y un margen para mantenimiento y reparaciones. Como aproximación, muchos análisis usan entre el 1% y el 2% del valor de la vivienda al año.",
        },
        {
          q: "¿Por qué importa tanto la rentabilidad alternativa de inversión?",
          a: "Es la hipótesis que más cambia el resultado: cuanto mayor sea la rentabilidad que asumes que obtendrías invirtiendo en vez de comprar, más favorece la comparación a alquilar. Si no tienes intención real de invertir la diferencia con disciplina, esta ventaja del alquiler no se materializa en la práctica.",
        },
        {
          q: "¿Qué pasa si el horizonte es más corto que el plazo de la hipoteca?",
          a: "El patrimonio del comprador se calcula como el valor estimado de la vivienda en ese momento menos el saldo pendiente de la hipoteca en ese punto de la tabla de amortización, no la hipoteca completa.",
        },
        {
          q: "¿Qué no tiene en cuenta esta calculadora?",
          a: "No considera la posible subida del alquiler con el tiempo (lo asume constante), los costes de vender la vivienda al final del periodo, cambios de tipo de interés en hipotecas variables, ni el valor \"no económico\" de vivir en una vivienda en propiedad frente a la incertidumbre de un alquiler (posibilidad de que no renueven el contrato, subidas de renta, etc.).",
        },
      ]}
      content={
        <>
          <h2 className="mb-3 text-xl font-bold text-slate-900">Cómo interpretar la comparación</h2>
          <p className="leading-relaxed text-slate-600">
            Ninguna de las dos opciones es universalmente mejor: depende de cuánto tiempo vayas a quedarte, de la
            diferencia entre la cuota de hipoteca y el alquiler equivalente, y sobre todo de qué rentabilidad asumas
            para el dinero que no se destina a la entrada si alquilas. Cuanto más largo el horizonte y menor la
            diferencia mensual entre comprar y alquilar, más suele favorecer la comparación a comprar, porque el
            "coste" de la entrada se diluye y el equity de la vivienda crece con los años.
          </p>
          <h2 className="mb-3 mt-8 text-xl font-bold text-slate-900">Factores que no son solo económicos</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-600">
            <li>
              <strong className="text-slate-800">Movilidad:</strong> si prevés cambiar de ciudad o de vivienda en
              pocos años, los gastos de compra y venta pueden penalizar mucho la opción de comprar.
            </li>
            <li>
              <strong className="text-slate-800">Estabilidad:</strong> comprar elimina el riesgo de que no te
              renueven el alquiler o de subidas de renta, a cambio de asumir el riesgo de mantenimiento y de la
              evolución del mercado inmobiliario.
            </li>
            <li>
              <strong className="text-slate-800">Disciplina de inversión:</strong> la ventaja del alquiler en esta
              calculadora depende de invertir de verdad la diferencia mensual, no solo de gastarla.
            </li>
          </ul>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-slate-700">Datos de la compra</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Precio de la vivienda" unit="€" value={precio} min={0} step={5000} onChange={setPrecio} />
            <Field label="Entrada" unit="%" value={entrada} min={0} max={100} step={1} onChange={setEntrada} />
            <Field label="Interés hipotecario" unit="% anual" value={interes} min={0} max={15} step={0.1} onChange={setInteres} />
            <Field label="Plazo de la hipoteca" unit="años" value={plazoHipoteca} min={1} max={40} step={1} onChange={setPlazoHipoteca} />
            <Field label="Gastos de compra" unit="% del precio" value={gastosCompra} min={0} max={20} step={0.5} onChange={setGastosCompra} />
            <Field label="Gastos anuales (IBI, comunidad...)" unit="% del precio" value={gastosAnuales} min={0} max={10} step={0.1} onChange={setGastosAnuales} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-slate-700">Alquiler y comparación</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Alquiler mensual equivalente" unit="€/mes" value={alquiler} min={0} step={50} onChange={setAlquiler} />
            <Field label="Revalorización anual vivienda" unit="% anual" value={revalorizacion} min={-5} max={10} step={0.1} onChange={setRevalorizacion} />
            <Field label="Rentabilidad alternativa" unit="% anual" value={rentabilidadAlt} min={0} max={15} step={0.1} onChange={setRentabilidadAlt} />
            <Field label="Horizonte de comparación" unit="años" value={horizonte} min={1} max={40} step={1} onChange={setHorizonte} />
          </div>
        </div>

        {result ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div
              className={`mb-6 rounded-lg p-4 text-sm font-medium ${
                buyerWins ? "bg-brand-50 text-brand-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {buyerWins
                ? `Comprar te dejaría aproximadamente ${formatCurrency(Math.abs(result.difference))} más de patrimonio que alquilar e invertir la diferencia, a ${horizonte} años.`
                : `Alquilar e invertir la diferencia te dejaría aproximadamente ${formatCurrency(Math.abs(result.difference))} más de patrimonio que comprar, a ${horizonte} años.`}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ResultStat label="Patrimonio si compras (equity)" value={formatCurrency(result.buyerEquity)} emphasis={buyerWins} />
              <ResultStat label="Patrimonio si alquilas e inviertes" value={formatCurrency(result.renterWealth)} emphasis={!buyerWins} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ResultStat label="Cuota de hipoteca" value={formatCurrency(result.mortgage)} />
              <ResultStat label="Gastos mensuales de la vivienda" value={formatCurrency(result.monthlyOwnCosts)} />
              <ResultStat label="Entrada + gastos de compra" value={formatCurrency(result.upfrontCash)} />
              <ResultStat label="Valor de la vivienda al horizonte" value={formatCurrency(result.homeValueAtHorizon)} />
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Diferencia mensual (comprar − alquilar):{" "}
              <strong className="text-slate-700">
                {result.monthlyDiff >= 0 ? "+" : ""}
                {formatCurrency(result.monthlyDiff)}
              </strong>{" "}
              {result.monthlyDiff >= 0
                ? "(comprar cuesta más al mes; el alquiler invierte esta diferencia)"
                : "(alquilar cuesta más al mes en este escenario)"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Introduce un precio y un horizonte válidos para ver la comparación.</p>
        )}
      </div>
    </CalculatorLayout>
  );
}


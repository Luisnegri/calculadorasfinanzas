import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import AdSlot from "../components/AdSlot";
import { CALCULATORS } from "../lib/calculators";

export default function Home() {
  return (
    <>
      <SeoHead
        title="Calculadoras Financieras Online Gratis"
        description="Calculadoras financieras online gratis: hipoteca, salario neto, ROI de inversión, amortización de crédito e impuestos. Resultados instantáneos, sin registro."
        path="/"
      />

      <section className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Calculadoras financieras <span className="text-brand-600">claras y gratuitas</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Hipoteca, salario neto, inversión, crédito e impuestos: resuelve tus
          cuentas en segundos, sin registro y sin complicaciones.
        </p>
      </section>

      <div className="mt-8">
        <AdSlot slotId="home-top" format="horizontal" label="Espacio publicitario" />
      </div>

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.path}
            to={calc.path}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">{calc.name}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-500">{calc.description}</p>
            <span className="mt-4 text-sm font-medium text-brand-600">Calcular ahora →</span>
          </Link>
        ))}
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900">¿Por qué usar nuestras calculadoras?</h2>
        <div className="mt-4 space-y-3 text-slate-600">
          <p>
            Todas nuestras calculadoras financieras son gratuitas, no
            requieren registro y calculan al instante en tu navegador: tus
            datos no se envían a ningún servidor.
          </p>
          <p>
            Cada resultado incluye el desglose del cálculo para que entiendas
            de dónde sale cada número, no solo el resultado final.
          </p>
          <p>
            Vamos añadiendo nuevas calculadoras cada semana. Si echas en falta
            alguna, puedes escribirnos desde la página de{" "}
            <Link to="/sobre-nosotros" className="text-brand-600 hover:underline">
              Sobre nosotros
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

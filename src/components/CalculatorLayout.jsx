import { Helmet } from "react-helmet-async";
import SeoHead, { SITE_URL } from "./SeoHead";
import AdSlot from "./AdSlot";
import AffiliateBox from "./AffiliateBox";

export default function CalculatorLayout({ calc, intro, children, faq, content }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: calc.name,
        url: `${SITE_URL}${calc.path}`,
        description: calc.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any (navegador web)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        inLanguage: "es-ES",
      },
      ...(faq && faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <SeoHead title={calc.name} description={calc.description} path={calc.path} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <nav className="mb-4 text-xs text-slate-400">
        <span>Inicio</span> <span className="mx-1">/</span> <span>{calc.shortName}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{calc.name}</h1>
      {intro ? <p className="mt-3 max-w-3xl text-slate-600">{intro}</p> : null}

      <div className="mt-4">
        <AdSlot slotId="top-of-calculator" format="horizontal" label="Espacio publicitario" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">{children}</div>
        <aside className="space-y-6">
          <AdSlot slotId="sidebar" format="sidebar" label="Espacio publicitario" />
          <AffiliateBox category={calc.category} />
        </aside>
      </div>

      <div className="mt-10">
        <AdSlot slotId="bottom-of-calculator" format="horizontal" label="Espacio publicitario" />
      </div>

      {content ? <section className="mt-12 max-w-3xl">{content}</section> : null}

      {faq && faq.length > 0 ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-lg border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer list-none font-medium text-slate-800 marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-slate-400">
        Los resultados de esta calculadora son orientativos y se basan en los
        datos introducidos. No constituyen asesoramiento financiero, fiscal ni
        legal; para decisiones importantes consulta con un profesional
        cualificado.
      </p>
    </>
  );
}

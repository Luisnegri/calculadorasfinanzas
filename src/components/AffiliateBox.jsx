import { AFFILIATE_OFFERS } from "../lib/affiliates";

// Caja de ofertas de afiliación por categoría. Ver src/lib/affiliates.js
// para sustituir los enlaces placeholder por enlaces de afiliado reales.
export default function AffiliateBox({ category }) {
  const offers = AFFILIATE_OFFERS[category];
  if (!offers || offers.length === 0) return null;

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Recomendado para ti
      </p>
      <ul className="space-y-4">
        {offers.map((offer) => (
          <li key={offer.name} className="flex flex-col gap-1">
            <span className="font-medium text-slate-800">{offer.name}</span>
            <span className="text-sm text-slate-500">{offer.description}</span>
            <a
              href={offer.href}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="mt-1 inline-flex w-fit items-center gap-1 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              {offer.cta} →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] leading-snug text-slate-400">
        Enlace de afiliado: puede que recibamos una comisión sin coste
        adicional para ti.
      </p>
    </aside>
  );
}

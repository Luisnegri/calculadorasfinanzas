import { useEffect, useRef } from "react";

// Slot de anuncio reutilizable (Google AdSense).
//
// Por defecto se muestra como un placeholder visible (útil durante el
// desarrollo y mientras se espera la aprobación de AdSense, ver Semana 2 del
// plan). Cuando la cuenta esté aprobada:
//   1. Añade tu client ID (ca-pub-XXXXXXXXXXXXXXXX) en .env como
//      VITE_ADSENSE_CLIENT y el slot ID correspondiente por posición.
//   2. Añade el script de AdSense en index.html (ver README).
//   3. Pon VITE_ADSENSE_ENABLED=true en .env.
//
// Reglas de colocación del plan: nunca cubrir la calculadora, usar sidebar y
// espacios antes/después de la calculadora (300x250, 728x90).
const ADSENSE_ENABLED = import.meta.env.VITE_ADSENSE_ENABLED === "true";
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || "";

export default function AdSlot({ slotId, format = "horizontal", label = "Publicidad" }) {
  const insRef = useRef(null);

  useEffect(() => {
    if (!ADSENSE_ENABLED || !ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silenciosamente ignorar: falla en desarrollo o si el script no cargó.
    }
  }, []);

  const sizeClass =
    format === "sidebar"
      ? "min-h-[250px] w-full max-w-[300px]"
      : format === "square"
        ? "min-h-[250px] w-full max-w-[300px]"
        : "min-h-[90px] w-full";

  if (ADSENSE_ENABLED && ADSENSE_CLIENT && slotId) {
    return (
      <div className={`mx-auto ${sizeClass}`}>
        <ins
          ref={insRef}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder: no renderiza nada intrusivo en producción sin AdSense,
  // solo un contenedor discreto para reservar el espacio de layout.
  return (
    <div
      className={`mx-auto flex ${sizeClass} items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-100/60 text-xs text-slate-400`}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

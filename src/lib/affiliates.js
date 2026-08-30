// Enlaces de afiliación por categoría (ver sección "Monetización" del plan).
//
// IMPORTANTE: los `href` de abajo son PLACEHOLDERS ("#"). Sustitúyelos por tus
// enlaces de afiliado reales una vez tengas cuenta aprobada en cada programa:
//   - Hipotecas: comparadores de hipotecas, Amazon Associates
//   - Impuestos: TurboTax, QuickBooks, Wave
//   - Inversión: Interactive Brokers, Coinbase
// No actives/publiques estos bloques hasta tener enlaces reales: un enlace
// "#" en producción es una promesa rota para el usuario.
export const AFFILIATE_OFFERS = {
  hipotecas: [
    {
      name: "Comparador de hipotecas",
      description: "Compara ofertas de varios bancos en unos minutos.",
      href: "#",
      cta: "Comparar hipotecas",
    },
    {
      name: "Amazon Associates",
      description: "Libros y herramientas sobre finanzas personales.",
      href: "#",
      cta: "Ver en Amazon",
    },
  ],
  impuestos: [
    {
      name: "TurboTax",
      description: "Declara tus impuestos online paso a paso.",
      href: "#",
      cta: "Probar TurboTax",
    },
    {
      name: "QuickBooks",
      description: "Contabilidad y fiscalidad para autónomos y pymes.",
      href: "#",
      cta: "Probar QuickBooks",
    },
    {
      name: "Wave",
      description: "Contabilidad gratuita para pequeños negocios.",
      href: "#",
      cta: "Probar Wave",
    },
  ],
  inversion: [
    {
      name: "Interactive Brokers",
      description: "Bróker internacional con acceso a múltiples mercados.",
      href: "#",
      cta: "Abrir cuenta",
    },
    {
      name: "Coinbase",
      description: "Compra y vende criptomonedas de forma sencilla.",
      href: "#",
      cta: "Crear cuenta",
    },
  ],
};

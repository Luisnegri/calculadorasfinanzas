// Registro central de calculadoras: una única fuente de verdad para nav,
// home, sitemap y metadatos SEO.
export const CALCULATORS = [
  {
    slug: "calculadora-hipoteca",
    path: "/calculadora-hipoteca",
    name: "Calculadora de Hipoteca",
    shortName: "Hipoteca",
    description: "Calcula la cuota mensual de tu hipoteca, el interés total y el plazo, con tabla de amortización completa.",
    keyword: "calculadora de hipoteca",
    category: "hipotecas",
    icon: "home",
  },
  {
    slug: "calculadora-salario-neto",
    path: "/calculadora-salario-neto",
    name: "Calculadora de Sueldo Neto",
    shortName: "Sueldo Neto",
    description: "Convierte tu sueldo bruto anual en neto: Seguridad Social, IRPF estimado y cuánto recibes cada mes en tu nómina.",
    keyword: "calculadora de sueldo neto",
    category: "impuestos",
    icon: "wallet",
  },
  {
    slug: "calculadora-roi-inversion",
    path: "/calculadora-roi-inversion",
    name: "Calculadora de ROI de Inversión",
    shortName: "ROI Inversión",
    description: "Calcula el retorno de inversión (ROI) y la rentabilidad anual compuesta (CAGR) de cualquier inversión.",
    keyword: "calculadora roi inversión",
    category: "inversion",
    icon: "trending-up",
  },
  {
    slug: "amortizacion-credito",
    path: "/amortizacion-credito",
    name: "Calculadora de Amortización de Crédito",
    shortName: "Amortización de Crédito",
    description: "Genera la tabla de amortización mensual y anual de cualquier préstamo o crédito: capital, interés y saldo pendiente.",
    keyword: "amortización crédito",
    category: "hipotecas",
    icon: "table",
  },
  {
    slug: "calculadora-impuestos-renta",
    path: "/calculadora-impuestos-renta",
    name: "Calculadora de Impuestos sobre la Renta",
    shortName: "Impuestos (IRPF)",
    description: "Estima cuánto IRPF pagarás sobre tus ingresos anuales, con el desglose por tramos y tu tipo efectivo.",
    keyword: "impuesto sobre la renta",
    category: "impuestos",
    icon: "receipt",
  },
];

export function getCalculatorByPath(path) {
  return CALCULATORS.find((c) => c.path === path);
}

// Funciones puras de cálculo financiero.
// Todas devuelven números "crudos" (sin formatear) para facilitar pruebas unitarias.

/**
 * Cuota mensual de un préstamo con amortización francesa (cuota constante).
 * @param {number} principal - Capital solicitado.
 * @param {number} annualRatePct - Tipo de interés nominal anual, en % (ej. 3.5).
 * @param {number} years - Plazo en años.
 * @returns {number} Cuota mensual.
 */
export function monthlyPayment(principal, annualRatePct, years) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  if (n <= 0) return 0;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

/**
 * Genera la tabla de amortización completa de un préstamo a cuota constante.
 * @returns {{schedule: Array<{month:number, payment:number, interest:number, principal:number, balance:number}>, totalInterest:number, totalPaid:number, payment:number}}
 */
export function amortizationSchedule(principal, annualRatePct, years) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const payment = monthlyPayment(principal, annualRatePct, years);
  let balance = principal;
  const schedule = [];
  let totalInterest = 0;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    let principalPaid = payment - interest;
    if (month === n) {
      // Ajuste del último mes para que el saldo quede exactamente en 0
      principalPaid = balance;
    }
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    schedule.push({
      month,
      payment: month === n ? principalPaid + interest : payment,
      interest,
      principal: principalPaid,
      balance,
    });
  }

  const totalPaid = principal + totalInterest;
  return { schedule, totalInterest, totalPaid, payment };
}

/**
 * Resumen anual (agregado) de una tabla de amortización, útil para gráficos/tablas cortas.
 */
export function amortizationYearlySummary(schedule) {
  const years = Math.ceil(schedule.length / 12);
  const summary = [];
  for (let y = 0; y < years; y++) {
    const yearRows = schedule.slice(y * 12, y * 12 + 12);
    const interest = yearRows.reduce((s, row) => s + row.interest, 0);
    const principal = yearRows.reduce((s, row) => s + row.principal, 0);
    const endBalance = yearRows[yearRows.length - 1]?.balance ?? 0;
    summary.push({ year: y + 1, interest, principal, endBalance });
  }
  return summary;
}

/**
 * ROI simple y CAGR (tasa anual compuesta) de una inversión.
 */
export function roi(initialInvestment, finalValue, years) {
  const gain = finalValue - initialInvestment;
  const roiPct = initialInvestment > 0 ? (gain / initialInvestment) * 100 : 0;
  let cagrPct = 0;
  if (initialInvestment > 0 && finalValue > 0 && years > 0) {
    cagrPct = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  }
  return { gain, roiPct, cagrPct };
}

/**
 * Valor futuro de una inversión con aportaciones periódicas (mensuales) y
 * capitalización mensual.
 */
export function futureValueWithContributions(initialAmount, monthlyContribution, annualRatePct, years) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  let balance = initialAmount;
  const yearly = [];
  let totalContributed = initialAmount;

  for (let month = 1; month <= n; month++) {
    balance = balance * (1 + r) + monthlyContribution;
    totalContributed += monthlyContribution;
    if (month % 12 === 0) {
      yearly.push({ year: month / 12, balance, totalContributed });
    }
  }
  if (n % 12 !== 0 && n > 0) {
    yearly.push({ year: Math.ceil(n / 12), balance, totalContributed });
  }

  return {
    finalBalance: balance,
    totalContributed,
    totalGain: balance - totalContributed,
    yearly,
  };
}

// --- IRPF (España) --------------------------------------------------------
// Tabla de tramos estatal + autonómico medio, orientativa (2024/2025).
// OJO: es una aproximación general para fines informativos, no sustituye
// asesoría fiscal ni las tablas oficiales de cada comunidad autónoma.
export const IRPF_BRACKETS = [
  { upTo: 12450, rate: 0.19 },
  { upTo: 20200, rate: 0.24 },
  { upTo: 35200, rate: 0.30 },
  { upTo: 60000, rate: 0.37 },
  { upTo: 300000, rate: 0.45 },
  { upTo: Infinity, rate: 0.47 },
];

export const PERSONAL_MINIMUM_SINGLE = 5550;

/**
 * Calcula el IRPF aplicando tramos progresivos sobre una base imponible.
 * @param {number} taxableBase - Base imponible (ya con reducciones aplicadas si procede).
 * @returns {{tax:number, effectiveRate:number, marginalRate:number, breakdown:Array}}
 */
export function progressiveTax(taxableBase, brackets = IRPF_BRACKETS) {
  let base = Math.max(0, taxableBase);
  let tax = 0;
  let lastLimit = 0;
  let marginalRate = brackets[0]?.rate ?? 0;
  const breakdown = [];

  for (const bracket of brackets) {
    if (base <= lastLimit) break;
    const upperForThisBracket = Math.min(base, bracket.upTo);
    const amountInBracket = Math.max(0, upperForThisBracket - lastLimit);
    const taxInBracket = amountInBracket * bracket.rate;
    if (amountInBracket > 0) {
      tax += taxInBracket;
      marginalRate = bracket.rate;
      breakdown.push({ from: lastLimit, to: bracket.upTo, rate: bracket.rate, amount: amountInBracket, tax: taxInBracket });
    }
    lastLimit = bracket.upTo;
  }

  const effectiveRate = taxableBase > 0 ? tax / taxableBase : 0;
  return { tax, effectiveRate, marginalRate, breakdown };
}

/**
 * Estimación de IRPF a pagar sobre una renta anual, aplicando el mínimo
 * personal (aproximación del mecanismo real de "mínimo exento").
 */
export function estimateIncomeTax(annualGrossIncome, personalMinimum = PERSONAL_MINIMUM_SINGLE) {
  const taxableBase = Math.max(0, annualGrossIncome);
  const taxOnFull = progressiveTax(taxableBase);
  const taxOnMinimum = progressiveTax(Math.min(taxableBase, personalMinimum));
  const tax = Math.max(0, taxOnFull.tax - taxOnMinimum.tax);
  const effectiveRate = taxableBase > 0 ? tax / taxableBase : 0;
  return { tax, effectiveRate, marginalRate: taxOnFull.marginalRate, breakdown: taxOnFull.breakdown };
}

// --- Seguridad Social (España, régimen general, aproximado) ---------------
export const SS_EMPLOYEE_RATE = 0.0635; // contingencias comunes + desempleo + FP (general)
export const SS_MAX_MONTHLY_BASE_2024 = 4720.5;

/**
 * Cuota mensual de Seguridad Social a cargo del trabajador (aproximada).
 */
export function socialSecurityEmployeeContribution(monthlyGross) {
  const base = Math.min(monthlyGross, SS_MAX_MONTHLY_BASE_2024);
  return base * SS_EMPLOYEE_RATE;
}

/**
 * Calcula el salario neto anual y mensual a partir del bruto anual,
 * aplicando la cotización a la Seguridad Social y el IRPF estimado.
 * Aproximación orientativa (régimen general, sin hijos, sin reducciones
 * específicas ni especialidades autonómicas).
 */
export function netSalaryFromGross(annualGross, paymentsPerYear = 14) {
  const monthlyGrossForSS = annualGross / 12; // la SS cotiza sobre el prorrateo mensual
  const monthlySS = socialSecurityEmployeeContribution(monthlyGrossForSS);
  const annualSS = monthlySS * 12;

  // Reducción por rendimientos del trabajo (aproximación simplificada) antes de IRPF
  const taxableBase = Math.max(0, annualGross - annualSS);
  const { tax: annualIRPF, effectiveRate, marginalRate } = estimateIncomeTax(taxableBase);

  const annualNet = annualGross - annualSS - annualIRPF;
  const netPerPayment = annualNet / paymentsPerYear;
  const grossPerPayment = annualGross / paymentsPerYear;
  const ssPerPayment = annualSS / paymentsPerYear;
  const irpfPerPayment = annualIRPF / paymentsPerYear;

  return {
    annualGross,
    annualSS,
    annualIRPF,
    annualNet,
    monthlySS,
    netPerPayment,
    grossPerPayment,
    ssPerPayment,
    irpfPerPayment,
    effectiveRate,
    marginalRate,
    paymentsPerYear,
  };
}

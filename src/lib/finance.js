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

// --- IVA (España) ----------------------------------------------------------
export const VAT_RATES = [
  { label: "General (21%)", value: 21 },
  { label: "Reducido (10%)", value: 10 },
  { label: "Superreducido (4%)", value: 4 },
];

/**
 * Calcula el desglose de IVA de un importe.
 * @param {number} amount - Importe introducido.
 * @param {number} ratePct - Tipo de IVA en % (ej. 21).
 * @param {"add"|"remove"} mode - "add": el importe es la base (sin IVA) y se
 *   calcula el total con IVA. "remove": el importe es el total (con IVA
 *   incluido) y se extrae la base y la cuota de IVA.
 * @returns {{base:number, vat:number, total:number}}
 */
export function calculateVAT(amount, ratePct, mode = "add") {
  const rate = (ratePct || 0) / 100;
  const value = Math.max(0, amount || 0);
  if (mode === "remove") {
    const base = value / (1 + rate);
    return { base, vat: value - base, total: value };
  }
  const vat = value * rate;
  return { base: value, vat, total: value + vat };
}

// --- Ahorro (meta de ahorro) ------------------------------------------------
/**
 * Calcula la aportación mensual necesaria para alcanzar una meta de ahorro,
 * dado un capital inicial y una rentabilidad anual estimada, capitalizando
 * mensualmente. Es la función inversa de futureValueWithContributions.
 * @returns {{monthlyContribution:number, alreadyReached:boolean}}
 */
export function requiredMonthlyContribution(goalAmount, initialAmount, annualRatePct, years) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  if (n <= 0) return { monthlyContribution: 0, alreadyReached: initialAmount >= goalAmount };

  let monthlyContribution;
  if (r === 0) {
    monthlyContribution = (goalAmount - initialAmount) / n;
  } else {
    const factor = Math.pow(1 + r, n);
    const futureValueOfInitial = initialAmount * factor;
    const annuityFactor = (factor - 1) / r;
    monthlyContribution = (goalAmount - futureValueOfInitial) / annuityFactor;
  }

  const alreadyReached = monthlyContribution <= 0;
  return { monthlyContribution: Math.max(0, monthlyContribution), alreadyReached };
}

// --- Alquilar vs Comprar vivienda -------------------------------------------
/**
 * Compara el patrimonio neto acumulado a un horizonte temporal si se compra
 * una vivienda (con hipoteca) frente a si se alquila y se invierte la
 * diferencia (entrada + gastos de compra, más el ahorro mensual si alquilar
 * sale más barato que la cuota+gastos de la compra) a una rentabilidad
 * alternativa.
 */
export function rentVsBuy({
  price,
  downPaymentPct,
  mortgageRatePct,
  mortgageYears,
  buyingCostsPct,
  annualOwnCostsPct,
  monthlyRent,
  homeAppreciationPct,
  altReturnPct,
  horizonYears,
}) {
  const downPayment = price * (downPaymentPct / 100);
  const loanAmount = Math.max(0, price - downPayment);
  const buyingCosts = price * (buyingCostsPct / 100);
  const upfrontCash = downPayment + buyingCosts;

  const mortgage = monthlyPayment(loanAmount, mortgageRatePct, mortgageYears);
  const monthlyOwnCosts = (price * (annualOwnCostsPct / 100)) / 12;
  const monthlyOwnTotal = mortgage + monthlyOwnCosts;
  const monthlyDiff = monthlyOwnTotal - monthlyRent;

  const homeValueAtHorizon = price * Math.pow(1 + homeAppreciationPct / 100, horizonYears);
  let remainingDebt = 0;
  if (horizonYears < mortgageYears && loanAmount > 0) {
    const { schedule } = amortizationSchedule(loanAmount, mortgageRatePct, mortgageYears);
    const monthIndex = Math.min(schedule.length, Math.round(horizonYears * 12)) - 1;
    remainingDebt = schedule[monthIndex] ? schedule[monthIndex].balance : 0;
  }
  const buyerEquity = homeValueAtHorizon - remainingDebt;

  const projection = futureValueWithContributions(upfrontCash, monthlyDiff, altReturnPct, horizonYears);
  const renterWealth = projection.finalBalance;

  return {
    downPayment,
    loanAmount,
    buyingCosts,
    upfrontCash,
    mortgage,
    monthlyOwnCosts,
    monthlyOwnTotal,
    monthlyDiff,
    homeValueAtHorizon,
    remainingDebt,
    buyerEquity,
    renterWealth,
    difference: buyerEquity - renterWealth,
  };
}

// --- Cuota de autónomo (RETA, España) ---------------------------------------
// Tramos de rendimientos netos mensuales y cuota mínima mensual 2026,
// contrastados con varias fuentes especializadas (orientativo, la cuota real
// puede variar si se elige voluntariamente una base superior a la mínima del
// tramo). Tipo de cotización conjunto ≈ 30,50% (contingencias comunes +
// contingencias profesionales + cese de actividad + formación + MEI).
export const RETA_BRACKETS_2026 = [
  { upTo: 670, quota: 200 },
  { upTo: 900, quota: 220 },
  { upTo: 1166.7, quota: 260 },
  { upTo: 1300, quota: 275 },
  { upTo: 1500, quota: 291 },
  { upTo: 1700, quota: 294 },
  { upTo: 1850, quota: 350 },
  { upTo: 2030, quota: 370 },
  { upTo: 2330, quota: 390 },
  { upTo: 2760, quota: 415 },
  { upTo: 3190, quota: 440 },
  { upTo: 3620, quota: 465 },
  { upTo: 4050, quota: 490 },
  { upTo: 6000, quota: 530 },
  { upTo: Infinity, quota: 590 },
];

// Tarifa plana para nuevos autónomos: cuota fija durante los primeros 12
// meses de alta (ampliable a otros 12 más si los rendimientos netos siguen
// por debajo del SMI), con independencia de los rendimientos reales.
export const RETA_FLAT_RATE = 80;

/**
 * Estima la cuota mensual de autónomo a partir de los rendimientos netos
 * mensuales, según los tramos RETA 2026 (o la tarifa plana si aplica).
 * @returns {{quota:number, bracketMin:number, bracketMax:number, isFlatRate:boolean}}
 */
export function estimateAutonomoQuota(netMonthlyIncome, { flatRate = false } = {}) {
  if (flatRate) {
    return { quota: RETA_FLAT_RATE, bracketMin: null, bracketMax: null, isFlatRate: true };
  }
  let lower = 0;
  const bracket =
    RETA_BRACKETS_2026.find((b) => netMonthlyIncome <= b.upTo) || RETA_BRACKETS_2026[RETA_BRACKETS_2026.length - 1];
  const idx = RETA_BRACKETS_2026.indexOf(bracket);
  lower = idx > 0 ? RETA_BRACKETS_2026[idx - 1].upTo : 0;
  return { quota: bracket.quota, bracketMin: lower, bracketMax: bracket.upTo, isFlatRate: false };
}

// --- Finiquito ---------------------------------------------------------------
// Reglas de indemnización simplificadas (orientativas): no contemplan
// particularidades de convenios colectivos ni contratos anteriores a la
// reforma laboral de 2012.
export const SETTLEMENT_TERMINATION_TYPES = {
  voluntaria: { label: "Baja voluntaria", daysPerYear: 0, capMonths: null },
  temporal: { label: "Fin de contrato temporal", daysPerYear: 12, capMonths: null },
  objetivo: { label: "Despido procedente / causas objetivas", daysPerYear: 20, capMonths: 12 },
  improcedente: { label: "Despido improcedente", daysPerYear: 33, capMonths: 24 },
};

/**
 * Calcula el finiquito: parte proporcional del salario, vacaciones no
 * disfrutadas, parte proporcional de pagas extra, e indemnización por fin de
 * contrato o despido (si corresponde según el tipo).
 */
export function calculateSettlement({
  monthlyGross,
  paymentsPerYear,
  pendingDays,
  vacationDays,
  extraProrationMonths,
  terminationType,
  yearsWorked,
}) {
  const dailySalary = (monthlyGross * paymentsPerYear) / 365;
  const pendingSalary = dailySalary * pendingDays;
  const vacationPay = dailySalary * vacationDays;

  const numberOfExtras = Math.max(0, paymentsPerYear - 12);
  const extraProrated = numberOfExtras > 0 ? monthlyGross * numberOfExtras * (extraProrationMonths / 12) : 0;

  const rule = SETTLEMENT_TERMINATION_TYPES[terminationType] || SETTLEMENT_TERMINATION_TYPES.voluntaria;
  const severanceDays = rule.daysPerYear * Math.max(0, yearsWorked);
  let severanceAmount = dailySalary * severanceDays;
  if (rule.capMonths) {
    severanceAmount = Math.min(severanceAmount, monthlyGross * rule.capMonths);
  }

  const total = pendingSalary + vacationPay + extraProrated + severanceAmount;

  return { dailySalary, pendingSalary, vacationPay, extraProrated, severanceDays, severanceAmount, total };
}


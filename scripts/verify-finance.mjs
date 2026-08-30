// Script de verificación manual (no es un test runner formal): compara los
// resultados de src/lib/finance.js contra valores calculados de forma
// independiente para varios casos conocidos.
import {
  monthlyPayment,
  amortizationSchedule,
  roi,
  futureValueWithContributions,
  progressiveTax,
  estimateIncomeTax,
  socialSecurityEmployeeContribution,
  netSalaryFromGross,
  calculateVAT,
  requiredMonthlyContribution,
  rentVsBuy,
  estimateAutonomoQuota,
  calculateSettlement,
} from "../src/lib/finance.js";

let failures = 0;

function check(name, actual, expected, tolerance = 0.5) {
  const diff = Math.abs(actual - expected);
  const ok = diff <= tolerance;
  if (!ok) failures++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name}: actual=${actual.toFixed(4)} expected=${expected.toFixed(4)} diff=${diff.toFixed(4)}`);
}

console.log("--- Hipoteca / amortización ---");
// Caso de referencia bien conocido: 200,000 al 6% anual a 30 años -> cuota ~ 1199.10
check("monthlyPayment 200k/6%/30y", monthlyPayment(200000, 6, 30), 1199.1, 0.5);

// Caso simple sin interés: 12000 a 0% en 1 año -> cuota = 1000
check("monthlyPayment 0% interest", monthlyPayment(12000, 0, 1), 1000, 0.001);

{
  const { schedule, totalInterest, totalPaid, payment } = amortizationSchedule(200000, 6, 30);
  check("amortization schedule length", schedule.length, 360, 0);
  check("amortization last balance ~0", schedule[schedule.length - 1].balance, 0, 0.01);
  check("amortization totalPaid = principal + interest", totalPaid, 200000 + totalInterest, 0.01);
  check("amortization payment matches monthlyPayment()", payment, monthlyPayment(200000, 6, 30), 0.001);
  // Suma de todos los "principal" debe ser igual al capital original
  const sumPrincipal = schedule.reduce((s, r) => s + r.principal, 0);
  check("sum(principal) == loan amount", sumPrincipal, 200000, 0.5);
}

console.log("\n--- ROI / inversión ---");
{
  // Inversión de 10,000 que se convierte en 20,000 en 5 años
  // ROI = 100%, CAGR = 2^(1/5)-1 = 14.87%
  const r = roi(10000, 20000, 5);
  check("roi 100%", r.roiPct, 100, 0.001);
  check("cagr ~14.87%", r.cagrPct, 14.8698, 0.01);
}

{
  // Sin aportaciones, capitalización mensual de 10,000 al 12% anual (1% mensual) durante 1 año
  // Valor final = 10000 * 1.01^12 = 11268.25...
  const fv = futureValueWithContributions(10000, 0, 12, 1);
  check("future value no contributions", fv.finalBalance, 10000 * Math.pow(1.01, 12), 0.01);
}

console.log("\n--- IRPF / impuestos ---");
{
  // Tramo único: 10,000 al 19% (por debajo del primer límite de 12,450)
  const t = progressiveTax(10000);
  check("progressiveTax single bracket", t.tax, 10000 * 0.19, 0.001);
  check("progressiveTax marginal rate", t.marginalRate, 0.19, 0);
}
{
  // Dos tramos: 15,000 -> 12450*0.19 + (15000-12450)*0.24
  const t = progressiveTax(15000);
  const expected = 12450 * 0.19 + (15000 - 12450) * 0.24;
  check("progressiveTax two brackets", t.tax, expected, 0.001);
}
{
  // estimateIncomeTax debe dar 0 si la renta es igual o menor al mínimo personal
  const t = estimateIncomeTax(5000, 5550);
  check("estimateIncomeTax below personal minimum", t.tax, 0, 0.001);
}

console.log("\n--- Seguridad Social / salario neto ---");
{
  const ss = socialSecurityEmployeeContribution(2000);
  check("SS contribution 6.35% of 2000", ss, 2000 * 0.0635, 0.001);
}
{
  const ss = socialSecurityEmployeeContribution(10000); // por encima del tope
  check("SS contribution capped at max base", ss, 4720.5 * 0.0635, 0.001);
}
{
  const net = netSalaryFromGross(30000, 14);
  check("netSalary: gross - SS - IRPF = net", net.annualNet, 30000 - net.annualSS - net.annualIRPF, 0.01);
  check("netSalary: net < gross", net.annualNet < 30000 ? 1 : 0, 1, 0);
  check("netSalary: 14 payments sum to annual gross", net.grossPerPayment * 14, 30000, 0.01);
  check("netSalary: 14 payments sum to annual net", net.netPerPayment * 14, net.annualNet, 0.01);
}

console.log("\n--- IVA ---");
{
  // Añadir IVA: 100 al 21% -> base 100, cuota 21, total 121
  const v = calculateVAT(100, 21, "add");
  check("calculateVAT add: base", v.base, 100, 0.001);
  check("calculateVAT add: vat", v.vat, 21, 0.001);
  check("calculateVAT add: total", v.total, 121, 0.001);
}
{
  // Extraer IVA: 121 con IVA del 21% -> base 100, cuota 21
  const v = calculateVAT(121, 21, "remove");
  check("calculateVAT remove: base", v.base, 100, 0.001);
  check("calculateVAT remove: vat", v.vat, 21, 0.001);
  check("calculateVAT remove: total", v.total, 121, 0.001);
}

console.log("\n--- Ahorro (meta) ---");
{
  // Meta de 50,000 desde 5,000 al 5% anual en 10 años: comprobar que
  // reinvertir la aportación calculada realmente alcanza la meta.
  const { monthlyContribution } = requiredMonthlyContribution(50000, 5000, 5, 10);
  const projection = futureValueWithContributions(5000, monthlyContribution, 5, 10);
  check("requiredMonthlyContribution reaches goal", projection.finalBalance, 50000, 1);
}
{
  // Sin rentabilidad (0%): aportación = (meta - inicial) / meses
  const { monthlyContribution } = requiredMonthlyContribution(12000, 0, 0, 1);
  check("requiredMonthlyContribution 0% interest", monthlyContribution, 1000, 0.001);
}
{
  // Meta ya alcanzada con el capital inicial
  const { monthlyContribution, alreadyReached } = requiredMonthlyContribution(1000, 5000, 5, 5);
  check("requiredMonthlyContribution already reached (contribution=0)", monthlyContribution, 0, 0.001);
  check("requiredMonthlyContribution already reached (flag)", alreadyReached ? 1 : 0, 1, 0);
}

console.log("\n--- Alquilar vs Comprar ---");
{
  const r = rentVsBuy({
    price: 200000,
    downPaymentPct: 20,
    mortgageRatePct: 3,
    mortgageYears: 30,
    buyingCostsPct: 10,
    annualOwnCostsPct: 1.5,
    monthlyRent: 800,
    homeAppreciationPct: 2,
    altReturnPct: 5,
    horizonYears: 30,
  });
  check("rentVsBuy: loanAmount = price - downPayment", r.loanAmount, 160000, 0.01);
  check("rentVsBuy: upfrontCash = downPayment + buyingCosts", r.upfrontCash, 40000 + 20000, 0.01);
  check("rentVsBuy: mortgage matches monthlyPayment()", r.mortgage, monthlyPayment(160000, 3, 30), 0.001);
  // A 30 años (== plazo hipoteca), la deuda pendiente debe ser 0 y el
  // patrimonio del comprador = valor de la vivienda revalorizada
  check("rentVsBuy: remainingDebt at full mortgage term", r.remainingDebt, 0, 0.01);
  check("rentVsBuy: buyerEquity = homeValue when debt is 0", r.buyerEquity, r.homeValueAtHorizon, 0.01);
}

console.log("\n--- Cuota de autónomo (RETA 2026) ---");
{
  const q = estimateAutonomoQuota(500);
  check("estimateAutonomoQuota lowest bracket", q.quota, 200, 0.001);
}
{
  const q = estimateAutonomoQuota(7000);
  check("estimateAutonomoQuota highest bracket", q.quota, 590, 0.001);
}
{
  const q = estimateAutonomoQuota(1200, { flatRate: true });
  check("estimateAutonomoQuota flat rate overrides bracket", q.quota, 80, 0.001);
}

console.log("\n--- Finiquito ---");
{
  // 1500€/mes, 14 pagas, 10 días pendientes, 5 días de vacaciones, 6 meses
  // desde la última paga extra, baja voluntaria (sin indemnización)
  const s = calculateSettlement({
    monthlyGross: 1500,
    paymentsPerYear: 14,
    pendingDays: 10,
    vacationDays: 5,
    extraProrationMonths: 6,
    terminationType: "voluntaria",
    yearsWorked: 3,
  });
  const expectedDaily = (1500 * 14) / 365;
  check("calculateSettlement dailySalary", s.dailySalary, expectedDaily, 0.001);
  check("calculateSettlement pendingSalary", s.pendingSalary, expectedDaily * 10, 0.001);
  check("calculateSettlement vacationPay", s.vacationPay, expectedDaily * 5, 0.001);
  check("calculateSettlement extraProrated (2 extras, 6/12)", s.extraProrated, 1500 * 2 * 0.5, 0.001);
  check("calculateSettlement severance = 0 for voluntaria", s.severanceAmount, 0, 0.001);
}
{
  // Despido improcedente: 33 días/año x 3 años, sin tope alcanzado
  const s = calculateSettlement({
    monthlyGross: 1500,
    paymentsPerYear: 12,
    pendingDays: 0,
    vacationDays: 0,
    extraProrationMonths: 0,
    terminationType: "improcedente",
    yearsWorked: 3,
  });
  const expectedDaily = (1500 * 12) / 365;
  check("calculateSettlement severanceDays improcedente", s.severanceDays, 99, 0.001);
  check("calculateSettlement severanceAmount improcedente (no cap hit)", s.severanceAmount, expectedDaily * 99, 0.001);
}
{
  // Despido improcedente con tope: muchos años de antigüedad debe capar en 24 mensualidades
  // (33 días/año x 25 años > 24 mensualidades de sueldo, así que debe quedar capado)
  const s = calculateSettlement({
    monthlyGross: 1500,
    paymentsPerYear: 12,
    pendingDays: 0,
    vacationDays: 0,
    extraProrationMonths: 0,
    terminationType: "improcedente",
    yearsWorked: 25,
  });
  check("calculateSettlement severance capped at 24 months", s.severanceAmount, 1500 * 24, 0.001);
}

console.log(`\n${failures === 0 ? "TODOS LOS CHECKS PASARON" : `${failures} CHECK(S) FALLARON`}`);
process.exit(failures === 0 ? 0 : 1);


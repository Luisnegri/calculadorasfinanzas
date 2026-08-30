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

console.log(`\n${failures === 0 ? "TODOS LOS CHECKS PASARON" : `${failures} CHECK(S) FALLARON`}`);
process.exit(failures === 0 ? 0 : 1);


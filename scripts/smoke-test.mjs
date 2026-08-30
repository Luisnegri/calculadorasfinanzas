// Smoke test manual con navegador headless. No forma parte del `npm install`
// habitual (no está en package.json) para no forzar la descarga de Chromium.
// Para ejecutarlo: `npm i -D playwright` y luego, con `npm run preview`
// levantado en el puerto 4173, `node scripts/smoke-test.mjs`.
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4173";
const routes = [
  "/",
  "/calculadora-hipoteca",
  "/calculadora-salario-neto",
  "/calculadora-roi-inversion",
  "/amortizacion-credito",
  "/calculadora-impuestos-renta",
  "/sobre-nosotros",
  "/aviso-legal",
  "/politica-privacidad",
  "/politica-cookies",
  "/ruta-inexistente",
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

let errors = 0;
page.on("pageerror", (err) => {
  console.log(`PAGE ERROR: ${err.message}`);
  errors++;
});
page.on("console", (msg) => {
  if (msg.type() === "error") {
    console.log(`CONSOLE ERROR: ${msg.text()}`);
    errors++;
  }
});

for (const route of routes) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  const title = await page.title();
  const h1 = await page.locator("h1").first().textContent().catch(() => null);
  console.log(`${route.padEnd(32)} title="${title}" h1="${h1?.trim()}"`);
}

// Verificación funcional: cambiar un input de la calculadora de hipoteca y
// comprobar que el resultado cambia.
await page.goto(`${BASE}/calculadora-hipoteca`, { waitUntil: "networkidle" });
const resultCard = page.locator("div.rounded-lg", { hasText: "Cuota mensual" }).first();
const cuotaBefore = await resultCard.textContent();
const priceInput = page.locator('input[type="number"]').first();
await priceInput.fill("400000");
await priceInput.dispatchEvent("change");
await page.waitForTimeout(200);
const cuotaAfter = await resultCard.textContent();
console.log(`Hipoteca cuota antes: ${cuotaBefore.trim()}`);
console.log(`Hipoteca cuota despues (precio=400000): ${cuotaAfter.trim()}`);
if (cuotaBefore === cuotaAfter) {
  console.log("FAIL: la cuota no cambió al modificar el precio de la vivienda");
  errors++;
} else {
  console.log("OK: la cuota cambia dinámicamente con el input");
}

await browser.close();
console.log(`\n${errors === 0 ? "SMOKE TEST OK" : `${errors} PROBLEMA(S) DETECTADO(S)`}`);
process.exit(errors === 0 ? 0 : 1);

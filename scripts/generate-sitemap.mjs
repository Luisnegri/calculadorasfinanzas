// Genera public/sitemap.xml y dist/sitemap.xml a partir de la lista central
// de calculadoras (src/lib/calculators.js), para que nunca queden
// desincronizados. Se ejecuta automáticamente tras `npm run build`
// (ver "postbuild" en package.json) y también se deja una copia en /public
// para el modo desarrollo.
import { writeFileSync, existsSync } from "node:fs";
import { CALCULATORS } from "../src/lib/calculators.js";

const SITE_URL = "https://calculadorasfinanzas.com";

const staticPaths = [
  "/",
  "/sobre-nosotros",
  "/aviso-legal",
  "/politica-privacidad",
  "/politica-cookies",
];

const allPaths = [...staticPaths, ...CALCULATORS.map((c) => c.path)];

const urls = allPaths
  .map((path) => {
    const priority = path === "/" ? "1.0" : path.startsWith("/calculadora") || path.startsWith("/amortizacion") ? "0.9" : "0.3";
    return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
if (existsSync(new URL("../dist", import.meta.url))) {
  writeFileSync(new URL("../dist/sitemap.xml", import.meta.url), xml);
}

console.log(`sitemap.xml generado con ${allPaths.length} URLs.`);

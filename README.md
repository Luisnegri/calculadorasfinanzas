# CalculadorasFinanzas

Sitio web de calculadoras financieras online (React + Vite + TailwindCSS),
construido siguiendo el plan de negocio "Calculadoras Financieras Online".

Incluye la Fase 1 (MVP, mes 1): 5 calculadoras core, SEO on-page básico,
páginas legales necesarias para solicitar Google AdSense, y slots de
publicidad/afiliación listos para activar.

## Calculadoras incluidas

1. **Calculadora de Hipoteca** (`/calculadora-hipoteca`) — cuota mensual, intereses totales, tabla de amortización anual.
2. **Calculadora de Salario Neto** (`/calculadora-salario-neto`) — de bruto a neto, con Seguridad Social e IRPF estimados.
3. **Calculadora de ROI de Inversión** (`/calculadora-roi-inversion`) — ROI, CAGR y proyección con aportaciones periódicas.
4. **Calculadora de Amortización de Crédito** (`/amortizacion-credito`) — tabla de amortización mensual completa para cualquier préstamo.
5. **Calculadora de Impuestos sobre la Renta** (`/calculadora-impuestos-renta`) — IRPF estimado con desglose por tramos.

Todos los cálculos se ejecutan en el navegador (no hay backend ni base de
datos): los datos del usuario nunca salen de su dispositivo.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build de producción

```bash
npm run build
```

Esto genera `dist/` y regenera automáticamente `public/sitemap.xml` /
`dist/sitemap.xml` a partir de `src/lib/calculators.js` (script
`postbuild`, ver `scripts/generate-sitemap.mjs`). Para previsualizar el
build: `npm run preview`.

## Checklist de lanzamiento (Semana 1 del plan)

- [ ] Comprar dominio (`calculadorasfinanzas.com` ya en gestión en Hostinger)
- [ ] Crear repositorio en GitHub y subir este proyecto
- [ ] Conectar el repo a Vercel o Netlify (ambos detectan Vite automáticamente: build command `npm run build`, output `dist`)
- [ ] Apuntar el dominio de Hostinger al hosting elegido (registros DNS: en Vercel/Netlify, panel del proyecto → "Domains" te da los valores exactos de CNAME/A a poner en Hostinger)
- [ ] Revisar y completar los datos reales en `src/pages/AvisoLegal.jsx` (titular, NIF/CIF, email de contacto)

### Despliegue en Vercel

1. `vercel.json` ya incluido con el rewrite necesario para que las rutas de React Router funcionen (evita 404 al recargar una calculadora).
2. Importa el repo en https://vercel.com/new, framework detectado: Vite.
3. Añade el dominio desde el panel del proyecto.

### Despliegue en Netlify

1. `public/_redirects` ya incluido con el rewrite SPA.
2. Build command: `npm run build` — Publish directory: `dist`.
3. Añade el dominio desde "Domain settings".

## Monetización (según el plan)

### Google AdSense (Semana 2-3)

1. Solicita en https://www.google.com/adsense (aprobación 2-7 días). Para que te aprueben necesitas contenido original suficiente (ya tienes 5 calculadoras + textos + FAQs) y páginas legales (ya incluidas: Aviso legal, Privacidad, Cookies, Sobre nosotros).
2. Cuando tengas tu client ID (`ca-pub-XXXXXXXXXXXXXXXX`):
   - Copia `.env.example` a `.env`.
   - Pon `VITE_ADSENSE_ENABLED=true` y `VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`.
   - Añade el script de AdSense en `index.html`, justo antes de `</head>`:
     ```html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
     ```
   - Vuelve a desplegar. Los slots (`src/components/AdSlot.jsx`) ya están colocados en cabecera, pie, sidebar y antes/después de cada calculadora, sin cubrir nunca el propio cálculo, tal como pide el plan.

### Afiliación (15% de los ingresos objetivo)

Edita `src/lib/affiliates.js` y sustituye los `href: "#"` por tus enlaces de afiliado reales (comparadores de hipotecas, Amazon Associates, TurboTax, QuickBooks, Wave, Interactive Brokers, Coinbase). No actives enlaces "#" en producción.

## Próximos pasos (Fase 2 y 3 del plan)

- Semana 3-4: trabajar el SEO on-page de cada calculadora (las palabras clave objetivo ya están mapeadas en `src/lib/calculators.js` → campo `keyword`), y publicar contenido adicional (guías, artículos) para reforzar cada calculadora.
- Mes 2: añadir Tasa de Interés, Años de Pago, Comparador de Hipotecas, Impuestos por Región, Simulador de Inversión.
- Mes 3: Pensión, FV/PV, Break Even, Seguros, Plan de Ahorro, Cash Flow, y más — hasta 22-30 calculadoras.

Cada calculadora nueva sigue el mismo patrón: añade sus datos a
`src/lib/calculators.js`, su lógica pura en `src/lib/finance.js`, y una
página en `src/pages/` usando `CalculatorLayout`.

## Aviso

Todas las calculadoras muestran resultados orientativos y no constituyen
asesoramiento financiero, fiscal ni legal. La calculadora de Salario Neto y
la de Impuestos usan una escala de IRPF y una cotización a la Seguridad
Social aproximadas (régimen general español, sin especialidades
autonómicas ni familiares) — revisa `src/lib/finance.js` si necesitas
ajustar los tramos a datos oficiales actualizados.

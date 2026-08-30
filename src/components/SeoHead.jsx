import { Helmet } from "react-helmet-async";

const SITE_NAME = "CalculadorasFinanzas";
const SITE_URL = "https://calculadorasfinanzas.com";

export default function SeoHead({ title, description, path = "/" }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Calculadoras financieras online gratis`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

export { SITE_NAME, SITE_URL };

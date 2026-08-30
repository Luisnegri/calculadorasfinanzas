import SeoHead from "../components/SeoHead";

export default function PoliticaCookies() {
  return (
    <>
      <SeoHead
        title="Política de cookies"
        description="Política de cookies de CalculadorasFinanzas."
        path="/politica-cookies"
      />
      <h1 className="text-3xl font-bold text-slate-900">Política de cookies</h1>
      <div className="prose mt-6 max-w-2xl space-y-4 text-slate-600">
        <p>
          Una cookie es un pequeño archivo que se almacena en tu navegador
          cuando visitas casi cualquier página web. Nuestro objetivo es
          informarte de forma precisa sobre las cookies que utilizamos.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          ¿Qué tipo de cookies utiliza este sitio?
        </h2>
        <p>
          - <strong>Cookies técnicas:</strong> necesarias para el
          funcionamiento básico del sitio.
          <br />- <strong>Cookies de analítica:</strong> nos ayudan a entender
          cómo se usa el sitio para mejorarlo.
          <br />- <strong>Cookies de publicidad (Google AdSense):</strong>{" "}
          usadas por Google y sus socios publicitarios para mostrar anuncios
          relevantes.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          Cómo desactivar las cookies
        </h2>
        <p>
          Puedes permitir, bloquear o eliminar las cookies instaladas en tu
          equipo mediante la configuración de tu navegador. También puedes
          gestionar tus preferencias de anuncios de Google en la{" "}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            Configuración de anuncios de Google
          </a>
          .
        </p>
      </div>
    </>
  );
}

import SeoHead from "../components/SeoHead";

export default function AvisoLegal() {
  return (
    <>
      <SeoHead title="Aviso legal" description="Aviso legal de CalculadorasFinanzas." path="/aviso-legal" />
      <h1 className="text-3xl font-bold text-slate-900">Aviso legal</h1>
      <div className="prose mt-6 max-w-2xl space-y-4 text-slate-600">
        <p>
          <strong>Titular del sitio:</strong> Invictum Europe S.L. — CIF
          B88357298 — Carrer Riu Millars, 20, 46940 Manises, Valencia, España.
          Contacto:{" "}
          <a href="mailto:admin@invictumeurope.com" className="text-brand-600 hover:underline">
            admin@invictumeurope.com
          </a>
          .
        </p>
        <p>
          El acceso y uso de este sitio web atribuye la condición de usuario
          y supone la aceptación de las condiciones aquí descritas.
          CalculadorasFinanzas se reserva el derecho a modificar en cualquier
          momento el contenido de este aviso.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          Finalidad de las calculadoras
        </h2>
        <p>
          Todas las calculadoras de este sitio ofrecen resultados orientativos
          calculados a partir de los datos introducidos por el usuario. No
          constituyen asesoramiento financiero, fiscal, legal ni de ningún
          otro tipo, y no sustituyen la consulta con un profesional
          cualificado.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          Propiedad intelectual
        </h2>
        <p>
          Los contenidos, textos, diseño y código de este sitio son propiedad
          de CalculadorasFinanzas o de sus licenciantes, salvo que se indique
          lo contrario.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">Publicidad</h2>
        <p>
          Este sitio puede mostrar anuncios a través de Google AdSense y
          contener enlaces de afiliación. Consulta nuestra{" "}
          <a href="/politica-privacidad" className="text-brand-600 hover:underline">
            Política de privacidad
          </a>{" "}
          y{" "}
          <a href="/politica-cookies" className="text-brand-600 hover:underline">
            Política de cookies
          </a>{" "}
          para más información.
        </p>
      </div>
    </>
  );
}

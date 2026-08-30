import SeoHead from "../components/SeoHead";

export default function PoliticaPrivacidad() {
  return (
    <>
      <SeoHead
        title="Política de privacidad"
        description="Política de privacidad de CalculadorasFinanzas."
        path="/politica-privacidad"
      />
      <h1 className="text-3xl font-bold text-slate-900">Política de privacidad</h1>
      <div className="prose mt-6 max-w-2xl space-y-4 text-slate-600">
        <p>
          En CalculadorasFinanzas todos los cálculos se realizan directamente
          en tu navegador: los datos que introduces en las calculadoras (por
          ejemplo, tu salario o el importe de una hipoteca) no se envían ni se
          almacenan en nuestros servidores.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          Datos que recopilamos
        </h2>
        <p>
          Podemos recopilar datos de navegación de forma anónima o
          pseudonimizada mediante herramientas de analítica web, y datos de
          publicidad mediante Google AdSense, para mostrar anuncios
          relevantes y medir el rendimiento del sitio.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          Google AdSense y terceros
        </h2>
        <p>
          Este sitio usa o usará Google AdSense para mostrar publicidad.
          Google, como proveedor de terceros, utiliza cookies para publicar
          anuncios basados en las visitas previas del usuario a este sitio o
          a otros. El uso de la cookie de publicidad de Google permite a
          Google y a sus socios ofrecer anuncios basados en las visitas de
          este usuario a este sitio y/o a otros sitios de Internet. Los
          usuarios pueden inhabilitar la publicidad personalizada visitando
          la{" "}
          
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            Configuración de anuncios de Google
          </a>
          .
        </p>
        <h2 className="text-xl font-semibold text-slate-800">
          Enlaces de afiliación
        </h2>
        <p>
          Algunos enlaces de este sitio son enlaces de afiliado: si haces
          clic y contratas un servicio, podemos recibir una comisión sin
          coste adicional para ti.
        </p>
        <h2 className="text-xl font-semibold text-slate-800">Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión y
          oposición escribiendo a{" "}
          <a href="mailto:admin@invictumeurope.com" className="text-brand-600 hover:underline">
            admin@invictumeurope.com
          </a>
          .
        </p>
      </div>
    </>
  );
}

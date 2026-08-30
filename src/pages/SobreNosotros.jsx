import SeoHead from "../components/SeoHead";

export default function SobreNosotros() {
  return (
    <>
      <SeoHead
        title="Sobre nosotros"
        description="Conoce el proyecto CalculadorasFinanzas: quiénes somos y qué buscamos ofrecerte."
        path="/sobre-nosotros"
      />
      <h1 className="text-3xl font-bold text-slate-900">Sobre nosotros</h1>
      <div className="prose mt-6 max-w-2xl space-y-4 text-slate-600">
        <p>
          CalculadorasFinanzas nace con un objetivo sencillo: ofrecer
          herramientas financieras claras y gratuitas para que cualquier
          persona pueda entender sus números sin necesidad de conocimientos
          técnicos.
        </p>
        <p>
          Cada calculadora explica no solo el resultado, sino también cómo se
          calcula, para que puedas tomar decisiones informadas sobre tu
          hipoteca, tu salario, tus inversiones o tus impuestos.
        </p>
        <p>
          Estamos ampliando el catálogo de calculadoras constantemente. Si
          quieres proponer una nueva calculadora o reportar un error en algún
          cálculo, escríbenos a{" "}
          <a href="mailto:admin@invictumeurope.com" className="text-brand-600 hover:underline">
            admin@invictumeurope.com
          </a>
          .
        </p>
      </div>
    </>
  );
}
import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

export default function NotFound() {
  return (
    <>
      <SeoHead title="Página no encontrada" description="La página que buscas no existe." path="/404" />
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-500">No hemos encontrado esta página.</p>
        <Link to="/" className="mt-6 inline-block font-medium text-brand-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    </>
  );
}

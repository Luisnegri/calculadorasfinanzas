import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Hipoteca from "./pages/Hipoteca";
import SalarioNeto from "./pages/SalarioNeto";
import Roi from "./pages/Roi";
import Amortizacion from "./pages/Amortizacion";
import Impuestos from "./pages/Impuestos";
import InteresCompuesto from "./pages/InteresCompuesto";
import Iva from "./pages/Iva";
import Ahorro from "./pages/Ahorro";
import AlquilarVsComprar from "./pages/AlquilarVsComprar";
import CuotaAutonomo from "./pages/CuotaAutonomo";
import Finiquito from "./pages/Finiquito";
import SobreNosotros from "./pages/SobreNosotros";
import AvisoLegal from "./pages/AvisoLegal";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookies";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculadora-hipoteca" element={<Hipoteca />} />
        <Route path="/calculadora-salario-neto" element={<SalarioNeto />} />
        <Route path="/calculadora-roi-inversion" element={<Roi />} />
        <Route path="/amortizacion-credito" element={<Amortizacion />} />
        <Route path="/calculadora-impuestos-renta" element={<Impuestos />} />
        <Route path="/calculadora-interes-compuesto" element={<InteresCompuesto />} />
        <Route path="/calculadora-iva" element={<Iva />} />
        <Route path="/calculadora-ahorro" element={<Ahorro />} />
        <Route path="/calculadora-alquilar-vs-comprar" element={<AlquilarVsComprar />} />
        <Route path="/calculadora-cuota-autonomo" element={<CuotaAutonomo />} />
        <Route path="/calculadora-finiquito" element={<Finiquito />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/politica-cookies" element={<PoliticaCookies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}


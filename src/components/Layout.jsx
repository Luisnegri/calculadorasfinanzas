import { Link, NavLink } from "react-router-dom";
import { CALCULATORS } from "../lib/calculators";
import { SITE_NAME } from "./SeoHead";
import AdSlot from "./AdSlot";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition ${
          isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              €
            </span>
            {SITE_NAME}
          </Link>
          <nav className="hidden flex-wrap items-center gap-1 md:flex">
            {CALCULATORS.map((calc) => (
              <NavItem key={calc.path} to={calc.path}>
                {calc.shortName}
              </NavItem>
            ))}
          </nav>
        </div>
        {/* Navegación móvil simplificada */}
        <div className="flex flex-wrap gap-1 border-t border-slate-100 px-4 py-2 md:hidden">
          {CALCULATORS.map((calc) => (
            <NavItem key={calc.path} to={calc.path}>
              {calc.shortName}
            </NavItem>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <div className="mx-auto w-full max-w-6xl px-4 pb-4">
        <AdSlot slotId="footer-leaderboard" format="horizontal" label="Espacio publicitario" />
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 font-semibold text-slate-700">{SITE_NAME}</p>
              <p>Calculadoras financieras gratuitas, claras y sin registro.</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-slate-700">Calculadoras</p>
              <ul className="space-y-1">
                {CALCULATORS.map((calc) => (
                  <li key={calc.path}>
                    <Link to={calc.path} className="hover:text-brand-600">
                      {calc.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-semibold text-slate-700">Legal</p>
              <ul className="space-y-1">
                <li>
                  <Link to="/sobre-nosotros" className="hover:text-brand-600">
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/aviso-legal" className="hover:text-brand-600">
                    Aviso legal
                  </Link>
                </li>
                <li>
                  <Link to="/politica-privacidad" className="hover:text-brand-600">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/politica-cookies" className="hover:text-brand-600">
                    Política de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} {SITE_NAME}. Los resultados son
            orientativos y no constituyen asesoramiento financiero, fiscal ni
            legal.
          </p>
        </div>
      </footer>
    </div>
  );
}

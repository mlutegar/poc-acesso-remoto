import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";
import ThemeSwitcher from "./ThemeSwitcher";
import BrandMark from "./BrandMark";

export default function Layout() {
  const { user, logout } = useAuth();
  const { preset } = useTheme();
  const navigate = useNavigate();
  return (
    <div className="op-shell">
      <header className="op-header">
        <div className="op-header-inner">
          <NavLink to="/visitas" className="op-brand">
            <BrandMark size={36} />
            <div>
              <strong>{preset.name}</strong>
              <small>CONTROLE DE ACESSO</small>
            </div>
          </NavLink>
          <div className="op-condominium">
            <strong>Condomínio Modelo</strong>
            <small>Portaria Central · Brasília</small>
          </div>
          <span className="op-demo-badge">Demonstração local</span>
          <div className="op-account">
            <span>{user}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Sair ↗
            </button>
          </div>
        </div>
        <nav className="op-nav" aria-label="Menu principal">
          {[
            ["/visitas", "Visitas"],
            ["/condominos", "Condôminos"],
            ["/residencias", "Residências"],
            ["/pre-autorizacoes", "Pré-autorizações"],
          ].map(([to, text]) => (
            <NavLink key={to} to={to}>
              {text}
            </NavLink>
          ))}
          <details className="op-admin">
            <summary>
              Administração <span>⌄</span>
            </summary>
            <div>
              {[
                ["/operacao", "Painel simulado"],
                ["/eventos", "Eventos simulados"],
                ["/veiculos", "Veículos de exemplo"],
                ["/dispositivos", "Dispositivos de exemplo"],
              ].map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={(e) => e.currentTarget.closest("details")?.removeAttribute("open")}
                >
                  {label}
                </NavLink>
              ))}
              <div className="op-theme">
                <ThemeSwitcher />
              </div>
            </div>
          </details>
        </nav>
      </header>
      <div className="op-content">
        <Outlet context={{ openMenu: () => document.querySelector(".op-nav")?.scrollIntoView() }} />
      </div>
    </div>
  );
}

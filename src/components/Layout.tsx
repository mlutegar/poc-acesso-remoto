import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";
import { useOperations } from "../operations/Store";
import ThemeSwitcher from "./ThemeSwitcher";
import BrandMark from "./BrandMark";
import { Icon } from "./Icons";

// Árvore de menu igual à do sistema de referência. Os itens sem tela própria
// abrem a página de módulo previsto, com o que está planejado para cada um.
export type MenuItem = { label: string; to?: string; children?: MenuItem[] };
export const MENU: MenuItem[] = [
  { label: "Visitas", to: "/visitas" },
  { label: "Correspondências", to: "/correspondencias" },
  { label: "Condôminos", to: "/condominos" },
  { label: "Residências", to: "/residencias" },
  { label: "Ocorrências", to: "/ocorrencias" },
  { label: "Comunicados", to: "/comunicados" },
  {
    label: "Administração",
    children: [
      { label: "Usuários", to: "/usuarios" },
      { label: "Funcionários", to: "/funcionarios" },
      {
        label: "Relatórios",
        children: [
          { label: "Painel Operacional", to: "/operacao" },
          { label: "Acessos", to: "/eventos" },
          { label: "Visitas", to: "/relatorios/visitas" },
          { label: "Correspondências", to: "/relatorios/correspondencias" },
          { label: "Pré-Autorização", to: "/pre-autorizacoes" },
          { label: "Diário", to: "/diario" },
          { label: "Ligações", to: "/ligacoes" },
          { label: "Fila SIP", to: "/fila-sip" },
          { label: "Listar Bio/RFID", to: "/bio-rfid" },
          { label: "Log Notificações", to: "/log-notificacoes" },
          { label: "Log Emails", to: "/log-emails" },
          { label: "Log Usuários", to: "/log-usuarios" },
        ],
      },
      { label: "Enquetes", to: "/enquetes" },
      { label: "Assembleia Virtual", to: "/assembleias" },
      { label: "Achados/Perdidos", to: "/achados" },
      {
        label: "Gestão",
        children: [
          { label: "Manutenções", to: "/manutencoes" },
          { label: "Bloqueios", to: "/bloqueios" },
          { label: "Documentos", to: "/documentos" },
          { label: "Produtos", to: "/produtos" },
          { label: "Inventários", to: "/inventarios" },
          { label: "Objetos", to: "/objetos" },
          { label: "Fornecedores", to: "/fornecedores" },
          { label: "Procedimentos", to: "/procedimentos" },
          { label: "Turnos", to: "/turnos" },
        ],
      },
      {
        label: "Configurações",
        children: [
          { label: "Acionadores", to: "/acionadores" },
          { label: "Câmeras", to: "/cameras" },
          { label: "Dispositivos", to: "/dispositivos" },
          { label: "Condomínio", to: "/condominio" },
        ],
      },
    ],
  },
];

function Items({ items }: { items: MenuItem[] }) {
  return (
    <ul className="sh-sub">
      {items.map((item) =>
        item.children ? (
          <li key={item.label} className="sh-group">
            <a href="#" onClick={(e) => e.preventDefault()}>
              {item.label}
            </a>
            <Items items={item.children} />
          </li>
        ) : (
          <li key={item.to}>
            <NavLink to={item.to!}>{item.label}</NavLink>
          </li>
        )
      )}
    </ul>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { preset } = useTheme();
  const { reset } = useOperations();
  const navigate = useNavigate();
  // Dois cliques em vez de um diálogo do navegador, que travaria a janela.
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="op-shell">
      <header className="sh-top">
        <div className="sh-top-inner">
          <NavLink to="/visitas" className="sh-brand">
            <BrandMark size={44} />
            <div>
              <strong>{preset.name}</strong>
              <small>Controle de acesso</small>
            </div>
          </NavLink>
          <div className="sh-condo" title="Condomínio Modelo">
            CM
          </div>
          <span className="sh-phone">(61) 3000-0000</span>
          <div className="sh-tools">
            <button type="button" title="Anotações do turno" aria-label="Anotações do turno">
              <Icon name="note" />
            </button>
            <button type="button" title="Notificações" aria-label="Notificações">
              <Icon name="bell" />
            </button>
            <button type="button" title="Procedimentos" aria-label="Procedimentos">
              <Icon name="info" />
            </button>
            <span className="sh-condo-name">condomínio modelo</span>
            <details className="sh-user">
              <summary>
                <Icon name="user" /> {user}
              </summary>
              <div>
                <p>
                  <strong>{user}</strong>
                  Portaria Central · Brasília
                </p>
                <ThemeSwitcher />
                <div className="sh-user-actions">
                  <span className="text-[11px] text-ink/50">Ambiente de demonstração</span>
                  <button
                    className="op-button"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    <Icon name="exit" /> Sair
                  </button>
                </div>
                <div className="sh-user-actions">
                  {confirming ? (
                    <>
                      <span className="text-[11px] text-danger">Apaga o que foi cadastrado.</span>
                      <button
                        className="op-button"
                        onClick={() => {
                          reset();
                          setConfirming(false);
                        }}
                      >
                        <Icon name="check" /> Confirmar
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-ink/50">Condomínio fictício</span>
                      <button className="op-button" onClick={() => setConfirming(true)}>
                        Recarregar demonstração
                      </button>
                    </>
                  )}
                </div>
              </div>
            </details>
          </div>
        </div>
        <nav className="sh-nav" aria-label="Menu principal">
          <ul>
            {MENU.map((item) =>
              item.children ? (
                <li key={item.label} className="sh-group-top">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {item.label}
                  </a>
                  <Items items={item.children} />
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to!}>{item.label}</NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>
      <div className="op-content">
        <Outlet context={{ openMenu: () => document.querySelector(".sh-nav")?.scrollIntoView() }} />
      </div>
    </div>
  );
}

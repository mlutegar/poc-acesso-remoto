import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Usuário", "IP", "Início", "Fim", "Situação"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "CM",
    kind: "pessoa",
    main: ["carlos.portaria", "Carlos Mendonça · portaria"],
    cols: ["189.45.220.17", "13/09 06:00", "Em andamento"],
    badge: ["Conectado", "green"],
  },
  {
    tab: "active",
    photo: "AD",
    kind: "pessoa",
    main: ["adm.modelo", "Administração · administrador"],
    cols: ["201.17.88.140", "13/09 08:31", "13/09 09:05"],
    badge: ["Encerrada", "gray"],
  },
  {
    tab: "active",
    photo: "WT",
    kind: "pessoa",
    main: ["sindico", "Wagner Tavares · síndico"],
    cols: ["177.92.14.201", "13/09 07:44", "13/09 08:02"],
    badge: ["Encerrada", "gray"],
  },
  {
    tab: "history",
    photo: "DA",
    kind: "pessoa",
    main: ["denise.portaria", "Denise Alcântara · portaria"],
    cols: ["189.45.220.17", "12/09 18:00", "13/09 06:00"],
    badge: ["Encerrada", "gray"],
  },
  {
    tab: "history",
    main: ["adm.modelo", "Tentativa com senha incorreta"],
    cols: ["45.191.66.8", "12/09 23:14", "—"],
    badge: ["Recusada", "red"],
  },
];

export default function LogUsuarios() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Acessos de usuários</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Exportar
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de acessos de usuários">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Hoje"],
              ["history", "Últimos 30 dias"],
              ["all", "Tudo"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Usuários
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em acessos de usuários"
              placeholder="Buscar usuário ou IP…"
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          {query && (
            <button className="op-text-button" onClick={clear}>
              Limpar filtros
            </button>
          )}
        </div>
        {visiveis.length === 0 ? (
          <Empty text="Altere os filtros ou a aba para ver outros registros." />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {COLUNAS.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linhas.map((l, i) => (
                  <tr key={i}>
                    <td>
                      <div className="sh-cell">
                        {l.photo && <Photo name={l.photo} kind={l.kind} />}
                        <div>
                          <strong>{l.main[0]}</strong>
                          {l.main.slice(1).map((t) => (
                            <small key={t}>{t}</small>
                          ))}
                        </div>
                      </div>
                    </td>
                    {l.cols.map((c, j) => (
                      <td key={j}>{c}</td>
                    ))}
                    <td>
                      {l.badge && <span className={`op-badge ${l.badge[1]}`}>{l.badge[0]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={visiveis.length} page={pagina} onGo={goTo} />
      </section>
    </main>
  );
}

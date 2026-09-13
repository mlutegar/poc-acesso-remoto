import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Ligação", "Atendente", "Data", "Duração", "Situação"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Interfone 101 → Portaria", "Ramal 2001 · servidor SIP-01"],
    cols: ["Carlos Mendonça", "13/09 09:31", "1 min 12 s"],
    badge: ["Atendida", "green"],
  },
  {
    tab: "active",
    main: ["Portaria → Aplicativo · 2·201", "Chamada de vídeo"],
    cols: ["Carlos Mendonça", "13/09 09:12", "46 s"],
    badge: ["Atendida", "green"],
  },
  {
    tab: "active",
    main: ["Interfone 202 → Portaria", "Ramal 2004"],
    cols: ["Carlos Mendonça", "13/09 08:55", "2 min 03 s"],
    badge: ["Atendida", "green"],
  },
  {
    tab: "active",
    main: ["Portaria → Celular · 3·102", "Encaminhada para (61) 99088-5510"],
    cols: ["Carlos Mendonça", "13/09 08:20", "—"],
    badge: ["Não atendida", "red"],
  },
  {
    tab: "history",
    main: ["Interfone 102 → Portaria", "Ramal 2002"],
    cols: ["Denise Alcântara", "12/09 22:47", "3 min 51 s"],
    badge: ["Atendida", "green"],
  },
];

export default function Ligacoes() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Ligações</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Exportar
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de ligações">
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
              Fila SIP
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em ligações"
              placeholder="Buscar origem, destino ou atendente…"
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

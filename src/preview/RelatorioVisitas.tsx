import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Dia", "Visitas", "Prestadores", "Entregas", "Permanência média"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["13/09/2026 · sexta"],
    cols: ["28", "9", "11", "41 min"],
  },
  {
    tab: "active",
    main: ["12/09/2026 · quinta"],
    cols: ["34", "12", "14", "38 min"],
  },
  {
    tab: "active",
    main: ["11/09/2026 · quarta"],
    cols: ["31", "10", "13", "44 min"],
  },
  {
    tab: "active",
    main: ["10/09/2026 · terça"],
    cols: ["26", "8", "10", "36 min"],
  },
  {
    tab: "active",
    main: ["09/09/2026 · segunda"],
    cols: ["22", "7", "9", "33 min"],
  },
  {
    tab: "history",
    main: ["Agosto de 2026 · total"],
    cols: ["742", "233", "310", "39 min"],
  },
];

export default function RelatorioVisitas() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Relatório de visitas</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Imprimir
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de relatório de visitas">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Últimos 7 dias"],
              ["history", "Mês anterior"],
              ["all", "Tudo"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Salvar em PDF
            </button>
            <button className="op-button small" onClick={inerte}>
              Exportar Excel
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em relatório de visitas"
              placeholder="Buscar dia…"
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

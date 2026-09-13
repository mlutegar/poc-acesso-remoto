import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Dia", "Entradas", "Saídas", "Recusados", "Horário de pico"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["13/09/2026 · sexta"],
    cols: ["186", "171", "3", "18h às 19h"],
  },
  {
    tab: "active",
    main: ["12/09/2026 · quinta"],
    cols: ["214", "210", "1", "18h às 19h"],
  },
  {
    tab: "active",
    main: ["11/09/2026 · quarta"],
    cols: ["201", "198", "4", "07h às 08h"],
  },
  {
    tab: "active",
    main: ["10/09/2026 · terça"],
    cols: ["195", "192", "0", "18h às 19h"],
  },
  {
    tab: "active",
    main: ["09/09/2026 · segunda"],
    cols: ["188", "184", "2", "07h às 08h"],
  },
  {
    tab: "history",
    main: ["Agosto de 2026 · total"],
    cols: ["5.842", "5.796", "41", "18h às 19h"],
  },
];

export default function RelatorioAcessos() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Relatório de acessos</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Imprimir
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de relatório de acessos">
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
              aria-label="Buscar em relatório de acessos"
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

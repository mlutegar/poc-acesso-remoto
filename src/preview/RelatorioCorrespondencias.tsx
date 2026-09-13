import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Mês", "Recebidas", "Retiradas", "Pendentes", "Tempo médio até a retirada"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Setembro de 2026", "Parcial, até hoje"],
    cols: ["54", "42", "12", "1 dia e 4 horas"],
  },
  {
    tab: "active",
    main: ["Agosto de 2026"],
    cols: ["188", "186", "2", "19 horas"],
  },
  {
    tab: "active",
    main: ["Julho de 2026"],
    cols: ["174", "174", "0", "22 horas"],
  },
  {
    tab: "active",
    main: ["Junho de 2026"],
    cols: ["166", "166", "0", "1 dia e 2 horas"],
  },
  {
    tab: "history",
    main: ["Dezembro de 2025", "Pico de fim de ano"],
    cols: ["241", "240", "1", "1 dia e 9 horas"],
  },
];

export default function RelatorioCorrespondencias() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Relatório de correspondências</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Imprimir
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de relatório de correspondências">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Este ano"],
              ["history", "Ano anterior"],
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
              aria-label="Buscar em relatório de correspondências"
              placeholder="Buscar mês…"
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

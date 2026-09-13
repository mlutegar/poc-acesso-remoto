import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Responsável", "Credencial", "Equipamento", "Data", "Situação"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "HV",
    kind: "pessoa",
    main: ["Helena Vasconcelos", "1 · 101 · proprietária"],
    cols: ["Facial", "Facial Entrada Social", "13/09 08:12"],
    badge: ["Liberado", "green"],
  },
  {
    tab: "active",
    photo: "WT",
    kind: "pessoa",
    main: ["Wagner Tavares", "2 · 101 · proprietário"],
    cols: ["TAG veicular", "Leitora Garagem", "13/09 07:58"],
    badge: ["Liberado", "green"],
  },
  {
    tab: "active",
    photo: "RQ",
    kind: "pessoa",
    main: ["Rafael Quintela", "2 · 201 · inquilino"],
    cols: ["Facial", "Facial Entrada Social", "13/09 07:41"],
    badge: ["Liberado", "green"],
  },
  {
    tab: "active",
    main: ["Não identificado", "Sem cadastro correspondente"],
    cols: ["Facial", "Facial Entrada Social", "13/09 07:15"],
    badge: ["Recusado", "red"],
  },
  {
    tab: "active",
    photo: "CB",
    kind: "pessoa",
    main: ["Camila Bustamante", "3 · 102 · inquilina"],
    cols: ["Cartão de proximidade", "Leitora Serviço", "13/09 06:50"],
    badge: ["Liberado", "green"],
  },
  {
    tab: "history",
    photo: "MS",
    kind: "pessoa",
    main: ["Marcos Sarmento", "2 · 102 · proprietário"],
    cols: ["TAG veicular", "Leitora Garagem", "12/09 19:22"],
    badge: ["Liberado", "green"],
  },
];

export default function BioRfid() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Acessos por biometria e RFID</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Exportar
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de acessos por biometria e rfid">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Hoje"],
              ["history", "Últimos 7 dias"],
              ["all", "Tudo"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Credenciais
            </button>
            <button className="op-button small" onClick={inerte}>
              Câmeras
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em acessos por biometria e rfid"
              placeholder="Buscar responsável, unidade ou equipamento…"
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

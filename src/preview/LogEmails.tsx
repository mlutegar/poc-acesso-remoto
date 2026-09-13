import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Assunto", "Destinatário", "Data", "Situação"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Comunicado: manutenção da caixa d'água", "Disparo automático do comunicado"],
    cols: ["20 condôminos", "13/09 07:02"],
    badge: ["Enviado", "green"],
  },
  {
    tab: "active",
    main: ["Convocação de assembleia ordinária", "Com anexo convocacao-assembleia.pdf"],
    cols: ["11 proprietários", "12/09 18:00"],
    badge: ["Enviado", "green"],
  },
  {
    tab: "active",
    main: ["Balancete de agosto disponível", "Documento publicado"],
    cols: ["11 proprietários", "10/09 16:22"],
    badge: ["Enviado", "green"],
  },
  {
    tab: "active",
    main: ["Comunicado: obra na unidade 1/202", "Destino: uma residência"],
    cols: ["Priscila Moreira", "10/09 09:05"],
    badge: ["Devolvido", "red"],
  },
  {
    tab: "history",
    main: ["Nova regra para visitantes na piscina"],
    cols: ["20 condôminos", "06/09 09:00"],
    badge: ["Enviado", "green"],
  },
];

export default function LogEmails() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Log de e-mails</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Exportar
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de log de e-mails">
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
              Log de notificações
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em log de e-mails"
              placeholder="Buscar destinatário ou assunto…"
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

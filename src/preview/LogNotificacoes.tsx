import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Mensagem", "Destinatário", "Data", "Situação"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Você tem uma correspondência na portaria", "Enviada pelo módulo de correspondências"],
    cols: ["Helena Vasconcelos · 1 · 101", "13/09 09:26"],
    badge: ["Entregue", "green"],
  },
  {
    tab: "active",
    main: ["Visita aguardando sua autorização", "Jonas Ribeiro · Mercado Envios"],
    cols: ["Helena Vasconcelos · 1 · 101", "13/09 09:18"],
    badge: ["Lida", "green"],
  },
  {
    tab: "active",
    main: ["Comunicado: manutenção da caixa d'água", "Enviado a 20 condôminos"],
    cols: ["Todos os condôminos", "13/09 07:02"],
    badge: ["Entregue", "green"],
  },
  {
    tab: "active",
    main: ["Você tem uma correspondência na portaria", "Segunda tentativa"],
    cols: ["Antônio Guimarães · 3 · 201", "13/09 01:12"],
    badge: ["Não entregue", "red"],
  },
  {
    tab: "history",
    main: ["Visita autorizada pela portaria", "Aline Caldas · Clínica Movimente"],
    cols: ["Eduardo Peçanha · 3 · 101", "12/09 14:30"],
    badge: ["Lida", "green"],
  },
];

export default function LogNotificacoes() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Log de notificações</h1>
        <button className="op-button primary" onClick={() => inerte()}>
          <Icon name="plus" /> Exportar
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de log de notificações">
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
              Log de e-mails
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em log de notificações"
              placeholder="Buscar responsável, unidade ou mensagem…"
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

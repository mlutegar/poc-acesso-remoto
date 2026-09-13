import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Fila", "Ramal", "Portaria", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Portaria principal", "Fila padrão de login"],
    cols: ["2000", "Portaria Central"],
    badge: ["Online", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Portaria de serviço", "Atende a entrada da garagem"],
    cols: ["2010", "Portaria de Serviço"],
    badge: ["Online", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Central remota", "Atendimento noturno terceirizado"],
    cols: ["2020", "Central Remota"],
    badge: ["Online", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Zeladoria", "Visível ao morador no app"],
    cols: ["2030", "Portaria Central"],
    badge: ["Offline", "gray"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Portaria antiga", "Desabilitada em 05/2026"],
    cols: ["2040", "—"],
    badge: ["Desabilitada", "gray"],
    actions: ["Histórico"],
  },
];

export default function FilaSip() {
  const { query, tab, update, pageOf, goTo, clear } = useListParams();
  const [form, setForm] = useState(false);
  const [aviso, setAviso] = useState("");
  const inerte = () => setAviso(AVISO);
  const visiveis = LINHAS.filter((l) => (tab === "all" || l.tab === tab) && matches(l, query));
  const pagina = pageOf(visiveis.length);
  const linhas = visiveis.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Fila SIP</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova fila
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de fila sip">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativas"],
              ["history", "Desabilitadas"],
              ["all", "Todas"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Ligações
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em fila sip"
              placeholder="Buscar fila ou ramal…"
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
                    <td>
                      <div className="op-actions">
                        {(l.actions ?? []).map((a) => (
                          <button key={a} className="op-text-button" onClick={inerte}>
                            {a}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={visiveis.length} page={pagina} onGo={goTo} />
      </section>
      {form && (
        <Modal title="Nova fila" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <div className="op-form-grid">
              <Field label="Nome" name="nome" />
              <Field label="Ramal" name="ramal" />
              <Field label="Portaria" name="portaria">
                <option key="Portaria Central">Portaria Central</option>
                <option key="Portaria de Serviço">Portaria de Serviço</option>
                <option key="Central Remota">Central Remota</option>
              </Field>
            </div>

            <div className="op-checks">
              <Check label="Exibir ao morador" name="morador" checked={false} />
              <Check label="Padrão de login" name="padrao" checked={false} />
            </div>
            <footer className="op-form-footer">
              <button type="button" className="op-button" onClick={() => setForm(false)}>
                Cancelar
              </button>
              <button className="op-button primary" type="submit">
                Salvar
              </button>
            </footer>
          </form>
        </Modal>
      )}
    </main>
  );
}

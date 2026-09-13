import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Anotação", "Operador", "Data", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Entrega de gás para a unidade 2·102", "Caminhão autorizado a entrar pela garagem"],
    cols: ["Carlos Mendonça", "13/09 09:14"],
    badge: ["Registrada", "green"],
    actions: ["Histórico"],
  },
  {
    tab: "active",
    main: ["Chave do salão entregue à unidade 3·201", "Devolução prevista para segunda"],
    cols: ["Carlos Mendonça", "13/09 08:40"],
    badge: ["Registrada", "green"],
    actions: ["Histórico"],
  },
  {
    tab: "active",
    main: ["Mudança na unidade 1·102", "Elevador de serviço reservado das 8h às 12h"],
    cols: ["Denise Alcântara", "12/09 20:05"],
    badge: ["Registrada", "green"],
    actions: ["Histórico"],
  },
  {
    tab: "active",
    main: ["Ronda das 3h sem intercorrências", "Todos os acessos conferidos"],
    cols: ["Denise Alcântara", "12/09 03:10"],
    badge: ["Registrada", "green"],
    actions: ["Histórico"],
  },
  {
    tab: "history",
    main: ["Queda de energia às 2h14", "Gerador acionado, normalizado às 2h39"],
    cols: ["Denise Alcântara", "08/09 02:14"],
    badge: ["Arquivada", "gray"],
    actions: ["Histórico"],
  },
];

export default function Diario() {
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
        <h1>Diário</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova anotação
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de diário">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativos"],
              ["history", "Histórico"],
              ["all", "Todos"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions"></div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em diário"
              placeholder="Buscar anotação…"
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
        <Modal title="Nova anotação" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <div className="op-form-grid">
              <Field label="Data" name="data" type="date" />
              <Field label="Hora" name="hora" type="time" />
              <Field label="Operador" name="operador" />
            </div>
            <Field label="Anotação" name="anotacao" type="textarea" />
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

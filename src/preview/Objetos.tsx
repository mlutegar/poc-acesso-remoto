import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Objeto", "Responsável", "Saída / devolução", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Furadeira de impacto", "Código INV-0088"],
    cols: ["Rafael Quintela · 2·201", "11/09 09:20 → prevista hoje"],
    badge: ["Em uso", "amber"],
    actions: ["Devolver"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Escada de alumínio", "Código INV-0142"],
    cols: ["Josué Vieira · zeladoria", "10/09 14:00 → prevista 13/09"],
    badge: ["Em uso", "amber"],
    actions: ["Devolver"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["10 cadeiras de plástico", "Código INV-0212"],
    cols: ["Bianca Sarmento · 2·102", "12/09 17:00 → prevista 14/09"],
    badge: ["Em uso", "amber"],
    actions: ["Devolver"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Mesas de plástico", "Código INV-0211"],
    cols: ["Antônio Guimarães · 3·201", "28/08 → devolvido 30/08"],
    badge: ["Devolvido", "gray"],
    actions: ["Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Aspirador de água e pó", "Código INV-0157"],
    cols: ["Marta Figueiredo · limpeza", "02/09 → devolvido 02/09"],
    badge: ["Devolvido", "gray"],
    actions: ["Histórico"],
  },
];

export default function Objetos() {
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
        <h1>Objetos e empréstimos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo empréstimo
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de objetos e empréstimos">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Em uso"],
              ["history", "Devolvidos"],
              ["all", "Todos"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Inventário
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em objetos e empréstimos"
              placeholder="Buscar objeto ou responsável…"
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
        <Modal title="Novo empréstimo" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <div className="op-form-grid">
              <Field label="Objeto" name="objeto" />
              <Field label="Responsável" name="responsavel" />
              <Field label="Saída" name="saida" type="date" />
              <Field label="Devolução prevista" name="devolucao" type="date" />
            </div>
            <Field label="Observação" name="observacao" type="textarea" />
            <div className="op-checks">
              <Check label="Notificar na devolução" name="notificar" checked={false} />
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

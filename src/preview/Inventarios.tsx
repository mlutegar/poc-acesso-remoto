import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo, PhotoField } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Item", "Setor", "Quantidade", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Escada de alumínio 7 degraus", "Código INV-0142"],
    cols: ["Zeladoria", "1 unidade"],
    badge: ["Disponível", "green"],
    actions: ["Emprestar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Furadeira de impacto", "Código INV-0088"],
    cols: ["Zeladoria", "2 unidades"],
    badge: ["Emprestado", "amber"],
    actions: ["Devolver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Mesas de plástico", "Código INV-0211"],
    cols: ["Salão de festas", "20 unidades"],
    badge: ["Disponível", "green"],
    actions: ["Emprestar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Cadeiras de plástico", "Código INV-0212"],
    cols: ["Salão de festas", "80 unidades"],
    badge: ["Disponível", "green"],
    actions: ["Emprestar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Aspirador de água e pó", "Código INV-0157"],
    cols: ["Zeladoria", "1 unidade"],
    badge: ["Em manutenção", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Roçadeira a gasolina", "Código INV-0031 · baixa em 04/2026"],
    cols: ["Jardinagem", "0 unidade"],
    badge: ["Baixado", "gray"],
    actions: ["Histórico"],
  },
];

export default function Inventarios() {
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
        <h1>Inventários</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo item
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de inventários">
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
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Objetos
            </button>
            <button className="op-button small" onClick={inerte}>
              Empréstimos
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em inventários"
              placeholder="Buscar item, código ou setor…"
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
        <Modal title="Novo item" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <PhotoField kind="objeto" />
            <div className="op-form-grid">
              <Field label="Código" name="codigo" />
              <Field label="Descrição" name="descricao" />
              <Field label="Setor" name="setor" />
              <Field label="Quantidade" name="quantidade" />
              <Field label="Unidade" name="unidade">
                <option key="Unidade">Unidade</option>
                <option key="Caixa">Caixa</option>
                <option key="Par">Par</option>
                <option key="Metro">Metro</option>
              </Field>
            </div>

            <div className="op-checks">
              <Check label="Permite empréstimo" name="emprestimo" checked={false} />
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

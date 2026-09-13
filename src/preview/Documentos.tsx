import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Documento", "Pasta", "Público", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Convenção do condomínio", "convencao.pdf · 2,4 MB"],
    cols: ["Institucional", "Moradores e portaria"],
    badge: ["Aceite obrigatório", "amber"],
    actions: ["Baixar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Regimento interno", "regimento-2026.pdf · 1,1 MB"],
    cols: ["Institucional", "Moradores e portaria"],
    badge: ["Aceite obrigatório", "amber"],
    actions: ["Baixar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Balancete de agosto", "balancete-08-2026.pdf · 680 KB"],
    cols: ["Prestação de contas", "Somente proprietários"],
    badge: ["Publicado", "green"],
    actions: ["Baixar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Ata da assembleia de abril", "ata-04-2026.pdf · 320 KB"],
    cols: ["Assembleias", "Moradores e portaria"],
    badge: ["Publicado", "green"],
    actions: ["Baixar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Manual do morador", "manual.pdf · 5,8 MB"],
    cols: ["Institucional", "Moradores"],
    badge: ["Publicado", "green"],
    actions: ["Baixar", "Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Balancete de julho", "balancete-07-2026.pdf"],
    cols: ["Prestação de contas", "Somente proprietários"],
    badge: ["Arquivado", "gray"],
    actions: ["Baixar"],
  },
];

export default function Documentos() {
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
        <h1>Documentos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo documento
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de documentos">
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
              Pastas
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em documentos"
              placeholder="Buscar documento ou pasta…"
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
        <Modal title="Novo documento" onClose={() => setForm(false)}>
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
              <Field label="Arquivo" name="arquivo" />
              <Field label="Pasta" name="pasta">
                <option key="Institucional">Institucional</option>
                <option key="Prestação de contas">Prestação de contas</option>
                <option key="Assembleias">Assembleias</option>
                <option key="Obras">Obras</option>
              </Field>
              <Field label="Público" name="publico">
                <option key="Moradores e portaria">Moradores e portaria</option>
                <option key="Somente proprietários">Somente proprietários</option>
                <option key="Somente administradores">Somente administradores</option>
              </Field>
            </div>

            <div className="op-checks">
              <Check label="Visível a inquilinos" name="inquilinos" checked={false} />
              <Check label="Aceite obrigatório" name="aceite" checked={false} />
              <Check label="Compartilhar no app" name="app" checked={false} />
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

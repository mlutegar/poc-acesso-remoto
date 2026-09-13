import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Enquete", "Público votante", "Votos", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Troca do portão da garagem", "Encerra em 5 dias · comentários liberados"],
    cols: ["Somente proprietários", "34 de 11 unidades"],
    badge: ["Aberta", "green"],
    actions: ["Ver resultado", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Horário da academia aos domingos", "Encerra em 12 dias"],
    cols: ["Todos os condôminos", "87 de 20 unidades"],
    badge: ["Aberta", "green"],
    actions: ["Ver resultado", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Escolha do novo síndico", "Encerra em 20 dias · anexo: chapas.pdf"],
    cols: ["Somente proprietários", "12 de 11 unidades"],
    badge: ["Aberta", "green"],
    actions: ["Ver resultado", "Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Pintura da fachada — cor", "Encerrada em 02/08/2026"],
    cols: ["Somente proprietários", "96 de 11 unidades"],
    badge: ["Encerrada", "gray"],
    actions: ["Ver resultado"],
  },
  {
    tab: "history",
    main: ["Festa junina do condomínio", "Encerrada em 14/06/2026"],
    cols: ["Exceto inquilinos", "71 de 20 unidades"],
    badge: ["Encerrada", "gray"],
    actions: ["Ver resultado"],
  },
];

export default function Enquetes() {
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
        <h1>Enquetes</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova enquete
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de enquetes">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativas"],
              ["history", "Histórico"],
              ["all", "Todas"],
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
              aria-label="Buscar em enquetes"
              placeholder="Buscar título ou pergunta…"
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
        <Modal title="Nova enquete" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <div className="op-form-grid">
              <Field label="Título" name="titulo" />
              <Field label="Encerramento" name="fim" type="date" />
              <Field label="Público votante" name="publico">
                <option key="Todos os condôminos">Todos os condôminos</option>
                <option key="Somente proprietários">Somente proprietários</option>
                <option key="Exceto inquilinos">Exceto inquilinos</option>
              </Field>
              <Field label="Anexo" name="anexo" />
              <Field label="Pergunta" name="pergunta" />
            </div>
            <Field label="Descrição" name="descricao" type="textarea" />
            <div className="op-checks">
              <Check label="Permitir comentários" name="comentarios" checked={false} />
              <Check label="Notificar no app" name="app" checked={false} />
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

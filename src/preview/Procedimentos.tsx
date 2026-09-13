import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Procedimento", "Categoria", "Atualizado em", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Como proceder em caso de incêndio", "Acionar brigada, liberar saídas, chamar 193"],
    cols: ["Emergência", "02/09/2026"],
    badge: ["Publicado", "green"],
    actions: ["Ler", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Recebimento de encomendas", "Conferir destinatário, fotografar, avisar pelo app"],
    cols: ["Portaria", "28/08/2026"],
    badge: ["Publicado", "green"],
    actions: ["Ler", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: [
      "Entrada de prestador de serviço",
      "Conferir documento, autorizar com o morador, registrar rota",
    ],
    cols: ["Portaria", "28/08/2026"],
    badge: ["Publicado", "green"],
    actions: ["Ler", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: [
      "Falta de energia nas áreas comuns",
      "Verificar quadro, acionar gerador, registrar ocorrência",
    ],
    cols: ["Emergência", "15/07/2026"],
    badge: ["Publicado", "green"],
    actions: ["Ler", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Troca de turno", "Conferir chaves, ler anotações, assinar o livro"],
    cols: ["Portaria", "10/06/2026"],
    badge: ["Publicado", "green"],
    actions: ["Ler", "Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Uso do salão de festas", "Substituído pelo regimento atualizado"],
    cols: ["Áreas comuns", "04/2026"],
    badge: ["Arquivado", "gray"],
    actions: ["Ler"],
  },
];

export default function Procedimentos() {
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
        <h1>Procedimentos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo procedimento
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de procedimentos">
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
              aria-label="Buscar em procedimentos"
              placeholder="Buscar procedimento ou categoria…"
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
        <Modal title="Novo procedimento" onClose={() => setForm(false)}>
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
              <Field label="Categoria" name="categoria">
                <option key="Portaria">Portaria</option>
                <option key="Emergência">Emergência</option>
                <option key="Áreas comuns">Áreas comuns</option>
                <option key="Administrativo">Administrativo</option>
              </Field>
              <Field label="Imagem" name="imagem" />
            </div>
            <Field label="Descrição" name="descricao" type="textarea" />
            <div className="op-checks">
              <Check label="Exibir no cabeçalho" name="cabecalho" checked={false} />
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

import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo, PhotoField } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Fornecedor", "Categoria", "Contato", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "EL",
    kind: "pessoa",
    main: ["Elevasa Elevadores", "Contrato mensal · desde 2023"],
    cols: ["Manutenção", "(61) 3344-0180"],
    badge: ["Em destaque", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "CP",
    kind: "pessoa",
    main: ["Clean Predial", "Limpeza pesada aos sábados"],
    cols: ["Limpeza", "(61) 3344-2290"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "FN",
    kind: "pessoa",
    main: ["Frio Norte Climatização", "Atende chamados dos moradores"],
    cols: ["Ar-condicionado", "(61) 99812-7745"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "VV",
    kind: "pessoa",
    main: ["Verde Vivo Jardinagem", "Quinzenal"],
    cols: ["Jardinagem", "(61) 99730-4412"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "DP",
    kind: "pessoa",
    main: ["Duarte Pinturas", "Orçamento em andamento"],
    cols: ["Pintura", "(61) 99655-8890"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "HS",
    kind: "pessoa",
    main: ["Hidro Sul Encanamentos", "Contrato encerrado em 03/2026"],
    cols: ["Hidráulica", "(61) 3344-7781"],
    badge: ["Inativo", "gray"],
    actions: ["Histórico"],
  },
];

export default function Fornecedores() {
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
        <h1>Fornecedores</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo fornecedor
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de fornecedores">
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
              aria-label="Buscar em fornecedores"
              placeholder="Buscar fornecedor ou categoria…"
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
        <Modal title="Novo fornecedor" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <PhotoField kind="pessoa" />
            <div className="op-form-grid">
              <Field label="Nome" name="nome" />
              <Field label="Categoria" name="categoria" />
              <Field label="Telefone" name="telefone" type="tel" />
              <Field label="E-mail" name="email" type="email" />
              <Field label="Dias em destaque" name="destaque" />
            </div>
            <Field label="Descrição" name="descricao" type="textarea" />
            <div className="op-checks">
              <Check label="Exibir no aplicativo" name="app" checked={false} />
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

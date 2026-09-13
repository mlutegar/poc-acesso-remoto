import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo, PhotoField } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Objeto", "Encontrado em", "Registro", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Guarda-chuva azul", "Cabo de madeira"],
    cols: ["Hall do Bloco 1 · 09/09", "Carlos (portaria)"],
    badge: ["Na portaria", "amber"],
    actions: ["Entregar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Chave com chaveiro de coelho", "Três chaves em argola"],
    cols: ["Garagem · 08/09", "Denise (portaria)"],
    badge: ["Na portaria", "amber"],
    actions: ["Entregar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Óculos de sol", "Armação preta, estojo marrom"],
    cols: ["Piscina · 06/09", "Carlos (portaria)"],
    badge: ["Na portaria", "amber"],
    actions: ["Entregar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Carteira infantil", "Com carteirinha escolar"],
    cols: ["Playground · 05/09", "Josué (zeladoria)"],
    badge: ["Na portaria", "amber"],
    actions: ["Entregar", "Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Bicicleta infantil vermelha", "Aro 16"],
    cols: ["Bicicletário · 21/08", "Carlos (portaria)"],
    badge: ["Devolvida", "gray"],
    actions: ["Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Fone de ouvido", "Estojo branco"],
    cols: ["Academia · 12/08", "Denise (portaria)"],
    badge: ["Devolvido", "gray"],
    actions: ["Histórico"],
  },
];

export default function Achados() {
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
        <h1>Achados e perdidos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo achado
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de achados e perdidos">
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
              aria-label="Buscar em achados e perdidos"
              placeholder="Buscar objeto ou descrição…"
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
        <Modal title="Novo achado" onClose={() => setForm(false)}>
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
              <Field label="Nome do objeto" name="nome" />
              <Field label="Encontrado em" name="local" />
              <Field label="Data" name="data" type="date" />
              <Field label="Registrado por" name="quem" />
            </div>
            <Field label="Descrição" name="descricao" type="textarea" />
            <div className="op-checks">
              <Check label="Exibir aos condôminos" name="exibir" checked={false} />
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

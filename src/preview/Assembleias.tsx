import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Assembleia", "Tipo", "Período", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Prestação de contas 2026", "Anexo: convocacao-assembleia.pdf"],
    cols: ["Ordinária", "14/09 19:00 às 21:00"],
    badge: ["Convocada", "amber"],
    actions: ["Ata", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Reforma do salão de festas", "Quórum mínimo: dois terços"],
    cols: ["Extraordinária", "28/09 19:30 às 21:30"],
    badge: ["Convocada", "amber"],
    actions: ["Ata", "Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Orçamento do exercício", "Quórum atingido: 14 de 20"],
    cols: ["Ordinária", "12/04 19:00 às 22:10"],
    badge: ["Encerrada", "gray"],
    actions: ["Ata"],
  },
  {
    tab: "history",
    main: ["Contratação da portaria remota", "Aprovada por 12 votos a 2"],
    cols: ["Extraordinária", "03/02 20:00 às 21:40"],
    badge: ["Encerrada", "gray"],
    actions: ["Ata"],
  },
];

export default function Assembleias() {
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
        <h1>Assembleia Virtual</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova assembleia
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de assembleia virtual">
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
              aria-label="Buscar em assembleia virtual"
              placeholder="Buscar assembleia…"
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
        <Modal title="Nova assembleia" onClose={() => setForm(false)}>
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
              <Field label="Tipo" name="tipo">
                <option key="Ordinária">Ordinária</option>
                <option key="Extraordinária">Extraordinária</option>
              </Field>
              <Field label="Data de início" name="inicio" type="date" />
              <Field label="Hora de início" name="hinicio" type="time" />
              <Field label="Data de fim" name="fim" type="date" />
              <Field label="Hora de fim" name="hfim" type="time" />
              <Field label="Anexo" name="anexo" />
            </div>
            <Field label="Descrição" name="descricao" type="textarea" />
            <div className="op-checks">
              <Check label="Notificar no app" name="app" checked={false} />
              <Check label="Enviar e-mail" name="email" checked={false} />
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

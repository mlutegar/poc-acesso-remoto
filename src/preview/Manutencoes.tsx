import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Manutenção", "Local", "Próxima data", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Limpeza da caixa d'água", "Semestral · alerta 15 dias antes"],
    cols: ["Casa de máquinas", "11/09/2026"],
    badge: ["Hoje", "red"],
    actions: ["Concluir", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Recarga dos extintores", "Anual · alerta 30 dias antes"],
    cols: ["Todas as áreas comuns", "30/09/2026"],
    badge: ["Em 17 dias", "amber"],
    actions: ["Concluir", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Manutenção dos elevadores", "Mensal · contrato Elevasa"],
    cols: ["Blocos 1, 2 e 3", "25/09/2026"],
    badge: ["Em 12 dias", "amber"],
    actions: ["Concluir", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Dedetização", "Trimestral"],
    cols: ["Áreas comuns e garagem", "19/09/2026"],
    badge: ["Em 6 dias", "amber"],
    actions: ["Concluir", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Inspeção do portão automático", "Trimestral"],
    cols: ["Garagem", "14/11/2026"],
    badge: ["Em 62 dias", "green"],
    actions: ["Concluir", "Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Troca da bomba d'água", "Concluída em 07/09/2026"],
    cols: ["Casa de máquinas", "—"],
    badge: ["Concluída", "gray"],
    actions: ["Histórico"],
  },
];

export default function Manutencoes() {
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
        <h1>Manutenções</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova manutenção
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de manutenções">
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
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Calendário
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em manutenções"
              placeholder="Buscar manutenção ou local…"
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
        <Modal title="Nova manutenção" onClose={() => setForm(false)}>
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
              <Field label="Local" name="local" />
              <Field label="Data" name="data" type="date" />
              <Field label="Renovação" name="renovacao">
                <option key="Não repete">Não repete</option>
                <option key="Mensal">Mensal</option>
                <option key="Trimestral">Trimestral</option>
                <option key="Semestral">Semestral</option>
                <option key="Anual">Anual</option>
              </Field>
              <Field label="Alertar com antecedência de" name="alerta">
                <option key="7 dias">7 dias</option>
                <option key="15 dias">15 dias</option>
                <option key="30 dias">30 dias</option>
              </Field>
            </div>
            <Field label="Descrição" name="descricao" type="textarea" />
            <div className="op-checks">
              <Check label="Notificar o síndico" name="sindico" checked={false} />
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

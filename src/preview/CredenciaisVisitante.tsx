import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo, PhotoField } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { DependeDeEquipamento } from "./Hardware";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Visitante", "Credencial", "Vínculo", "Validade", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "AC",
    kind: "pessoa",
    main: ["Aline Caldas", "Clínica Movimente"],
    cols: ["Cartão temporário · V-0148", "Pré-autorização · 3 · 101", "Seg a sex, 09h às 11h30"],
    badge: ["Ativa", "green"],
    actions: ["Devolver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "MT",
    kind: "pessoa",
    main: ["Murilo Tenório", "Professor de natação"],
    cols: ["Cartão temporário · V-0151", "Pré-autorização · 2 · 101", "Ter e qui, 15h às 18h"],
    badge: ["Ativa", "green"],
    actions: ["Devolver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "NB",
    kind: "pessoa",
    main: ["Neide Barbosa", "Diarista"],
    cols: ["Facial temporário", "Pré-autorização · 1 · 101", "Seg, qua e sex, 08h às 17h"],
    badge: ["Ativa", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "MD",
    kind: "pessoa",
    main: ["Marcelo Duarte", "Duarte Pinturas"],
    cols: ["Cartão temporário · V-0155", "Visita em andamento · 3 · 201", "Somente hoje"],
    badge: ["Ativa", "green"],
    actions: ["Devolver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Equipe Clean Predial", "Limpeza aos sábados"],
    cols: ["Cartão temporário · V-0160", "Pré-autorização · 3 · 201", "Sábados, 08h às 14h"],
    badge: ["Pendente", "amber"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "JR",
    kind: "pessoa",
    main: ["Jonas Ribeiro", "Mercado Envios"],
    cols: ["Cartão temporário · V-0142", "Visita finalizada · 1 · 101", "Devolvido em 12/09"],
    badge: ["Devolvida", "gray"],
    actions: ["Histórico"],
  },
];

export default function CredenciaisVisitante() {
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
        <h1>Credenciais de visitante</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova credencial
        </button>
      </div>
      <DependeDeEquipamento acoes="Enviar a credencial ao equipamento e registrar a passagem" />
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de credenciais de visitante">
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
              Visitas
            </button>
            <button className="op-button small" onClick={inerte}>
              Pré-autorizações
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em credenciais de visitante"
              placeholder="Buscar visitante, serial ou unidade…"
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
        <Modal title="Nova credencial de visitante" onClose={() => setForm(false)}>
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
              <Field label="Visitante" name="visitante" />
              <Field label="Tipo" name="tipo">
                <option key="Cartão temporário">Cartão temporário</option>
                <option key="Facial temporário">Facial temporário</option>
                <option key="TAG temporária">TAG temporária</option>
              </Field>
              <Field label="Serial ou código" name="serial" />
              <Field label="Vínculo" name="vinculo">
                <option key="Visita">Visita</option>
                <option key="Pré-autorização">Pré-autorização</option>
              </Field>
              <Field label="Validade" name="validade" type="date" />
            </div>

            <div className="op-checks">
              <Check label="Devolução obrigatória na saída" name="devolucao" checked={false} />
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

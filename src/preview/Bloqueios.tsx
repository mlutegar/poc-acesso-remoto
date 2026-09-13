import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Bloqueio", "Identificação", "Período", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "GR",
    kind: "pessoa",
    main: ["Gilmar Rezende", "Bloqueio solicitado pela unidade 2·201"],
    cols: ["CPF 246.635.397-15", "Indeterminado"],
    badge: ["Ativo", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "VC",
    kind: "pessoa",
    main: ["Vanda Correia", "Ex-prestadora — acesso revogado"],
    cols: ["RG 20.441.905", "Até 31/12/2026"],
    badge: ["Ativo", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "LM",
    kind: "pessoa",
    main: ["Laerte Monteiro", "Medida protetiva informada pela síndica"],
    cols: ["CPF 903.771.458-20", "Indeterminado"],
    badge: ["Ativo", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Veículo PXR-4C18", "Fiesta prata — abordagem suspeita"],
    cols: ["PXR4C18", "Indeterminado"],
    badge: ["Ativo", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Veículo HTB-9J05", "Gol preto — furto registrado"],
    cols: ["HTB9J05", "Indeterminado"],
    badge: ["Ativo", "red"],
    actions: ["Editar", "Histórico"],
  },
];

export default function Bloqueios() {
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
        <h1>Bloqueios</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo bloqueio
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de bloqueios">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Visitantes"],
              ["history", "Veículos"],
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
              aria-label="Buscar em bloqueios"
              placeholder="Buscar nome, documento ou placa…"
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
        <Modal title="Novo bloqueio" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <div className="op-form-grid">
              <Field label="Tipo" name="tipo">
                <option key="Visitante">Visitante</option>
                <option key="Veículo">Veículo</option>
              </Field>
              <Field label="Nome" name="nome" />
              <Field label="Documento" name="documento" />
              <Field label="Placa" name="placa" />
              <Field label="Unidade solicitante" name="unidade" />
              <Field label="Início" name="inicio" type="date" />
              <Field label="Fim" name="fim" type="date" />
            </div>
            <Field label="Justificativa" name="justificativa" type="textarea" />
            <div className="op-checks">
              <Check
                label="Bloqueio por tempo indeterminado"
                name="indeterminado"
                checked={false}
              />
              <Check label="Notificar a portaria" name="portaria" checked={false} />
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

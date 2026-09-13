import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Turno", "Operador", "Início / fim", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "CM",
    kind: "pessoa",
    main: ["Turno diurno · 13/09", "3 anotações registradas"],
    cols: ["Carlos Mendonça", "06:00 → em andamento"],
    badge: ["Aberto", "green"],
    actions: ["Anotar", "Encerrar"],
  },
  {
    tab: "history",
    photo: "DA",
    kind: "pessoa",
    main: ["Turno noturno · 12/09", "5 anotações · portão social com defeito"],
    cols: ["Denise Alcântara", "18:00 → 06:00"],
    badge: ["Encerrado", "gray"],
    actions: ["Anotações"],
  },
  {
    tab: "history",
    photo: "CM",
    kind: "pessoa",
    main: ["Turno diurno · 12/09", "2 anotações"],
    cols: ["Carlos Mendonça", "06:00 → 18:00"],
    badge: ["Encerrado", "gray"],
    actions: ["Anotações"],
  },
  {
    tab: "history",
    photo: "DA",
    kind: "pessoa",
    main: ["Turno noturno · 11/09", "4 anotações · ronda sem intercorrências"],
    cols: ["Denise Alcântara", "18:00 → 06:00"],
    badge: ["Encerrado", "gray"],
    actions: ["Anotações"],
  },
  {
    tab: "history",
    photo: "CM",
    kind: "pessoa",
    main: ["Turno diurno · 11/09", "6 anotações · entrega de gás"],
    cols: ["Carlos Mendonça", "06:00 → 18:00"],
    badge: ["Encerrado", "gray"],
    actions: ["Anotações"],
  },
];

export default function Turnos() {
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
        <h1>Turnos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Iniciar turno
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de turnos">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Em andamento"],
              ["history", "Encerrados"],
              ["all", "Todos"],
            ]}
            onSelect={(v) => update("tab", v)}
          />
          <div className="op-actions">
            <button className="op-button small" onClick={inerte}>
              Relatório de anotações
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em turnos"
              placeholder="Buscar operador ou anotação…"
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
        <Modal title="Iniciar turno" onClose={() => setForm(false)}>
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              setForm(false);
              setAviso("Esta prévia mostra os campos do cadastro, mas ainda não grava.");
            }}
          >
            <div className="op-form-grid">
              <Field label="Operador" name="operador" />
              <Field label="Início" name="inicio" type="time" />
              <Field label="Chaves conferidas" name="chaves">
                <option key="Sim">Sim</option>
                <option key="Não">Não</option>
              </Field>
            </div>
            <Field label="Anotação de abertura" name="anotacao" type="textarea" />
            <div className="op-checks">
              <Check label="Li as anotações do turno anterior" name="leu" checked={false} />
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

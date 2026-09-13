import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { DependeDeEquipamento } from "./Hardware";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Acionador", "Dispositivo", "Relay", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Portão social", "Visível à portaria · pulso de 3 s"],
    cols: ["Controladora Entrada 01", "Relay 1"],
    badge: ["Online", "green"],
    actions: ["Acionar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Portão da garagem", "Visível à portaria · pulso de 8 s"],
    cols: ["Controladora Garagem 01", "Relay 1"],
    badge: ["Online", "green"],
    actions: ["Acionar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Cancela de saída", "Acionada por laço indutivo"],
    cols: ["Controladora Garagem 01", "Relay 2"],
    badge: ["Online", "green"],
    actions: ["Acionar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Porta de serviço", "Somente administradores"],
    cols: ["Controladora Serviço 01", "Relay 1"],
    badge: ["Online", "green"],
    actions: ["Acionar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Portão da quadra", "Horário restrito: 06h às 22h"],
    cols: ["Controladora Lazer 01", "Relay 1"],
    badge: ["Offline", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Portão antigo do Bloco 3", "Desativado após a reforma"],
    cols: ["—", "—"],
    badge: ["Desativado", "gray"],
    actions: ["Histórico"],
  },
];

export default function Acionadores() {
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
        <h1>Acionadores</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo acionador
        </button>
      </div>
      <DependeDeEquipamento acoes="Acionar o portão, testar o relay e o indicador de online" />
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de acionadores">
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
              Câmeras
            </button>
            <button className="op-button small" onClick={inerte}>
              Dispositivos
            </button>
            <button className="op-button small" onClick={inerte}>
              Gatilhos
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em acionadores"
              placeholder="Buscar acionador ou dispositivo…"
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
        <Modal title="Novo acionador" onClose={() => setForm(false)}>
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
              <Field label="Dispositivo" name="dispositivo" />
              <Field label="Relay" name="relay">
                <option key="Relay 1">Relay 1</option>
                <option key="Relay 2">Relay 2</option>
                <option key="Relay 3">Relay 3</option>
                <option key="Relay 4">Relay 4</option>
              </Field>
              <Field label="Tipo" name="tipo">
                <option key="Pulso">Pulso</option>
                <option key="Retenção">Retenção</option>
              </Field>
              <Field label="Tempo de pulso (s)" name="pulso" />
            </div>

            <div className="op-checks">
              <Check label="Visível à portaria" name="portaria" checked={false} />
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

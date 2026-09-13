import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { DependeDeEquipamento } from "./Hardware";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Gatilho", "Evento", "Ação", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Abrir cancela na placa reconhecida", "Somente placas de moradores ativos"],
    cols: ["Placa reconhecida", "Acionar Cancela de Saída"],
    badge: ["Ativo", "green"],
    actions: ["Testar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Abrir portão social no facial liberado", "Atraso de 1 segundo"],
    cols: ["Facial liberado", "Acionar Portão social"],
    badge: ["Ativo", "green"],
    actions: ["Testar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Registrar ocorrência com portão aberto", "Dispara após 5 minutos"],
    cols: ["Portão aberto por tempo excedido", "Abrir ocorrência automática"],
    badge: ["Ativo", "green"],
    actions: ["Testar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Avisar a portaria em recusas seguidas", "Três recusas no mesmo equipamento"],
    cols: ["Acesso recusado três vezes", "Notificar a portaria"],
    badge: ["Ativo", "green"],
    actions: ["Testar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Sirene no botão de pânico", "Aciona também a gravação da câmera"],
    cols: ["Botão de pânico acionado", "Acionar sirene e gravar"],
    badge: ["Ativo", "green"],
    actions: ["Testar", "Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Luz da garagem por presença", "Substituído por sensor próprio"],
    cols: ["Presença na garagem", "Acionar iluminação"],
    badge: ["Inativo", "gray"],
    actions: ["Histórico"],
  },
];

export default function Gatilhos() {
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
        <h1>Gatilhos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo gatilho
        </button>
      </div>
      <DependeDeEquipamento acoes="O disparo automático das ações" />
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de gatilhos">
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
              Acionadores
            </button>
            <button className="op-button small" onClick={inerte}>
              Câmeras
            </button>
            <button className="op-button small" onClick={inerte}>
              Dispositivos
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em gatilhos"
              placeholder="Buscar gatilho ou evento…"
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
        <Modal title="Novo gatilho" onClose={() => setForm(false)}>
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
              <Field label="Evento" name="evento">
                <option key="Placa reconhecida">Placa reconhecida</option>
                <option key="Facial liberado">Facial liberado</option>
                <option key="Acesso recusado">Acesso recusado</option>
                <option key="Portão aberto por tempo excedido">
                  Portão aberto por tempo excedido
                </option>
                <option key="Botão de pânico acionado">Botão de pânico acionado</option>
              </Field>
              <Field label="Acionador" name="acionador">
                <option key="Portão social">Portão social</option>
                <option key="Portão da garagem">Portão da garagem</option>
                <option key="Cancela de saída">Cancela de saída</option>
                <option key="Sirene">Sirene</option>
              </Field>
              <Field label="Atraso (segundos)" name="atraso" />
            </div>
            <Field label="Observação" name="observacao" type="textarea" />
            <div className="op-checks">
              <Check label="Ativo" name="ativo" checked={false} />
              <Check label="Gravar câmera vinculada" name="gravar" checked={false} />
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

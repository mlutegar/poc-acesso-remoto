import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Câmera", "Servidor", "Canal", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Entrada social", "Exibida na portaria e na visita"],
    cols: ["Servidor P2P 01", "Canal 1"],
    badge: ["Online", "green"],
    actions: ["Ver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Garagem — entrada", "Exibida na portaria"],
    cols: ["Servidor P2P 01", "Canal 2"],
    badge: ["Online", "green"],
    actions: ["Ver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Garagem — saída", "Vinculada à cancela de saída"],
    cols: ["Servidor P2P 01", "Canal 3"],
    badge: ["Online", "green"],
    actions: ["Ver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Hall do Bloco 1", "Somente administradores"],
    cols: ["Servidor P2P 02", "Canal 1"],
    badge: ["Online", "green"],
    actions: ["Ver", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "",
    kind: "objeto",
    main: ["Portaria de serviço", "Sem prévia no aplicativo"],
    cols: ["Servidor P2P 02", "Canal 2"],
    badge: ["Offline", "red"],
    actions: ["Ver", "Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "",
    kind: "objeto",
    main: ["Playground", "Removida na reforma de 07/2026"],
    cols: ["—", "—"],
    badge: ["Inativa", "gray"],
    actions: ["Histórico"],
  },
];

export default function Cameras() {
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
        <h1>Câmeras</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova câmera
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de câmeras">
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
              Acionadores
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
              aria-label="Buscar em câmeras"
              placeholder="Buscar câmera ou servidor…"
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
        <Modal title="Nova câmera" onClose={() => setForm(false)}>
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
              <Field label="Servidor" name="servidor" />
              <Field label="Canal" name="canal" />
              <Field label="Marca" name="marca">
                <option key="Intelbras">Intelbras</option>
                <option key="Hikvision">Hikvision</option>
                <option key="Dahua">Dahua</option>
                <option key="Outra">Outra</option>
              </Field>
              <Field label="IP ou DDNS" name="ip" />
              <Field label="Porta" name="porta" />
              <Field label="Usuário" name="usuario" />
              <Field label="Senha" name="senha" type="password" />
              <Field label="Acionador vinculado" name="acionador">
                <option key="Nenhum">Nenhum</option>
                <option key="Portão social">Portão social</option>
                <option key="Portão da garagem">Portão da garagem</option>
                <option key="Cancela de saída">Cancela de saída</option>
              </Field>
            </div>

            <div className="op-checks">
              <Check label="Exibir na portaria" name="portaria" checked={false} />
              <Check label="Exibir no aplicativo" name="app" checked={false} />
              <Check label="Exibir na visita" name="visita" checked={false} />
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

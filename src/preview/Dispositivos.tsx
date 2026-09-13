import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { DependeDeEquipamento } from "./Hardware";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Dispositivo", "Endereço", "Último acesso", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    main: ["Facial Entrada Social", "ControlID Face · MAC 00:1B:44:11:3A:B7"],
    cols: ["192.168.10.21:8080", "13/09 09:31"],
    badge: ["Online", "green"],
    actions: ["Sincronizar", "Reiniciar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Leitora Garagem", "Controladora veicular · MAC 00:1B:44:11:3A:C2"],
    cols: ["192.168.10.22:8080", "13/09 09:28"],
    badge: ["Online", "green"],
    actions: ["Sincronizar", "Reiniciar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Cancela de Saída", "Controladora veicular · MAC 00:1B:44:11:3A:C9"],
    cols: ["192.168.10.23:8080", "13/09 09:05"],
    badge: ["Online", "green"],
    actions: ["Sincronizar", "Reiniciar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Leitora Serviço", "Leitora de proximidade · MAC 00:1B:44:11:3A:D4"],
    cols: ["192.168.10.24:8080", "12/09 18:40"],
    badge: ["Offline", "red"],
    actions: ["Sincronizar", "Reiniciar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    main: ["Servidor de câmeras P2P", "Concentrador de vídeo"],
    cols: ["192.168.10.30:9000", "13/09 09:30"],
    badge: ["Online", "green"],
    actions: ["Reiniciar", "Editar", "Histórico"],
  },
  {
    tab: "history",
    main: ["Leitora Bloco 3", "Removida na reforma de 07/2026"],
    cols: ["—", "—"],
    badge: ["Removido", "gray"],
    actions: ["Histórico"],
  },
];

export default function Dispositivos() {
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
        <h1>Dispositivos</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo dispositivo
        </button>
      </div>
      <DependeDeEquipamento acoes="Sincronizar, reiniciar e o indicador de online" />
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de dispositivos">
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
              Sincronizar todos
            </button>
            <button className="op-button small" onClick={inerte}>
              Rotas
            </button>
            <button className="op-button small" onClick={inerte}>
              Acionadores
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em dispositivos"
              placeholder="Buscar nome, MAC ou endereço…"
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
        <Modal title="Novo dispositivo" onClose={() => setForm(false)}>
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
              <Field label="Tipo" name="tipo">
                <option key="Facial">Facial</option>
                <option key="Leitora de proximidade">Leitora de proximidade</option>
                <option key="Controladora veicular">Controladora veicular</option>
                <option key="Concentrador de vídeo">Concentrador de vídeo</option>
              </Field>
              <Field label="Fabricante" name="fabricante" />
              <Field label="MAC" name="mac" />
              <Field label="IP ou DDNS" name="ip" />
              <Field label="Porta" name="porta" />
              <Field label="Rota" name="rota">
                <option key="Entrada social">Entrada social</option>
                <option key="Entrada e saída de veículos">Entrada e saída de veículos</option>
                <option key="Prestadores de serviço">Prestadores de serviço</option>
              </Field>
            </div>

            <div className="op-checks">
              <Check label="Ativo" name="ativo" checked={false} />
              <Check label="Sincronizar automaticamente" name="sync" checked={false} />
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

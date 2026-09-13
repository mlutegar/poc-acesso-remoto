import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo, PhotoField } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { DependeDeEquipamento } from "./Hardware";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Responsável", "Credencial", "Rota", "Validade", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "HV",
    kind: "pessoa",
    main: ["Helena Vasconcelos", "1 · 101 · proprietária"],
    cols: ["TAG veicular · 0A4F21C8", "Entrada e saída de veículos", "Sem validade"],
    badge: ["Ativa", "green"],
    actions: ["Copiar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "HV",
    kind: "pessoa",
    main: ["Helena Vasconcelos", "1 · 101 · proprietária"],
    cols: ["Facial · molde cadastrado", "Entrada social", "Sem validade"],
    badge: ["Ativa", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "WT",
    kind: "pessoa",
    main: ["Wagner Tavares", "2 · 101 · proprietário"],
    cols: ["Placa MHL5D72", "Entrada e saída de veículos", "Sem validade"],
    badge: ["Ativa", "green"],
    actions: ["Copiar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "RQ",
    kind: "pessoa",
    main: ["Rafael Quintela", "2 · 201 · inquilino"],
    cols: ["Cartão de proximidade · 77B10E", "Entrada social", "Até 31/03/2027"],
    badge: ["Ativa", "green"],
    actions: ["Copiar", "Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "CB",
    kind: "pessoa",
    main: ["Camila Bustamante", "3 · 102 · inquilina"],
    cols: ["Facial · aguardando cadastro", "Entrada social", "Até 30/06/2027"],
    badge: ["Pendente", "amber"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "EP",
    kind: "pessoa",
    main: ["Eduardo Peçanha", "3 · 101 · proprietário"],
    cols: ["Controle remoto · pânico", "Entrada e saída de veículos", "Sem validade"],
    badge: ["Pânico", "red"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "LP",
    kind: "pessoa",
    main: ["Leonardo Prado", "1 · 102 · ex-inquilino"],
    cols: ["Cartão de proximidade · 44C902", "Entrada social", "Vencida em 05/2026"],
    badge: ["Revogada", "gray"],
    actions: ["Histórico"],
  },
];

export default function Credenciais() {
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
        <h1>Credenciais de morador</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Nova credencial
        </button>
      </div>
      <DependeDeEquipamento acoes="Enviar a credencial ao equipamento, cadastrar o rosto e registrar a passagem" />
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de credenciais de morador">
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
              Cadastrar facial
            </button>
            <button className="op-button small" onClick={inerte}>
              Condôminos
            </button>
            <button className="op-button small" onClick={inerte}>
              Acessos
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em credenciais de morador"
              placeholder="Buscar responsável, serial ou placa…"
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
        <Modal title="Nova credencial" onClose={() => setForm(false)}>
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
              <Field label="Responsável" name="responsavel" />
              <Field label="Tipo" name="tipo">
                <option key="TAG veicular">TAG veicular</option>
                <option key="Cartão de proximidade">Cartão de proximidade</option>
                <option key="Controle remoto">Controle remoto</option>
                <option key="Placa">Placa</option>
                <option key="Facial">Facial</option>
              </Field>
              <Field label="Serial ou código" name="serial" />
              <Field label="Rota" name="rota">
                <option key="Entrada social">Entrada social</option>
                <option key="Entrada e saída de veículos">Entrada e saída de veículos</option>
                <option key="Prestadores de serviço">Prestadores de serviço</option>
              </Field>
              <Field label="Validade" name="validade" type="date" />
            </div>

            <div className="op-checks">
              <Check label="Credencial de pânico" name="panico" checked={false} />
              <Check label="Ativa" name="ativa" checked={false} />
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

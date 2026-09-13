import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo, PhotoField } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Funcionário", "Função / empresa", "Contato", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "CM",
    kind: "pessoa",
    main: ["Carlos Mendonça", "345.221.907-41 · matrícula 014"],
    cols: ["Porteiro · Condomínio", "(61) 99880-1140"],
    badge: ["Presente", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "DA",
    kind: "pessoa",
    main: ["Denise Alcântara", "711.408.663-29 · matrícula 021"],
    cols: ["Porteira · Condomínio", "(61) 99880-1141"],
    badge: ["Ausente", "gray"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "JV",
    kind: "pessoa",
    main: ["Josué Vieira", "502.913.774-08 · matrícula 007"],
    cols: ["Zelador · Condomínio", "(61) 99880-1142"],
    badge: ["Presente", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "MF",
    kind: "pessoa",
    main: ["Marta Figueiredo", "884.550.219-37"],
    cols: ["Limpeza · Clean Predial", "(61) 99771-3308"],
    badge: ["Presente", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "RB",
    kind: "pessoa",
    main: ["Ronaldo Braga", "167.339.482-55"],
    cols: ["Jardinagem · Verde Vivo", "(61) 99662-7714"],
    badge: ["Ausente", "gray"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "PS",
    kind: "pessoa",
    main: ["Paulo Seixas", "920.174.638-12"],
    cols: ["Porteiro · Condomínio", "(61) 99553-2201"],
    badge: ["Desligado", "gray"],
    actions: ["Histórico"],
  },
];

export default function Funcionarios() {
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
        <h1>Funcionários</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo funcionário
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de funcionários">
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
              Controle de acesso
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
              aria-label="Buscar em funcionários"
              placeholder="Buscar nome, função ou empresa…"
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
        <Modal title="Novo funcionário" onClose={() => setForm(false)}>
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
              <Field label="Nome completo" name="nome" />
              <Field label="RG" name="rg" />
              <Field label="CPF" name="cpf" />
              <Field label="Função" name="funcao" />
              <Field label="Empresa" name="empresa" />
              <Field label="E-mail" name="email" type="email" />
              <Field label="Telefone" name="telefone" type="tel" />
              <Field label="Rota de acesso" name="rota">
                <option key="Todas">Todas</option>
                <option key="Entrada de serviço">Entrada de serviço</option>
                <option key="Entrada social">Entrada social</option>
              </Field>
            </div>

            <div className="op-checks">
              <Check label="Avisar de visitas" name="visitas" checked={false} />
              <Check label="Avisar de correspondências" name="correio" checked={false} />
              <Check label="Exibir aos moradores" name="exibir" checked={false} />
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

import { useState } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { PAGE_SIZE, Feedback, Pagination, Tabs, useListParams } from "../operations/List";
import { Empty, Field, Modal } from "../operations/UI";
import { Check } from "../operations/UI";
import { AVISO, matches, type PreviewRow } from "./row";

const COLUNAS = ["Usuário", "Perfil", "Faixa horária", "Situação", "Ações"];

const LINHAS: PreviewRow[] = [
  {
    tab: "active",
    photo: "AD",
    kind: "pessoa",
    main: ["Administração", "adm.modelo · administrador"],
    cols: ["Administrador", "Sem restrição"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "CM",
    kind: "pessoa",
    main: ["Carlos Mendonça", "carlos.portaria"],
    cols: ["Portaria", "06:00 às 18:00"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "DA",
    kind: "pessoa",
    main: ["Denise Alcântara", "denise.portaria"],
    cols: ["Portaria", "18:00 às 06:00"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "WT",
    kind: "pessoa",
    main: ["Wagner Tavares", "sindico · conselho"],
    cols: ["Síndico", "Sem restrição"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "active",
    photo: "JV",
    kind: "pessoa",
    main: ["Josué Vieira", "zeladoria"],
    cols: ["Edição", "07:00 às 17:00"],
    badge: ["Ativo", "green"],
    actions: ["Editar", "Histórico"],
  },
  {
    tab: "history",
    photo: "RB",
    kind: "pessoa",
    main: ["Ronaldo Braga", "ronaldo.jardim"],
    cols: ["Portaria", "07:00 às 16:00"],
    badge: ["Inativo", "gray"],
    actions: ["Reativar", "Histórico"],
  },
];

export default function Usuarios() {
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
        <h1>Usuários</h1>
        <button className="op-button primary" onClick={() => setForm(true)}>
          <Icon name="plus" /> Novo usuário
        </button>
      </div>
      <Feedback notice={aviso} error="" onDismiss={() => setAviso("")} />
      <section className="op-panel" aria-label="Lista de usuários">
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
              Log de acessos
            </button>
          </div>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar em usuários"
              placeholder="Buscar nome ou login…"
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
        <Modal title="Novo usuário" onClose={() => setForm(false)}>
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
              <Field label="Login" name="login" />
              <Field label="Senha" name="senha" type="password" />
              <Field label="Perfil" name="perfil">
                <option key="Administrador">Administrador</option>
                <option key="Portaria">Portaria</option>
                <option key="Edição">Edição</option>
                <option key="Síndico">Síndico</option>
              </Field>
              <Field label="Início da faixa horária" name="de" type="time" />
              <Field label="Fim da faixa horária" name="ate" type="time" />
            </div>

            <div className="op-checks">
              <Check label="Administrador" name="admin" checked={false} />
              <Check label="Acesso à portaria" name="portaria" checked={false} />
              <Check label="Pode editar" name="edicao" checked={false} />
              <Check label="Ativo" name="ativo" checked={false} />
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

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Editor, type Edit } from "./Forms";
import { useOperations } from "./Store";
import {
  matchingPermit,
  normalize,
  permitValid,
  statusLabels,
  unitName,
  type CoreCollection,
  type Permit,
  type Resident,
  type Unit,
  type Visit,
} from "./model";
import { downloadCsv, Empty, formatDate, Modal } from "./UI";

const labels = {
  visits: "Visitas",
  residents: "Condôminos",
  units: "Residências",
  permits: "Pré-autorizações",
};
const createLabels = {
  visits: "Nova visita",
  residents: "Novo condômino",
  units: "Nova residência",
  permits: "Nova pré-autorização",
};
type Action = { visit: Visit; kind: "authorize" | "permit" | "enter" | "deny" | "finish" };
export default function Operations({ kind }: { kind: CoreCollection }) {
  const { data, error: storageError, act } = useOperations();
  const [, refreshClock] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => refreshClock((n) => n + 1), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const [params, setParams] = useSearchParams();
  const [edit, setEdit] = useState<Edit | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const query = params.get("q") || "";
  const tab = params.get("tab") || "active";
  const unitFilter = params.get("unit") || "";
  const status = params.get("status") || "";
  const update = (name: string, value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (name === "tab") next.delete("status");
        value ? next.set(name, value) : next.delete(name);
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  const residentFor = (v: Visit | Permit) => data.residents.find((r) => r.id === v.residentId);
  const home = (r?: Resident) => data.units.find((u) => u.id === r?.unitId);
  const activeVisits = data.visits.filter((v) =>
    ["pendente", "autorizada", "presente"].includes(v.status)
  );
  const source = data[kind] as (Unit | Resident | Permit | Visit)[];
  const visible = source
    .filter((row) => {
      const isVisit = "status" in row;
      const active = isVisit
        ? ["pendente", "autorizada", "presente"].includes(row.status)
        : row.active;
      if (tab !== "all" && active !== (tab === "active")) return false;
      if (status && isVisit && row.status !== status) return false;
      const r = "residentId" in row ? residentFor(row) : "unitId" in row ? row : undefined;
      const u = "block" in row ? row : home(r);
      if (unitFilter && u?.id !== unitFilter) return false;
      if (
        kind === "units" &&
        status === "occupied" &&
        !data.residents.some((r) => r.unitId === row.id && r.active)
      )
        return false;
      if (
        kind === "units" &&
        status === "empty" &&
        data.residents.some((r) => r.unitId === row.id && r.active)
      )
        return false;
      if (kind === "units" && status === "rented" && !(row as Unit).rented) return false;
      if (kind === "residents" && status === "owner" && !(row as Resident).owner) return false;
      if (kind === "residents" && status === "principal" && !(row as Resident).principal)
        return false;
      if (kind === "permits" && status === "valid" && !permitValid(row as Permit)) return false;
      return normalize(
        [
          ...Object.values(row).filter((v) => typeof v === "string"),
          r?.name || "",
          unitName(u),
        ].join(" ")
      ).includes(normalize(query));
    })
    .reverse();
  const page = Math.min(
    Math.max(1, Number(params.get("page")) || 1),
    Math.max(1, Math.ceil(visible.length / 15))
  );
  const pageRows = visible.slice((page - 1) * 15, page * 15);
  const badge = (active: boolean) => (
    <span className={`op-badge ${active ? "green" : "gray"}`}>{active ? "Ativo" : "Inativo"}</span>
  );
  const exportRows = () => {
    let rows: string[][];
    if (kind === "units")
      rows = [
        ["Bloco", "Número", "Telefone", "Interfone", "Ativa"],
        ...(visible as Unit[]).map((u) => [
          u.block,
          u.number,
          u.phone,
          u.intercom,
          u.active ? "Sim" : "Não",
        ]),
      ];
    else if (kind === "residents")
      rows = [
        ["Nome", "Documento", "Residência", "Telefone", "Email", "Placa", "Ativo"],
        ...(visible as Resident[]).map((r) => [
          r.name,
          r.document,
          unitName(home(r)),
          r.phone,
          r.email,
          r.plate,
          r.active ? "Sim" : "Não",
        ]),
      ];
    else if (kind === "visits")
      rows = [
        [
          "Visitante",
          "Documento",
          "Responsável",
          "Residência",
          "Objetivo",
          "Situação",
          "Entrada",
          "Saída",
        ],
        ...(visible as Visit[]).map((v) => [
          v.name,
          v.document,
          residentFor(v)?.name || "",
          unitName(home(residentFor(v))),
          v.purpose,
          statusLabels[v.status],
          formatDate(v.entryAt),
          formatDate(v.exitAt),
        ]),
      ];
    else
      rows = [
        ["Visitante", "Documento", "Responsável", "Início", "Fim", "Horário", "Ativa"],
        ...(visible as Permit[]).map((p) => [
          p.name,
          p.document,
          residentFor(p)?.name || "",
          p.start,
          p.end,
          `${p.from}–${p.until}`,
          p.active ? "Sim" : "Não",
        ]),
      ];
    downloadCsv(`${kind}.csv`, rows);
    setNotice(`${visible.length} registro(s) exportado(s), respeitando os filtros.`);
  };
  const editButton = (row: Unit | Resident | Permit | Visit) => (
    <button className="op-text-button" onClick={() => setEdit({ kind, item: row })}>
      Editar
    </button>
  );
  const historyButton = (id: string) => (
    <button className="op-text-button" onClick={() => setSelected(id)}>
      Histórico
    </button>
  );
  return (
    <main className="op-main">
      <div className="op-breadcrumb">
        CONDOMÍNIO MODELO <span>/</span> PORTARIA <span>/</span> {labels[kind].toUpperCase()}
      </div>
      <div className="op-page-heading">
        <div>
          <h1>{labels[kind]}</h1>
          <p>
            {kind === "visits"
              ? "Acompanhe quem chega, quem está no condomínio e quem já saiu."
              : kind === "permits"
                ? "Organize os acessos previstos por responsável, dia e horário."
                : "Cadastros e vínculos para uma portaria organizada."}
          </p>
        </div>
        <button className="op-button primary" onClick={() => setEdit({ kind })}>
          ＋ {createLabels[kind]}
        </button>
      </div>
      {kind === "visits" && (
        <div className="op-stats">
          {[
            ["Em andamento", activeVisits.length, "navy"],
            ["Aguardando", data.visits.filter((v) => v.status === "pendente").length, "amber"],
            ["No condomínio", data.visits.filter((v) => v.status === "presente").length, "green"],
            [
              "Pré-autorizadas agora",
              data.permits.filter(
                (p) =>
                  permitValid(p) && data.residents.some((r) => r.id === p.residentId && r.active)
              ).length,
              "blue",
            ],
          ].map(([label, value, color]) => (
            <div className="op-stat" key={label}>
              <span>{label}</span>
              <strong className={`text-${color}`}>{value}</strong>
              <small>
                {label === "Pré-autorizadas agora"
                  ? "Horário de Brasília"
                  : "Registros desta demonstração"}
              </small>
            </div>
          ))}
        </div>
      )}
      {storageError && (
        <p role="alert" className="op-error">
          {storageError}
        </p>
      )}
      {notice && (
        <div role="status" className="op-notice">
          {notice}
          <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      <section className="op-panel" aria-label={`Lista de ${labels[kind].toLowerCase()}`}>
        <div className="op-panel-top">
          <div className="op-tabs" aria-label="Situação do cadastro">
            {[
              ["active", "Ativos"],
              ["history", "Histórico"],
              ["all", "Todos"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={tab === value}
                className={tab === value ? "selected" : ""}
                onClick={() => {
                  update("tab", value);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="op-button small" onClick={exportRows}>
            ↓ Exportar CSV
          </button>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>⌕</span>
            <input
              aria-label="Buscar registros"
              placeholder={
                kind === "units"
                  ? "Buscar bloco, número, telefone…"
                  : "Buscar nome, documento, placa, residência…"
              }
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          {kind !== "units" && (
            <select
              aria-label="Filtrar por residência"
              value={unitFilter}
              onChange={(e) => update("unit", e.target.value)}
            >
              <option value="">Todas as residências</option>
              {data.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {unitName(u)}
                </option>
              ))}
            </select>
          )}
          <select
            aria-label="Filtro adicional"
            value={status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">Todas as situações</option>
            {(kind === "visits"
              ? Object.entries(statusLabels)
              : kind === "units"
                ? [
                    ["occupied", "Habitadas"],
                    ["empty", "Vazias"],
                    ["rented", "Alugadas"],
                  ]
                : kind === "residents"
                  ? [
                      ["owner", "Proprietários"],
                      ["principal", "Responsáveis principais"],
                    ]
                  : [["valid", "Válidas agora"]]
            ).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          {(query || status || unitFilter) && (
            <button className="op-text-button" onClick={() => setParams({ tab })}>
              Limpar filtros
            </button>
          )}
        </div>
        {visible.length === 0 ? (
          <Empty
            text={
              source.length
                ? "Altere os filtros ou cadastre um novo registro."
                : `Comece em “${createLabels[kind]}”.`
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {(kind === "units"
                    ? ["Residência", "Contato", "Condôminos", "Situação", "Ações"]
                    : kind === "residents"
                      ? ["Condômino", "Residência", "Contato / veículo", "Situação", "Ações"]
                      : kind === "permits"
                        ? ["Visitante", "Destino / responsável", "Validade", "Situação", "Ações"]
                        : [
                            "Visita",
                            "Destino / responsável",
                            "Entrada / saída",
                            "Situação",
                            "Ações",
                          ]
                  ).map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => {
                  if (kind === "units") {
                    const u = row as Unit;
                    const count = data.residents.filter(
                      (r) => r.unitId === u.id && r.active
                    ).length;
                    return (
                      <tr key={u.id}>
                        <td>
                          <strong>{unitName(u)}</strong>
                          <small>
                            {u.rented ? "Alugada" : "Própria"} · {count ? "Habitada" : "Vazia"}
                          </small>
                        </td>
                        <td>
                          {u.phone || "Sem telefone"}
                          <small>Interfone {u.intercom || "—"}</small>
                        </td>
                        <td>
                          <Link className="op-text-button" to={`/condominos?unit=${u.id}`}>
                            {count} condômino(s) →
                          </Link>
                        </td>
                        <td>{badge(u.active)}</td>
                        <td>
                          <div className="op-actions">
                            {editButton(u)}
                            {historyButton(u.id)}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  if (kind === "residents") {
                    const r = row as Resident;
                    return (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.name}</strong>
                          <small>
                            {r.document} · {r.principal ? "Principal" : r.relationship}
                          </small>
                        </td>
                        <td>
                          {unitName(home(r))}
                          <small>{r.owner ? "Proprietário" : "Morador"}</small>
                        </td>
                        <td>
                          {r.phone || "Sem telefone"}
                          <small>
                            {r.plate ? `${r.plate} · ${r.vehicle}` : r.email || "Sem veículo"}
                          </small>
                        </td>
                        <td>{badge(r.active)}</td>
                        <td>
                          <div className="op-actions">
                            {editButton(r)}
                            {historyButton(r.id)}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  if (kind === "permits") {
                    const p = row as Permit;
                    return (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          <small>
                            {p.document} {p.company && `· ${p.company}`}
                          </small>
                        </td>
                        <td>
                          {unitName(home(residentFor(p)))}
                          <small>{residentFor(p)?.name}</small>
                        </td>
                        <td>
                          {p.start.split("-").reverse().join("/")} →{" "}
                          {p.end.split("-").reverse().join("/")}
                          <small>
                            {p.from}–{p.until} ·{" "}
                            {p.days
                              .map((d) => ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d])
                              .join(", ")}
                          </small>
                        </td>
                        <td>
                          <span className={`op-badge ${permitValid(p) ? "green" : "gray"}`}>
                            {!p.active
                              ? "Inativa"
                              : permitValid(p)
                                ? "Válida agora"
                                : "Fora da validade"}
                          </span>
                        </td>
                        <td>
                          <div className="op-actions">
                            {editButton(p)}
                            {historyButton(p.id)}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  const v = row as Visit;
                  return (
                    <tr key={v.id}>
                      <td>
                        <strong>{v.name}</strong>
                        <small>
                          {v.document} {v.plate && `· ${v.plate}`}
                        </small>
                        <small>{v.purpose}</small>
                      </td>
                      <td>
                        {unitName(home(residentFor(v)))}
                        <small>{residentFor(v)?.name}</small>
                      </td>
                      <td>
                        {formatDate(v.entryAt)}
                        <small>Saída: {formatDate(v.exitAt)}</small>
                      </td>
                      <td>
                        <span
                          className={`op-badge ${v.status === "pendente" ? "amber" : v.status === "negada" ? "red" : v.status === "finalizada" ? "gray" : "green"}`}
                        >
                          {statusLabels[v.status]}
                        </span>
                        {v.permitId && <small>Via pré-autorização</small>}
                      </td>
                      <td>
                        <div className="op-actions">
                          {v.status === "pendente" && (
                            <>
                              <button
                                className="op-text-button"
                                onClick={() => setAction({ visit: v, kind: "authorize" })}
                              >
                                Autorizar
                              </button>
                              {matchingPermit(data, v) && (
                                <button
                                  className="op-text-button"
                                  onClick={() => setAction({ visit: v, kind: "permit" })}
                                >
                                  Usar pré-autorização
                                </button>
                              )}
                              {editButton(v)}
                            </>
                          )}
                          {v.status === "autorizada" && (
                            <button
                              className="op-text-button"
                              onClick={() => setAction({ visit: v, kind: "enter" })}
                            >
                              Registrar entrada
                            </button>
                          )}
                          {["pendente", "autorizada"].includes(v.status) && (
                            <button
                              className="op-text-button danger"
                              onClick={() => setAction({ visit: v, kind: "deny" })}
                            >
                              Negar
                            </button>
                          )}
                          {v.status === "presente" && (
                            <button
                              className="op-text-button"
                              onClick={() => setAction({ visit: v, kind: "finish" })}
                            >
                              Registrar saída
                            </button>
                          )}
                          {historyButton(v.id)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <footer className="op-list-footer">
          <span>
            {visible.length} registro(s) · página {page} de{" "}
            {Math.max(1, Math.ceil(visible.length / 15))}
          </span>
          <div>
            <button
              className="op-button small"
              disabled={page <= 1}
              onClick={() =>
                setParams((p) => {
                  p.set("page", String(page - 1));
                  return p;
                })
              }
            >
              Anterior
            </button>
            <button
              className="op-button small"
              disabled={page * 15 >= visible.length}
              onClick={() =>
                setParams((p) => {
                  p.set("page", String(page + 1));
                  return p;
                })
              }
            >
              Próxima
            </button>
          </div>
        </footer>
      </section>
      <p className="op-footnote">
        Demonstração local · Os registros não acionam equipamentos nem enviam notificações.
      </p>
      {edit && (
        <Editor
          edit={edit}
          onClose={() => setEdit(null)}
          onSaved={() => {
            setEdit(null);
            setNotice("Cadastro salvo neste navegador.");
          }}
        />
      )}
      {selected && (
        <Modal title="Histórico do registro" onClose={() => setSelected(null)}>
          <div className="op-form">
            <p className="op-muted">Horário de Brasília · alterações desta demonstração</p>
            {data.logs.filter((l) => l.entityId === selected).length ? (
              <ol className="op-timeline">
                {data.logs
                  .filter((l) => l.entityId === selected)
                  .map((l) => (
                    <li key={l.id}>
                      <strong>{l.message}</strong>
                      <small>
                        {formatDate(l.at)} · {l.actor}
                      </small>
                    </li>
                  ))}
              </ol>
            ) : (
              <Empty text="Este cadastro de exemplo ainda não recebeu alterações." />
            )}
            <button className="op-button" onClick={() => setSelected(null)}>
              Fechar
            </button>
          </div>
        </Modal>
      )}
      {action && (
        <Modal
          title={
            {
              authorize: "Confirmar autorização",
              permit: "Usar pré-autorização",
              enter: "Registrar entrada",
              deny: "Negar acesso",
              finish: "Registrar saída",
            }[action.kind]
          }
          onClose={() => {
            setAction(null);
            setError("");
          }}
        >
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                act(
                  action.visit.id,
                  action.kind,
                  String(new FormData(e.currentTarget).get("reason") || "")
                );
                setAction(null);
                setError("");
                setNotice("Situação da visita atualizada.");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <p>
              <strong>{action.visit.name}</strong> · {unitName(home(residentFor(action.visit)))}
            </p>
            <p className="op-muted">
              {action.kind === "enter"
                ? "Registra o horário de entrada nesta demonstração; não abre portões."
                : action.kind === "permit"
                  ? "Documento, responsável, período, dia e horário serão verificados novamente."
                  : action.kind === "finish"
                    ? "Registra a saída e move a visita para o histórico."
                    : "Esta confirmação ficará registrada no histórico da visita."}
            </p>
            {["authorize", "deny"].includes(action.kind) && (
              <label className="op-field">
                <span>
                  {action.kind === "deny" ? "Motivo da negativa" : "Como o responsável autorizou?"}{" "}
                  *
                </span>
                <textarea name="reason" required maxLength={1000} rows={3} />
              </label>
            )}
            {error && (
              <p role="alert" className="op-error">
                {error}
              </p>
            )}
            <footer className="op-form-footer">
              <button
                type="button"
                className="op-button"
                onClick={() => {
                  setAction(null);
                  setError("");
                }}
              >
                Cancelar
              </button>
              <button className="op-button primary" type="submit">
                Confirmar
              </button>
            </footer>
          </form>
        </Modal>
      )}
    </main>
  );
}

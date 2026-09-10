import { useEffect, useState, type FormEvent } from "react";
import { Feedback, History, Pagination, Tabs, useListParams, PAGE_SIZE } from "./List";
import { Icon } from "../components/Icons";
import { useOperations } from "./Store";
import {
  audienceLabels,
  localClock,
  noticeLabels,
  noticeState,
  normalize,
  recipients,
  unitName,
  type Notice,
  type NoticeAudience,
} from "./model";
import { Check, downloadCsv, Empty, Field, formatDate, Modal } from "./UI";

export default function Notices() {
  const { data, error: storageError, save, actNotice } = useOperations();
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [, refreshClock] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => refreshClock((n) => n + 1), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const [edit, setEdit] = useState<{ item?: Notice } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const clock = localClock();
  const current = preview ? data.notices.find((n) => n.id === preview) : null;
  const unitFor = (n: Notice) => data.units.find((u) => u.id === n.unitId);
  const destination = (n: Notice) =>
    n.audience === "unidade" ? unitName(unitFor(n)) : audienceLabels[n.audience];

  const visible = data.notices
    .filter((n) => {
      const state = noticeState(n);
      if (tab === "active" && state !== "ativo") return false;
      if (tab === "scheduled" && state !== "agendado") return false;
      if (tab === "history" && state !== "finalizado") return false;
      if (filter && n.audience !== filter) return false;
      return normalize([n.subject, n.body, destination(n)].join(" ")).includes(normalize(query));
    })
    .reverse();
  const page = pageOf(visible.length);
  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportRows = () => {
    downloadCsv("comunicados.csv", [
      ["Assunto", "Destino", "Destinatários", "Disparo", "Finalização", "Situação", "Email", "App"],
      ...visible.map((n) => [
        n.subject,
        destination(n),
        String(recipients(data, n).length),
        `${n.start} ${n.startTime}`,
        n.end ? `${n.end} ${n.endTime}` : "",
        noticeLabels[noticeState(n)],
        n.email ? "Sim" : "Não",
        n.push ? "Sim" : "Não",
      ]),
    ]);
    setNotice(`${visible.length} registro(s) exportado(s), respeitando os filtros.`);
  };

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (name: string) => String(f.get(name) || "").trim();
    const item = edit?.item;
    try {
      save("notices", {
        id: item?.id || crypto.randomUUID(),
        subject: s("subject"),
        body: s("body"),
        audience: s("audience") as NoticeAudience,
        unitId: s("audience") === "unidade" ? s("unitId") : "",
        attachment: s("attachment"),
        start: s("start"),
        startTime: s("startTime"),
        end: s("end"),
        endTime: s("end") ? s("endTime") || "23:59" : "",
        email: f.has("email"),
        push: f.has("push"),
        tenants: f.has("tenants"),
        finished: item?.finished || false,
        createdAt: item?.createdAt || new Date().toISOString(),
      } satisfies Notice);
      setEdit(null);
      setError("");
      setNotice("Comunicado salvo neste navegador.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function run(id: string, action: "finish" | "reopen") {
    try {
      actNotice(id, action);
      setNotice("Comunicado atualizado.");
    } catch (e) {
      setNotice("");
      setError((e as Error).message);
      window.setTimeout(() => setError(""), 6000);
    }
  }

  return (
    <main className="op-main">
      <div className="op-page-heading">
        <div>
          <h1>Comunicados</h1>
          <p>Programe o que será publicado, para quem vale e quando deixa de valer.</p>
        </div>
        <button className="op-button primary" onClick={() => setEdit({})}>
          <Icon name="plus" /> Novo comunicado
        </button>
      </div>
      <Feedback notice={notice} error={storageError || error} onDismiss={() => setNotice("")} />
      <section className="op-panel" aria-label="Lista de comunicados">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativos"],
              ["scheduled", "Agendados"],
              ["history", "Histórico"],
              ["all", "Todos"],
            ]}
            onSelect={(value) => update("tab", value)}
          />
          <button className="op-button small" onClick={exportRows}>
            <Icon name="download" /> Exportar CSV
          </button>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar comunicados"
              placeholder="Buscar assunto, texto, destino…"
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por destino"
            value={filter}
            onChange={(e) => update("filter", e.target.value)}
          >
            <option value="">Todos os destinos</option>
            {Object.entries(audienceLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {(query || filter) && (
            <button className="op-text-button" onClick={clear}>
              Limpar filtros
            </button>
          )}
        </div>
        {visible.length === 0 ? (
          <Empty
            text={
              data.notices.length
                ? "Altere os filtros ou programe um novo comunicado."
                : "Comece em “Novo comunicado”."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {["Comunicado", "Destino", "Período", "Situação", "Ações"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((n) => {
                  const state = noticeState(n);
                  return (
                    <tr key={n.id}>
                      <td>
                        <strong>{n.subject}</strong>
                        <small>
                          {n.email ? "Email" : "Sem email"} ·{" "}
                          {n.push ? "Notificação no app" : "Sem notificação"}
                        </small>
                        {n.attachment && <small>Anexo: {n.attachment}</small>}
                      </td>
                      <td>
                        {destination(n)}
                        <small>
                          {recipients(data, n).length} condômino(s) ·{" "}
                          {n.tenants ? "inclui inquilinos" : "sem inquilinos"}
                        </small>
                      </td>
                      <td>
                        {n.start.split("-").reverse().join("/")} {n.startTime}
                        <small>
                          {n.end
                            ? `até ${n.end.split("-").reverse().join("/")} ${n.endTime}`
                            : "Sem finalização programada"}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`op-badge ${
                            state === "ativo" ? "green" : state === "agendado" ? "amber" : "gray"
                          }`}
                        >
                          {noticeLabels[state]}
                        </span>
                        {n.finished && <small>Finalizado manualmente</small>}
                      </td>
                      <td>
                        <div className="op-actions">
                          <button className="op-text-button" onClick={() => setPreview(n.id)}>
                            Ver texto
                          </button>
                          {state !== "finalizado" && (
                            <button className="op-text-button" onClick={() => setEdit({ item: n })}>
                              Editar
                            </button>
                          )}
                          {state === "finalizado" ? (
                            n.finished && (
                              <button
                                className="op-text-button"
                                onClick={() => run(n.id, "reopen")}
                              >
                                Reabrir
                              </button>
                            )
                          ) : (
                            <button
                              className="op-text-button danger"
                              onClick={() => run(n.id, "finish")}
                            >
                              Finalizar
                            </button>
                          )}
                          <button className="op-text-button" onClick={() => setSelected(n.id)}>
                            Histórico
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={visible.length} page={page} onGo={goTo} />
      </section>
      {edit && (
        <Modal
          title={edit.item ? "Editar comunicado" : "Novo comunicado"}
          onClose={() => {
            setEdit(null);
            setError("");
          }}
        >
          <form className="op-form" onSubmit={submit}>
            <Field label="Assunto" name="subject" value={edit.item?.subject} required />
            <Field label="Texto" name="body" type="textarea" value={edit.item?.body} />
            <div className="op-form-grid">
              <Field
                label="Destino"
                name="audience"
                value={edit.item?.audience || "todos"}
                required
              >
                {Object.entries(audienceLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <Field label="Residência do destino" name="unitId" value={edit.item?.unitId}>
                <option value="">Selecione</option>
                {data.units
                  .filter((u) => u.active)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {unitName(u)}
                    </option>
                  ))}
              </Field>
              <Field
                label="Data do disparo"
                name="start"
                type="date"
                value={edit.item?.start || clock.date}
                required
              />
              <Field
                label="Hora do disparo"
                name="startTime"
                type="time"
                value={edit.item?.startTime || clock.time}
                required
              />
              <Field label="Data de finalização" name="end" type="date" value={edit.item?.end} />
              <Field
                label="Hora de finalização"
                name="endTime"
                type="time"
                value={edit.item?.endTime}
              />
              <Field
                label="Anexo (nome do arquivo)"
                name="attachment"
                value={edit.item?.attachment}
              />
            </div>
            <div className="op-checks">
              <Check label="Enviar email (simulado)" name="email" checked={!!edit.item?.email} />
              <Check label="Notificar no app (simulado)" name="push" checked={!!edit.item?.push} />
              <Check
                label="Visível também a inquilinos"
                name="tenants"
                checked={edit.item ? edit.item.tenants : true}
              />
            </div>
            <p className="op-hint">
              A residência do destino só é usada quando o destino é “Uma residência”. Deixe a
              finalização em branco para o comunicado ficar ativo até você finalizá-lo.
            </p>
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
                  setEdit(null);
                  setError("");
                }}
              >
                Cancelar
              </button>
              <button className="op-button primary" type="submit">
                Salvar
              </button>
            </footer>
          </form>
        </Modal>
      )}
      {current && (
        <Modal title={current.subject} onClose={() => setPreview(null)}>
          <div className="op-form">
            <p className="op-muted">
              {destination(current)} · {recipients(data, current).length} condômino(s) ·{" "}
              {noticeLabels[noticeState(current)]}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{current.body}</p>
            {current.attachment && <p className="op-hint">Anexo: {current.attachment}</p>}
            <p className="op-hint">Criado em {formatDate(current.createdAt)}.</p>
            <button className="op-button" onClick={() => setPreview(null)}>
              Fechar
            </button>
          </div>
        </Modal>
      )}
      {selected && <History id={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

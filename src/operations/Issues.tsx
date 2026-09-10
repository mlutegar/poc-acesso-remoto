import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Feedback, History, Pagination, Tabs, useListParams, PAGE_SIZE } from "./List";
import { useOperations } from "./Store";
import { issueLabels, normalize, unitName, type Issue, type Resident } from "./model";
import { Check, downloadCsv, Empty, Field, formatDate, Modal } from "./UI";

const kinds = ["Manutenção", "Segurança", "Convivência", "Limpeza", "Portaria", "Outros"];
type Action = { item: Issue; kind: "reply" | "close" };

export default function Issues() {
  const { data, error: storageError, save, actIssue } = useOperations();
  const { user } = useAuth();
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [edit, setEdit] = useState<{ item?: Issue } | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [thread, setThread] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const residentFor = (i: Issue) => data.residents.find((r) => r.id === i.residentId);
  const home = (r?: Resident) => data.units.find((u) => u.id === r?.unitId);
  const activeResidents = data.residents.filter(
    (r) => r.active && data.units.some((u) => u.id === r.unitId && u.active)
  );
  const current = thread ? data.issues.find((i) => i.id === thread) : null;

  const visible = data.issues
    .filter((i) => {
      const open = i.status === "aberta";
      if (tab === "pinned" && !(i.pinned && open)) return false;
      if (tab === "active" && !open) return false;
      if (tab === "history" && open) return false;
      if (filter && i.kind !== filter) return false;
      const r = residentFor(i);
      return normalize(
        [i.description, i.kind, i.place, i.reporter, r?.name || "", unitName(home(r))].join(" ")
      ).includes(normalize(query));
    })
    .reverse()
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  const page = pageOf(visible.length);
  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportRows = () => {
    downloadCsv("ocorrencias.csv", [
      [
        "Tipo",
        "Descrição",
        "Local",
        "Condômino",
        "Residência",
        "Registrada por",
        "Situação",
        "Respostas",
        "Abertura",
        "Encerramento",
      ],
      ...visible.map((i) => [
        i.kind,
        i.description,
        i.place,
        residentFor(i)?.name || "",
        i.residentId ? unitName(home(residentFor(i))) : "",
        i.reporter,
        issueLabels[i.status],
        String(i.replies.length),
        formatDate(i.createdAt),
        formatDate(i.closedAt),
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
      save("issues", {
        id: item?.id || crypto.randomUUID(),
        kind: s("kind"),
        description: s("description"),
        place: s("place"),
        residentId: s("residentId"),
        reporter: s("reporter"),
        shared: f.has("shared"),
        pinned: f.has("pinned"),
        notify: f.has("notify"),
        attachment: s("attachment"),
        status: item?.status || "aberta",
        createdAt: item?.createdAt || new Date().toISOString(),
        closedAt: item?.closedAt || "",
        replies: item?.replies || [],
      } satisfies Issue);
      setEdit(null);
      setError("");
      setNotice("Ocorrência salva neste navegador.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function run(id: string, kind: "reply" | "close" | "pin" | "unpin", text: string) {
    try {
      actIssue(id, kind, text);
      setAction(null);
      setError("");
      setNotice("Ocorrência atualizada.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="op-main">
      <div className="op-breadcrumb">
        CONDOMÍNIO MODELO <span>/</span> PORTARIA <span>/</span> OCORRÊNCIAS
      </div>
      <div className="op-page-heading">
        <div>
          <h1>Ocorrências</h1>
          <p>
            Registre o que aconteceu no turno, acompanhe as respostas e encerre com um desfecho.
          </p>
        </div>
        <button className="op-button primary" onClick={() => setEdit({})}>
          ＋ Nova ocorrência
        </button>
      </div>
      <div className="op-stats">
        {[
          ["Abertas", data.issues.filter((i) => i.status === "aberta").length, "navy"],
          ["Fixadas", data.issues.filter((i) => i.pinned && i.status === "aberta").length, "amber"],
          ["Encerradas", data.issues.filter((i) => i.status === "encerrada").length, "green"],
        ].map(([label, value, color]) => (
          <div className="op-stat" key={label}>
            <span>{label}</span>
            <strong className={`text-${color}`}>{value}</strong>
            <small>Registros desta demonstração</small>
          </div>
        ))}
      </div>
      <Feedback notice={notice} error={storageError} onDismiss={() => setNotice("")} />
      <section className="op-panel" aria-label="Lista de ocorrências">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativas"],
              ["pinned", "Fixadas"],
              ["history", "Histórico"],
              ["all", "Todas"],
            ]}
            onSelect={(value) => update("tab", value)}
          />
          <button className="op-button small" onClick={exportRows}>
            ↓ Exportar CSV
          </button>
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>⌕</span>
            <input
              aria-label="Buscar ocorrências"
              placeholder="Buscar descrição, local, condômino…"
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por tipo"
            value={filter}
            onChange={(e) => update("filter", e.target.value)}
          >
            <option value="">Todos os tipos</option>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
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
              data.issues.length
                ? "Altere os filtros ou registre uma nova ocorrência."
                : "Comece em “Nova ocorrência”."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {["Ocorrência", "Local / envolvido", "Abertura", "Situação", "Ações"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <strong>
                        {i.pinned && i.status === "aberta" ? "📌 " : ""}
                        {i.description}
                      </strong>
                      <small>
                        {i.kind} · registrada por {i.reporter}
                      </small>
                      {i.attachment && <small>Anexo: {i.attachment}</small>}
                    </td>
                    <td>
                      {i.place || "Sem local informado"}
                      <small>
                        {i.residentId
                          ? `${residentFor(i)?.name} · ${unitName(home(residentFor(i)))}`
                          : "Sem condômino vinculado"}
                      </small>
                    </td>
                    <td>
                      {formatDate(i.createdAt)}
                      <small>
                        {i.status === "encerrada"
                          ? `Encerrada: ${formatDate(i.closedAt)}`
                          : i.shared
                            ? "Visível aos condôminos"
                            : "Interna da portaria"}
                      </small>
                    </td>
                    <td>
                      <span className={`op-badge ${i.status === "aberta" ? "amber" : "gray"}`}>
                        {issueLabels[i.status]}
                      </span>
                      <small>{i.replies.length} resposta(s)</small>
                    </td>
                    <td>
                      <div className="op-actions">
                        <button className="op-text-button" onClick={() => setThread(i.id)}>
                          Respostas
                        </button>
                        {i.status === "aberta" && (
                          <>
                            <button
                              className="op-text-button"
                              onClick={() => run(i.id, i.pinned ? "unpin" : "pin", "")}
                            >
                              {i.pinned ? "Desafixar" : "Fixar"}
                            </button>
                            <button className="op-text-button" onClick={() => setEdit({ item: i })}>
                              Editar
                            </button>
                            <button
                              className="op-text-button danger"
                              onClick={() => setAction({ item: i, kind: "close" })}
                            >
                              Encerrar
                            </button>
                          </>
                        )}
                        <button className="op-text-button" onClick={() => setSelected(i.id)}>
                          Histórico
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={visible.length} page={page} onGo={goTo} />
      </section>
      <p className="op-footnote">
        Demonstração local · Notificar síndico e funcionários fica registrado, mas nada é enviado.
      </p>
      {edit && (
        <Modal
          title={edit.item ? "Editar ocorrência" : "Nova ocorrência"}
          onClose={() => {
            setEdit(null);
            setError("");
          }}
        >
          <form className="op-form" onSubmit={submit}>
            <div className="op-form-grid">
              <Field label="Tipo" name="kind" value={edit.item?.kind || kinds[0]} required>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Field>
              <Field label="Local" name="place" value={edit.item?.place} />
              <Field
                label="Registrada por"
                name="reporter"
                value={edit.item?.reporter || user || ""}
                required
              />
              <Field
                label="Anexo (nome do arquivo)"
                name="attachment"
                value={edit.item?.attachment}
              />
              <Field label="Condômino envolvido" name="residentId" value={edit.item?.residentId}>
                <option value="">Nenhum</option>
                {activeResidents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {unitName(home(r))}
                  </option>
                ))}
              </Field>
            </div>
            <Field
              label="Descrição"
              name="description"
              type="textarea"
              value={edit.item?.description}
            />
            <div className="op-checks">
              <Check label="Visível aos condôminos" name="shared" checked={!!edit.item?.shared} />
              <Check label="Fixar no topo" name="pinned" checked={!!edit.item?.pinned} />
              <Check
                label="Notificar síndico e funcionários (simulado)"
                name="notify"
                checked={!!edit.item?.notify}
              />
            </div>
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
        <Modal
          title="Respostas da ocorrência"
          onClose={() => {
            setThread(null);
            setError("");
          }}
        >
          <div className="op-form">
            <p>
              <strong>{current.description}</strong>
            </p>
            <p className="op-muted">
              {current.kind} · aberta em {formatDate(current.createdAt)} por {current.reporter}
            </p>
            {current.replies.length ? (
              <ol className="op-timeline">
                {current.replies.map((r) => (
                  <li key={r.id}>
                    <strong>{r.text}</strong>
                    <small>
                      {formatDate(r.at)} · {r.author}
                    </small>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty text="Nenhuma resposta registrada até agora." />
            )}
            {current.status === "aberta" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  try {
                    actIssue(current.id, "reply", String(new FormData(form).get("text") || ""));
                    form.reset();
                    setError("");
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                <label className="op-field">
                  <span>Nova resposta *</span>
                  <textarea name="text" required rows={3} maxLength={1000} />
                </label>
                {error && (
                  <p role="alert" className="op-error">
                    {error}
                  </p>
                )}
                <footer className="op-form-footer">
                  <button className="op-button primary" type="submit">
                    Responder
                  </button>
                </footer>
              </form>
            ) : (
              <p className="op-hint">Ocorrência encerrada em {formatDate(current.closedAt)}.</p>
            )}
            <button className="op-button" onClick={() => setThread(null)}>
              Fechar
            </button>
          </div>
        </Modal>
      )}
      {selected && <History id={selected} onClose={() => setSelected(null)} />}
      {action && (
        <Modal
          title="Encerrar ocorrência"
          onClose={() => {
            setAction(null);
            setError("");
          }}
        >
          <form
            className="op-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(action.item.id, "close", String(new FormData(e.currentTarget).get("text") || ""));
            }}
          >
            <p>
              <strong>{action.item.description}</strong>
            </p>
            <p className="op-muted">
              O desfecho fica registrado como última resposta e a ocorrência vai para o histórico.
            </p>
            <label className="op-field">
              <span>Como foi resolvida? *</span>
              <textarea name="text" required rows={3} maxLength={1000} />
            </label>
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
                Encerrar
              </button>
            </footer>
          </form>
        </Modal>
      )}
    </main>
  );
}

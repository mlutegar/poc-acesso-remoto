import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Feedback, History, Pagination, Tabs, useListParams, PAGE_SIZE } from "./List";
import { useOperations } from "./Store";
import { mailLabels, normalize, unitName, type Mail, type Resident } from "./model";
import { downloadCsv, Empty, Field, formatDate, Modal } from "./UI";

type Action = { item: Mail; kind: "notify" | "pickup" };

export default function MailPage() {
  const { data, error: storageError, save, actMail } = useOperations();
  const { user } = useAuth();
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [edit, setEdit] = useState<{ item?: Mail } | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const residentFor = (m: Mail) => data.residents.find((r) => r.id === m.residentId);
  const home = (r?: Resident) => data.units.find((u) => u.id === r?.unitId);
  const activeResidents = data.residents.filter(
    (r) => r.active && data.units.some((u) => u.id === r.unitId && u.active)
  );
  const waiting = data.mail.filter((m) => m.status !== "retirada");

  const visible = data.mail
    .filter((m) => {
      const open = m.status !== "retirada";
      if (tab !== "all" && open !== (tab === "active")) return false;
      if (filter && m.status !== filter) return false;
      const r = residentFor(m);
      return normalize(
        [
          m.description,
          m.tracking,
          m.carrier,
          m.receivedBy,
          m.pickedBy,
          m.notes,
          r?.name || "",
          unitName(home(r)),
        ].join(" ")
      ).includes(normalize(query));
    })
    .reverse();
  const page = pageOf(visible.length);
  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportRows = () => {
    downloadCsv("correspondencias.csv", [
      [
        "Descrição",
        "Rastreio",
        "Remetente",
        "Destinatário",
        "Residência",
        "Situação",
        "Entrada",
        "Retirada",
        "Retirada por",
      ],
      ...visible.map((m) => [
        m.description,
        m.tracking,
        m.carrier,
        residentFor(m)?.name || "",
        unitName(home(residentFor(m))),
        mailLabels[m.status],
        formatDate(m.createdAt),
        formatDate(m.pickupAt),
        m.pickedBy,
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
      save("mail", {
        id: item?.id || crypto.randomUUID(),
        residentId: s("residentId"),
        description: s("description"),
        tracking: s("tracking"),
        carrier: s("carrier"),
        receivedBy: s("receivedBy"),
        attachment: s("attachment"),
        notes: s("notes"),
        status: item?.status || "recebida",
        createdAt: item?.createdAt || new Date().toISOString(),
        noticedAt: item?.noticedAt || "",
        pickupAt: item?.pickupAt || "",
        pickedBy: item?.pickedBy || "",
      } satisfies Mail);
      setEdit(null);
      setError("");
      setNotice("Correspondência salva neste navegador.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="op-main">
      <div className="op-breadcrumb">
        CONDOMÍNIO MODELO <span>/</span> PORTARIA <span>/</span> CORRESPONDÊNCIAS
      </div>
      <div className="op-page-heading">
        <div>
          <h1>Correspondências</h1>
          <p>Registre o que chega na portaria, avise o destinatário e comprove a retirada.</p>
        </div>
        <button className="op-button primary" onClick={() => setEdit({})}>
          ＋ Nova correspondência
        </button>
      </div>
      <div className="op-stats">
        {[
          ["Aguardando retirada", waiting.length, "navy"],
          [
            "Sem aviso ao destinatário",
            data.mail.filter((m) => m.status === "recebida").length,
            "amber",
          ],
          ["Retiradas", data.mail.filter((m) => m.status === "retirada").length, "green"],
        ].map(([label, value, color]) => (
          <div className="op-stat" key={label}>
            <span>{label}</span>
            <strong className={`text-${color}`}>{value}</strong>
            <small>Registros desta demonstração</small>
          </div>
        ))}
      </div>
      <Feedback notice={notice} error={storageError} onDismiss={() => setNotice("")} />
      <section className="op-panel" aria-label="Lista de correspondências">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativas"],
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
              aria-label="Buscar correspondências"
              placeholder="Buscar morador, residência, rastreio, descrição…"
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por situação"
            value={filter}
            onChange={(e) => update("filter", e.target.value)}
          >
            <option value="">Todas as situações</option>
            {Object.entries(mailLabels).map(([value, label]) => (
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
              data.mail.length
                ? "Altere os filtros ou registre uma nova correspondência."
                : "Comece em “Nova correspondência”."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {[
                    "Correspondência",
                    "Destinatário",
                    "Entrada / retirada",
                    "Situação",
                    "Ações",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.description}</strong>
                      <small>
                        {m.tracking || "Sem rastreio"} {m.carrier && `· ${m.carrier}`}
                      </small>
                      {m.attachment && <small>Anexo: {m.attachment}</small>}
                    </td>
                    <td>
                      {residentFor(m)?.name}
                      <small>{unitName(home(residentFor(m)))}</small>
                    </td>
                    <td>
                      {formatDate(m.createdAt)}
                      <small>
                        {m.status === "retirada"
                          ? `Retirada: ${formatDate(m.pickupAt)} · ${m.pickedBy}`
                          : `Recebida por ${m.receivedBy}`}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`op-badge ${
                          m.status === "recebida"
                            ? "amber"
                            : m.status === "avisada"
                              ? "green"
                              : "gray"
                        }`}
                      >
                        {mailLabels[m.status]}
                      </span>
                      {m.noticedAt && m.status !== "retirada" && (
                        <small>Avisado em {formatDate(m.noticedAt)}</small>
                      )}
                    </td>
                    <td>
                      <div className="op-actions">
                        {m.status === "recebida" && (
                          <button
                            className="op-text-button"
                            onClick={() => setAction({ item: m, kind: "notify" })}
                          >
                            Avisar destinatário
                          </button>
                        )}
                        {m.status !== "retirada" && (
                          <>
                            <button
                              className="op-text-button"
                              onClick={() => setAction({ item: m, kind: "pickup" })}
                            >
                              Registrar retirada
                            </button>
                            <button className="op-text-button" onClick={() => setEdit({ item: m })}>
                              Editar
                            </button>
                          </>
                        )}
                        <button className="op-text-button" onClick={() => setSelected(m.id)}>
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
        Demonstração local · O aviso ao destinatário é registrado, mas nenhuma notificação é
        enviada.
      </p>
      {edit && (
        <Modal
          title={edit.item ? "Editar correspondência" : "Nova correspondência"}
          onClose={() => {
            setEdit(null);
            setError("");
          }}
        >
          <form className="op-form" onSubmit={submit}>
            <div className="op-form-grid">
              <Field label="Destinatário" name="residentId" value={edit.item?.residentId} required>
                <option value="">Selecione o condômino</option>
                {activeResidents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {unitName(home(r))}
                  </option>
                ))}
              </Field>
              <Field label="Descrição" name="description" value={edit.item?.description} required />
              <Field label="Código de rastreio" name="tracking" value={edit.item?.tracking} />
              <Field label="Remetente / transportadora" name="carrier" value={edit.item?.carrier} />
              <Field
                label="Recebida por"
                name="receivedBy"
                value={edit.item?.receivedBy || user || ""}
                required
              />
              <Field
                label="Anexo (nome do arquivo)"
                name="attachment"
                value={edit.item?.attachment}
              />
            </div>
            <Field label="Observações" name="notes" type="textarea" value={edit.item?.notes} />
            <p className="op-hint">
              Registre apenas o nome do arquivo. Esta demonstração não armazena fotos nem
              documentos.
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
      {selected && <History id={selected} onClose={() => setSelected(null)} />}
      {action && (
        <Modal
          title={action.kind === "notify" ? "Avisar destinatário" : "Registrar retirada"}
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
                actMail(
                  action.item.id,
                  action.kind,
                  String(new FormData(e.currentTarget).get("text") || "")
                );
                setAction(null);
                setError("");
                setNotice("Situação da correspondência atualizada.");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <p>
              <strong>{action.item.description}</strong> ·{" "}
              {unitName(home(residentFor(action.item)))}
            </p>
            <p className="op-muted">
              {action.kind === "notify"
                ? "Registra o aviso no histórico desta demonstração; nenhuma mensagem é enviada."
                : "Informe quem retirou. A correspondência vai para o histórico."}
            </p>
            {action.kind === "pickup" && (
              <label className="op-field">
                <span>Retirada por *</span>
                <input
                  name="text"
                  required
                  maxLength={200}
                  defaultValue={residentFor(action.item)?.name || ""}
                />
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

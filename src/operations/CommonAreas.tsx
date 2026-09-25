import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "../components/Icons";
import { Feedback, History, PAGE_SIZE, Pagination, Tabs, useListParams } from "./List";
import { useOperations } from "./Store";
import {
  localClock,
  normalize,
  reservationState,
  unitName,
  type CommonArea,
  type Reservation,
} from "./model";
import { Check, downloadCsv, Empty, Field, Modal } from "./UI";

export default function CommonAreas() {
  const { data, error: storageError, save, cancelReservation } = useOperations();
  const [, refreshClock] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => refreshClock((value) => value + 1), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [mode, setMode] = useState<"reservations" | "areas">(
    data.areas.length ? "reservations" : "areas"
  );
  const [areaEdit, setAreaEdit] = useState<{ item?: CommonArea } | null>(null);
  const [reservationEdit, setReservationEdit] = useState<{ item?: Reservation } | null>(null);
  const [areaId, setAreaId] = useState("");
  const [residentId, setResidentId] = useState("");
  const [date, setDate] = useState(localClock().date);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const areaOf = (r: Reservation) => data.areas.find((a) => a.id === r.areaId);
  const residentOf = (r: Reservation) => data.residents.find((x) => x.id === r.residentId);
  const unitOf = (r: Reservation) => data.units.find((x) => x.id === r.unitId);
  const selectedArea = data.areas.find((a) => a.id === areaId);
  const selectedResident = data.residents.find((r) => r.id === residentId);
  const availableResidents = data.residents.filter(
    (r) =>
      (r.active && data.units.some((u) => u.id === r.unitId && u.active)) || r.id === residentId
  );
  const reservations = data.reservations
    .filter((r) => {
      const state = reservationState(r);
      if (tab === "active" && state !== "confirmada") return false;
      if (tab === "history" && state === "confirmada") return false;
      if (filter && r.areaId !== filter) return false;
      return normalize(
        [
          areaOf(r)?.name || "",
          residentOf(r)?.name || "",
          unitName(unitOf(r)),
          r.date,
          r.notes,
        ].join(" ")
      ).includes(normalize(query));
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.startsAt.localeCompare(b.startsAt));
  const areas = data.areas
    .filter((a) => {
      if (tab !== "all" && a.active !== (tab === "active")) return false;
      return normalize([a.name, a.description].join(" ")).includes(normalize(query));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const visible = mode === "reservations" ? reservations : areas;
  const page = pageOf(visible.length);
  const rows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openReservation(item?: Reservation) {
    setReservationEdit({ item });
    setAreaId(item?.areaId || "");
    setResidentId(item?.residentId || "");
    setDate(item?.date || localClock().date);
    setError("");
  }
  function create() {
    setError("");
    if (mode === "areas" || !data.areas.some((a) => a.active)) {
      setMode("areas");
      setAreaEdit({});
    } else openReservation();
  }
  function submitArea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "").trim();
    try {
      save("areas", {
        id: areaEdit?.item?.id || crypto.randomUUID(),
        name: value("name"),
        description: value("description"),
        capacity: Number(value("capacity")),
        opensAt: value("opensAt"),
        closesAt: value("closesAt"),
        active: form.has("active"),
      } satisfies CommonArea);
      setAreaEdit(null);
      setError("");
      setNotice("Área comum salva neste navegador.");
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "").trim();
    const item = reservationEdit?.item;
    try {
      save("reservations", {
        id: item?.id || crypto.randomUUID(),
        areaId,
        residentId,
        unitId: selectedResident?.unitId || "",
        date,
        startsAt: value("startsAt"),
        endsAt: value("endsAt"),
        participants: Number(value("participants")),
        notes: value("notes"),
        status: item?.status || "confirmada",
        createdAt: item?.createdAt || new Date().toISOString(),
        cancelledAt: item?.cancelledAt || "",
      } satisfies Reservation);
      setReservationEdit(null);
      setError("");
      setNotice("Reserva salva neste navegador.");
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  function confirmCancel() {
    if (!cancelId) return;
    try {
      cancelReservation(cancelId);
      setCancelId(null);
      setError("");
      setNotice("Reserva cancelada.");
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  function exportRows() {
    if (mode === "reservations")
      downloadCsv("reservas-areas-comuns.csv", [
        ["Área", "Data", "Início", "Fim", "Condômino", "Residência", "Pessoas", "Situação"],
        ...reservations.map((r) => [
          areaOf(r)?.name || "",
          r.date,
          r.startsAt,
          r.endsAt,
          residentOf(r)?.name || "",
          unitName(unitOf(r)),
          String(r.participants),
          reservationState(r),
        ]),
      ]);
    else
      downloadCsv("areas-comuns.csv", [
        ["Área", "Capacidade", "Abre", "Fecha", "Situação"],
        ...areas.map((a) => [
          a.name,
          String(a.capacity),
          a.opensAt,
          a.closesAt,
          a.active ? "Ativa" : "Inativa",
        ]),
      ]);
    setNotice(`${visible.length} registro(s) exportado(s), respeitando os filtros.`);
  }
  const bookingsThatDay = data.reservations
    .filter(
      (r) =>
        r.areaId === areaId &&
        r.date === date &&
        r.status === "confirmada" &&
        r.id !== reservationEdit?.item?.id
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <main className="op-main">
      <div className="op-page-heading">
        <div>
          <h1>Áreas comuns</h1>
          <p>Consulte a disponibilidade e organize as reservas do condomínio.</p>
        </div>
        <button className="op-button primary" onClick={create}>
          <Icon name="plus" />{" "}
          {mode === "areas" || !data.areas.some((a) => a.active) ? "Nova área" : "Nova reserva"}
        </button>
      </div>
      <Feedback notice={notice} error={storageError} onDismiss={() => setNotice("")} />
      <section className="op-panel">
        <div className="op-panel-top">
          <div className="op-tabs" aria-label="Visualização">
            <button
              aria-pressed={mode === "reservations"}
              className={mode === "reservations" ? "selected" : ""}
              onClick={() => setMode("reservations")}
            >
              Reservas
            </button>
            <button
              aria-pressed={mode === "areas"}
              className={mode === "areas" ? "selected" : ""}
              onClick={() => setMode("areas")}
            >
              Áreas
            </button>
          </div>
          <button className="op-button small" onClick={exportRows}>
            <Icon name="download" /> Exportar CSV
          </button>
        </div>
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", mode === "areas" ? "Ativas" : "Confirmadas"],
              ["history", mode === "areas" ? "Inativas" : "Histórico"],
              ["all", "Todas"],
            ]}
            onSelect={(value) => update("tab", value)}
          />
        </div>
        <div className="op-filters">
          <label className="op-search">
            <span aria-hidden>
              <Icon name="search" />
            </span>
            <input
              aria-label="Buscar áreas e reservas"
              placeholder="Buscar área, condômino, residência…"
              value={query}
              onChange={(event) => update("q", event.target.value)}
            />
          </label>
          {mode === "reservations" && (
            <select
              aria-label="Filtrar por área"
              value={filter}
              onChange={(event) => update("filter", event.target.value)}
            >
              <option value="">Todas as áreas</option>
              {data.areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          )}
          {(query || filter) && (
            <button className="op-text-button" onClick={clear}>
              Limpar filtros
            </button>
          )}
        </div>
        {visible.length === 0 ? (
          <Empty
            text={
              mode === "areas"
                ? "Cadastre uma área comum para começar."
                : data.areas.length
                  ? "Escolha outro filtro ou crie uma reserva."
                  : "Cadastre uma área comum antes de criar reservas."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {(mode === "areas"
                    ? ["Área", "Horário", "Capacidade", "Situação", "Ações"]
                    : ["Área / data", "Horário", "Condômino / residência", "Situação", "Ações"]
                  ).map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mode === "areas"
                  ? (rows as CommonArea[]).map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong>{a.name}</strong>
                          <small>{a.description}</small>
                        </td>
                        <td>
                          {a.opensAt}–{a.closesAt}
                        </td>
                        <td>{a.capacity} pessoa(s)</td>
                        <td>
                          <span className={`op-badge ${a.active ? "green" : "gray"}`}>
                            {a.active ? "Ativa" : "Inativa"}
                          </span>
                        </td>
                        <td>
                          <div className="op-actions">
                            <button
                              className="op-text-button"
                              onClick={() => {
                                setAreaEdit({ item: a });
                                setError("");
                              }}
                            >
                              Editar
                            </button>
                            <button className="op-text-button" onClick={() => setHistoryId(a.id)}>
                              Histórico
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : (rows as Reservation[]).map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{areaOf(r)?.name || "Área não encontrada"}</strong>
                          <small>
                            {r.date.split("-").reverse().join("/")} · {r.participants} pessoa(s)
                          </small>
                        </td>
                        <td>
                          {r.startsAt}–{r.endsAt}
                        </td>
                        <td>
                          {residentOf(r)?.name || "—"}
                          <small>{unitName(unitOf(r))}</small>
                        </td>
                        <td>
                          <span
                            className={`op-badge ${reservationState(r) === "confirmada" ? "green" : "gray"}`}
                          >
                            {reservationState(r) === "confirmada"
                              ? "Confirmada"
                              : reservationState(r) === "cancelada"
                                ? "Cancelada"
                                : "Concluída"}
                          </span>
                        </td>
                        <td>
                          <div className="op-actions">
                            {r.status === "confirmada" && (
                              <>
                                <button
                                  className="op-text-button"
                                  onClick={() => openReservation(r)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="op-text-button"
                                  onClick={() => {
                                    setCancelId(r.id);
                                    setError("");
                                  }}
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button className="op-text-button" onClick={() => setHistoryId(r.id)}>
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
      {areaEdit && (
        <Modal
          title={areaEdit.item ? "Editar área comum" : "Nova área comum"}
          onClose={() => setAreaEdit(null)}
        >
          <form className="op-form" onSubmit={submitArea}>
            <div className="op-form-grid">
              <Field label="Nome" name="name" value={areaEdit.item?.name} required />
              <Field
                label="Capacidade de pessoas"
                name="capacity"
                type="number"
                value={String(areaEdit.item?.capacity || 1)}
                required
              />
              <Field
                label="Abre às"
                name="opensAt"
                type="time"
                value={areaEdit.item?.opensAt || "08:00"}
                required
              />
              <Field
                label="Fecha às"
                name="closesAt"
                type="time"
                value={areaEdit.item?.closesAt || "22:00"}
                required
              />
            </div>
            <Field
              label="Descrição"
              name="description"
              type="textarea"
              value={areaEdit.item?.description}
            />
            <div className="op-checks">
              <Check
                label="Ativa para reservas"
                name="active"
                checked={areaEdit.item?.active ?? true}
              />
            </div>
            {error && (
              <p role="alert" className="op-error">
                {error}
              </p>
            )}
            <footer className="op-form-footer">
              <button type="button" className="op-button" onClick={() => setAreaEdit(null)}>
                Cancelar
              </button>
              <button className="op-button primary" type="submit">
                Salvar
              </button>
            </footer>
          </form>
        </Modal>
      )}
      {reservationEdit && (
        <Modal
          title={reservationEdit.item ? "Editar reserva" : "Nova reserva"}
          onClose={() => setReservationEdit(null)}
        >
          <form className="op-form" onSubmit={submitReservation}>
            <p className="op-muted">
              Horários no fuso de Brasília. Dados salvos somente neste navegador.
            </p>
            <div className="op-form-grid">
              <label className="op-field">
                <span>Área comum *</span>
                <select value={areaId} onChange={(event) => setAreaId(event.target.value)} required>
                  <option value="">Selecione a área</option>
                  {data.areas
                    .filter((a) => a.active || a.id === areaId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="op-field">
                <span>Condômino responsável *</span>
                <select
                  value={residentId}
                  onChange={(event) => setResidentId(event.target.value)}
                  required
                >
                  <option value="">Selecione o condômino</option>
                  {availableResidents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {unitName(data.units.find((u) => u.id === r.unitId))}
                    </option>
                  ))}
                </select>
              </label>
              <label className="op-field">
                <span>Data *</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </label>
              <Field
                label="Pessoas (incluindo o responsável)"
                name="participants"
                type="number"
                value={String(reservationEdit.item?.participants || 1)}
                required
              />
              <Field
                key={`start-${areaId}`}
                label="Início"
                name="startsAt"
                type="time"
                value={
                  reservationEdit.item?.areaId === areaId
                    ? reservationEdit.item.startsAt
                    : selectedArea?.opensAt || "08:00"
                }
                required
              />
              <Field
                key={`end-${areaId}`}
                label="Fim"
                name="endsAt"
                type="time"
                value={
                  reservationEdit.item?.areaId === areaId
                    ? reservationEdit.item.endsAt
                    : selectedArea?.closesAt || "22:00"
                }
                required
              />
            </div>
            <p className="op-hint">
              {selectedArea
                ? `Funcionamento: ${selectedArea.opensAt}–${selectedArea.closesAt} · capacidade: ${selectedArea.capacity} pessoa(s).`
                : "Selecione uma área para ver o horário de funcionamento."}{" "}
              Residência: {unitName(data.units.find((u) => u.id === selectedResident?.unitId))}
            </p>
            <p className="op-hint">
              {bookingsThatDay.length
                ? `Ocupado neste dia: ${bookingsThatDay.map((r) => `${r.startsAt}–${r.endsAt}`).join(", ")}.`
                : "Nenhuma outra reserva confirmada nesta área e data."}
            </p>
            <Field
              label="Observações"
              name="notes"
              type="textarea"
              value={reservationEdit.item?.notes}
            />
            {error && (
              <p role="alert" className="op-error">
                {error}
              </p>
            )}
            <footer className="op-form-footer">
              <button type="button" className="op-button" onClick={() => setReservationEdit(null)}>
                Cancelar
              </button>
              <button className="op-button primary" type="submit">
                Salvar reserva
              </button>
            </footer>
          </form>
        </Modal>
      )}
      {cancelId && (
        <Modal title="Cancelar reserva" onClose={() => setCancelId(null)}>
          <div className="op-form">
            <p>Deseja cancelar esta reserva? O registro continuará no histórico.</p>
            {error && (
              <p role="alert" className="op-error">
                {error}
              </p>
            )}
            <footer className="op-form-footer">
              <button className="op-button" onClick={() => setCancelId(null)}>
                Voltar
              </button>
              <button className="op-button primary" onClick={confirmCancel}>
                Confirmar cancelamento
              </button>
            </footer>
          </div>
        </Modal>
      )}
      {historyId && <History id={historyId} onClose={() => setHistoryId(null)} />}
    </main>
  );
}

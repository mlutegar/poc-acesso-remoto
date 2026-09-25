import { useState, type FormEvent } from "react";
import { Icon } from "../components/Icons";
import { Feedback, History, PAGE_SIZE, Pagination, Tabs, useListParams } from "../operations/List";
import { useOperations } from "../operations/Store";
import { identity, normalize, unitName, type Vehicle } from "../operations/model";
import { Check, downloadCsv, Empty, Field, Modal } from "../operations/UI";

export default function Veiculos() {
  const { data, error: storageError, save } = useOperations();
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [edit, setEdit] = useState<{ item?: Vehicle } | null>(null);
  const [residentId, setResidentId] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const residentOf = (vehicle: Vehicle) => data.residents.find((r) => r.id === vehicle.residentId);
  const unitOf = (vehicle: Vehicle) => data.units.find((u) => u.id === vehicle.unitId);
  const currentResident = data.residents.find((r) => r.id === residentId);
  const availableResidents = data.residents.filter(
    (r) =>
      (r.active && data.units.some((u) => u.id === r.unitId && u.active)) || r.id === residentId
  );
  const visible = data.vehicles
    .filter((v) => {
      if (tab !== "all" && v.active !== (tab === "active")) return false;
      if (filter && v.unitId !== filter) return false;
      return normalize(
        [v.plate, v.model, v.color, v.notes, residentOf(v)?.name || "", unitName(unitOf(v))].join(
          " "
        )
      ).includes(normalize(query));
    })
    .reverse();
  const page = pageOf(visible.length);
  const rows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function open(item?: Vehicle) {
    setEdit({ item });
    setResidentId(item?.residentId || "");
    setError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "").trim();
    const resident = data.residents.find((r) => r.id === residentId);
    try {
      save("vehicles", {
        id: edit?.item?.id || crypto.randomUUID(),
        residentId,
        unitId: resident?.unitId || "",
        plate: identity(value("plate")).toUpperCase(),
        model: value("model"),
        color: value("color"),
        notes: value("notes"),
        active: form.has("active"),
      } satisfies Vehicle);
      setEdit(null);
      setNotice("Veículo salvo neste navegador.");
      setError("");
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  function exportRows() {
    downloadCsv("veiculos.csv", [
      ["Placa", "Modelo", "Cor", "Condômino", "Residência", "Situação"],
      ...visible.map((v) => [
        v.plate,
        v.model,
        v.color,
        residentOf(v)?.name || "",
        unitName(unitOf(v)),
        v.active ? "Ativo" : "Inativo",
      ]),
    ]);
    setNotice(`${visible.length} veículo(s) exportado(s), respeitando os filtros.`);
  }
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <div>
          <h1>Veículos</h1>
          <p>Cadastro de veículos vinculados aos condôminos e às residências.</p>
        </div>
        <button className="op-button primary" onClick={() => open()}>
          <Icon name="plus" /> Novo veículo
        </button>
      </div>
      <Feedback notice={notice} error={storageError} onDismiss={() => setNotice("")} />
      <section className="op-panel" aria-label="Lista de veículos">
        <div className="op-panel-top">
          <Tabs
            tab={tab}
            options={[
              ["active", "Ativos"],
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
              aria-label="Buscar veículos"
              placeholder="Buscar placa, modelo, condômino…"
              value={query}
              onChange={(event) => update("q", event.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por residência"
            value={filter}
            onChange={(event) => update("filter", event.target.value)}
          >
            <option value="">Todas as residências</option>
            {data.units.map((u) => (
              <option key={u.id} value={u.id}>
                {unitName(u)}
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
              data.vehicles.length
                ? "Altere os filtros ou cadastre um novo veículo."
                : "Comece em “Novo veículo”."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {["Placa / veículo", "Condômino", "Residência", "Situação", "Ações"].map(
                    (label) => (
                      <th key={label}>{label}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <strong>{v.plate}</strong>
                      <small>
                        {v.model} · {v.color}
                      </small>
                    </td>
                    <td>{residentOf(v)?.name || "Condômino não encontrado"}</td>
                    <td>{unitName(unitOf(v))}</td>
                    <td>
                      <span className={`op-badge ${v.active ? "green" : "gray"}`}>
                        {v.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      <div className="op-actions">
                        <button className="op-text-button" onClick={() => open(v)}>
                          Editar
                        </button>
                        <button className="op-text-button" onClick={() => setSelected(v.id)}>
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
      {edit && (
        <Modal title={edit.item ? "Editar veículo" : "Novo veículo"} onClose={() => setEdit(null)}>
          <form className="op-form" onSubmit={submit}>
            <p className="op-muted">* Campos obrigatórios. Dados salvos somente neste navegador.</p>
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
            <p className="op-hint">
              Residência: {unitName(data.units.find((u) => u.id === currentResident?.unitId))}
            </p>
            <div className="op-form-grid">
              <Field label="Placa" name="plate" value={edit.item?.plate} required />
              <Field label="Modelo" name="model" value={edit.item?.model} required />
              <Field label="Cor" name="color" value={edit.item?.color} required />
            </div>
            <Field label="Observações" name="notes" type="textarea" value={edit.item?.notes} />
            <div className="op-checks">
              <Check label="Ativo" name="active" checked={edit.item?.active ?? true} />
            </div>
            <p className="op-hint">
              O cadastro organiza veículos e placas. A leitura LPR e a TAG dependem da integração
              com os equipamentos.
            </p>
            {error && (
              <p role="alert" className="op-error">
                {error}
              </p>
            )}
            <footer className="op-form-footer">
              <button type="button" className="op-button" onClick={() => setEdit(null)}>
                Cancelar
              </button>
              <button type="submit" className="op-button primary">
                Salvar
              </button>
            </footer>
          </form>
        </Modal>
      )}
      {selected && <History id={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

import { useState, type FormEvent } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { Feedback, History, PAGE_SIZE, Pagination, Tabs, useListParams } from "./List";
import { useOperations } from "./Store";
import { normalize, unitName, type Bike } from "./model";
import { Check, downloadCsv, Empty, Field, Modal } from "./UI";

export default function Bikes() {
  const { data, error: storageError, save } = useOperations();
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [edit, setEdit] = useState<{ item?: Bike } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const unitOf = (b: Bike) => data.units.find((u) => u.id === b.unitId);
  const residentOf = (b: Bike) => data.residents.find((r) => r.id === b.residentId);
  const activeUnits = data.units.filter((u) => u.active);
  const marcas = [...new Set(data.bikes.map((b) => b.brand))].sort();

  const visible = data.bikes
    .filter((b) => {
      if (tab !== "all" && b.active !== (tab === "active")) return false;
      if (filter && b.brand !== filter) return false;
      return normalize(
        [
          b.brand,
          b.model,
          b.color,
          b.code,
          b.notes,
          residentOf(b)?.name || "",
          unitName(unitOf(b)),
        ].join(" ")
      ).includes(normalize(query));
    })
    .reverse();
  const page = pageOf(visible.length);
  const rows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportRows = () => {
    downloadCsv("bicicletas.csv", [
      ["Código", "Marca", "Modelo", "Cor", "Residência", "Responsável", "Ativa"],
      ...visible.map((b) => [
        b.code,
        b.brand,
        b.model,
        b.color,
        unitName(unitOf(b)),
        residentOf(b)?.name || "",
        b.active ? "Sim" : "Não",
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
      save("bikes", {
        id: item?.id || crypto.randomUUID(),
        unitId: s("unitId"),
        residentId: s("residentId"),
        brand: s("brand"),
        model: s("model"),
        color: s("color"),
        code: s("code"),
        notes: s("notes"),
        active: f.has("active"),
      } satisfies Bike);
      setEdit(null);
      setError("");
      setNotice("Bicicleta salva neste navegador.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const unitId = edit?.item?.unitId;
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Bicicletas</h1>
        <button className="op-button primary" onClick={() => setEdit({})}>
          <Icon name="plus" /> Nova bicicleta
        </button>
      </div>
      <Feedback notice={notice} error={storageError} onDismiss={() => setNotice("")} />
      <section className="op-panel" aria-label="Lista de bicicletas">
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
              aria-label="Buscar bicicletas"
              placeholder="Buscar código, marca, modelo, residência…"
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por marca"
            value={filter}
            onChange={(e) => update("filter", e.target.value)}
          >
            <option value="">Todas as marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
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
              data.bikes.length
                ? "Altere os filtros ou cadastre uma nova bicicleta."
                : "Comece em “Nova bicicleta”."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {["Bicicleta", "Residência", "Responsável", "Situação", "Ações"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="sh-cell">
                        <Photo kind="objeto" tone={b.active ? "green" : ""} />
                        <div>
                          <strong>
                            {b.brand}
                            {b.model && ` ${b.model}`}
                          </strong>
                          <small>
                            {b.code || "Sem código"}
                            {b.color && ` · ${b.color}`}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {unitName(unitOf(b))}
                      <small>{unitOf(b)?.active ? "Residência ativa" : "Residência inativa"}</small>
                    </td>
                    <td>
                      {residentOf(b)?.name || "Sem condômino vinculado"}
                      {b.notes && <small>{b.notes}</small>}
                    </td>
                    <td>
                      <span className={`op-badge ${b.active ? "green" : "gray"}`}>
                        {b.active ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td>
                      <div className="op-actions">
                        <button className="op-text-button" onClick={() => setEdit({ item: b })}>
                          Editar
                        </button>
                        <button className="op-text-button" onClick={() => setSelected(b.id)}>
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
        <Modal
          title={edit.item ? "Editar bicicleta" : "Nova bicicleta"}
          onClose={() => {
            setEdit(null);
            setError("");
          }}
        >
          <form className="op-form" onSubmit={submit}>
            <div className="op-form-grid">
              <Field label="Residência" name="unitId" value={unitId} required>
                <option value="">Selecione a residência</option>
                {activeUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {unitName(u)}
                  </option>
                ))}
              </Field>
              <Field label="Condômino responsável" name="residentId" value={edit.item?.residentId}>
                <option value="">Nenhum</option>
                {data.residents
                  .filter((r) => r.active && (!unitId || r.unitId === unitId))
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {unitName(data.units.find((u) => u.id === r.unitId))}
                    </option>
                  ))}
              </Field>
              <Field label="Marca" name="brand" value={edit.item?.brand} required />
              <Field label="Modelo" name="model" value={edit.item?.model} />
              <Field label="Cor" name="color" value={edit.item?.color} required />
              <Field label="Código no bicicletário" name="code" value={edit.item?.code} />
            </div>
            <Field label="Observações" name="notes" type="textarea" value={edit.item?.notes} />
            <div className="op-checks">
              <Check label="Ativa" name="active" checked={edit.item?.active ?? true} />
            </div>
            <p className="op-hint">
              O código identifica a vaga no bicicletário e não pode se repetir entre bicicletas
              ativas.
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
    </main>
  );
}

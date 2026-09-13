import { useState, type FormEvent } from "react";
import { Icon } from "../components/Icons";
import { Photo } from "../components/Photo";
import { Feedback, History, PAGE_SIZE, Pagination, Tabs, useListParams } from "./List";
import { useOperations } from "./Store";
import { normalize, unitName, type Pet } from "./model";
import { Check, downloadCsv, Empty, Field, Modal } from "./UI";

const ESPECIES = ["Cão", "Gato", "Ave", "Roedor", "Réptil", "Outro"];
const PORTES = ["Pequeno", "Médio", "Grande"];

export default function Pets() {
  const { data, error: storageError, save } = useOperations();
  const { query, tab, filter, update, pageOf, goTo, clear } = useListParams();
  const [edit, setEdit] = useState<{ item?: Pet } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const unitOf = (a: Pet) => data.units.find((u) => u.id === a.unitId);
  const residentOf = (a: Pet) => data.residents.find((r) => r.id === a.residentId);
  const activeUnits = data.units.filter((u) => u.active);

  const visible = data.pets
    .filter((a) => {
      if (tab !== "all" && a.active !== (tab === "active")) return false;
      if (filter && a.species !== filter) return false;
      return normalize(
        [
          a.name,
          a.species,
          a.breed,
          a.color,
          a.size,
          a.notes,
          residentOf(a)?.name || "",
          unitName(unitOf(a)),
        ].join(" ")
      ).includes(normalize(query));
    })
    .reverse();
  const page = pageOf(visible.length);
  const rows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportRows = () => {
    downloadCsv("animais.csv", [
      ["Nome", "Espécie", "Raça", "Cor", "Porte", "Residência", "Responsável", "Ativo"],
      ...visible.map((a) => [
        a.name,
        a.species,
        a.breed,
        a.color,
        a.size,
        unitName(unitOf(a)),
        residentOf(a)?.name || "",
        a.active ? "Sim" : "Não",
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
      save("pets", {
        id: item?.id || crypto.randomUUID(),
        unitId: s("unitId"),
        residentId: s("residentId"),
        name: s("name"),
        species: s("species"),
        breed: s("breed"),
        color: s("color"),
        size: s("size"),
        notes: s("notes"),
        active: f.has("active"),
      } satisfies Pet);
      setEdit(null);
      setError("");
      setNotice("Animal salvo neste navegador.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const unitId = edit?.item?.unitId;
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>Animais</h1>
        <button className="op-button primary" onClick={() => setEdit({})}>
          <Icon name="plus" /> Novo animal
        </button>
      </div>
      <Feedback notice={notice} error={storageError} onDismiss={() => setNotice("")} />
      <section className="op-panel" aria-label="Lista de animais">
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
              aria-label="Buscar animais"
              placeholder="Buscar nome, espécie, raça, residência…"
              value={query}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          <select
            aria-label="Filtrar por espécie"
            value={filter}
            onChange={(e) => update("filter", e.target.value)}
          >
            <option value="">Todas as espécies</option>
            {ESPECIES.map((s) => (
              <option key={s} value={s}>
                {s}
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
              data.pets.length
                ? "Altere os filtros ou cadastre um novo animal."
                : "Comece em “Novo animal”."
            }
          />
        ) : (
          <div className="op-table-wrap">
            <table className="op-table">
              <thead>
                <tr>
                  {["Animal", "Residência", "Responsável", "Situação", "Ações"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="sh-cell">
                        <Photo kind="objeto" tone={a.active ? "green" : ""} />
                        <div>
                          <strong>{a.name}</strong>
                          <small>
                            {a.species}
                            {a.breed && ` · ${a.breed}`}
                          </small>
                          <small>
                            {a.size}
                            {a.color && ` · ${a.color}`}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {unitName(unitOf(a))}
                      <small>{unitOf(a)?.active ? "Residência ativa" : "Residência inativa"}</small>
                    </td>
                    <td>
                      {residentOf(a)?.name || "Sem condômino vinculado"}
                      {a.notes && <small>{a.notes}</small>}
                    </td>
                    <td>
                      <span className={`op-badge ${a.active ? "green" : "gray"}`}>
                        {a.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      <div className="op-actions">
                        <button className="op-text-button" onClick={() => setEdit({ item: a })}>
                          Editar
                        </button>
                        <button className="op-text-button" onClick={() => setSelected(a.id)}>
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
          title={edit.item ? "Editar animal" : "Novo animal"}
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
              <Field label="Nome" name="name" value={edit.item?.name} required />
              <Field
                label="Espécie"
                name="species"
                value={edit.item?.species || ESPECIES[0]}
                required
              >
                {ESPECIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Field>
              <Field label="Raça" name="breed" value={edit.item?.breed} />
              <Field label="Cor" name="color" value={edit.item?.color} />
              <Field label="Porte" name="size" value={edit.item?.size || PORTES[1]}>
                {PORTES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Field>
            </div>
            <Field label="Observações" name="notes" type="textarea" value={edit.item?.notes} />
            <div className="op-checks">
              <Check label="Ativo" name="active" checked={edit.item?.active ?? true} />
            </div>
            <p className="op-hint">
              O condômino responsável precisa ser da mesma residência. Deixe em branco quando o
              animal for do domicílio e não de uma pessoa específica.
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

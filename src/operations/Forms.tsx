import { useState, type FormEvent } from "react";
import { useOperations } from "./Store";
import {
  localClock,
  unitName,
  type CoreCollection,
  type Unit,
  type Resident,
  type Permit,
  type Visit,
} from "./model";
import { Check, Field, Modal } from "./UI";
import { PhotoField } from "../components/Photo";
export type Edit = { kind: CoreCollection; item?: Unit | Resident | Permit | Visit };
const titles = {
  units: "residência",
  residents: "condômino",
  permits: "pré-autorização",
  visits: "visita",
};
export function Editor({
  edit,
  onClose,
  onSaved,
}: {
  edit: Edit;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data, save } = useOperations();
  const [error, setError] = useState("");
  const { kind, item: rawItem } = edit;
  const item = rawItem as ((Unit | Resident | Permit | Visit) & { name?: string }) | undefined;
  const unit = item as Unit | undefined,
    resident = item as Resident | undefined,
    permit = item as Permit | undefined,
    visit = item as Visit | undefined;
  const activeResidents = data.residents.filter(
    (r) => r.active && data.units.some((u) => u.id === r.unitId && u.active)
  );
  const residentChoices = (
    <>
      <option value="">Selecione o responsável</option>
      {activeResidents.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name} — {unitName(data.units.find((u) => u.id === r.unitId))}
        </option>
      ))}
    </>
  );
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (name: string) => String(f.get(name) || "").trim();
    const b = (name: string) => f.has(name);
    const id = item?.id || crypto.randomUUID();
    try {
      if (kind === "units")
        save(kind, {
          id,
          block: s("block"),
          number: s("number"),
          phone: s("phone"),
          intercom: s("intercom"),
          notes: s("notes"),
          rented: b("rented"),
          active: b("active"),
        });
      if (kind === "residents")
        save(kind, {
          id,
          unitId: s("unitId"),
          name: s("name"),
          document: s("document"),
          phone: s("phone"),
          email: s("email"),
          relationship: s("relationship"),
          owner: b("owner"),
          principal: b("principal"),
          plate: s("plate").toUpperCase(),
          vehicle: s("vehicle"),
          color: s("color"),
          notes: s("notes"),
          active: b("active"),
        });
      if (kind === "permits")
        save(kind, {
          id,
          residentId: s("residentId"),
          name: s("name"),
          document: s("document"),
          company: s("company"),
          plate: s("plate").toUpperCase(),
          start: s("start"),
          end: s("end"),
          from: s("from"),
          until: s("until"),
          days: f.getAll("days").map(Number),
          reason: s("reason"),
          active: b("active"),
        });
      if (kind === "visits")
        save(kind, {
          id,
          residentId: s("residentId"),
          name: s("name"),
          document: s("document"),
          phone: s("phone"),
          company: s("company"),
          plate: s("plate").toUpperCase(),
          vehicle: s("vehicle"),
          purpose: s("purpose"),
          notes: s("notes"),
          status: visit?.status || "pendente",
          createdAt: visit?.createdAt || new Date().toISOString(),
          entryAt: visit?.entryAt || "",
          exitAt: visit?.exitAt || "",
          permitId: visit?.permitId || "",
        });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <Modal title={`${item ? "Editar" : "Cadastrar"} ${titles[kind]}`} onClose={onClose}>
      <form onSubmit={submit} className="op-form">
        <p className="op-muted">* Campos obrigatórios. Dados salvos somente neste navegador.</p>
        {kind === "units" && (
          <>
            <div className="op-form-grid">
              <Field label="Bloco" name="block" value={unit?.block} required />
              <Field label="Número" name="number" value={unit?.number} required />
              <Field label="Telefone" name="phone" value={unit?.phone} type="tel" />
              <Field label="Interfone" name="intercom" value={unit?.intercom} />
            </div>
            <Field
              label="Informações da residência"
              name="notes"
              value={unit?.notes}
              type="textarea"
            />
            <div className="op-checks">
              <Check label="Residência alugada" name="rented" checked={unit?.rented || false} />
              <Check label="Ativa" name="active" checked={unit?.active ?? true} />
            </div>
          </>
        )}
        {kind === "residents" && (
          <>
            <PhotoField label="Foto do condômino" />
            <div className="op-section-label">Vínculo com a residência</div>
            <Field label="Residência" name="unitId" value={resident?.unitId} required>
              <option value="">Selecione a residência</option>
              {data.units
                .filter((u) => u.active || u.id === resident?.unitId)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {unitName(u)}
                    {!u.active ? " (inativa)" : ""}
                  </option>
                ))}
            </Field>
            <div className="op-form-grid">
              <Field label="Nome completo" name="name" value={resident?.name} required />
              <Field label="Documento" name="document" value={resident?.document} required />
              <Field label="Telefone" name="phone" type="tel" value={resident?.phone} />
              <Field label="Email" name="email" type="email" value={resident?.email} />
              <Field
                label="Vínculo"
                name="relationship"
                value={resident?.relationship || "Titular"}
              >
                {["Titular", "Cônjuge", "Filho(a)", "Familiar", "Outro"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </Field>
            </div>
            <div className="op-checks">
              <Check label="Proprietário" name="owner" checked={resident?.owner || false} />
              <Check
                label="Responsável principal"
                name="principal"
                checked={resident?.principal || false}
              />
              <Check label="Ativo" name="active" checked={resident?.active ?? true} />
            </div>
            <div className="op-section-label">Veículo</div>
            <div className="op-form-grid">
              <Field label="Placa" name="plate" value={resident?.plate} />
              <Field label="Modelo" name="vehicle" value={resident?.vehicle} />
              <Field label="Cor" name="color" value={resident?.color} />
            </div>
            <Field
              label="Observação interna"
              name="notes"
              type="textarea"
              value={resident?.notes}
            />
          </>
        )}
        {(kind === "permits" || kind === "visits") && (
          <>
            {kind === "visits" && <PhotoField label="Foto do visitante" />}
            <div className="op-form-grid">
              <Field label="Nome do visitante" name="name" value={item?.name} required />
              <Field
                label="Documento do visitante"
                name="document"
                value={(item as Permit | Visit)?.document}
                required
              />
            </div>
            <Field
              label="Condômino responsável"
              name="residentId"
              value={(item as Permit | Visit)?.residentId}
              required
            >
              {residentChoices}
            </Field>
            <div className="op-form-grid">
              <Field
                label="Empresa / prestador"
                name="company"
                value={(item as Permit | Visit)?.company}
              />
              <Field
                label="Placa do veículo"
                name="plate"
                value={(item as Permit | Visit)?.plate}
              />
            </div>
          </>
        )}
        {kind === "permits" && (
          <>
            <div className="op-section-label">Validade · horário de Brasília</div>
            <div className="op-form-grid">
              <Field
                label="Data inicial"
                name="start"
                type="date"
                value={permit?.start || localClock().date}
                required
              />
              <Field
                label="Data final"
                name="end"
                type="date"
                value={permit?.end || localClock().date}
                required
              />
              <Field
                label="Hora inicial"
                name="from"
                type="time"
                value={permit?.from || "08:00"}
                required
              />
              <Field
                label="Hora final"
                name="until"
                type="time"
                value={permit?.until || "18:00"}
                required
              />
            </div>
            <fieldset className="op-days">
              <legend>Dias permitidos *</legend>
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d, i) => (
                <label key={d}>
                  <input
                    type="checkbox"
                    name="days"
                    value={i}
                    defaultChecked={permit ? permit.days.includes(i) : true}
                  />
                  {d}
                </label>
              ))}
            </fieldset>
            <Field label="Justificativa" name="reason" value={permit?.reason} required />
            <Check label="Ativa" name="active" checked={permit?.active ?? true} />
          </>
        )}
        {kind === "visits" && (
          <>
            <div className="op-form-grid">
              <Field label="Telefone do visitante" name="phone" type="tel" value={visit?.phone} />
              <Field label="Modelo do veículo" name="vehicle" value={visit?.vehicle} />
            </div>
            <Field label="Objetivo da visita" name="purpose" value={visit?.purpose} required />
            <Field label="Observação interna" name="notes" type="textarea" value={visit?.notes} />
            <p className="op-hint">
              A visita começa aguardando autorização. A entrada é registrada separadamente após a
              confirmação.
            </p>
          </>
        )}
        {error && (
          <p className="op-error" role="alert">
            {error}
          </p>
        )}
        <footer className="op-form-footer">
          <button type="button" className="op-button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="op-button primary">
            Salvar cadastro
          </button>
        </footer>
      </form>
    </Modal>
  );
}

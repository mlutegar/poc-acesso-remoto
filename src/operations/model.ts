export interface Unit {
  id: string;
  block: string;
  number: string;
  phone: string;
  intercom: string;
  notes: string;
  rented: boolean;
  active: boolean;
}
export interface Resident {
  id: string;
  unitId: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  relationship: string;
  owner: boolean;
  principal: boolean;
  plate: string;
  vehicle: string;
  color: string;
  notes: string;
  active: boolean;
}
export interface Permit {
  id: string;
  residentId: string;
  name: string;
  document: string;
  company: string;
  plate: string;
  start: string;
  end: string;
  from: string;
  until: string;
  days: number[];
  reason: string;
  active: boolean;
}
export type VisitStatus = "pendente" | "autorizada" | "presente" | "negada" | "finalizada";
export interface Visit {
  id: string;
  residentId: string;
  name: string;
  document: string;
  phone: string;
  company: string;
  plate: string;
  vehicle: string;
  purpose: string;
  notes: string;
  status: VisitStatus;
  createdAt: string;
  entryAt: string;
  exitAt: string;
  permitId: string;
}
export interface Log {
  id: string;
  entityId: string;
  at: string;
  actor: string;
  message: string;
}
export interface Data {
  version: 1;
  revision: number;
  units: Unit[];
  residents: Resident[];
  permits: Permit[];
  visits: Visit[];
  logs: Log[];
}
export type Collection = "units" | "residents" | "permits" | "visits";
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const identity = (s: string) => normalize(s).replace(/[^a-z0-9]/g, "");
export const unitName = (u?: Unit) => (u ? `${u.block} · ${u.number}` : "Unidade não encontrada");
export const statusLabels: Record<VisitStatus, string> = {
  pendente: "Aguardando autorização",
  autorizada: "Autorizada",
  presente: "No condomínio",
  negada: "Acesso negado",
  finalizada: "Finalizada",
};
export function localClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (key: string) => parts.find((p) => p.type === key)!.value;
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  return {
    date,
    time: `${get("hour")}:${get("minute")}`,
    day: new Date(`${date}T12:00:00Z`).getUTCDay(),
  };
}
export function permitValid(p: Permit, now = new Date()) {
  const clock = localClock(now);
  return (
    p.active &&
    clock.date >= p.start &&
    clock.date <= p.end &&
    p.days.includes(clock.day) &&
    clock.time >= p.from &&
    clock.time <= p.until
  );
}
export function matchingPermit(
  data: Data,
  visit: Pick<Visit, "document" | "residentId">,
  now = new Date()
) {
  return data.permits.find(
    (p) =>
      identity(p.document) === identity(visit.document) &&
      p.residentId === visit.residentId &&
      permitValid(p, now)
  );
}
function responsible(data: Data, id: string) {
  const r = data.residents.find((r) => r.id === id);
  if (!r?.active || !data.units.some((u) => u.id === r.unitId && u.active))
    throw new Error("Selecione um condômino ativo de uma residência ativa.");
}
export function validate(
  data: Data,
  collection: Collection,
  item: Unit | Resident | Permit | Visit
) {
  if (collection === "units") {
    const u = item as Unit;
    if (!u.block.trim() || !u.number.trim())
      throw new Error("Preencha bloco e número da residência.");
    if (
      data.units.some(
        (x) =>
          x.id !== u.id &&
          identity(x.block) === identity(u.block) &&
          identity(x.number) === identity(u.number)
      )
    )
      throw new Error("Já existe uma residência com esse bloco e número.");
    if (!u.active && data.residents.some((r) => r.unitId === u.id && r.active))
      throw new Error("Inative os condôminos vinculados antes de inativar a residência.");
  } else if (collection === "residents") {
    const r = item as Resident;
    if (!r.name.trim() || !identity(r.document)) throw new Error("Preencha nome e documento.");
    if (!data.units.some((u) => u.id === r.unitId && (u.active || !r.active)))
      throw new Error("Selecione uma residência ativa.");
    if (data.residents.some((x) => x.id !== r.id && identity(x.document) === identity(r.document)))
      throw new Error("Já existe um condômino com esse documento.");
    if (
      r.active &&
      r.principal &&
      data.residents.some((x) => x.id !== r.id && x.unitId === r.unitId && x.active && x.principal)
    )
      throw new Error("A residência já possui um responsável principal.");
    const previous = data.residents.find((x) => x.id === r.id);
    if (
      previous &&
      (!r.active || r.unitId !== previous.unitId) &&
      (data.visits.some(
        (v) => v.residentId === r.id && ["pendente", "autorizada", "presente"].includes(v.status)
      ) ||
        data.permits.some((p) => p.residentId === r.id && p.active))
    )
      throw new Error(
        "Encerre as visitas e inative as pré-autorizações vinculadas antes de inativar ou transferir este condômino."
      );
  } else if (collection === "permits") {
    const p = item as Permit;
    responsible(data, p.residentId);
    if (!p.name.trim() || !identity(p.document))
      throw new Error("Preencha nome e documento do visitante.");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(p.start) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(p.end) ||
      p.end < p.start
    )
      throw new Error("Informe um período de validade válido.");
    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.from) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.until) ||
      p.until < p.from
    )
      throw new Error(
        "O horário final deve ser igual ou posterior ao inicial. Para passar da meia-noite, cadastre dois períodos."
      );
    if (!p.days.length || p.days.some((d) => !Number.isInteger(d) || d < 0 || d > 6))
      throw new Error("Selecione ao menos um dia da semana válido.");
    if (!p.reason.trim()) throw new Error("Informe a justificativa da pré-autorização.");
  } else {
    const v = item as Visit;
    responsible(data, v.residentId);
    if (!v.name.trim() || !identity(v.document) || !v.purpose.trim())
      throw new Error("Preencha nome, documento e objetivo da visita.");
    if (
      data.visits.some(
        (x) =>
          x.id !== v.id &&
          identity(x.document) === identity(v.document) &&
          ["pendente", "autorizada", "presente"].includes(x.status)
      )
    )
      throw new Error("Este visitante já possui uma visita em andamento.");
  }
}
export function transition(
  data: Data,
  id: string,
  action: "authorize" | "permit" | "enter" | "deny" | "finish",
  reason = "",
  now = new Date()
): Visit {
  const v = data.visits.find((v) => v.id === id);
  if (!v) throw new Error("Visita não encontrada.");
  const allowed = {
    authorize: ["pendente"],
    permit: ["pendente"],
    enter: ["autorizada"],
    deny: ["pendente", "autorizada"],
    finish: ["presente"],
  };
  if (!allowed[action].includes(v.status))
    throw new Error("Esta ação não é válida para a situação atual da visita.");
  if (["authorize", "permit", "enter"].includes(action)) responsible(data, v.residentId);
  if (action === "authorize" && !reason.trim())
    throw new Error("Registre como o responsável confirmou a autorização.");
  if (action === "deny" && !reason.trim()) throw new Error("Informe o motivo da negativa.");
  const next = { ...v };
  if (action === "permit") {
    const p = matchingPermit(data, v, now);
    if (!p)
      throw new Error(
        "Não há pré-autorização válida para este documento, responsável, dia e horário."
      );
    next.permitId = p.id;
  }
  if (
    action === "enter" &&
    v.permitId &&
    !data.permits.some(
      (p) =>
        p.id === v.permitId &&
        p.residentId === v.residentId &&
        identity(p.document) === identity(v.document) &&
        permitValid(p, now)
    )
  )
    throw new Error(
      "A pré-autorização não está mais válida. Crie uma nova visita após encerrar esta autorização."
    );
  next.status =
    action === "enter"
      ? "presente"
      : action === "finish"
        ? "finalizada"
        : action === "deny"
          ? "negada"
          : "autorizada";
  if (action === "enter") next.entryAt = now.toISOString();
  if (action === "finish") next.exitAt = now.toISOString();
  return next;
}
export function seed(): Data {
  return {
    version: 1,
    revision: 0,
    units: [
      {
        id: "u-demo-1",
        block: "A",
        number: "101",
        phone: "",
        intercom: "101",
        notes: "",
        rented: false,
        active: true,
      },
      {
        id: "u-demo-2",
        block: "B",
        number: "204",
        phone: "",
        intercom: "204",
        notes: "",
        rented: true,
        active: true,
      },
    ],
    residents: [
      {
        id: "r-demo-1",
        unitId: "u-demo-1",
        name: "Ana Exemplo",
        document: "DEMO-101",
        phone: "",
        email: "",
        relationship: "Titular",
        owner: true,
        principal: true,
        plate: "ABC1D23",
        vehicle: "Sedan",
        color: "Prata",
        notes: "Cadastro fictício para demonstração.",
        active: true,
      },
      {
        id: "r-demo-2",
        unitId: "u-demo-2",
        name: "Bruno Exemplo",
        document: "DEMO-204",
        phone: "",
        email: "",
        relationship: "Titular",
        owner: false,
        principal: true,
        plate: "",
        vehicle: "",
        color: "",
        notes: "",
        active: true,
      },
    ],
    visits: [],
    permits: [],
    logs: [],
  };
}
// Validate the persisted envelope and field types before the UI uses it.
export function isData(value: unknown): value is Data {
  if (!value || typeof value !== "object") return false;
  const d = value as Data;
  if (d.version !== 1 || !Number.isSafeInteger(d.revision) || d.revision < 0) return false;
  const shapes: Record<string, Record<string, string>> = {
    units: {
      id: "string",
      block: "string",
      number: "string",
      phone: "string",
      intercom: "string",
      notes: "string",
      rented: "boolean",
      active: "boolean",
    },
    residents: {
      id: "string",
      unitId: "string",
      name: "string",
      document: "string",
      phone: "string",
      email: "string",
      relationship: "string",
      owner: "boolean",
      principal: "boolean",
      plate: "string",
      vehicle: "string",
      color: "string",
      notes: "string",
      active: "boolean",
    },
    permits: {
      id: "string",
      residentId: "string",
      name: "string",
      document: "string",
      company: "string",
      plate: "string",
      start: "string",
      end: "string",
      from: "string",
      until: "string",
      reason: "string",
      active: "boolean",
    },
    visits: {
      id: "string",
      residentId: "string",
      name: "string",
      document: "string",
      phone: "string",
      company: "string",
      plate: "string",
      vehicle: "string",
      purpose: "string",
      notes: "string",
      status: "string",
      createdAt: "string",
      entryAt: "string",
      exitAt: "string",
      permitId: "string",
    },
    logs: { id: "string", entityId: "string", at: "string", actor: "string", message: "string" },
  };
  for (const [key, shape] of Object.entries(shapes)) {
    const rows = (d as unknown as Record<string, unknown>)[key];
    if (
      !Array.isArray(rows) ||
      !rows.every(
        (row) => row && Object.entries(shape).every(([field, type]) => typeof row[field] === type)
      ) ||
      new Set(rows.map((r) => r.id)).size !== rows.length
    )
      return false;
  }
  return (
    d.permits.every(
      (p) =>
        Array.isArray(p.days) &&
        p.days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    ) &&
    d.visits.every((v) => Object.prototype.hasOwnProperty.call(statusLabels, v.status)) &&
    d.residents.every((r) => d.units.some((u) => u.id === r.unitId)) &&
    [...d.visits, ...d.permits].every((x) => d.residents.some((r) => r.id === x.residentId))
  );
}

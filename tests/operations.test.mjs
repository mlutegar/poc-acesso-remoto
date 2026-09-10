import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  validate,
  transition,
  permitValid,
  matchingPermit,
  isData,
  localClock,
} from "../src/operations/model.ts";

const now = new Date("2026-09-10T15:00:00Z"); // Thursday, noon in São Paulo.
const visitor = () => ({
  id: "v1",
  residentId: "r-demo-1",
  name: "Visitante Teste",
  document: "TEST-01",
  phone: "",
  company: "",
  plate: "",
  vehicle: "",
  purpose: "Entrega",
  notes: "",
  status: "pendente",
  createdAt: now.toISOString(),
  entryAt: "",
  exitAt: "",
  permitId: "",
});
const permit = () => ({
  id: "p1",
  residentId: "r-demo-1",
  name: "Visitante Teste",
  document: "TEST01",
  company: "",
  plate: "",
  start: "2026-09-10",
  end: "2026-09-10",
  from: "08:00",
  until: "18:00",
  days: [4],
  reason: "Serviço agendado",
  active: true,
});
function fixture() {
  const d = seed();
  d.visits.push(visitor());
  d.permits.push(permit());
  return d;
}

test("rejects duplicate units and documents including punctuation variants", () => {
  const d = seed();
  assert.throws(
    () => validate(d, "units", { ...d.units[0], id: "another", block: "a" }),
    /Já existe/
  );
  assert.throws(
    () => validate(d, "residents", { ...d.residents[0], id: "another", document: "demo101" }),
    /documento/
  );
});
test("protects active relationships from inactivation or reassignment", () => {
  const d = fixture();
  assert.throws(() => validate(d, "units", { ...d.units[0], active: false }), /Inative/);
  assert.throws(() => validate(d, "residents", { ...d.residents[0], active: false }), /Encerre/);
  assert.throws(
    () => validate(d, "residents", { ...d.residents[0], unitId: d.units[1].id, principal: false }),
    /Encerre/
  );
});
test("requires one principal resident and an active unit", () => {
  const d = seed();
  assert.throws(
    () => validate(d, "residents", { ...d.residents[0], id: "new", document: "NEW" }),
    /principal/
  );
  d.units[0].active = false;
  assert.throws(() => validate(d, "residents", d.residents[0]), /residência ativa/);
});
test("rejects duplicate active visits and allows a new visit after departure", () => {
  const d = fixture();
  assert.throws(
    () => validate(d, "visits", { ...visitor(), id: "v2", document: "test01" }),
    /andamento/
  );
  d.visits[0].status = "finalizada";
  assert.doesNotThrow(() => validate(d, "visits", { ...visitor(), id: "v2" }));
});
test("checks permit dates, weekdays, times and São Paulo timezone", () => {
  const p = permit();
  assert.equal(permitValid(p, now), true);
  assert.equal(permitValid({ ...p, days: [1] }, now), false);
  assert.equal(permitValid({ ...p, active: false }, now), false);
  assert.equal(permitValid(p, new Date("2026-09-10T22:00:00Z")), false);
  assert.equal(localClock(new Date("2026-09-11T01:00:00Z")).date, "2026-09-10");
  assert.equal(permitValid(p, new Date("2026-09-11T15:00:00Z")), false);
});
test("validates period ordering and rejects an empty weekly schedule", () => {
  const d = fixture();
  assert.throws(() => validate(d, "permits", { ...permit(), end: "2026-09-09" }), /período/);
  assert.throws(
    () => validate(d, "permits", { ...permit(), from: "22:00", until: "06:00" }),
    /horário/
  );
  assert.throws(() => validate(d, "permits", { ...permit(), days: [] }), /dia/);
});
test("permit matches document and responsible resident, never just a visitor name", () => {
  const d = fixture();
  assert.equal(matchingPermit(d, visitor(), now)?.id, "p1");
  assert.equal(matchingPermit(d, { ...visitor(), residentId: "r-demo-2" }, now), undefined);
  assert.equal(matchingPermit(d, { ...visitor(), document: "different" }, now), undefined);
});
test("enforces the full manual authorization → entry → departure cycle", () => {
  const d = fixture();
  assert.throws(() => transition(d, "v1", "enter", "", now), /não é válida/);
  assert.throws(() => transition(d, "v1", "authorize", "", now), /responsável/);
  d.visits[0] = transition(d, "v1", "authorize", "Confirmado por interfone", now);
  assert.equal(d.visits[0].status, "autorizada");
  d.visits[0] = transition(d, "v1", "enter", "", now);
  assert.equal(d.visits[0].entryAt, now.toISOString());
  d.visits[0] = transition(d, "v1", "finish", "", now);
  assert.equal(d.visits[0].status, "finalizada");
  assert.equal(d.visits[0].exitAt, now.toISOString());
  assert.throws(() => transition(d, "v1", "finish", "", now), /não é válida/);
});
test("rechecks revoked or expired permit at entry time", () => {
  const d = fixture();
  d.visits[0] = transition(d, "v1", "permit", "", now);
  assert.equal(d.visits[0].permitId, "p1");
  assert.throws(
    () => transition(d, "v1", "enter", "", new Date("2026-09-10T23:00:00Z")),
    /mais válida/
  );
  d.permits[0].active = false;
  assert.throws(() => transition(d, "v1", "enter", "", now), /mais válida/);
});
test("denial requires a reason and cannot lead to entry", () => {
  const d = fixture();
  assert.throws(() => transition(d, "v1", "deny", "", now), /motivo/);
  d.visits[0] = transition(d, "v1", "deny", "Não autorizado", now);
  assert.throws(() => transition(d, "v1", "enter", "", now), /não é válida/);
});
test("rejects corrupt persisted data, dangling relations and invalid states", () => {
  assert.equal(isData(seed()), true);
  assert.equal(isData(fixture()), true);
  assert.equal(isData({ version: 1 }), false);
  const d = fixture();
  d.visits[0].status = "unknown";
  assert.equal(isData(d), false);
  const other = fixture();
  other.residents = [];
  assert.equal(isData(other), false);
});

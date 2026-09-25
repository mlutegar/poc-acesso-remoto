import test from "node:test";
import assert from "node:assert/strict";
import { seed, validate, isData, migrate, reservationState } from "../src/operations/model.ts";

const vehicle = (extra = {}) => ({
  id: "v1",
  unitId: "u-demo-1",
  residentId: "r-demo-1",
  plate: "ABC1D23",
  model: "Sedan",
  color: "Prata",
  notes: "",
  active: true,
  ...extra,
});
const area = (extra = {}) => ({
  id: "a1",
  name: "Salão",
  description: "",
  capacity: 20,
  opensAt: "08:00",
  closesAt: "22:00",
  active: true,
  ...extra,
});
const reservation = (extra = {}) => ({
  id: "res1",
  areaId: "a1",
  unitId: "u-demo-1",
  residentId: "r-demo-1",
  date: "2026-10-10",
  startsAt: "10:00",
  endsAt: "12:00",
  participants: 10,
  notes: "",
  status: "confirmada",
  createdAt: "2026-09-25T12:00:00.000Z",
  cancelledAt: "",
  ...extra,
});

test("veículos aceitam vários por condômino, mas não placa ativa duplicada", () => {
  const d = seed();
  validate(d, "vehicles", vehicle({ id: "v2", plate: "DEF2G34" }));
  assert.throws(() => validate(d, "vehicles", vehicle({ id: "v2" })), /placa/);
  assert.throws(
    () => validate(d, "vehicles", vehicle({ id: "v2", plate: "ABC-123" })),
    /placa válida/
  );
  assert.throws(
    () => validate(d, "vehicles", vehicle({ id: "v2", plate: "DEF2G34", residentId: "r-demo-2" })),
    /mesma residência/
  );
  d.vehicles[0].active = false;
  validate(d, "vehicles", vehicle({ id: "v2" }));
});

test("reservas verificam horário, capacidade e sobreposição; canceladas liberam o horário", () => {
  const d = seed();
  d.areas = [area()];
  validate(d, "reservations", reservation());
  d.reservations = [reservation()];
  assert.throws(
    () =>
      validate(d, "reservations", reservation({ id: "res2", startsAt: "11:00", endsAt: "13:00" })),
    /Já existe/
  );
  validate(d, "reservations", reservation({ id: "res2", startsAt: "12:00", endsAt: "14:00" }));
  assert.throws(
    () => validate(d, "reservations", reservation({ id: "res2", startsAt: "07:00" })),
    /funcionamento/
  );
  assert.throws(
    () => validate(d, "reservations", reservation({ id: "res2", participants: 21 })),
    /quantidade/
  );
  assert.throws(
    () => validate(d, "reservations", reservation({ id: "res2", date: "2026-02-30" })),
    /data e horário/
  );
  d.reservations[0].status = "cancelada";
  validate(d, "reservations", reservation({ id: "res2" }));
  assert.equal(reservationState(d.reservations[0]), "cancelada");
});

test("área com reservas futuras não pode reduzir capacidade ou fechar antes da reserva", () => {
  const d = seed();
  d.areas = [area()];
  d.reservations = [reservation({ date: "2099-10-10" })];
  assert.throws(() => validate(d, "areas", area({ capacity: 5 })), /reservas futuras/);
  assert.throws(() => validate(d, "areas", area({ closesAt: "11:00" })), /reservas futuras/);
  assert.throws(() => validate(d, "areas", area({ active: false })), /reservas futuras/);
});

test("migração de v3 transforma placa do morador sem perder demais entidades", () => {
  const d = seed();
  const old = structuredClone(d);
  old.version = 3;
  delete old.vehicles;
  delete old.areas;
  delete old.reservations;
  const next = migrate(old);
  assert.ok(next && isData(next));
  assert.equal(next.vehicles.length, 1);
  assert.equal(next.vehicles[0].plate, "ABC1D23");
  assert.equal(next.residents[0].name, d.residents[0].name);
});

test("um arquivo local sem áreas recebe as cinco áreas de demonstração", () => {
  const old = seed();
  old.areas = [];
  const next = migrate(structuredClone(old));
  assert.ok(next && isData(next));
  assert.equal(next.areas.length, 5);
  assert.ok(next.areas.some((a) => a.name === "Campo de futebol"));
  assert.deepEqual(next.residents, old.residents);
});

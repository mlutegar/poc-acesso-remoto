import test from "node:test";
import assert from "node:assert/strict";
import { seed, validate, isData, migrate } from "../src/operations/model.ts";
import { demoData } from "../src/operations/demo.ts";

const base = () => {
  const d = seed();
  d.units = [
    { id: "u1", block: "1", number: "101", phone: "", intercom: "101", notes: "", rented: false, active: true },
    { id: "u2", block: "1", number: "102", phone: "", intercom: "102", notes: "", rented: false, active: false },
  ];
  d.residents = [
    { id: "r1", unitId: "u1", name: "Helena Exemplo", document: "DEMO-1", phone: "", email: "", relationship: "Titular", owner: true, principal: true, plate: "", vehicle: "", color: "", notes: "", active: true },
    { id: "r2", unitId: "u1", name: "Rodrigo Exemplo", document: "DEMO-2", phone: "", email: "", relationship: "Cônjuge", owner: false, principal: false, plate: "", vehicle: "", color: "", notes: "", active: false },
  ];
  return d;
};
const animal = (extra = {}) => ({
  id: "a1", unitId: "u1", residentId: "", name: "Nina", species: "Cão",
  breed: "", color: "", size: "Médio", notes: "", active: true, ...extra,
});
const bicicleta = (extra = {}) => ({
  id: "b1", unitId: "u1", residentId: "", brand: "Caloi", model: "", color: "Preta",
  code: "BIC-014", notes: "", active: true, ...extra,
});

test("animal exige nome, espécie e residência ativa", () => {
  const d = base();
  validate(d, "pets", animal());
  assert.throws(() => validate(d, "pets", animal({ name: " " })), /nome e a espécie/);
  assert.throws(() => validate(d, "pets", animal({ species: "" })), /nome e a espécie/);
  assert.throws(() => validate(d, "pets", animal({ unitId: "u2" })), /residência ativa/);
  assert.throws(() => validate(d, "pets", animal({ unitId: "inexistente" })), /residência ativa/);
  // Inativar o animal de uma residência inativa continua sendo possível.
  validate(d, "pets", animal({ unitId: "u2", active: false }));
});

test("responsável do animal precisa ser condômino ativo da mesma residência", () => {
  const d = base();
  validate(d, "pets", animal({ residentId: "r1" }));
  assert.throws(() => validate(d, "pets", animal({ residentId: "r2" })), /condômino ativo/);
  assert.throws(() => validate(d, "pets", animal({ residentId: "outro" })), /condômino ativo/);
  d.units[1].active = true;
  assert.throws(
    () => validate(d, "pets", animal({ unitId: "u2", residentId: "r1" })),
    /mesma residência/
  );
});

test("bicicleta exige marca e cor, e o código não se repete entre as ativas", () => {
  const d = base();
  validate(d, "bikes", bicicleta());
  assert.throws(() => validate(d, "bikes", bicicleta({ brand: "" })), /marca e a cor/);
  assert.throws(() => validate(d, "bikes", bicicleta({ color: " " })), /marca e a cor/);
  d.bikes = [bicicleta()];
  assert.throws(() => validate(d, "bikes", bicicleta({ id: "b2" })), /mesmo código|esse código/);
  // Código livre quando a outra bicicleta está inativa, e sem código não há conflito.
  d.bikes = [bicicleta({ active: false })];
  validate(d, "bikes", bicicleta({ id: "b2" }));
  d.bikes = [bicicleta()];
  validate(d, "bikes", bicicleta({ id: "b2", code: "" }));
});

test("o formato anterior sobe para a versão 3 sem perder cadastros", () => {
  const antigo = demoData();
  antigo.version = 2;
  delete antigo.pets;
  delete antigo.bikes;
  const migrado = migrate(JSON.parse(JSON.stringify(antigo)));
  assert.ok(migrado, "migração de v2 recusada");
  assert.equal(migrado.version, 3);
  assert.deepEqual(migrado.pets, []);
  assert.deepEqual(migrado.bikes, []);
  assert.equal(migrado.residents.length, antigo.residents.length);

  // E o formato original, de antes do bloco 2, ainda sobe direto para v3.
  const v1 = seed();
  v1.version = 1;
  for (const c of ["mail", "issues", "notices", "pets", "bikes"]) delete v1[c];
  const doV1 = migrate(JSON.parse(JSON.stringify(v1)));
  assert.ok(doV1, "migração de v1 recusada");
  assert.equal(doV1.version, 3);
});

test("a demonstração traz animais e bicicletas coerentes", () => {
  const d = demoData();
  assert.equal(isData(d), true);
  assert.ok(d.pets.length >= 5 && d.bikes.length >= 5);
  assert.ok(d.pets.some((p) => !p.active), "sem animal no histórico");
  assert.ok(d.bikes.some((b) => !b.active), "sem bicicleta no histórico");
  for (const x of [...d.pets, ...d.bikes]) {
    assert.ok(d.units.some((u) => u.id === x.unitId), `${x.id} sem residência`);
    if (x.residentId) {
      const r = d.residents.find((y) => y.id === x.residentId);
      assert.ok(r && r.unitId === x.unitId, `${x.id} com responsável de outra residência`);
    }
  }
  for (const p of d.pets.filter((p) => p.active)) validate(d, "pets", p);
  for (const b of d.bikes.filter((b) => b.active)) validate(d, "bikes", b);
});

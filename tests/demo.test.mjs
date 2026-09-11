import test from "node:test";
import assert from "node:assert/strict";
import { isData, identity, noticeState, permitValid, validate } from "../src/operations/model.ts";
import { demoData } from "../src/operations/demo.ts";

test("o conjunto de demonstração é um arquivo local válido", () => {
  assert.equal(isData(demoData()), true);
});

test("respeita as regras de cadastro que a aplicação cobra do usuário", () => {
  const d = demoData();
  // Documento único entre condôminos.
  const docs = d.residents.map((r) => identity(r.document));
  assert.equal(new Set(docs).size, docs.length);
  // Um responsável principal ativo por residência, e residência ativa.
  for (const u of d.units) {
    const ativos = d.residents.filter((r) => r.unitId === u.id && r.active);
    assert.ok(
      ativos.filter((r) => r.principal).length <= 1,
      `dois principais em ${u.block}/${u.number}`
    );
    if (!u.active)
      assert.equal(ativos.length, 0, `residência inativa com morador em ${u.block}/${u.number}`);
  }
  // Nenhuma visita em andamento repete documento.
  const abertas = d.visits.filter((v) => ["pendente", "autorizada", "presente"].includes(v.status));
  const vistos = abertas.map((v) => identity(v.document));
  assert.equal(new Set(vistos).size, vistos.length);
  // Toda visita e pré-autorização aponta para condômino ativo de residência ativa.
  for (const x of [...abertas, ...d.permits.filter((p) => p.active)]) {
    const r = d.residents.find((y) => y.id === x.residentId);
    assert.ok(r?.active, `responsável inativo em ${x.id}`);
    assert.ok(
      d.units.some((u) => u.id === r.unitId && u.active),
      `residência inativa em ${x.id}`
    );
  }
  // Cada cadastro passa pela mesma validação usada ao salvar pela interface.
  for (const [collection, rows] of [
    ["units", d.units],
    ["residents", d.residents],
    ["permits", d.permits],
    ["visits", abertas],
    ["mail", d.mail.filter((m) => m.status !== "retirada")],
    ["issues", d.issues],
    ["notices", d.notices],
  ]) {
    for (const row of rows) validate(d, collection, row);
  }
});

test("a demonstração mostra todas as situações de cada módulo", () => {
  const d = demoData();
  for (const status of ["pendente", "autorizada", "presente", "negada", "finalizada"])
    assert.ok(
      d.visits.some((v) => v.status === status),
      `sem visita ${status}`
    );
  for (const status of ["recebida", "avisada", "retirada"])
    assert.ok(
      d.mail.some((m) => m.status === status),
      `sem correspondência ${status}`
    );
  assert.ok(
    d.issues.some((i) => i.status === "aberta" && i.pinned),
    "sem ocorrência fixada"
  );
  assert.ok(
    d.issues.some((i) => i.status === "encerrada"),
    "sem ocorrência encerrada"
  );
  assert.ok(
    d.issues.some((i) => i.replies.length >= 2),
    "sem ocorrência com conversa"
  );
  for (const state of ["agendado", "ativo", "finalizado"])
    assert.ok(
      d.notices.some((n) => noticeState(n) === state),
      `sem comunicado ${state}`
    );
  assert.ok(
    d.permits.some((p) => permitValid(p)) || d.permits.some((p) => p.active),
    "sem pré-autorização ativa"
  );
  assert.ok(
    d.units.some((u) => !u.active),
    "sem residência no histórico"
  );
  assert.ok(
    d.residents.some((r) => !r.active),
    "sem condômino no histórico"
  );
});

test("os documentos são de CPF inválido, para não coincidirem com pessoas reais", () => {
  const d = demoData();
  const digitos = (doc) => doc.replace(/\D/g, "");
  const valido = (doc) => {
    const n = digitos(doc);
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    const calc = (ate) => {
      let soma = 0;
      for (let i = 0; i < ate; i++) soma += Number(n[i]) * (ate + 1 - i);
      return ((soma * 10) % 11) % 10;
    };
    return calc(9) === Number(n[9]) && calc(10) === Number(n[10]);
  };
  const todos = [...d.residents, ...d.visits, ...d.permits].map((x) => x.document);
  const comFormatoCpf = todos.filter((doc) => digitos(doc).length === 11);
  assert.ok(comFormatoCpf.length > 30, "esperava documentos em formato de CPF");
  for (const doc of comFormatoCpf) assert.equal(valido(doc), false, `${doc} é um CPF válido`);
});

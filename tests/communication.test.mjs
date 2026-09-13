import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  validate,
  isData,
  migrate,
  mailTransition,
  issueTransition,
  noticeTransition,
  noticeState,
  recipients,
} from "../src/operations/model.ts";

const now = new Date("2026-09-10T15:00:00Z"); // Quinta-feira, meio-dia em São Paulo.
const letter = () => ({
  id: "m1",
  residentId: "r-demo-1",
  description: "Caixa média",
  tracking: "BR-123",
  carrier: "Transportadora Demo",
  receivedBy: "Portaria",
  attachment: "",
  notes: "",
  status: "recebida",
  createdAt: now.toISOString(),
  noticedAt: "",
  pickupAt: "",
  pickedBy: "",
});
const issue = () => ({
  id: "i1",
  kind: "Manutenção",
  description: "Lâmpada queimada no hall",
  place: "Bloco A",
  residentId: "",
  reporter: "Portaria",
  shared: false,
  pinned: false,
  notify: false,
  attachment: "",
  status: "aberta",
  createdAt: now.toISOString(),
  closedAt: "",
  replies: [],
});
const notice = () => ({
  id: "n1",
  subject: "Manutenção da caixa d'água",
  body: "Haverá interrupção no fornecimento.",
  audience: "todos",
  unitId: "",
  attachment: "",
  start: "2026-09-10",
  startTime: "08:00",
  end: "2026-09-10",
  endTime: "18:00",
  email: false,
  push: false,
  tenants: true,
  finished: false,
  createdAt: now.toISOString(),
});
const fixture = () => {
  const data = seed();
  data.mail = [letter()];
  data.issues = [issue()];
  data.notices = [notice()];
  return data;
};

test("carrega o formato anterior sem descartar os cadastros", () => {
  const old = seed();
  old.version = 1;
  delete old.mail;
  delete old.issues;
  delete old.notices;
  const upgraded = migrate(JSON.parse(JSON.stringify(old)));
  assert.ok(upgraded);
  assert.equal(upgraded.version, 3);
  assert.deepEqual(upgraded.mail, []);
  assert.equal(upgraded.residents.length, old.residents.length);
  assert.equal(migrate({ version: 1, revision: 0 }), null);
  assert.equal(migrate("nada"), null);
});

test("correspondência exige destinatário ativo, descrição e rastreio livre", () => {
  const data = fixture();
  assert.throws(() => validate(data, "mail", { ...letter(), description: " " }), /Descreva/);
  assert.throws(() => validate(data, "mail", { ...letter(), receivedBy: "" }), /quem recebeu/);
  assert.throws(
    () => validate(data, "mail", { ...letter(), residentId: "inexistente" }),
    /condômino ativo/
  );
  assert.throws(
    () => validate(data, "mail", { ...letter(), id: "m2", tracking: "br123" }),
    /aguardando retirada/
  );
  data.mail[0].status = "retirada";
  validate(data, "mail", { ...letter(), id: "m2", tracking: "br123" });
});

test("ciclo da correspondência: aviso, retirada e ações fora de ordem", () => {
  const data = fixture();
  data.mail[0] = mailTransition(data, "m1", "notify", "", now);
  assert.equal(data.mail[0].status, "avisada");
  assert.ok(data.mail[0].noticedAt);
  assert.throws(() => mailTransition(data, "m1", "notify", "", now), /não é válida/);
  assert.throws(() => mailTransition(data, "m1", "pickup", "  ", now), /quem retirou/);
  data.mail[0] = mailTransition(data, "m1", "pickup", "Ana Exemplo", now);
  assert.equal(data.mail[0].status, "retirada");
  assert.equal(data.mail[0].pickedBy, "Ana Exemplo");
  assert.throws(() => mailTransition(data, "m1", "pickup", "Ana Exemplo", now), /não é válida/);
});

test("ocorrência registra respostas e encerra com desfecho", () => {
  const data = fixture();
  assert.throws(() => validate(data, "issues", { ...issue(), kind: "" }), /tipo e a descrição/);
  assert.throws(() => issueTransition(data, "i1", "reply", " ", now), /Escreva a resposta/);
  data.issues[0] = issueTransition(data, "i1", "reply", "Zelador acionado", now, "operador");
  assert.equal(data.issues[0].replies.length, 1);
  assert.equal(data.issues[0].status, "aberta");
  data.issues[0] = issueTransition(data, "i1", "pin", "", now);
  assert.equal(data.issues[0].pinned, true);
  assert.throws(() => issueTransition(data, "i1", "close", "", now), /como a ocorrência/);
  data.issues[0] = issueTransition(data, "i1", "close", "Lâmpada trocada", now);
  assert.equal(data.issues[0].status, "encerrada");
  assert.equal(data.issues[0].pinned, false);
  assert.equal(data.issues[0].replies.length, 2);
  assert.throws(() => issueTransition(data, "i1", "reply", "mais um", now), /já foi encerrada/);
  assert.throws(
    () => validate(data, "issues", { ...data.issues[0], pinned: true }),
    /não pode ficar fixada/
  );
});

test("comunicado valida período, destino e lista de destinatários", () => {
  const data = fixture();
  assert.throws(() => validate(data, "notices", { ...notice(), subject: " " }), /assunto e o texto/);
  assert.throws(
    () => validate(data, "notices", { ...notice(), start: "10/09/2026" }),
    /disparo válidos/
  );
  assert.throws(
    () => validate(data, "notices", { ...notice(), end: "2026-09-10", endTime: "07:00" }),
    /posterior ao disparo/
  );
  assert.throws(
    () => validate(data, "notices", { ...notice(), audience: "unidade", unitId: "" }),
    /residência ativa/
  );
  validate(data, "notices", { ...notice(), end: "", endTime: "" });
  // A residência B/204 é alugada e o morador não é proprietário.
  assert.equal(recipients(data, { audience: "todos", unitId: "", tenants: true }).length, 2);
  assert.equal(recipients(data, { audience: "todos", unitId: "", tenants: false }).length, 1);
  assert.equal(recipients(data, { audience: "proprietarios", unitId: "", tenants: true }).length, 1);
  data.units.push({ ...data.units[0], id: "u-vazia", block: "C", number: "1" });
  assert.throws(
    () => validate(data, "notices", { ...notice(), audience: "unidade", unitId: "u-vazia" }),
    /Nenhum condômino ativo/
  );
});

test("estado do comunicado vem do relógio de Brasília e da finalização manual", () => {
  const n = notice();
  assert.equal(noticeState(n, new Date("2026-09-10T10:00:00Z")), "agendado"); // 07:00 local
  assert.equal(noticeState(n, now), "ativo"); // 12:00 local
  assert.equal(noticeState(n, new Date("2026-09-10T23:00:00Z")), "finalizado"); // 20:00 local
  assert.equal(noticeState({ ...n, end: "", endTime: "" }, new Date("2026-09-30T23:00:00Z")), "ativo");
  const data = fixture();
  data.notices[0] = noticeTransition(data, "n1", "finish", "", now);
  assert.equal(noticeState(data.notices[0], now), "finalizado");
  assert.throws(() => noticeTransition(data, "n1", "finish", "", now), /já está finalizado/);
  data.notices[0] = noticeTransition(data, "n1", "reopen", "", now);
  assert.equal(noticeState(data.notices[0], now), "ativo");
  assert.throws(
    () => noticeTransition(data, "n1", "reopen", "", now),
    /finalizado manualmente/
  );
});

test("recusa dados persistidos inválidos nos módulos novos", () => {
  assert.equal(isData(fixture()), true);
  const badStatus = fixture();
  badStatus.mail[0].status = "extraviada";
  assert.equal(isData(badStatus), false);
  const dangling = fixture();
  dangling.mail[0].residentId = "r-inexistente";
  assert.equal(isData(dangling), false);
  const badReplies = fixture();
  badReplies.issues[0].replies = [{ id: "x", at: "", author: "" }];
  assert.equal(isData(badReplies), false);
  const badAudience = fixture();
  badAudience.notices[0].audience = "sindico";
  assert.equal(isData(badAudience), false);
  const badUnit = fixture();
  badUnit.notices[0].audience = "unidade";
  badUnit.notices[0].unitId = "u-inexistente";
  assert.equal(isData(badUnit), false);
});

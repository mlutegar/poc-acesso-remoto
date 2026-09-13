import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const layout = readFileSync("src/components/Layout.tsx", "utf8");
const app = readFileSync("src/App.tsx", "utf8");

const doMenu = [...layout.matchAll(/to:\s*"([^"]+)"/g)].map((m) => m[1]);
const rotas = new Set([...app.matchAll(/path="([^"]+)"/g)].map((m) => m[1]));

test("todo item do menu tem uma tela", () => {
  assert.ok(doMenu.length > 30, `esperava o menu completo, encontrei ${doMenu.length}`);
  const semTela = doMenu.filter((to) => !rotas.has(to));
  assert.deepEqual(semTela, [], `itens de menu sem rota: ${semTela.join(", ")}`);
});

const ehPagina = (f) =>
  f.endsWith(".tsx") && readFileSync(`src/preview/${f}`, "utf8").includes("export default function");

test("toda tela de prévia está ligada a uma rota", () => {
  const telas = readdirSync("src/preview").filter(ehPagina);
  const orfas = telas.filter((f) => !app.includes(`./preview/${f.replace(".tsx", "")}`));
  assert.deepEqual(orfas, [], `telas não roteadas: ${orfas.join(", ")}`);
  assert.ok(telas.length >= 31, `esperava ao menos 26 telas, encontrei ${telas.length}`);
});

test("nenhuma prévia finge gravar em silêncio", () => {
  for (const f of readdirSync("src/preview").filter(ehPagina)) {
    const src = readFileSync(`src/preview/${f}`, "utf8");
    if (!src.includes("<form")) continue;
    assert.ok(
      src.includes("setAviso(") && /ainda não grava|ainda não está ligada/.test(src),
      `${f} tem formulário sem avisar que não grava`
    );
  }
});

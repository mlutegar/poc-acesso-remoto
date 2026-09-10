# 07 — Paleta de Cor / Identidade Visual

[[00-Painel|← Painel]]

## 🎨 Conceito
Azul-marinho + azul elétrico + branco (muito espaço em branco), detalhes em verde/vermelho/laranja para **status**.
- 🔵 Navy — segurança, confiança, estabilidade
- 🔷 Azul elétrico — tecnologia, modernidade
- ⚪ Branco / cinza claro — limpeza, leitura fácil
- 🟢 Verde — acesso autorizado / online
- 🔴 Vermelho — acesso negado / alerta
- 🟠 Laranja — atenção / equipamento com problema

## Tabela de cores (tokens)
| Elemento | Cor | Hex | Token |
|----------|-----|-----|-------|
| Menu lateral | Azul-marinho | `#0B1F3A` | `navy` |
| Botões principais | Azul | `#146EF5` | `blue` |
| Fundo | Cinza claro | `#F4F7FA` | `bg` |
| Cards | Branco | `#FFFFFF` | `card` |
| Acesso liberado | Verde | `#16A34A` | `success` |
| Negado / Alerta | Vermelho | `#DC2626` | `danger` |
| Atenção | Laranja | `#F59E0B` | `warning` |
| Texto principal | Grafite | `#172033` | `ink` |

> Estes tokens estão implementados em `tailwind.config.ts` e `src/theme/tokens.ts`.

Relacionado: [[06-Nome-do-Produto]] · [[08-Escopo-POC-Acesso]]

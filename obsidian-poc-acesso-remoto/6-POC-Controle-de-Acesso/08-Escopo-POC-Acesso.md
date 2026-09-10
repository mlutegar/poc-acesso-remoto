# 08 — Escopo POC: Controle de Acesso Remoto

[[00-Painel|← Painel]]

> 1º processo do produto. Nesta etapa: **somente front (mock)**; integração com hardware vem depois.

## Objetivo
Demonstrar a operação de portaria: **identificar → autorizar/negar → registrar**, com status visual claro.

## Telas (front)
1. **Login** — branding do produto.
2. **Dashboard / Operação**
   - Cards de resumo (acessos hoje, autorizados, negados, alertas).
   - **Feed ao vivo** de acessos com status grande (🟢/🔴/🟠) no formato do cliente.
   - Painel de câmeras (placeholder) + status dos [[09-Equipamentos|dispositivos]].
3. **Eventos de Acesso** — tabela filtrável (tipo, pessoa, porta, resultado, hora).
4. **Pessoas** — moradores/visitantes + credenciais (facial, TAG, placa).
5. **Dispositivos** — leitores com status online/offline/atenção.

## Regras de status
- 🟢 **Autorizado** — credencial válida.
- 🔴 **Negado** — credencial inválida / sem permissão.
- 🟠 **Atenção** — porta/portão aberto há X min, dispositivo com problema.

## Fora do escopo (nesta etapa)
- Backend, persistência, integração real com leitores, autenticação real.

Relacionado: [[03-Escopo-Geral]] · [[09-Equipamentos]] · [[07-Paleta-de-Cor]]

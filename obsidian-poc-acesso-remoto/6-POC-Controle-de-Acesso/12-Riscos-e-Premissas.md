# 12 — Riscos e Premissas

[[00-Painel|← Painel]]

## ⚠️ Riscos
| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Dependência de SDK/API de terceiros (Control iD, Hikvision ISAPI, SIP Intelbras) | Alto | POC de integração cedo, com equipamento emprestado |
| Latência de rede na portaria remota | Médio | Buffer local + reconexão; testar em campo |
| Dado biométrico facial = sensível (LGPD) | Alto | Ver [[13-LGPD]] |
| Escopo crescer além do acesso remoto | Médio | Requisitos numerados ([[11-Requisitos-Funcionais]]) |
| Nome/branding não definido trava marketing | Baixo | Decisão com prazo ([[06-Nome-do-Produto]]) |
| Firmware/modelos diferentes de leitores | Médio | Camada de abstração por fabricante |

## 📌 Premissas
- Equipamentos emprestados pelo cliente estão operacionais ([[09-Equipamentos]]).
- Nesta etapa: **somente front + mock**, sem backend.
- Rede da portaria com acesso à internet para operação remota.
- Cliente fornece dados reais (moradores/veículos) só na fase de integração.

Relacionado: [[11-Requisitos-Funcionais]] · [[05-Cronograma-Geral]]

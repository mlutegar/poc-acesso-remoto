# Portaris — POC Controle de Acesso / Portaria Remota

Protótipo **front-end** (white-label) do módulo de controle de acesso remoto.
Cliente âncora: Grupo R Johnson (marca **não** vinculada — produto revendável).

## Stack
React + Vite + TypeScript + TailwindCSS. Dados mockados (sem backend).

## Rodar
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de produção (tsc + vite)
npm run lint      # ESLint
npm run format    # Prettier
npm run typecheck # tsc --noEmit
```

## Funcionalidades
- **Login** com rota protegida (`RequireAuth`) — sem sessão, redireciona para `/login`.
- **Operação (Dashboard)**: cards de resumo + **feed ao vivo** (novos eventos entrando em tempo real, com pausa) + status visual grande (🟢🔴🟠).
- **Ações de portaria** nos cards: abrir porta / interfone / negar (toast de confirmação).
- **Modal de detalhe**: foto/placa capturada, dispositivo, histórico do dia.
- **Eventos**: tabela filtrável + busca + estado vazio.
- **Pessoas**: moradores/visitantes e credenciais (facial/TAG/placa).
- **Veículos (LPR)**: acesso veicular por placa (Hikvision 406) e TAG (Control iD).
- **Dispositivos**: status online/offline/atenção dos equipamentos reais.
- **White-label em runtime**: seletor de marca (Portaris / Vigio / Sentric) troca nome + paleta na hora.
- **Dark mode** + acessibilidade (aria-labels, foco, contraste).
- Responsivo (sidebar vira drawer no mobile).

## Onde mexer
- `src/theme/tokens.ts` — **presets de marca** (white-label): nome, tagline, cores navy/azul.
- `src/theme/ThemeProvider.tsx` — troca de marca + dark mode (CSS variables).
- `src/auth/AuthProvider.tsx` — auth mock + `RequireAuth`.
- `src/data/mock.ts` — eventos, pessoas, veículos, dispositivos + pool do feed ao vivo.
- `src/hooks/useLiveFeed.ts` — simulação de tempo real.
- `src/components/` · `src/pages/` — UI.

## Documentação
Vault Obsidian: `obsidian-poc-acesso-remoto/` — abrir `0-Painel/00-Painel.md`.
Destaques: requisitos (RF01…), riscos & premissas, LGPD (dado biométrico).

## Paleta
Navy `#0B1F3A` · Azul `#146EF5` · Fundo `#F4F7FA` · Verde `#16A34A` · Vermelho `#DC2626` · Laranja `#F59E0B` · Grafite `#172033`

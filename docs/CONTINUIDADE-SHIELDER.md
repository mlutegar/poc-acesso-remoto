# Continuidade econômica — reprodução funcional do Shielder

## Contexto acordado

A usuária quer reproduzir o aplicativo usado pelo cliente a partir do Shielder autenticado no Chrome Marina. Aceitou começar pela auditoria e pelo mapa funcional, com economia de tokens. A inspeção inicial e a comparação com o código estão em `docs/MAPA-SHIELDER.md`.

## O que já foi feito

- Repositório clonado, dependências instaladas e build validado na etapa inicial.
- Endereço do protótipo iniciado: `http://127.0.0.1:5173/`.
- Mapa estrutural de 77 rotas de Shielder, incluindo formulários e parâmetros.
- Conferência visual do padrão desktop e leitura dos principais fluxos de dados.
- Primeiro bloco implementado após a auditoria: navegação horizontal, residências, condôminos, visitas e pré-autorizações. Detalhes em `docs/IMPLEMENTACAO-SHIELDER.md`.
- Segundo bloco implementado: correspondências, ocorrências com respostas e comunicados com agendamento, mais a migração dos dados locais para `version: 2`. Detalhes no mesmo arquivo.
- Terceiro bloco: camada visual no padrão do sistema de referência (cabeçalho, menu completo com submenus, listagens, formulários, login), com paleta própria. Tokens medidos: fundo `#eee`, texto `#333`, azul da referência `#102372` (não copiado; usa-se o navy do preset), Helvetica Neue 14px, título 28px, cabeçalho de tabela `#e0e0e0` 16px, zebra `#f9f9f9`, botão pequeno `#f5f5f5` 12px, busca 410×30px, tabela 940px.
- Nenhum formulário foi enviado nem equipamento acionado durante a consulta. Aba devolvida a Comunicados.

## Como continuar sem repetir a auditoria

1. Ler o mapa local e a cobertura em `docs/COBERTURA-SHIELDER.md`, e conferir o estado atual do código. Não reler as 77 telas.
2. Usar as etapas e critérios de aceite da seção 8 como sequência de implementação.
3. Retornar ao Shielder somente para a dúvida concreta do fluxo em desenvolvimento, com a sessão atual identificada novamente se necessário.
4. Extrair títulos, rótulos, cabeçalhos, controles e ações; omitir valores dos cadastros. Deduplicar controles e links repetidos antes de exibir resultados.
5. Usar capturas visuais apenas quando forem necessárias para conferir layout; não registrar fotos/cadastros reais no repositório.
6. Reutilizar busca, tabelas, filtros, formulários e estados comuns. Manter regras próprias para autorização, retirada, votação e empréstimo.
7. Verificar cada entrega com um fluxo de dados fictícios completo; atualizar o mapa/backlog com o que realmente foi implementado.

## Decisões ainda não tomadas

- Quais reclamações do cliente orientarão melhorias além da equivalência.
- Backend, banco, hospedagem, autenticação e integrações de produção.
- App do morador e módulos invisíveis no perfil web observado.
- Protocolo e ambiente de testes dos equipamentos físicos.

## Próxima entrega sugerida após o segundo bloco

Etapa 4 do mapa: usuários e perfis, com as permissões efetivamente aplicadas às telas já existentes, e os parâmetros por condomínio que mudam os campos exigidos nos formulários. É o primeiro bloco em que a auditoria encontrou regras que alteram o comportamento do que já foi construído, e não apenas cadastros novos.

Antes disso, vale decidir com a cliente o que motivou o projeto: o mapa registra como pendência as reclamações concretas sobre o Shielder. Elas mudam o que compensa reproduzir fielmente e o que compensa fazer diferente.

A navegação atual inclui apenas módulos implementados e os painéis de exemplo anteriores, identificados como simulados.

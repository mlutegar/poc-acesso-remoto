# Continuidade econômica — reprodução funcional do Shielder

## Contexto acordado

A usuária quer reproduzir o aplicativo usado pelo cliente a partir do Shielder autenticado no Chrome Marina. Aceitou começar pela auditoria e pelo mapa funcional, com economia de tokens. A inspeção inicial e a comparação com o código estão em `docs/MAPA-SHIELDER.md`.

## O que já foi feito

- Repositório clonado, dependências instaladas e build validado na etapa inicial.
- Endereço do protótipo iniciado: `http://127.0.0.1:5173/`.
- Mapa estrutural de 77 rotas de Shielder, incluindo formulários e parâmetros.
- Conferência visual do padrão desktop e leitura dos principais fluxos de dados.
- Primeiro bloco implementado após a auditoria: navegação horizontal, residências, condôminos, visitas e pré-autorizações. Detalhes em `docs/IMPLEMENTACAO-SHIELDER.md`.
- Nenhum formulário foi enviado nem equipamento acionado durante a consulta. Aba devolvida a Comunicados.

## Como continuar sem repetir a auditoria

1. Ler o mapa local e conferir o estado atual do código. Não reler as 77 telas.
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

## Próxima entrega sugerida após o primeiro bloco

Correspondências com recebimento, destinatário e retirada; ocorrências e respostas; comunicados com estados e agendamento. Reutilizar `src/operations` para dados e controles comuns, mantendo as regras próprias de cada fluxo. A navegação atual inclui apenas módulos implementados e os painéis de exemplo anteriores, identificados como simulados.

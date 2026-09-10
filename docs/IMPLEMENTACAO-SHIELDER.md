# Primeiro bloco implementado — 10/09/2026

## Entregue

- Cabeçalho e navegação horizontal inspirados no padrão observado, preservando a identidade Portaris e os temas white-label.
- `/residencias`: criar/editar/inativar/reativar, bloco/número, telefone/interfone, aluguel, observações, filtros de ocupação e vínculo para os condôminos.
- `/condominos`: cadastro vinculado à residência, documento, contatos, parentesco, proprietário/principal, veículo, observações e situação.
- `/visitas`: cadastro com responsável, documento, veículo, empresa, objetivo e observação; autorização manual com confirmação registrada; entrada; negativa com motivo; saída e histórico.
- `/pre-autorizacoes`: documento/responsável, datas, horas e dias da semana, empresa/placa, justificativa, edição e ativação/inativação. Aplicação à visita após conferir a validade; nova verificação na entrada.
- Busca sem distinção de acentos, filtros combinados, paginação de 15 registros e CSV dos registros filtrados.
- Histórico local por entidade com operador e horário de Brasília; registros preservados após recarregar.
- Proteções contra unidades/documentos duplicados, múltiplos responsáveis principais, visitas simultâneas do mesmo documento e inativação de vínculos em uso.
- Dados de demonstração separados dos antigos arrays mockados. Gravação em `localStorage`, chave `portaris-operations-v1`, com versão/revisão, validação estrutural e mensagem de erro se a gravação falhar.

## Verificação

- `npm test`: 11 testes de regras, abrangendo duplicidade, integridade de vínculos, validade/horários/fuso, estados da visita, negativa, revogação e dados locais inválidos.
- `npm run build`: TypeScript e build Vite.
- Pela interface: residência Demo 301 → Carla Demonstração → Diego Demonstração → autorização → entrada → saída → histórico. Persistência conferida após recarregar.
- Pela interface: pré-autorização de Elisa Demonstração aplicada à visita; busca por nome sem acentos; exportação filtrada; tentativa de inativar residência com condômino ativo rejeitada.
- Aparência conferida em desktop e no painel estreito. As tabelas permitem rolagem horizontal em telas pequenas; formulários passam para uma coluna.
- Sem erros de execução no console durante a verificação. Os registros fictícios utilizados ficaram no navegador como exemplos.

## Limites desta entrega

É o primeiro bloco do mapa de 77 rotas, não a reprodução integral do Shielder. Os campos implementados representam o núcleo desses quatro fluxos, não todos os parâmetros e campos condicionais do produto de referência.

O login continua demonstrativo. A persistência é por origem/navegador, não é um banco multiusuário ou um registro de auditoria inviolável. Não usar dados reais nesta fase. O caminho de produção requer autenticação, autorização e transações no backend.

Autorizar/entrar/sair apenas registra os eventos locais; não aciona portas, valida biometria nem envia mensagens. Painel, eventos, veículos e equipamentos antigos continuam disponíveis em Administração, identificados como exemplos/simulações. O veículo do novo cadastro de condômino não é sincronizado com a antiga lista mockada de veículos.

Regras como documento único, um principal por unidade e impedimento de transferência com vínculos ativos são decisões deste protótipo. Não foram comprovadas como regras idênticas do servidor Shielder. Não há passagem de faixa horária pela meia-noite em uma única pré-autorização; cadastrar dois períodos.

Próximos módulos: correspondências/retirada, ocorrências/respostas e comunicados; depois administração, gestão e integrações conforme o mapa funcional.

## Comandos

```sh
npm run dev -- --host 127.0.0.1
npm run build
npm test
```

O comando de testes utiliza o suporte a TypeScript do Node (22.6 ou posterior). Nenhuma dependência nova foi adicionada.

# Segundo bloco implementado — 10/09/2026

## Entregue

- Migração dos dados locais do formato do bloco 1 (`version: 1`) para o `version: 2`, completando as coleções novas em vez de recusar o conteúdo já gravado. Sem ela, os cadastros existentes apareceriam como "Formato de dados locais inválido" e as gravações ficariam bloqueadas.
- `/correspondencias`: destinatário vinculado ao condômino e à residência, descrição, rastreio, remetente e quem recebeu; ciclo recebida → avisada → retirada com registro de quem retirou; rastreio único entre as que ainda aguardam retirada.
- `/ocorrencias`: tipo, local, condômino envolvido opcional, visibilidade aos condôminos, fixação no topo e notificação simulada; respostas encadeadas com autor e horário; encerramento exige o desfecho, que fica gravado como última resposta e desafixa a ocorrência.
- `/comunicados`: assunto, texto, anexo por nome, destino (todos, proprietários ou uma residência), disparo e finalização com data e hora, email e app simulados e visibilidade a inquilinos. O estado Agendado/Ativo/Finalizado é calculado pelo relógio de Brasília; finalizar e reabrir são manuais.
- Cada comunicado mostra quantos condôminos correspondem ao destino escolhido, e o cadastro é recusado quando esse número é zero.
- Abas, busca sem acento, filtros, paginação de 15, exportação CSV respeitando os filtros e histórico por entidade, reaproveitados em `src/operations/List.tsx`.

## Verificação

- `npm test`: 18 testes (11 do bloco 1 mais 7 novos), cobrindo a migração do formato anterior, o ciclo da correspondência, o rastreio duplicado, respostas e encerramento da ocorrência, período e destino do comunicado, o estado pelo fuso de Brasília e a recusa de dados persistidos inválidos.
- `npm run build` e `npx eslint . --ext ts,tsx` sem erros.
- Pelo navegador, com um payload no formato antigo gravado à mão: os cadastros anteriores continuaram na tela, sem mensagem de erro, e o arquivo local foi reescrito como `version: 2`.
- Pela interface: correspondência avisada e retirada; ocorrência respondida, fixada e encerrada; comunicado finalizado e reaberto. Em todos, o histórico recebeu a linha correspondente e os registros sobreviveram ao recarregamento. Sem erros no console.

## Limites desta entrega

Os cliques sintéticos da automação de navegador não disparam os manipuladores do React nesta aplicação; a verificação pela interface foi feita acionando os mesmos botões pelo contexto da página. Isso vale igualmente para as telas do bloco 1 e não indica problema no código.

Anexos guardam apenas o nome do arquivo. Não há upload nem armazenamento de binários: em `localStorage`, fotos em base64 estourariam a cota do navegador.

Avisar destinatário, notificar síndico e funcionários, enviar email e notificar no app ficam registrados no histórico, mas nada é enviado. São rotulados como simulados na interface.

O parâmetro "somente habitadas" do Shielder não foi implementado: como os destinatários são calculados a partir dos condôminos ativos, toda residência considerada já é habitada e a opção não mudaria o resultado. Favoritos e excluídos dos comunicados também ficaram de fora, por serem preferência de usuário e não fluxo.

As regras de rastreio único, desfecho obrigatório no encerramento e destino sem destinatários são decisões deste protótipo. Não foram comprovadas como regras do servidor Shielder.

## Estrutura

As três telas ficaram em `src/operations/Mail.tsx`, `Issues.tsx` e `Notices.tsx`, com os controles comuns em `List.tsx`. O formulário genérico do bloco 1 (`Forms.tsx`) continua atendendo apenas residências, condôminos, visitas e pré-autorizações, agora pelo tipo `CoreCollection`; cada módulo novo traz o seu próprio formulário, porque os campos e as regras não se sobrepõem.

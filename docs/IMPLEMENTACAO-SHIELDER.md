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

# Terceiro bloco — camada visual no padrão da referência — 10/09/2026

## Entregue

- Estrutura visual reproduzida a partir de capturas e dos estilos computados do sistema de referência, mantendo a paleta e a marca próprias (presets Portaris, Vigio e Sentric continuam funcionando): fundo cinza-claro `#eee`, texto `#333`, Helvetica Neue 14px/20px, títulos de página em caixa alta 28px, botão principal em azul-escuro, botões pequenos cinza em caixa alta, abas com a ativa em selo azul-escuro, busca centralizada de 410px, tabela zebrada de 940px com cabeçalho cinza em caixa alta.
- Cabeçalho em duas faixas: identificação, telefone, atalhos (anotações, notificações, procedimentos), nome do condomínio e usuário em cima; barra de menu com canto inferior direito arredondado embaixo. Submenus em cascata com os mesmos grupos do original.
- Menu completo com os 7 itens e os 33 subitens de Administração. Os itens sem tela abrem uma página de módulo previsto (`src/pages/Previsto.tsx`) com o que faz, o que vai ter e do que depende, alinhada à planilha de cobertura.
- Ícones em SVG inline (`src/components/Icons.tsx`) no lugar dos glifos unicode; formulários em janela com o mesmo tratamento das telas de cadastro (título em caixa alta, rótulos em negrito, campos de 35px, botão Salvar largo); estado vazio como faixa cinza "Nenhum registro encontrado!"; login sóbrio com a mesma faixa azul-escura.
- Cartões de estatística, breadcrumb, selo "Demonstração local" e rodapés de aviso saíram das listagens. O aviso de demonstração ficou no menu do usuário e no login.

## Verificação

- `npm run build`, `npx eslint` e `npm test` (18 testes) sem erros. O servidor de desenvolvimento precisou ser reiniciado para carregar as cores novas do `tailwind.config.ts`.
- Conferido no navegador: login, Visitas, Correspondências, Ocorrências, formulário de nova correspondência, submenu Administração › Gestão, página de módulo previsto (Usuários) e o painel simulado antigo.

## Limites

- Reprodução a olho, a partir de capturas e de estilos computados; não é cópia do CSS nem pixel a pixel. Logo, nome e cores exatas do sistema de referência não foram copiados de propósito.
- Os formulários continuam em janela; no original são páginas próprias ("Cadastro de visitante"). O tratamento visual é o mesmo, a navegação não.
- As listagens do original mostram foto do visitante/morador e uma linha com criação/atualização por registro; aqui não há fotos e o histórico fica em janela.
- As páginas de exemplo anteriores (painel, eventos, veículos, dispositivos) mantêm a aparência antiga de cartões; o painel operacional do próprio original também usa cartões modernos, então a diferença é aceitável para a demonstração.
- Capturas do sistema de referência ficaram fora do repositório por conterem dados de moradores.

# Conjunto de demonstração — 11/09/2026

## Entregue

- `src/operations/demo.ts`: um condomínio fictício com movimento de um dia comum de portaria — 12 residências (uma inativa, em reforma), 21 condôminos (um inativo, no histórico), 16 visitas cobrindo as cinco situações, 6 pré-autorizações (uma vencida), 12 correspondências nas três situações, 7 ocorrências (duas fixadas, duas encerradas, algumas com conversa) e 6 comunicados nos três estados.
- As datas são calculadas a cada carga, relativas a agora, para as listas nunca parecerem antigas numa apresentação.
- O navegador sem dados gravados passa a abrir com esse conjunto, em vez das duas residências de exemplo.
- No menu do usuário, "Recarregar demonstração" restaura tudo em dois cliques — para reiniciar a apresentação depois de mexerem nos dados. O segundo clique avisa que apaga o que foi cadastrado. São dois botões em vez de um `confirm()` do navegador, que travaria a janela.

## Origem dos dados

Nada foi copiado do sistema de referência. Nomes, endereços, telefones, placas e textos são inventados. Os documentos têm formato de CPF com dígitos verificadores propositalmente inválidos, de modo que não correspondem ao documento de nenhuma pessoa — há teste automatizado verificando isso.

## Verificação

- `npm test`: 22 testes (4 novos). Os novos conferem que o conjunto passa pelo `isData`, que cada cadastro passa pela mesma `validate` usada ao salvar pela interface, que as regras de negócio são respeitadas (documento único, um principal por residência, nenhuma visita aberta repetida, responsáveis ativos) e que todas as situações de cada módulo aparecem.
- `npm run build` e `npx eslint` sem erros.
- Conferido no navegador: as seis telas com os dados, o botão de recarregar gravando as 12+21+16+12+7+6 linhas, e uma gravação normal em cima dos dados de demonstração (aviso de correspondência) subindo a revisão e o histórico.

# Telas de prévia e espaço de foto — 13/09/2026

## Entregue

- **26 telas novas**, uma por arquivo em `src/preview/`, cobrindo todos os itens do menu que antes caíam numa página de texto: Usuários, Funcionários, Enquetes, Assembleia, Achados/Perdidos, os nove de Gestão, os nove de Relatórios e telefonia e os quatro de Configurações. São listagens navegáveis com colunas, abas, busca, paginação, atalhos e dados fictícios, mais o formulário de cadastro com os campos do original.
- Cada módulo tem **seu próprio arquivo**, com as colunas, as linhas e os campos dele, importando só os blocos já compartilhados (`Tabs`, `Pagination`, `Feedback`, `Photo`, classes do CSS). A ideia é que ligar um módulo aos dados depois seja mexer em um arquivo só, como foi com correspondências e ocorrências.
- Nenhuma dessas telas grava. Ao clicar em Salvar aparece "Esta prévia mostra os campos do cadastro, mas ainda não grava"; nas demais ações, "Nesta prévia esta ação ainda não está ligada aos dados". É o mínimo para ninguém achar que cadastrou e perder o registro.
- `Condomínio` é a única que não é listagem: tem abas Dados gerais, Aparência e Parâmetros, esta última com uma amostra dos controles que afetam os módulos já construídos.
- **Espaço de foto** onde o original tem foto: visitante e condômino na listagem (iniciais do nome, borda na cor da situação e selo de câmera), encomenda (ícone de pacote), e o quadro com os botões Câmera e Arquivo nos cadastros de condômino, visitante, correspondência e ocorrência. É só apresentação — não muda o modelo de dados nem grava imagem, que em `localStorage` estouraria a cota.

## Verificação

- `npm test`: 25 testes (3 novos). Os novos garantem que todo item do menu tem rota, que toda tela de prévia está roteada, e que nenhuma prévia com formulário deixa de avisar que não grava.
- `npm run build` e `npx eslint` sem erros. Conferido no navegador: listagem com foto, formulário de exemplo com o quadro de foto, os dois avisos e a aba de parâmetros do condomínio.
- Um documento inventado para a tela de bloqueios saiu como CPF válido por acaso e foi trocado automaticamente por um inválido, pela mesma guarda usada no conjunto de demonstração.

## Limites

As prévias mostram dados fixos escritos no próprio arquivo: busca e abas filtram essas linhas, mas nada é gravado, e os números não conversam com os módulos que funcionam. O design é o mesmo das telas prontas, então refinar a aparência depois vale para todas de uma vez.

# Equipamentos, animais e bicicletas — 13/09/2026

## Entregue

- **Animais e Bicicletas funcionando de verdade** (`/animais`, `/bicicletas`): cadastro vinculado à residência e, opcionalmente, a um condômino dela, com busca, filtro, exportação, histórico e gravação. O código do bicicletário não se repete entre bicicletas ativas, e o responsável precisa ser condômino ativo da mesma residência. Não dependiam de equipamento — estavam na lista de pendências só por não terem sido feitas.
- **Seis telas novas de prévia**: Rotas, Dispositivos, Gatilhos, Credenciais de morador, Credenciais de visitante e Relatório de acessos. Com elas, todo item do menu passou a ter tela: nenhuma rota do mapa continua sem nada.
- **Aviso explícito de equipamento** (`src/preview/Hardware.tsx`) em **11 telas**: as cinco acima que dependem de equipamento, mais Acionadores, Câmeras, Bio/RFID, Ligações e Fila SIP. A faixa diz o que já está pronto e o que passa a funcionar quando o equipamento for conectado — é informação para a apresentação, não pedido de desculpas.
- A tela de dispositivos que vinha do protótipo inicial, com dados fixos, foi substituída por essa prévia.

## Migração para a versão 3

Animais e bicicletas são coleções novas no arquivo local. Quem já tinha dados gravados sobe de `version: 2` para `3` sem perder nada, e quem ainda estava na `1` sobe direto para a `3`. Há teste para os dois caminhos.

## Verificação

- `npm test`: 30 testes (5 novos), cobrindo as regras de animal e bicicleta, o responsável de outra residência, o código duplicado, as duas migrações e a coerência dos dados de demonstração.
- `npm run build` e `npx eslint` sem erros.
- Pelo navegador: a faixa de equipamento aparece nas telas certas; cadastrar um animal com responsável de outra residência é recusado com a mensagem correta e, corrigido o responsável, grava e aparece na lista; bicicleta com código repetido é recusada. O arquivo local subiu para a versão 3 mantendo os cadastros.

## Cobertura

Nenhuma das 77 rotas segue como "não iniciada": 16 parciais (funcionam), 59 em prévia — das quais 19 dependem de equipamento e trazem o aviso na tela — e 2 simuladas.

## O que falta para as telas de equipamento saírem da prévia

Não é só "ligar o aparelho". Precisa de: o modelo instalado em cada ponto de acesso e a documentação do fabricante; uma unidade de teste em bancada; e, principalmente, resolver a rede — o equipamento fica atrás do roteador do condomínio e um servidor na nuvem não o alcança, então será preciso um agente local dentro do condomínio, com fila de sincronização nos dois sentidos. O cadastro facial ainda exige consentimento e política de retenção, por ser dado sensível na LGPD.

# Identidade Átrio e visual corporativo — 13/09/2026

## Entregue

- O produto passa a se chamar **Átrio**, com a logo em `public/logo-atrio.jpeg` (recortada das margens; o arquivo original está em `docs/marca/`). O nome aparece no título da aba, no cabeçalho, no login e na documentação. A chave do armazenamento local mudou para `atrio-operations-v1`, lendo a antiga uma vez para ninguém perder o que já cadastrou.
- Paleta medida na própria logo: azul-marinho `#182838` (nome) e azul-aço `#405870` (o "A"). São os tokens `--c-navy` e `--c-blue`.
- Barra de marca clara com a logo, menu escuro na cor da marca, ambos alinhados à mesma coluna de 960px do conteúdo. Menu plano com o item ativo sublinhado. Fonte IBM Plex Sans. Títulos, botões, abas, cabeçalhos de tabela e selos em caixa normal; caixa alta só no menu. Selos em contorno, botões sem gradiente, cantos de 2px.
- A logo virou PNG com **fundo transparente** (preenchimento a partir das bordas, sem tocar no desenho; o JPEG original tinha fundo `#f9f9f9` com ruído entre `#f8` e `#f9`, que deixava um retângulo visível sobre o branco). A barra de marca usa exatamente `#f9f9f9` (`--c-brandbar`) por segurança; no modo escuro a barra e a placa da logo ficam escuras.
- Como só há uma marca, o seletor de marca some do login e do menu do usuário; fica o alternador claro/escuro.
- Duas versões da logo: `logo-atrio.png` completa, com o slogan, usada grande no login (124px), e `logo-atrio-marca.png` só com o "A" e o nome, usada no cabeçalho (48px numa barra de 72px). No cabeçalho o slogan é **texto tipografado** ao lado da marca, na cor azul-aço do "A": dentro da imagem, a 48px, ele teria 4px de altura e seria ilegível. A barra do login mostra só o condomínio, para não repetir a marca.

## O que não mudou

Modelo, regras, gravação, telas e testes. Só CSS, identidade e o markup do cabeçalho. Build, lint e os 30 testes iguais.

# Shielder — mapa funcional observado

Levantamento em 10/09/2026, na sessão autenticada do Chrome Marina. Referência: interface web de `https://www.shielder.com.br/index_web.php`. Comparação: repositório local `poc-acesso-remoto`.

## Cobertura e significado das evidências

Foram inspecionadas **77 rotas distintas**, incluindo listagens, relatórios, formulários e configurações. Algumas rotas apresentam a mesma tela, como `cadastrarCondominio` e `configurarCondominio`. Também foi aberto o atalho de anotações da portaria, que apresentou **Iniciar Novo Turno**, **Ver Histórico**, **Cancelar** e **Iniciar Turno**.

Este é um inventário da interface e dos campos disponíveis ao usuário atual. A presença de um botão demonstra que a ação é oferecida; não demonstra que sua execução, validação ou integração funcionou. Formulários foram consultados sem envio. Não foram executados acionamentos, notificações, reinícios, sincronizações, exclusões ou início de turno.

O documento registra estruturas e requisitos, sem copiar cadastros, imagens de pessoas, credenciais, endereços de equipamentos ou conteúdo privado dos registros. A aba foi devolvida à tela de Comunicados.

Ainda não constituem cobertura completa: aplicativo do morador, outros perfis de acesso, todos os estados de edição, conteúdo de registros históricos, combinações condicionais de parâmetros, erros de validação e comportamento real de equipamentos. Agenda/reservas e leituras aparecem nas configurações, mas suas telas operacionais não foram localizadas no menu desta sessão.

## Navegação e aparência

- Cabeçalho azul-escuro com identidade do condomínio/empresa, telefone, atalhos de anotações, ocorrências, procedimentos, condomínio e usuário.
- Menu horizontal: Visitas, Correspondências, Condôminos, Residências, Ocorrências, Comunicados e Administração.
- Administração: Usuários, Funcionários, Relatórios, Enquetes, Assembleia Virtual, Achados/Perdidos, Gestão e Configurações.
- Submenus em cascata; conteúdo central sobre fundo cinza-claro; títulos em caixa alta; ações de cadastro à direita; busca, abas de situação e listagens compactas.
- Abas Ativos/Histórico recorrentes, com variações por módulo. Exportação, seleção em lote e paginação existem em módulos específicos; não se deve presumir que todos ofereçam as mesmas operações.
- A aparência foi conferida visualmente em desktop. Não foram medidos tokens de cor, fontes ou dimensões exatas nem validada a versão móvel.

## 1. Operação e cadastros principais

| Módulo | Listagem e ações observadas | Campos e relações observados |
|---|---|---|
| Visitas | Ativas/histórico; busca por nome, placa, empresa, documentos e residência; Word/PDF/CSV/Excel; editar, notificar condôminos, cadastrar passageiro, pré-autorizar e finalizar; atalhos a câmeras, acionadores, acessos e pré-autorizações | Documento, CPF, validade, nome, câmera, placa/modelo/cor, vistoria do veículo, local e responsável, objetivo, telefone, prestador/empresa, observação interna, limite em minutos, rota e portaria de entrada |
| Pré-autorizações | Ativas/histórico; filtros por período e identidade/unidade; exportar; alternativas Lista e Facial; controle de acesso de visitante | Uma ou mais unidades, documento/CPF/nome, prestador/empresa, início/fim, faixa horária, dias da semana, endereço/telefone, validade CNH, veículo e justificativa |
| Correspondências | Ativas/histórico; busca por morador, residência, código e descrição; ordenação por destinatário/entrada; notificação de pendentes; Excel; colunas de entrada e saída | Descrição, rastreio, responsável, captura/arquivo de foto. Retirada e comprovantes aparecem também nos parâmetros; seu formulário completo não foi exercitado |
| Condôminos | Ativos/histórico; busca por identidade, contato, unidade e veículo; filtros por datas/idade, principal, proprietário, uso de app, biometria, acessos, aniversário e antiguidade do cadastro; Word/PDF/Excel; emails/backup; ações em lote e rota | Bloco/número; inquilino, proprietário, principal e parentesco; documento/CPF-CNPJ/nascimento/nome; foto e geração facial; telefones/email/endereço de correspondência; observação interna; autorizar app, chave virtual e agenda; rota/turno; validade/atestado; ID externo; veículo |
| Residências | Ativas/histórico; busca por bloco, número, placa, telefone, complemento e interfone; filtros habitadas, alugadas, inadimplentes, sem app e vazias; imprimir/exportar; vínculos para condôminos, animais, bicicletas, ramais e aluguel | Bloco/número, telefone/interfone/alias, complemento, informações; alugada/habitada/inadimplente; bloquear/silenciar Fale Síndico; duplicar notificação email/app; permitir reservas/convites; acesso e correspondência da unidade; fração ideal, limite de visitantes, controle, rota e geolocalização |
| Veículos | Ativos/histórico; período, busca e exportação; colunas morador, placa, modelo e cor | Cadastro de veículo também incorporado ao formulário de condômino; regras adicionais por condomínio |
| Animais | Ativos/histórico; busca por condômino, residência, nome, espécie e cor; Word/Excel | Formulário específico não localizado; relação com condômino/residência visível na listagem |
| Bicicletas | Ativas/histórico; busca por condômino, residência, marca, modelo e cor; Word/Excel | Formulário específico não localizado; relação com condômino/residência visível na listagem |

### Fluxos a reproduzir

1. **Residência → condômino → veículo/credencial → rota → registro de acesso.** As relações são indicadas por campos e atalhos; persistência e propagação aos equipamentos precisam de teste em ambiente próprio.
2. **Pré-autorização → visita → autorização/entrada → saída/histórico.** Considerar período, dias, horário, responsável, prestador, documento, veículo e limite de permanência. Precedência entre autorização e bloqueio ainda precisa de definição/validação.
3. **Correspondência → destinatário/unidade → aviso → retirada → histórico.** Fotos, recibos, facial e processamento em lote são configuráveis; não estão comprovados ponta a ponta por esta inspeção.

## 2. Comunicação e administração

| Módulo | Funções observadas | Cadastro/regras visíveis |
|---|---|---|
| Ocorrências | Ativas/histórico/fixadas; filtro por tipo; busca; Word/PDF/Excel; resposta; desativar selecionadas; ações relacionadas a ocorrências antigas | Descrição, tipo, local/responsável, notificar apps de síndico/funcionários, ocorrência pública e foto. A execução das ações de antiguidade não foi testada |
| Comunicados | Ativos, agendados, histórico, favoritos e excluídos; busca por descrição; Word/Excel; finalizar selecionados | Destino, assunto, agendamento de disparo/finalização, editor de texto, anexo, enviar email, notificar app, somente habitadas, visível a inquilinos |
| Usuários | Busca por nome/login; ativos/histórico; seleção em lote e finalização; log de acessos | Nome/login/senha, administrador, portaria, edição, ativo, faixa horária e intervalo. A listagem também exibe Configuração, Gestão, Fale Síndico e Comunicação; essas permissões não apareceram individualmente no formulário novo consultado |
| Funcionários/prestadores | Ativos/histórico; busca por nome; presentes/ausentes; Word/Excel; controle de acesso | Foto/facial, RG/CPF, nome, função/empresa, email/telefones; avisos de visita, correio, agenda e comunicado; tipo de ocorrência; rota; exibição aos moradores |
| Enquetes | Ativas/histórico; busca por nome/pergunta | Título, descrição formatada, anexo, público votante (todos, proprietários ou exceto inquilinos), comentários, pergunta e respostas adicionáveis/removíveis. Votação e apuração não foram testadas |
| Assembleias | Ativas/histórico/inativas; busca | Ordinária/extraordinária, datas/horários de início e fim, descrição formatada e anexo. Participação, quórum, votos e ata não foram observados |
| Achados/perdidos | Ativos/histórico; busca; exportação | Nome, descrição, exibir aos condôminos, foto por câmera/arquivo. Há campo de vistoria de saída na estrutura da listagem; baixa não executada |

## 3. Gestão condominial

| Módulo | Funções e campos observados |
|---|---|
| Manutenções | Calendário/lista; ativas/histórico; busca/exportação; nome, descrição, data, renovação e alerta |
| Bloqueios de visitantes | Ativos/histórico; busca por nome, RG, CPF e unidade; exportação; unidade, identidade, período, horário, dias da semana e justificativa |
| Bloqueios de veículos | Ativos/histórico; busca por placa/modelo/cor; exportação; placa, modelo, cor e outras características |
| Documentos | Ativos/histórico; busca; nome, arquivo, pasta, público (moradores/portaria/administradores), visibilidade a inquilinos, aceite obrigatório e compartilhamento no app. Interface informa Word/Excel/PowerPoint/PDF até 50 MB |
| Produtos | Ativos/histórico; busca/exportação; nome, descrição, valor e estoque; atualização de estoque/valor pela listagem |
| Inventário | Ativos/histórico; busca/exportação; código, descrição, setor, quantidade, unidade; listagem indica possibilidade de empréstimo; formulário novo contém 20 linhas para inclusão |
| Objetos | Busca por código/descrição; acesso ao inventário e aos empréstimos |
| Empréstimos | Busca por nome/descrição/setor; período; exportação; responsável, descrição, entrada e saída. Empréstimo/devolução não realizados |
| Fornecedores | Ativos/histórico; busca/exportação; foto, categoria, nome, telefones/email, descrição, exibição no app e dias de destaque |
| Procedimentos | Ativos/histórico; categoria e busca; cadastro de categoria, descrição formatada e imagem; atalho no cabeçalho |
| Turnos/anotações | Relatório de anotações de turno, ativos/histórico, usuário, período e exportação; atalho do cabeçalho oferece iniciar novo turno e ver histórico |
| Diário | Ativos/histórico; busca por descrição; anotação e início. Não confundir automaticamente com o relatório de turnos |

## 4. Relatórios

| Tela | Filtros/saídas observados |
|---|---|
| Painel operacional | Intervalo de datas; aplicar/limpar; indicadores de adesão ao app, visitas ativas, correspondências aguardando retirada; tabela residência/descrição/chegada/status. Valores dinâmicos não auditados |
| Relatório de acessos | Datas inicial/final, atualizar, salvar e imprimir |
| Relatório de visitas e residências | Datas inicial/final, atualizar, salvar e imprimir |
| Relatório de correspondências | Datas inicial/final, atualizar, salvar e imprimir |
| Acessos de condôminos / listar BIO-RFID | Datas, busca por responsável/unidade/tipo; filtro por acesso/equipamento e sem cadastro; paginação, ampliar, Word/PDF/Excel |
| Ligações | Período/exportação; origem, destino, atendente, data, TAA, duração e servidor |
| Fila SIP | Ativas/desabilitadas; nome, ramal, portaria, morador, central remota, padrão e online; nova fila com nome/ramal/portaria, exibir ao morador e padrão de login |
| Log de notificações | Busca por responsável/unidade/mensagem, datas, exportação; mensagem de aplicativo |
| Log de emails | Busca por responsável/unidade/mensagem, datas e exportação |
| Acessos de usuários | Nome, usuário, IP, início/fim; busca, período, portaria/administradores, paginação e exportação |
| Acionamentos | Busca por código/descrição, período, paginação e exportação; acesso a câmeras e acionadores |

Os formatos, totais, fuso, conteúdo exportado e impressão devem ser verificados na implementação. A auditoria apenas confirmou os controles disponíveis; não gerou exportações de dados reais.

## 5. Credenciais, equipamentos e integrações

| Módulo | Funções observadas |
|---|---|
| Controle de acesso de moradores | Ativas/histórico, pendentes e pânico; período, busca, paginação/exportação; responsável, ID/serial/código, descrição (TAG/placa/controle), rota, validade e pânico; atualizar/copiar/ativar/desativar em lote |
| Facial | Seleção de responsável, foto por câmera/arquivo e rota; também oferecida nos cadastros de morador e funcionário |
| Controle de acesso visitante | Ativas/histórico; pendentes, visitas e pré-autorizados; busca/exportação; cadastro de serial; copiar/apagar em lote |
| Dispositivos | Busca por nome/MAC/IP, filtro por tipo, ativos/histórico/novos/offline; editar, desabilitar, sincronizar, reiniciar individualmente ou em lote; último acesso; DDNS, rotas, relatórios de copiados/recusados e links a homologados/documentação |
| Acionadores | Ativos/histórico; busca/exportação; nome, dispositivo, relay, visível à portaria, tipo e CAN; vínculos com câmeras/gatilhos/acionamentos |
| Câmeras IP | Ativas/histórico; busca/exportação; nome, servidor, tipo/marca, canal, porta virtual, IP/DDNS, porta, método, usuário/senha, acionador, URL; gerar URL; exibição em app/visita/portaria e qualidade |
| Rotas | Ativas/histórico; busca/exportação; nome, múltiplos dispositivos e perfil (todos/condôminos/pré-autorizados/visitas) |
| Gatilhos | Ativos/histórico; busca/exportação; evento, múltiplos acionadores e campo de acionamentos; manual disponível. Sem execução de automações |

Na conta observada há equipamentos identificados na interface como **CONTROLID FACE** e **SERVIDOR CAMERAS P2P**. Isso não comprova acesso a SDK/API nem compatibilidade de todos os modelos citados no repositório. LPR, SIP, QR code, RFID, biometria, sensores, VMS e impressão aparecem como recursos/configurações.

## 6. Configuração por condomínio

### Dados gerais

Identificação, CNPJ, síndico responsável, contatos/endereço; contratos e boletos; valores/desconto/equipamentos/comissão/plano/parceiro; contato financeiro; logos; cor do layout, fuso, suporte e nomenclatura de unidades/condôminos; pré-cadastro; integração Superlógica; geolocalização; ligações por app, celular e WhatsApp; prévia de câmera; servidor SIP e central de interfone.

Campos de autenticação de integrações foram identificados pelo nome, sem ler ou registrar os valores. Contratos, boletos e seus conteúdos não foram abertos.

### Parâmetros

A página apresentou **206 controles distintos** na extração estrutural, incluindo a busca e o botão de salvar. Esse número não equivale a 206 funcionalidades independentes nem significa que estejam todas habilitadas.

Grupos e exemplos que impactam a implementação:

- **Pré-autorização e convites:** autorizar/avisar, quantidades máximas, lista, campos exigidos, rota, CNH, horários de convidados/prestadores, QR code/link e referência a Airbnb.
- **Visitantes e prestadores:** documento/CPF/telefone/foto/observação/objetivo, validade, empresa/carregamento, intervalo e horário de aviso.
- **Veículos:** dados obrigatórios, vistoria, bloqueio/furto e lembrar placa.
- **Regras de acesso:** entrada, aviso de autorização, prazo pendente, encerramento da visita, limite de tempo, alertas de identidade, facial/senha/rota e acionamento de relay.
- **Portaria:** encerramento manual/automático, avisos, delivery, ocorrências, parentesco, crachá, permissões de cadastro/remoção e módulos visíveis.
- **Correspondências e saída:** recibo, fotos de entrada/retirada, vistoria, lote, facial, aviso de saída e baixa pelo aplicativo.
- **Moradores e app:** validade/atestado, contatos, veículos por unidade, editar/incluir moradores/veículos/animais/bicicletas; autorização, chave virtual, pânico, offline, facial própria/de terceiros e remoção.
- **Comunicação:** Fale Portaria, Fale Síndico, Fale Vizinho, acesso administrativo do síndico e suspensão de comunicação.
- **Câmeras e automação:** webcam por finalidade, QR code, VMS externo, RFID/biometria, bloqueio/pânico, reentrada/validação de saída, facial duplicada, alerta de dispositivo, sensor de porta e porta crítica.
- **Portarias físicas:** nomes e portaria de serviço, com múltiplas entradas configuráveis.
- **Reservas e integrações:** agenda no app/portaria, limite de reservas/visitantes, bloqueio de nova visita, anúncios, totem e consulta LPR.
- **Hardware:** níveis de acesso/aviso para morador, pré-autorizado e visitante; notificações de acesso/correio/foto/vaga.
- **Impressão:** modo, QR codes e tickets por veículo/pedestre/correio, reimpressão, impressoras por portaria, frases e inclusão do documento; referência a JSPRINT.

Não foram levantadas todas as opções dos selects, valores ativos, dependências entre flags nem sua aplicação pelo servidor.

### Tabelas auxiliares

Tipos de ocorrência e respostas; tipos de agenda; blocos; pastas; tipos de documento; tipos de leitura; parentescos; turnos. Esses catálogos devem alimentar seletores compartilhados, em vez de serem repetidos como listas fixas em cada tela.

## 7. Comparação com o repositório

| Área | Estado atual verificado no código | Distância para a referência |
|---|---|---|
| Navegação | Cinco áreas: Operação, Eventos, Pessoas, Veículos e Dispositivos | Faltam menu administrativo e a maioria dos módulos; layout atual é lateral, enquanto a referência é horizontal |
| Login | `src/auth/AuthProvider.tsx`: usuário em `sessionStorage`; proteção de rota por presença desse valor | Faltam autenticação real, perfis, horários e autorização no servidor |
| Dados | `src/data/mock.ts`: arrays de exemplos | Faltam banco, persistência compartilhada, relacionamentos e isolamento por condomínio |
| Pessoas | `src/pages/Pessoas.tsx`: cards e busca por nome | Faltam cadastro/edição, residência estruturada, documentos, contatos, foto, vínculo familiar, permissões e filtros avançados |
| Visitas | Eventos e feed simulado | Falta entidade de visita com responsável, autorização, entrada, acompanhantes, saída e histórico |
| Ações | `src/components/AccessCard.tsx`: botões abrir/interfone/negar encaminhados ao callback do protótipo | Não representam integração real com portas ou telefonia |
| Eventos | `src/pages/Eventos.tsx`: filtro de status/nome e detalhes sobre mocks | Faltam período, equipamento, paginação real, exportação e trilha persistente |
| Veículos/equipamentos | Listas mockadas | Faltam cadastros, vínculo de credenciais, rotas, comunicação e estados reais |
| Comunicação, patrimônio e administração | Não presentes nas rotas de `src/App.tsx` | Implementação necessária |
| Marca/tema | Componentes e presets white-label já existentes | Reaproveitáveis; a organização visual precisa ser ajustada ao objetivo de equivalência |

O repositório é uma base de interface, não uma cópia funcional do Shielder. Trocar cores e adicionar menus não resolve os fluxos ausentes. Esta etapa adicionou documentação; não alterou as telas do protótipo.

## 8. Ordem de implementação proposta

| Etapa | Entrega | Critério de aceite |
|---|---|---|
| 1 — Base operacional | Navegação equivalente; residências, condôminos, veículos, funcionários, credenciais e catálogos | Criar/editar/inativar dados relacionados, pesquisar e recarregar preservando o estado; apresentar histórico |
| 2 — Portaria | Visitas, pré-autorizações, bloqueios, correspondências e painel | Completar visita e recebimento/retirada com dados de demonstração; validar períodos/horários; registrar responsáveis e histórico |
| 3 — Comunicação | Ocorrências/respostas, comunicados/agendamento, documentos, turnos e diário | Destinos e permissões coerentes; histórico; anexos; estados ativos/agendados/finalizados |
| 4 — Administração | Usuários/perfis, parâmetros por condomínio, filtros/exportações e auditoria | Permissões efetivamente aplicadas; parâmetros refletidos nos formulários; exportações respeitando filtros |
| 5 — Gestão | Enquetes/assembleias, achados, manutenção, fornecedores, produtos, inventário, objetos/empréstimos | Fluxos específicos implementados e validados, sem tratar todos como um cadastro genérico |
| 6 — Integrações | Equipamentos, facial/RFID/LPR, câmeras, acionadores/gatilhos, SIP, notificações e impressão | Homologação com serviços e equipamentos de teste; resultado verificável e tratamento de falhas |

As etapas são uma proposta de execução, não evidência de trabalho implementado. Para protótipo, usar dados fictícios persistidos localmente e indicar operações simuladas. Para substituir o sistema em operação, precisam ser definidos backend, infraestrutura, integrações acessíveis e migração de dados.

## 9. Pendências de descoberta

- Reclamações concretas do cliente e quais fluxos ele quer preservar ou melhorar.
- Permissões e módulos de outros perfis; app do morador e agenda/reservas/leituras.
- Autorização negada, expirada, duplicada, visita com passageiro, bloqueio concorrente, saída, retirada/devolução e formulários condicionais.
- Validações obrigatórias, campos únicos, limites, ordenação e regras de exclusão/reativação no servidor.
- Respostas, votos, quórum, resultados, contratos/boletos e estados de registros não percorridos.
- Edição de dispositivo/DDNS, histórico de parâmetros, geração de ramais e atualização de aluguel: links identificados, fluxos não executados.
- Hardware/API/SDK disponíveis, formatos de notificações e impressão, além dos modelos indicados na interface.
- Comportamento móvel, acessibilidade e comparação visual de cada fluxo.

## 10. Índice das rotas inspecionadas

Todas pertencem ao parâmetro `p` de `https://www.shielder.com.br/index_web.php?p=ROTA`. Os nomes são referências de rastreabilidade, não nomes obrigatórios para as rotas do novo produto.

```text
Operação (18):
listarVisitas, cadastrarVisitante,
listarCorrespondencias, cadastrarCorrespondencia,
listarMoradores, cadastrarMorador,
listarResidencias, cadastrarResidencia,
listarVeiculosMorador, listarAnimais, listarBicicletas,
listarPreAutorizacoes, cadastrarPreAutorizacao,
listarTag, cadastrarTag, cadastrarFace,
listarTagsVisitante, cadastrarTagVisitante

Comunicação e administração (12):
listarOcorrencias, cadastrarOcorrencia,
listarComunicados, cadastrarComunicado,
listarUsuarios, cadastrarUsuario,
listarPortaria, cadastrarPortaria,
listarEnquetes, cadastrarEnquete,
listarAssembleias, cadastrarAssembleia

Gestão (21):
listarAchados, cadastrarAchado,
listarManutencoes, cadastrarManutencao,
listarBloquear, cadastrarBloquear,
listarFurtoVeiculo, cadastrarFurtoVeiculo,
listarDocumentos, cadastrarDocumento,
listarProdutos, cadastrarProduto,
listarInventarios, cadastrarInventario,
listarObjetos, listarEmprestimos,
listarAnunciantes, cadastrarAnuciante,
listarProcedimentos, cadastrarProcedimento, listarAnotacoes

Relatórios e telefonia (12):
painel, relatorioAcessos, relatorioVisitas, relatorioCorrespondenciaMes,
listarDiarios, listarLigacoes, relatorioFilasUsuariosOnline, cadastrarFila,
listarAcessos, listarMensagens, listarMensagensEmail, listarAcessosUsuarios

Configurações e equipamentos (14):
listarRelay, cadastrarRelay, listarCameras, cadastrarCamera,
listarBoxs, listarAcionaRelay, listarGatilhos, cadastrarGatilho,
listarRotas, cadastrarRota,
cadastrarCondominio, configurarCondominio,
parametrosCondominio, tabelasCondominio
```

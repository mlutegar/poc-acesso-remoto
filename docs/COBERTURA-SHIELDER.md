# Cobertura do Shielder — o que existe no protótipo

Base: as **77 rotas** inventariadas em `MAPA-SHIELDER.md` na auditoria de 10/09/2026. A planilha para abrir no Excel ou no Google Sheets é `cobertura-shielder.csv` (separador `;`).

## O que este documento prova, e o que não prova

Ele mede **quanto do Shielder já tem equivalente no protótipo**, contando as rotas da interface. Não mede semelhança de comportamento: a auditoria observou telas e campos sem enviar formulários, então as validações, os limites e as regras do servidor do Shielder continuam desconhecidos.

## Resumo

| Situação | Rotas | Do total |
|---|---:|---:|
| Parcial | 17 | 22% |
| Prévia | 59 | 77% |
| Simulada | 1 | 1% |
| Não iniciada | 0 | 0% |
| **Total** | **77** | **100%** |

- **Parcial** — o fluxo existe e funciona, com dados locais e regras próprias, mas faltam campos e ações do original.
- **Prévia** — a tela existe e é navegável, com colunas, filtros, dados fictícios e o formulário de exemplo, mas ainda não grava. Destas, **19 dependem de equipamento** e trazem o aviso na própria tela.
- **Simulada** — tela herdada do protótipo inicial, com dados fixos e sem regra por trás.
- **Não iniciada** — não há nada equivalente.

Nenhuma rota está marcada como concluída. Concluir exigiria comparar campo a campo com o sistema real e validar as regras do servidor, o que a auditoria deliberadamente não fez para não afetar a operação do cliente.

O módulo de **Áreas comuns** em `/areas-comuns` não entra nas 77 rotas desta tabela: a agenda/reservas não foi localizada no menu do perfil web auditado. O protótipo já permite cadastrar áreas e fazer reservas locais, mas os campos e limites do Shielder ainda precisam ser conferidos no fluxo usado pelo cliente.

## Por grupo

| Grupo | Rotas | Parcial | Prévia | Simulada | Não iniciada |
|---|---:|---:|---:|---:|---:|
| Operação | 18 | 13 | 5 | 0 | 0 |
| Comunicação e administração | 12 | 4 | 8 | 0 | 0 |
| Gestão | 21 | 0 | 21 | 0 | 0 |
| Relatórios e telefonia | 12 | 0 | 11 | 1 | 0 |
| Configurações e equipamentos | 14 | 0 | 14 | 0 | 0 |

## O que falta para sair da prévia

| Depende de | Rotas em prévia | O que é preciso |
|---|---:|---|
| Backend | 21 | Servidor, banco e autenticação de verdade. |
| Front | 19 | Só trabalho de front: ligar a tela ao mesmo armazenamento local dos módulos que funcionam. |
| Hardware | 16 | Equipamento de teste, documentação do fabricante e um agente local dentro do condomínio. |
| Telefonia | 3 | Servidor SIP e central de interfone. |

## Riscos de retrabalho

1. **`parametrosCondominio` (206 controles).** Muda o comportamento das telas já construídas: quais campos são obrigatórios, quais aparecem e como cada condomínio se comporta. Quanto mais tarde entrar, mais mexe no que já está pronto.
2. **Usuários e permissões.** Hoje o login é demonstrativo e qualquer operador faz tudo. Aplicar perfis depois significa revisitar cada tela.
3. **Integração com equipamentos.** O equipamento fica atrás do roteador do condomínio; um servidor na nuvem não alcança. Vai precisar de um agente local, e isso é um componente novo a instalar e manter.
4. **Persistência.** Tudo vive no `localStorage` de um navegador. Não é banco multiusuário nem registro de auditoria confiável, e não deve receber dado real.

## Tabela completa

| Rota | Grupo | Módulo | Situação | Onde está no protótipo | Depende de | O que falta |
|---|---|---|---|---|---|---|
| listarVisitas | Operação | Visitas | Parcial | /visitas (bloco 1) | Front | Falta exportar Word/PDF/Excel, notificar condôminos, cadastrar passageiro, atalhos a câmeras/acionadores/acessos e portaria de entrada. |
| cadastrarVisitante | Operação | Visitas | Parcial | /visitas (bloco 1) | Front + hardware | Falta foto por câmera, vistoria do veículo, validade do documento, limite de permanência em minutos e rota. |
| listarCorrespondencias | Operação | Correspondências | Parcial | /correspondencias (bloco 2) | Front | Falta ordenação por destinatário/entrada, notificação em lote de pendentes e exportação Excel. |
| cadastrarCorrespondencia | Operação | Correspondências | Parcial | /correspondencias (bloco 2) | Backend | Anexo guarda só o nome do arquivo; falta captura de foto e comprovante de retirada. |
| listarMoradores | Operação | Condôminos | Parcial | /condominos (bloco 1) | Front | Falta filtros por idade/aniversário/uso de app/biometria/antiguidade, exportações, envio de emails, backup e ações em lote. |
| cadastrarMorador | Operação | Condôminos | Parcial | /condominos (bloco 1) | Backend + hardware | Falta foto e geração facial, autorizar app, chave virtual, agenda, rota/turno, validade/atestado, ID externo e endereço de correspondência. |
| listarResidencias | Operação | Residências | Parcial | /residencias (bloco 1) | Front | Falta filtros de inadimplência e sem app, impressão e os vínculos com animais, bicicletas, ramais e aluguel. |
| cadastrarResidencia | Operação | Residências | Parcial | /residencias (bloco 1) | Backend | Falta fração ideal, limite de visitantes, bloquear/silenciar Fale Síndico, duplicar notificação, reservas/convites e geolocalização. |
| listarVeiculosMorador | Operação | Veículos | Parcial | /veiculos (cadastro local) | Backend + hardware | Cadastro, busca, histórico e vínculo com condômino/unidade funcionam. Faltam regras específicas do condomínio, TAG/LPR e sincronização com equipamentos. |
| listarAnimais | Operação | Animais | Parcial | /animais (bloco 5) | Front | Cadastro funcionando, vinculado à residência e ao condômino. O formulário do original não foi observado na auditoria. |
| listarBicicletas | Operação | Bicicletas | Parcial | /bicicletas (bloco 5) | Front | Cadastro funcionando, com código único por bicicleta ativa. O formulário do original não foi observado na auditoria. |
| listarPreAutorizacoes | Operação | Pré-autorizações | Parcial | /pre-autorizacoes (bloco 1) | Front | Falta filtro por período e identidade, exportação e as alternativas Lista e Facial. |
| cadastrarPreAutorizacao | Operação | Pré-autorizações | Parcial | /pre-autorizacoes (bloco 1) | Backend | Falta vincular várias unidades, endereço/telefone, validade da CNH e geração de QR code ou link de convite. |
| listarTag | Operação | Credenciais | Prévia | /credenciais (depende de equipamento) | Hardware | Falta enviar a credencial ao equipamento e receber a passagem. |
| cadastrarTag | Operação | Credenciais | Prévia | /credenciais (depende de equipamento) | Hardware | Falta enviar o serial ao equipamento. |
| cadastrarFace | Operação | Credenciais | Prévia | /credenciais (depende de equipamento) | Hardware | Falta o cadastro do molde biométrico no equipamento; exige consentimento por ser dado sensível. |
| listarTagsVisitante | Operação | Credenciais | Prévia | /credenciais-visitante (depende de equipamento) | Hardware | Falta enviar a credencial temporária e registrar a devolução pelo equipamento. |
| cadastrarTagVisitante | Operação | Credenciais | Prévia | /credenciais-visitante (depende de equipamento) | Hardware | Falta enviar o serial ao equipamento. |
| listarOcorrencias | Comunicação e administração | Ocorrências | Parcial | /ocorrencias (bloco 2) | Front | Falta exportar Word/PDF/Excel, desativar em lote e as ações sobre ocorrências antigas. |
| cadastrarOcorrencia | Comunicação e administração | Ocorrências | Parcial | /ocorrencias (bloco 2) | Backend | Anexo guarda só o nome do arquivo; notificar apps de síndico e funcionários está simulado. |
| listarComunicados | Comunicação e administração | Comunicados | Parcial | /comunicados (bloco 2) | Front | Falta favoritos, excluídos, exportar Word/Excel e finalizar em lote. |
| cadastrarComunicado | Comunicação e administração | Comunicados | Parcial | /comunicados (bloco 2) | Backend | Falta editor de texto formatado e anexo real; enviar email e notificar app estão simulados. |
| listarUsuarios | Comunicação e administração | Usuários | Prévia | /usuarios (tela navegável, sem gravação) | Backend | Muda o comportamento das telas já feitas: permissões de administrador, portaria, edição e faixa horária. |
| cadastrarUsuario | Comunicação e administração | Usuários | Prévia | /usuarios (tela navegável, sem gravação) | Backend | Login e senha exigem autenticação de verdade; hoje o login é demonstrativo. |
| listarPortaria | Comunicação e administração | Funcionários | Prévia | /funcionarios (tela navegável, sem gravação) | Front | Funcionários e prestadores, com presentes/ausentes e controle de acesso. |
| cadastrarPortaria | Comunicação e administração | Funcionários | Prévia | /funcionarios | Front | Foto e facial dependem de equipamento; o restante do cadastro é só front. |
| listarEnquetes | Comunicação e administração | Enquetes | Prévia | /enquetes (tela navegável, sem gravação) | Backend | Votação e apuração não foram observadas na auditoria. |
| cadastrarEnquete | Comunicação e administração | Enquetes | Prévia | /enquetes (tela navegável, sem gravação) | Backend | Público votante, comentários, pergunta e respostas. |
| listarAssembleias | Comunicação e administração | Assembleias | Prévia | /assembleias (tela navegável, sem gravação) | Backend | Participação, quórum, votos e ata não foram observados. |
| cadastrarAssembleia | Comunicação e administração | Assembleias | Prévia | /assembleias (tela navegável, sem gravação) | Backend | Ordinária/extraordinária, período, descrição e anexo. |
| listarAchados | Gestão | Achados e perdidos | Prévia | /achados (tela navegável, sem gravação) | Front | — |
| cadastrarAchado | Gestão | Achados e perdidos | Prévia | /achados (tela navegável, sem gravação) | Backend | Foto por câmera ou arquivo. |
| listarManutencoes | Gestão | Manutenções | Prévia | /manutencoes (tela navegável, sem gravação) | Front | Tem visão de calendário além da lista. |
| cadastrarManutencao | Gestão | Manutenções | Prévia | /manutencoes (tela navegável, sem gravação) | Front | Renovação e alerta. |
| listarBloquear | Gestão | Bloqueio de visitantes | Prévia | /bloqueios (tela navegável, sem gravação) | Front | Precisa definir a precedência entre bloqueio e pré-autorização — o mapa deixou isso em aberto. |
| cadastrarBloquear | Gestão | Bloqueio de visitantes | Prévia | /bloqueios (tela navegável, sem gravação) | Front | Unidade, identidade, período, horário e dias da semana. |
| listarFurtoVeiculo | Gestão | Bloqueio de veículos | Prévia | /bloqueios (tela navegável, sem gravação) | Front | — |
| cadastrarFurtoVeiculo | Gestão | Bloqueio de veículos | Prévia | /bloqueios (tela navegável, sem gravação) | Front | — |
| listarDocumentos | Gestão | Documentos | Prévia | /documentos (tela navegável, sem gravação) | Backend | Arquivos até 50 MB exigem armazenamento de verdade. |
| cadastrarDocumento | Gestão | Documentos | Prévia | /documentos (tela navegável, sem gravação) | Backend | Pasta, público, aceite obrigatório e compartilhamento no app. |
| listarProdutos | Gestão | Produtos | Prévia | /produtos (tela navegável, sem gravação) | Front | Atualização de estoque e valor pela própria listagem. |
| cadastrarProduto | Gestão | Produtos | Prévia | /produtos (tela navegável, sem gravação) | Front | — |
| listarInventarios | Gestão | Inventário | Prévia | /inventarios (tela navegável, sem gravação) | Front | — |
| cadastrarInventario | Gestão | Inventário | Prévia | /inventarios (tela navegável, sem gravação) | Front | O formulário novo do Shielder traz 20 linhas de inclusão de uma vez. |
| listarObjetos | Gestão | Objetos | Prévia | /objetos (tela navegável, sem gravação) | Front | — |
| listarEmprestimos | Gestão | Empréstimos | Prévia | /objetos (tela navegável, sem gravação) | Front | Empréstimo e devolução não foram executados na auditoria. |
| listarAnunciantes | Gestão | Fornecedores | Prévia | /fornecedores (tela navegável, sem gravação) | Front | — |
| cadastrarAnuciante | Gestão | Fornecedores | Prévia | /fornecedores (tela navegável, sem gravação) | Backend | Foto, exibição no app e dias de destaque. |
| listarProcedimentos | Gestão | Procedimentos | Prévia | /procedimentos (tela navegável, sem gravação) | Front | Tem atalho no cabeçalho do Shielder. |
| cadastrarProcedimento | Gestão | Procedimentos | Prévia | /procedimentos (tela navegável, sem gravação) | Backend | Categoria, descrição formatada e imagem. |
| listarAnotacoes | Gestão | Turnos e anotações | Prévia | /turnos (tela navegável, sem gravação) | Front | Iniciar turno e ver histórico; a auditoria não iniciou turno para não afetar a operação. |
| painel | Relatórios e telefonia | Painel | Simulada | /operacao (tela de exemplo) | Front | O painel atual usa dados fixos; os indicadores reais são adesão ao app, visitas ativas e correspondências aguardando retirada. |
| relatorioAcessos | Relatórios e telefonia | Relatórios | Prévia | /relatorios/acessos | Backend | Os números vêm do histórico de passagens, que depende de banco e dos equipamentos. |
| relatorioVisitas | Relatórios e telefonia | Relatórios | Prévia | /relatorios/visitas (tela navegável, sem gravação) | Backend | — |
| relatorioCorrespondenciaMes | Relatórios e telefonia | Relatórios | Prévia | /relatorios/correspondencias (tela navegável, sem gravação) | Backend | — |
| listarDiarios | Relatórios e telefonia | Diário | Prévia | /diario (tela navegável, sem gravação) | Front | Não confundir com o relatório de turnos. |
| listarLigacoes | Relatórios e telefonia | Telefonia | Prévia | /ligacoes (depende de equipamento) | Telefonia | Origem, destino, atendente, TAA, duração e servidor. |
| relatorioFilasUsuariosOnline | Relatórios e telefonia | Telefonia | Prévia | /fila-sip (depende de equipamento) | Telefonia | Filas SIP e ramais online. |
| cadastrarFila | Relatórios e telefonia | Telefonia | Prévia | /fila-sip (depende de equipamento) | Telefonia | Nome, ramal, portaria e padrão de login. |
| listarAcessos | Relatórios e telefonia | Acessos | Prévia | /bio-rfid (depende de equipamento) | Hardware | Acessos de condôminos por BIO-RFID, com equipamento e foto. |
| listarMensagens | Relatórios e telefonia | Logs | Prévia | /log-notificacoes (tela navegável, sem gravação) | Backend | Log de notificações enviadas ao app. |
| listarMensagensEmail | Relatórios e telefonia | Logs | Prévia | /log-emails (tela navegável, sem gravação) | Backend | Log de emails enviados. |
| listarAcessosUsuarios | Relatórios e telefonia | Auditoria | Prévia | /log-usuarios (tela navegável, sem gravação) | Backend | Quem entrou no sistema, IP, início e fim. |
| listarRelay | Configurações e equipamentos | Acionadores | Prévia | /acionadores (depende de equipamento) | Hardware | — |
| cadastrarRelay | Configurações e equipamentos | Acionadores | Prévia | /acionadores (depende de equipamento) | Hardware | Dispositivo, relay, visível à portaria, tipo e CAN. |
| listarCameras | Configurações e equipamentos | Câmeras | Prévia | /cameras (depende de equipamento) | Hardware | — |
| cadastrarCamera | Configurações e equipamentos | Câmeras | Prévia | /cameras (depende de equipamento) | Hardware | Servidor, canal, IP/DDNS, método, credenciais e geração de URL. |
| listarBoxs | Configurações e equipamentos | Dispositivos | Prévia | /dispositivos (depende de equipamento) | Hardware | Sincronizar, reiniciar e o indicador de online exigem o equipamento conectado. |
| listarAcionaRelay | Configurações e equipamentos | Acionamentos | Prévia | /acionadores (depende de equipamento) | Hardware | Histórico de acionamentos com acesso a câmeras. |
| listarGatilhos | Configurações e equipamentos | Gatilhos | Prévia | /gatilhos (depende de equipamento) | Hardware | Falta o disparo automático a partir dos eventos do equipamento. |
| cadastrarGatilho | Configurações e equipamentos | Gatilhos | Prévia | /gatilhos (depende de equipamento) | Hardware | Falta executar a automação. |
| listarRotas | Configurações e equipamentos | Rotas | Prévia | /rotas (depende de equipamento) | Hardware | Falta propagar a rota aos equipamentos que a compõem. |
| cadastrarRota | Configurações e equipamentos | Rotas | Prévia | /rotas (depende de equipamento) | Hardware | Falta vincular os dispositivos de verdade. |
| cadastrarCondominio | Configurações e equipamentos | Condomínio | Prévia | /condominio (tela navegável, sem gravação) | Backend | Identificação, contratos, boletos, plano e integrações. |
| configurarCondominio | Configurações e equipamentos | Condomínio | Prévia | /condominio (tela navegável, sem gravação) | Backend | Mesma tela de cadastrarCondominio. |
| parametrosCondominio | Configurações e equipamentos | Parâmetros | Prévia | /condominio (tela navegável, sem gravação) | Backend | 206 controles que mudam o comportamento das telas já construídas. É o maior risco de retrabalho. |
| tabelasCondominio | Configurações e equipamentos | Parâmetros | Prévia | /condominio (tela navegável, sem gravação) | Backend | Catálogos e tabelas auxiliares por condomínio. |

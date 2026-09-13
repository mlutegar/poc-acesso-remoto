# Cobertura do Shielder — o que existe no protótipo

Base: as **77 rotas** inventariadas em `MAPA-SHIELDER.md` na auditoria de 10/09/2026. A planilha para abrir no Excel ou no Google Sheets é `cobertura-shielder.csv` (separador `;`).

## O que este documento prova, e o que não prova

Ele mede **quanto do Shielder já tem equivalente no protótipo**, contando as rotas da interface. Não mede semelhança de comportamento: a auditoria observou telas e campos sem enviar formulários, então as validações, os limites e as regras do servidor do Shielder continuam desconhecidos.

## Resumo

| Situação | Rotas | Do total |
|---|---:|---:|
| Parcial | 14 | 18% |
| Prévia | 48 | 62% |
| Simulada | 2 | 3% |
| Não iniciada | 13 | 17% |
| **Total** | **77** | **100%** |

- **Parcial** — o fluxo existe, com dados locais e regras próprias, mas faltam campos e ações do original.
- **Prévia** — a tela existe e é navegável, com colunas, filtros, dados fictícios e o formulário de exemplo, mas ainda não grava nada.
- **Simulada** — tela herdada do protótipo inicial, com dados fixos e sem regra por trás.
- **Não iniciada** — não há nada equivalente.

Nenhuma rota está marcada como concluída. Concluir exigiria comparar campo a campo com o sistema real e validar as regras do servidor, o que a auditoria deliberadamente não fez para não afetar a operação do cliente.

## Por grupo

| Grupo | Rotas | Parcial | Prévia | Simulada | Não iniciada |
|---|---:|---:|---:|---:|---:|
| Operação | 18 | 10 | 0 | 1 | 7 |
| Comunicação e administração | 12 | 4 | 8 | 0 | 0 |
| Gestão | 21 | 0 | 21 | 0 | 0 |
| Relatórios e telefonia | 12 | 0 | 10 | 1 | 1 |
| Configurações e equipamentos | 14 | 0 | 9 | 0 | 5 |

## O que trava as 13 rotas não iniciadas

| Depende de | Rotas | Significado |
|---|---:|---|
| Hardware | 10 | Precisa de equipamento de teste: facial, TAG, câmera, acionador. |
| Front | 2 | Dá para fazer agora, no protótipo, do mesmo jeito que os módulos prontos. |
| Backend | 1 | Precisa de servidor, banco e autenticação de verdade. |

As que sobraram são, quase todas, credenciais e equipamentos — dependem de hardware de teste, não de mais tela.

## Riscos de retrabalho

1. **`parametrosCondominio` (206 controles).** Muda o comportamento das telas já construídas: quais campos são obrigatórios, quais aparecem e como cada condomínio se comporta. Quanto mais tarde entrar, mais mexe no que já está pronto.
2. **Usuários e permissões.** Hoje o login é demonstrativo e qualquer operador faz tudo. Aplicar perfis depois significa revisitar cada tela.
3. **Rotas e credenciais.** O campo *rota* aparece em morador, credencial e pré-autorização. Enquanto o módulo não existir, esses campos ficam sem destino.
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
| listarVeiculosMorador | Operação | Veículos | Simulada | /veiculos (tela de exemplo) | Front | O veículo existe dentro do cadastro de condômino, mas a tela própria ainda usa dados fixos e não se comunica com ele. |
| listarAnimais | Operação | Animais | Não iniciada | — | Front | Formulário não foi localizado na auditoria; só a listagem foi vista. |
| listarBicicletas | Operação | Bicicletas | Não iniciada | — | Front | Formulário não foi localizado na auditoria; só a listagem foi vista. |
| listarPreAutorizacoes | Operação | Pré-autorizações | Parcial | /pre-autorizacoes (bloco 1) | Front | Falta filtro por período e identidade, exportação e as alternativas Lista e Facial. |
| cadastrarPreAutorizacao | Operação | Pré-autorizações | Parcial | /pre-autorizacoes (bloco 1) | Backend | Falta vincular várias unidades, endereço/telefone, validade da CNH e geração de QR code ou link de convite. |
| listarTag | Operação | Credenciais | Não iniciada | — | Hardware | Controle de acesso de morador: TAG, placa, controle, validade, pânico e ações em lote. |
| cadastrarTag | Operação | Credenciais | Não iniciada | — | Hardware | Cadastro de serial/ID e rota da credencial. |
| cadastrarFace | Operação | Credenciais | Não iniciada | — | Hardware | Depende de câmera e do equipamento facial homologado. |
| listarTagsVisitante | Operação | Credenciais | Não iniciada | — | Hardware | Credenciais de visitante: pendentes, visitas e pré-autorizados. |
| cadastrarTagVisitante | Operação | Credenciais | Não iniciada | — | Hardware | Cadastro de serial para visitante. |
| listarOcorrencias | Comunicação e administração | Ocorrências | Parcial | /ocorrencias (bloco 2) | Front | Falta exportar Word/PDF/Excel, desativar em lote e as ações sobre ocorrências antigas. |
| cadastrarOcorrencia | Comunicação e administração | Ocorrências | Parcial | /ocorrencias (bloco 2) | Backend | Anexo guarda só o nome do arquivo; notificar apps de síndico e funcionários está simulado. |
| listarComunicados | Comunicação e administração | Comunicados | Parcial | /comunicados (bloco 2) | Front | Falta favoritos, excluídos, exportar Word/Excel e finalizar em lote. |
| cadastrarComunicado | Comunicação e administração | Comunicados | Parcial | /comunicados (bloco 2) | Backend | Falta editor de texto formatado e anexo real; enviar email e notificar app estão simulados. |
| listarUsuarios | Comunicação e administração | Usuários | Prévia | /usuarios (tela navegável, sem gravação) | Backend | Muda o comportamento das telas já feitas: permissões de administrador, portaria, edição e faixa horária. |
| cadastrarUsuario | Comunicação e administração | Usuários | Prévia | /usuarios (tela navegável, sem gravação) | Backend | Login e senha exigem autenticação de verdade; hoje o login é demonstrativo. |
| listarPortaria | Comunicação e administração | Funcionários | Prévia | /funcionarios (tela navegável, sem gravação) | Front | Funcionários e prestadores, com presentes/ausentes e controle de acesso. |
| cadastrarPortaria | Comunicação e administração | Funcionários | Prévia | /funcionarios (tela navegável, sem gravação) | Hardware | Foto/facial, função, empresa, avisos e rota. |
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
| relatorioAcessos | Relatórios e telefonia | Relatórios | Não iniciada | — | Backend | Período, atualizar, salvar e imprimir. |
| relatorioVisitas | Relatórios e telefonia | Relatórios | Prévia | /relatorios/visitas (tela navegável, sem gravação) | Backend | — |
| relatorioCorrespondenciaMes | Relatórios e telefonia | Relatórios | Prévia | /relatorios/correspondencias (tela navegável, sem gravação) | Backend | — |
| listarDiarios | Relatórios e telefonia | Diário | Prévia | /diario (tela navegável, sem gravação) | Front | Não confundir com o relatório de turnos. |
| listarLigacoes | Relatórios e telefonia | Telefonia | Prévia | /ligacoes (tela navegável, sem gravação) | Telefonia | Origem, destino, atendente, TAA, duração e servidor. |
| relatorioFilasUsuariosOnline | Relatórios e telefonia | Telefonia | Prévia | /fila-sip (tela navegável, sem gravação) | Telefonia | Filas SIP e ramais online. |
| cadastrarFila | Relatórios e telefonia | Telefonia | Prévia | /fila-sip (tela navegável, sem gravação) | Telefonia | Nome, ramal, portaria e padrão de login. |
| listarAcessos | Relatórios e telefonia | Acessos | Prévia | /bio-rfid (tela navegável, sem gravação) | Hardware | Acessos de condôminos por BIO-RFID, com equipamento e foto. |
| listarMensagens | Relatórios e telefonia | Logs | Prévia | /log-notificacoes (tela navegável, sem gravação) | Backend | Log de notificações enviadas ao app. |
| listarMensagensEmail | Relatórios e telefonia | Logs | Prévia | /log-emails (tela navegável, sem gravação) | Backend | Log de emails enviados. |
| listarAcessosUsuarios | Relatórios e telefonia | Auditoria | Prévia | /log-usuarios (tela navegável, sem gravação) | Backend | Quem entrou no sistema, IP, início e fim. |
| listarRelay | Configurações e equipamentos | Acionadores | Prévia | /acionadores (tela navegável, sem gravação) | Hardware | — |
| cadastrarRelay | Configurações e equipamentos | Acionadores | Prévia | /acionadores (tela navegável, sem gravação) | Hardware | Dispositivo, relay, visível à portaria, tipo e CAN. |
| listarCameras | Configurações e equipamentos | Câmeras | Prévia | /cameras (tela navegável, sem gravação) | Hardware | — |
| cadastrarCamera | Configurações e equipamentos | Câmeras | Prévia | /cameras (tela navegável, sem gravação) | Hardware | Servidor, canal, IP/DDNS, método, credenciais e geração de URL. |
| listarBoxs | Configurações e equipamentos | Dispositivos | Não iniciada | /dispositivos é tela de exemplo | Hardware | Sincronizar, reiniciar e último acesso exigem os equipamentos reais. |
| listarAcionaRelay | Configurações e equipamentos | Acionamentos | Prévia | /acionadores (tela navegável, sem gravação) | Hardware | Histórico de acionamentos com acesso a câmeras. |
| listarGatilhos | Configurações e equipamentos | Gatilhos | Não iniciada | — | Hardware | — |
| cadastrarGatilho | Configurações e equipamentos | Gatilhos | Não iniciada | — | Hardware | Evento, acionadores e automações. |
| listarRotas | Configurações e equipamentos | Rotas | Não iniciada | — | Hardware | Rota aparece como campo em morador, credencial e pré-autorização; sem ela, esses campos ficam soltos. |
| cadastrarRota | Configurações e equipamentos | Rotas | Não iniciada | — | Hardware | Nome, vários dispositivos e perfil de quem passa. |
| cadastrarCondominio | Configurações e equipamentos | Condomínio | Prévia | /condominio (tela navegável, sem gravação) | Backend | Identificação, contratos, boletos, plano e integrações. |
| configurarCondominio | Configurações e equipamentos | Condomínio | Prévia | /condominio (tela navegável, sem gravação) | Backend | Mesma tela de cadastrarCondominio. |
| parametrosCondominio | Configurações e equipamentos | Parâmetros | Prévia | /condominio (tela navegável, sem gravação) | Backend | 206 controles que mudam o comportamento das telas já construídas. É o maior risco de retrabalho. |
| tabelasCondominio | Configurações e equipamentos | Parâmetros | Prévia | /condominio (tela navegável, sem gravação) | Backend | Catálogos e tabelas auxiliares por condomínio. |

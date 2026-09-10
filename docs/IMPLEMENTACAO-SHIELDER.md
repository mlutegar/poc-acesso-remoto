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

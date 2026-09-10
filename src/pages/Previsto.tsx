import { useLocation } from "react-router-dom";

// O que cada módulo do menu vai ter, segundo o mapa funcional e a planilha de
// cobertura (docs/COBERTURA-SHIELDER.md). Serve para a demonstração mostrar a
// árvore inteira do produto sem fingir que a tela existe.
type Planned = { title: string; summary: string; items: string[]; depends: string };
const PLANNED: Record<string, Planned> = {
  "/usuarios": {
    title: "Usuários",
    summary: "Quem acessa o sistema e o que cada um pode fazer.",
    items: [
      "Nome, login e senha",
      "Perfis: administrador, portaria, edição",
      "Faixa horária de acesso",
      "Log de acessos ao sistema",
    ],
    depends: "Autenticação e permissões no servidor",
  },
  "/funcionarios": {
    title: "Funcionários",
    summary: "Funcionários e prestadores com acesso recorrente ao condomínio.",
    items: [
      "Foto e facial",
      "Função, empresa e contatos",
      "Presentes e ausentes",
      "Avisos e rota de acesso",
    ],
    depends: "Equipamento facial para a credencial",
  },
  "/relatorios/visitas": {
    title: "Relatório de visitas",
    summary: "Visitas por período e por residência.",
    items: ["Datas inicial e final", "Atualizar, salvar e imprimir"],
    depends: "Banco de dados com histórico",
  },
  "/relatorios/correspondencias": {
    title: "Relatório de correspondências",
    summary: "Correspondências recebidas e retiradas no mês.",
    items: ["Datas inicial e final", "Atualizar, salvar e imprimir"],
    depends: "Banco de dados com histórico",
  },
  "/diario": {
    title: "Diário",
    summary: "Anotações do dia a dia da portaria.",
    items: ["Anotação com data e responsável", "Ativos e histórico", "Busca por descrição"],
    depends: "Somente front",
  },
  "/ligacoes": {
    title: "Ligações",
    summary: "Registro das chamadas do interfone e do aplicativo.",
    items: ["Origem, destino e atendente", "Duração e servidor", "Exportação por período"],
    depends: "Servidor SIP e central de interfone",
  },
  "/fila-sip": {
    title: "Fila SIP",
    summary: "Ramais e filas de atendimento da portaria.",
    items: ["Nome, ramal e portaria", "Morador vinculado", "Online e padrão de login"],
    depends: "Servidor SIP",
  },
  "/bio-rfid": {
    title: "Acessos por biometria e RFID",
    summary: "Passagens registradas pelos equipamentos.",
    items: ["Responsável, unidade e tipo", "Filtro por equipamento", "Registros sem cadastro"],
    depends: "Equipamentos de acesso",
  },
  "/log-notificacoes": {
    title: "Log de notificações",
    summary: "Mensagens enviadas ao aplicativo dos moradores.",
    items: ["Responsável, unidade e mensagem", "Período e exportação"],
    depends: "Serviço de notificações",
  },
  "/log-emails": {
    title: "Log de emails",
    summary: "Emails enviados pelo sistema.",
    items: ["Responsável, unidade e mensagem", "Período e exportação"],
    depends: "Serviço de email",
  },
  "/log-usuarios": {
    title: "Acessos de usuários",
    summary: "Quem entrou no sistema, de onde e quando.",
    items: ["Nome, usuário e IP", "Início e fim da sessão", "Portaria e administradores"],
    depends: "Autenticação no servidor",
  },
  "/enquetes": {
    title: "Enquetes",
    summary: "Consultas aos condôminos com apuração.",
    items: [
      "Título, descrição e anexo",
      "Público votante",
      "Pergunta e respostas",
      "Comentários e apuração",
    ],
    depends: "Aplicativo do morador",
  },
  "/assembleias": {
    title: "Assembleia virtual",
    summary: "Convocação e registro das assembleias.",
    items: [
      "Ordinária ou extraordinária",
      "Período de início e fim",
      "Descrição e anexo",
      "Participação e quórum",
    ],
    depends: "Aplicativo do morador",
  },
  "/achados": {
    title: "Achados e perdidos",
    summary: "Objetos encontrados no condomínio.",
    items: ["Nome e descrição", "Foto", "Exibição aos condôminos", "Baixa na devolução"],
    depends: "Armazenamento de fotos",
  },
  "/manutencoes": {
    title: "Manutenções",
    summary: "Agenda das manutenções do condomínio.",
    items: ["Calendário e lista", "Nome, descrição e data", "Renovação e alerta"],
    depends: "Somente front",
  },
  "/bloqueios": {
    title: "Bloqueios",
    summary: "Visitantes e veículos com entrada bloqueada.",
    items: [
      "Identidade ou placa",
      "Período, horário e dias da semana",
      "Justificativa",
      "Precedência sobre pré-autorizações",
    ],
    depends: "Somente front",
  },
  "/documentos": {
    title: "Documentos",
    summary: "Arquivos compartilhados com moradores e portaria.",
    items: [
      "Arquivo até 50 MB",
      "Pasta e público",
      "Aceite obrigatório",
      "Compartilhamento no app",
    ],
    depends: "Armazenamento de arquivos",
  },
  "/produtos": {
    title: "Produtos",
    summary: "Itens vendidos ou controlados pela administração.",
    items: ["Nome, descrição e valor", "Estoque atualizado pela listagem"],
    depends: "Somente front",
  },
  "/inventarios": {
    title: "Inventários",
    summary: "Patrimônio do condomínio por setor.",
    items: ["Código, descrição e setor", "Quantidade e unidade", "Inclusão em lote"],
    depends: "Somente front",
  },
  "/objetos": {
    title: "Objetos e empréstimos",
    summary: "Objetos de uso comum e quem está com cada um.",
    items: ["Busca por código", "Empréstimo e devolução", "Responsável, entrada e saída"],
    depends: "Somente front",
  },
  "/fornecedores": {
    title: "Fornecedores",
    summary: "Prestadores indicados aos moradores.",
    items: ["Categoria, nome e contatos", "Foto e descrição", "Exibição no app e dias de destaque"],
    depends: "Aplicativo do morador",
  },
  "/procedimentos": {
    title: "Procedimentos",
    summary: "Orientações para a equipe da portaria.",
    items: ["Categoria", "Descrição formatada e imagem", "Atalho no cabeçalho"],
    depends: "Somente front",
  },
  "/turnos": {
    title: "Turnos",
    summary: "Início, fim e anotações de cada turno.",
    items: ["Iniciar novo turno", "Anotações por usuário", "Relatório por período"],
    depends: "Somente front",
  },
  "/acionadores": {
    title: "Acionadores",
    summary: "Portões, cancelas e fechaduras controlados pelo sistema.",
    items: ["Dispositivo e relay", "Visível à portaria", "Vínculo com câmeras e gatilhos"],
    depends: "Equipamentos de acionamento",
  },
  "/cameras": {
    title: "Câmeras",
    summary: "Câmeras exibidas na portaria e no aplicativo.",
    items: ["Servidor, canal e endereço", "Acionador associado", "Qualidade e exibição"],
    depends: "Servidor de câmeras",
  },
  "/condominio": {
    title: "Condomínio",
    summary: "Dados gerais e parâmetros de funcionamento.",
    items: [
      "Identificação e contatos",
      "Logos, cor e nomenclaturas",
      "Parâmetros por condomínio (206 controles)",
      "Integrações",
    ],
    depends: "Servidor e decisões da cliente",
  },
};

export default function Previsto() {
  const { pathname } = useLocation();
  const plan = PLANNED[pathname] || {
    title: "Módulo previsto",
    summary: "Este item do menu ainda não tem tela nesta demonstração.",
    items: [],
    depends: "A definir",
  };
  return (
    <main className="op-main">
      <div className="op-page-heading">
        <h1>{plan.title}</h1>
      </div>
      <section className="sh-planned" aria-label="Módulo previsto">
        <div className="sh-planned-bar">Módulo previsto · sem tela nesta demonstração</div>
        <dl>
          <dt>O que faz</dt>
          <dd>{plan.summary}</dd>
          {plan.items.length > 0 && (
            <>
              <dt>O que vai ter</dt>
              <dd>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </>
          )}
          <dt>Depende de</dt>
          <dd>{plan.depends}</dd>
        </dl>
      </section>
    </main>
  );
}

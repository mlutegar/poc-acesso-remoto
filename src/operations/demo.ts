import type { Data, Issue, Log, Mail, Notice, Permit, Resident, Unit, Visit } from "./model";

// Conjunto de demonstração: um condomínio fictício com movimento de um dia
// comum de portaria. Serve para apresentar o produto sem usar dado real.
//
// Nada aqui veio do sistema de referência. Os documentos têm formato de CPF,
// mas com dígitos verificadores propositalmente inválidos, de modo que não
// correspondem ao documento de nenhuma pessoa.

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** Momento relativo a agora, em ISO, para as listas parecerem sempre recentes. */
const at = (hoursAgo: number) => new Date(Date.now() - hoursAgo * HOUR).toISOString();

/** Data no fuso de Brasília, em AAAA-MM-DD, deslocada em dias. */
const day = (offset = 0) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(
    new Date(Date.now() + offset * DAY)
  );

const unit = (id: string, block: string, number: string, extra: Partial<Unit> = {}): Unit => ({
  id,
  block,
  number,
  phone: "",
  intercom: number,
  notes: "",
  rented: false,
  active: true,
  ...extra,
});

const resident = (
  id: string,
  unitId: string,
  name: string,
  document: string,
  extra: Partial<Resident> = {}
): Resident => ({
  id,
  unitId,
  name,
  document,
  phone: "",
  email: "",
  relationship: "Titular",
  owner: false,
  principal: false,
  plate: "",
  vehicle: "",
  color: "",
  notes: "",
  active: true,
  ...extra,
});

const visit = (
  id: string,
  residentId: string,
  name: string,
  document: string,
  purpose: string,
  extra: Partial<Visit> = {}
): Visit => ({
  id,
  residentId,
  name,
  document,
  phone: "",
  company: "",
  plate: "",
  vehicle: "",
  purpose,
  notes: "",
  status: "pendente",
  createdAt: at(1),
  entryAt: "",
  exitAt: "",
  permitId: "",
  ...extra,
});

const permit = (
  id: string,
  residentId: string,
  name: string,
  document: string,
  reason: string,
  extra: Partial<Permit> = {}
): Permit => ({
  id,
  residentId,
  name,
  document,
  company: "",
  plate: "",
  start: day(-15),
  end: day(75),
  from: "08:00",
  until: "18:00",
  days: [1, 2, 3, 4, 5],
  reason,
  active: true,
  ...extra,
});

const mail = (
  id: string,
  residentId: string,
  description: string,
  extra: Partial<Mail> = {}
): Mail => ({
  id,
  residentId,
  description,
  tracking: "",
  carrier: "",
  receivedBy: "Carlos (portaria)",
  attachment: "",
  notes: "",
  status: "recebida",
  createdAt: at(6),
  noticedAt: "",
  pickupAt: "",
  pickedBy: "",
  ...extra,
});

const reply = (id: string, hoursAgo: number, author: string, text: string) => ({
  id,
  at: at(hoursAgo),
  author,
  text,
});

const issue = (
  id: string,
  kind: string,
  description: string,
  extra: Partial<Issue> = {}
): Issue => ({
  id,
  kind,
  description,
  place: "",
  residentId: "",
  reporter: "Carlos (portaria)",
  shared: false,
  pinned: false,
  notify: false,
  attachment: "",
  status: "aberta",
  createdAt: at(20),
  closedAt: "",
  replies: [],
  ...extra,
});

const notice = (
  id: string,
  subject: string,
  body: string,
  extra: Partial<Notice> = {}
): Notice => ({
  id,
  subject,
  body,
  audience: "todos",
  unitId: "",
  attachment: "",
  start: day(-2),
  startTime: "08:00",
  end: "",
  endTime: "",
  email: true,
  push: true,
  tenants: true,
  finished: false,
  createdAt: at(50),
  ...extra,
});

const buildUnits = (): Unit[] => [
  unit("u-1-101", "1", "101", { phone: "(61) 3321-4410", notes: "Duas vagas de garagem." }),
  unit("u-1-102", "1", "102", { rented: true }),
  unit("u-1-201", "1", "201", { phone: "(61) 3321-4418" }),
  unit("u-1-202", "1", "202", { rented: true, notes: "Contrato de locação até 03/2027." }),
  unit("u-2-101", "2", "101", { phone: "(61) 3321-4425" }),
  unit("u-2-102", "2", "102"),
  unit("u-2-201", "2", "201", { rented: true }),
  unit("u-2-202", "2", "202", { phone: "(61) 3321-4432" }),
  unit("u-3-101", "3", "101"),
  unit("u-3-102", "3", "102", { rented: true }),
  unit("u-3-201", "3", "201", { phone: "(61) 3321-4441" }),
  unit("u-3-202", "3", "202", { active: false, notes: "Em reforma, sem moradores desde 07/2026." }),
];

const buildResidents = (): Resident[] => [
  resident("r-01", "u-1-101", "Helena Vasconcelos", "950.712.865-23", {
    phone: "(61) 99812-4410",
    email: "helena.vasconcelos@exemplo.com.br",
    owner: true,
    principal: true,
    plate: "RKF7C21",
    vehicle: "Corolla",
    color: "Prata",
  }),
  resident("r-02", "u-1-101", "Rodrigo Vasconcelos", "294.816.619-43", {
    phone: "(61) 99812-4411",
    relationship: "Cônjuge",
    owner: true,
    plate: "QNB2H85",
    vehicle: "Compass",
    color: "Branco",
  }),
  resident("r-03", "u-1-102", "Marcela Antunes", "798.957.062-67", {
    phone: "(61) 99744-3390",
    email: "marcela.antunes@exemplo.com.br",
    relationship: "Inquilina",
    principal: true,
  }),
  resident("r-04", "u-1-201", "Otávio Brandão", "960.408.392-26", {
    phone: "(61) 99615-7702",
    owner: true,
    principal: true,
    plate: "SDG4J09",
    vehicle: "HB20",
    color: "Cinza",
  }),
  resident("r-05", "u-1-201", "Beatriz Brandão", "951.837.288-60", {
    relationship: "Filha",
    phone: "(61) 99615-7703",
  }),
  resident("r-06", "u-1-202", "Priscila Moreira", "159.432.789-63", {
    phone: "(61) 99530-2214",
    email: "priscila.moreira@exemplo.com.br",
    relationship: "Inquilina",
    principal: true,
    plate: "PWT8A44",
    vehicle: "Kwid",
    color: "Vermelho",
  }),
  resident("r-07", "u-1-202", "Caio Moreira", "375.816.153-25", { relationship: "Filho" }),
  resident("r-08", "u-2-101", "Wagner Tavares", "605.978.758-90", {
    phone: "(61) 99418-6605",
    owner: true,
    principal: true,
    plate: "MHL5D72",
    vehicle: "Ranger",
    color: "Preto",
  }),
  resident("r-09", "u-2-101", "Lúcia Tavares", "028.548.083-74", {
    relationship: "Cônjuge",
    owner: true,
    phone: "(61) 99418-6606",
  }),
  resident("r-10", "u-2-102", "Bianca Sarmento", "903.490.368-27", {
    phone: "(61) 99327-8811",
    email: "bianca.sarmento@exemplo.com.br",
    owner: true,
    principal: true,
  }),
  resident("r-11", "u-2-102", "Marcos Sarmento", "182.601.535-55", {
    relationship: "Cônjuge",
    owner: true,
    plate: "JCV1F38",
    vehicle: "Onix",
    color: "Azul",
  }),
  resident("r-12", "u-2-201", "Rafael Quintela", "440.281.177-80", {
    phone: "(61) 99286-4477",
    relationship: "Inquilino",
    principal: true,
    plate: "TBX6M50",
    vehicle: "Tracker",
    color: "Branco",
  }),
  resident("r-13", "u-2-202", "Sílvia Nakamura", "429.051.485-33", {
    phone: "(61) 99201-3348",
    email: "silvia.nakamura@exemplo.com.br",
    owner: true,
    principal: true,
  }),
  resident("r-14", "u-2-202", "Yuri Nakamura", "555.580.706-54", {
    relationship: "Filho",
    phone: "(61) 99201-3349",
  }),
  resident("r-15", "u-3-101", "Eduardo Peçanha", "801.122.849-17", {
    phone: "(61) 99150-9922",
    owner: true,
    principal: true,
    plate: "GFR3K16",
    vehicle: "Civic",
    color: "Grafite",
  }),
  resident("r-16", "u-3-101", "Teresa Peçanha", "018.542.781-78", {
    relationship: "Mãe",
    notes: "Usa cadeira de rodas; acionar interfone e aguardar.",
  }),
  resident("r-17", "u-3-102", "Camila Bustamante", "946.669.642-19", {
    phone: "(61) 99088-5510",
    email: "camila.bustamante@exemplo.com.br",
    relationship: "Inquilina",
    principal: true,
  }),
  resident("r-18", "u-3-102", "Igor Bustamante", "638.353.704-51", {
    relationship: "Cônjuge",
    plate: "LDN9P03",
    vehicle: "Polo",
    color: "Prata",
  }),
  resident("r-19", "u-3-201", "Antônio Guimarães", "584.017.259-70", {
    phone: "(61) 99034-2261",
    owner: true,
    principal: true,
  }),
  resident("r-20", "u-3-201", "Regina Guimarães", "882.327.976-11", {
    relationship: "Cônjuge",
    owner: true,
    phone: "(61) 99034-2262",
    plate: "VQE2S67",
    vehicle: "Duster",
    color: "Marrom",
  }),
  resident("r-21", "u-1-102", "Leonardo Prado", "102.992.481-56", {
    relationship: "Inquilino",
    active: false,
    notes: "Desocupou a unidade em 05/2026.",
  }),
];

const buildPermits = (): Permit[] => [
  permit("p-01", "r-01", "Neide Barbosa", "300.292.458-95", "Diarista, três vezes por semana.", {
    days: [1, 3, 5],
    from: "08:00",
    until: "17:00",
  }),
  permit("p-02", "r-08", "Murilo Tenório", "068.473.422-52", "Professor de natação das crianças.", {
    days: [2, 4],
    from: "15:00",
    until: "18:00",
  }),
  permit("p-03", "r-16", "Aline Caldas", "602.470.703-46", "Fisioterapeuta domiciliar.", {
    company: "Clínica Movimente",
    days: [1, 2, 3, 4, 5],
    from: "09:00",
    until: "11:30",
  }),
  permit("p-04", "r-13", "Entregador Fonte Azul", "347.992.008-30", "Entrega de água mineral.", {
    company: "Distribuidora Fonte Azul",
    plate: "HKD4T29",
    days: [1, 2, 3, 4, 5, 6],
    from: "07:00",
    until: "12:00",
  }),
  permit("p-05", "r-19", "Equipe Clean Predial", "888.436.166-92", "Limpeza pesada aos sábados.", {
    company: "Clean Predial",
    days: [6],
    from: "08:00",
    until: "14:00",
  }),
  permit("p-06", "r-06", "Sandra Vilela", "649.508.344-76", "Cuidadora — contrato encerrado.", {
    start: day(-120),
    end: day(-30),
    active: false,
  }),
];

const buildVisits = (): Visit[] => [
  // Aguardando autorização
  visit("v-01", "r-01", "Jonas Ribeiro", "720.238.364-85", "Entrega de encomenda", {
    company: "Mercado Envios",
    plate: "FTC8R41",
    vehicle: "Fiorino",
    createdAt: at(0.2),
  }),
  visit("v-02", "r-13", "Patrícia Lemos", "808.492.703-93", "Visita social", {
    phone: "(61) 99617-2280",
    createdAt: at(0.4),
  }),
  visit("v-03", "r-12", "Gustavo Sanches", "697.870.679-11", "Corretor — visita ao imóvel", {
    company: "Imobiliária Central",
    plate: "NPA5V63",
    vehicle: "Argo",
    createdAt: at(0.8),
    notes: "Proprietário avisou por telefone que autorizaria.",
  }),
  // Autorizadas, aguardando entrada
  visit("v-04", "r-08", "Murilo Tenório", "068.473.422-52", "Aula de natação", {
    status: "autorizada",
    createdAt: at(1.2),
    permitId: "p-02",
  }),
  visit("v-05", "r-04", "Técnico Frio Norte", "797.194.983-06", "Manutenção de ar-condicionado", {
    company: "Frio Norte Climatização",
    plate: "BSE7L18",
    vehicle: "Saveiro",
    status: "autorizada",
    createdAt: at(1.6),
  }),
  // No condomínio
  visit("v-06", "r-10", "Amanda Ferraz", "641.445.280-44", "Visita social", {
    phone: "(61) 99402-1173",
    status: "presente",
    createdAt: at(2.5),
    entryAt: at(2.3),
  }),
  visit("v-07", "r-15", "Aline Caldas", "602.470.703-46", "Sessão de fisioterapia", {
    company: "Clínica Movimente",
    status: "presente",
    createdAt: at(1.9),
    entryAt: at(1.8),
    permitId: "p-03",
  }),
  visit("v-08", "r-19", "Marcelo Duarte", "651.019.488-50", "Orçamento de pintura", {
    company: "Duarte Pinturas",
    plate: "CYZ3W94",
    vehicle: "Strada",
    status: "presente",
    createdAt: at(3.1),
    entryAt: at(3),
  }),
  // Negadas
  visit("v-09", "r-06", "Fernando Aguiar", "012.404.515-73", "Entrega não identificada", {
    status: "negada",
    createdAt: at(5),
    notes: "Sem pedido registrado pela moradora.",
  }),
  visit("v-10", "r-03", "Vendedor porta a porta", "376.851.146-29", "Oferta de internet", {
    company: "Não informada",
    status: "negada",
    createdAt: at(7.5),
  }),
  // Finalizadas
  visit("v-11", "r-01", "Neide Barbosa", "300.292.458-95", "Diarista", {
    status: "finalizada",
    createdAt: at(26),
    entryAt: at(25.8),
    exitAt: at(17),
    permitId: "p-01",
  }),
  visit("v-12", "r-17", "Entregador iFood", "613.331.904-05", "Entrega de refeição", {
    company: "iFood",
    plate: "WJM1N57",
    vehicle: "Moto",
    status: "finalizada",
    createdAt: at(21),
    entryAt: at(20.9),
    exitAt: at(20.7),
  }),
  visit("v-13", "r-20", "Motorista de aplicativo", "136.829.091-64", "Embarque de passageiro", {
    company: "Uber",
    plate: "ZQT6B30",
    vehicle: "Prisma",
    status: "finalizada",
    createdAt: at(23),
    entryAt: at(22.9),
    exitAt: at(22.6),
  }),
  visit("v-14", "r-11", "Roberta Nunes", "438.192.926-32", "Aniversário infantil", {
    phone: "(61) 99566-8842",
    status: "finalizada",
    createdAt: at(45),
    entryAt: at(44.5),
    exitAt: at(40),
  }),
  visit("v-15", "r-13", "Técnico Vivo Fibra", "646.447.797-76", "Instalação de internet", {
    company: "Vivo Fibra",
    plate: "KUD2Y75",
    vehicle: "Fiorino",
    status: "finalizada",
    createdAt: at(29),
    entryAt: at(28.8),
    exitAt: at(26.5),
  }),
  visit("v-16", "r-15", "Leilane Farias", "338.414.270-66", "Visita social", {
    status: "finalizada",
    createdAt: at(50),
    entryAt: at(49.7),
    exitAt: at(46),
  }),
];

const buildMails = (): Mail[] => [
  mail("m-01", "r-01", "Caixa grande — loja de eletrodomésticos", {
    tracking: "NM472819304BR",
    carrier: "Correios",
    createdAt: at(2),
  }),
  mail("m-02", "r-13", "Envelope registrado", {
    tracking: "OQ118273645BR",
    carrier: "Correios",
    createdAt: at(3.5),
  }),
  mail("m-03", "r-12", "Duas caixas pequenas", {
    tracking: "TE9930184",
    carrier: "Total Express",
    createdAt: at(5),
    notes: "Volumosas, guardadas na sala da portaria.",
  }),
  mail("m-04", "r-06", "Sacola de farmácia", {
    carrier: "Entrega própria",
    status: "avisada",
    createdAt: at(7),
    noticedAt: at(6.8),
  }),
  mail("m-05", "r-19", "Caixa média — marketplace", {
    tracking: "LG8827361",
    carrier: "Loggi",
    status: "avisada",
    createdAt: at(9),
    noticedAt: at(8.5),
  }),
  mail("m-06", "r-10", "Correspondência bancária", {
    tracking: "AB556677889BR",
    carrier: "Correios",
    status: "avisada",
    createdAt: at(24),
    noticedAt: at(23.5),
  }),
  mail("m-07", "r-04", "Caixa pequena", {
    tracking: "JD4471902",
    carrier: "Jadlog",
    status: "retirada",
    createdAt: at(28),
    noticedAt: at(27.5),
    pickupAt: at(20),
    pickedBy: "Otávio Brandão",
  }),
  mail("m-08", "r-17", "Envelope do condomínio", {
    carrier: "Administração",
    status: "retirada",
    createdAt: at(30),
    noticedAt: at(29),
    pickupAt: at(26),
    pickedBy: "Camila Bustamante",
  }),
  mail("m-09", "r-08", "Caixa grande — pneus", {
    tracking: "TE9927451",
    carrier: "Total Express",
    status: "retirada",
    createdAt: at(52),
    noticedAt: at(51),
    pickupAt: at(44),
    pickedBy: "Wagner Tavares",
    notes: "Retirada com ajuda do zelador.",
  }),
  mail("m-10", "r-15", "Livro", {
    tracking: "NM998112435BR",
    carrier: "Correios",
    status: "retirada",
    createdAt: at(74),
    noticedAt: at(73),
    pickupAt: at(68),
    pickedBy: "Teresa Peçanha",
  }),
  mail("m-11", "r-20", "Duas caixas — roupas", {
    tracking: "LG7761230",
    carrier: "Loggi",
    status: "retirada",
    createdAt: at(96),
    noticedAt: at(95),
    pickupAt: at(90),
    pickedBy: "Regina Guimarães",
  }),
  mail("m-12", "r-03", "Envelope pequeno", {
    carrier: "Correios",
    status: "retirada",
    createdAt: at(120),
    pickupAt: at(112),
    pickedBy: "Marcela Antunes",
  }),
];

const buildIssues = (): Issue[] => [
  issue("i-01", "Manutenção", "Lâmpada queimada na escada do Bloco 2", {
    place: "Bloco 2 — escada do 1º andar",
    shared: true,
    pinned: true,
    createdAt: at(30),
    replies: [
      reply("i-01-r1", 28, "Carlos (portaria)", "Zelador avisado no início do turno."),
      reply("i-01-r2", 6, "Síndico", "Material comprado, troca marcada para amanhã de manhã."),
    ],
  }),
  issue("i-02", "Segurança", "Portão social ficou aberto por cerca de dez minutos", {
    place: "Portaria — portão social",
    reporter: "Denise (portaria)",
    notify: true,
    pinned: true,
    createdAt: at(14),
    replies: [
      reply("i-02-r1", 13, "Síndico", "Verificar se é falha da mola ou se alguém travou o portão."),
      reply("i-02-r2", 11, "Carlos (portaria)", "Mola frouxa. Empresa de manutenção acionada."),
    ],
  }),
  issue("i-03", "Convivência", "Barulho após as 23h na unidade 2/201", {
    place: "Bloco 2 — 201",
    residentId: "r-12",
    reporter: "Denise (portaria)",
    notify: true,
    createdAt: at(38),
    replies: [
      reply("i-03-r1", 36, "Síndico", "Morador notificado por escrito. Primeira ocorrência."),
    ],
  }),
  issue("i-04", "Limpeza", "Vazamento de água no corredor da garagem", {
    place: "Garagem — vaga 34",
    shared: true,
    createdAt: at(9),
  }),
  issue("i-05", "Portaria", "Interfone da unidade 1/202 sem áudio", {
    place: "Bloco 1 — 202",
    residentId: "r-06",
    createdAt: at(4),
  }),
  issue("i-06", "Manutenção", "Bomba d'água com ruído anormal", {
    place: "Casa de máquinas",
    status: "encerrada",
    createdAt: at(120),
    closedAt: at(96),
    replies: [
      reply("i-06-r1", 118, "Síndico", "Empresa de manutenção chamada."),
      reply("i-06-r2", 96, "Síndico", "Rolamento trocado e bomba testada. Ruído cessou."),
    ],
  }),
  issue("i-07", "Segurança", "Veículo desconhecido estacionado na vaga de visitantes", {
    place: "Estacionamento de visitantes",
    reporter: "Carlos (portaria)",
    status: "encerrada",
    createdAt: at(70),
    closedAt: at(64),
    replies: [
      reply("i-07-r1", 68, "Carlos (portaria)", "Placa anotada e consultada com os moradores."),
      reply(
        "i-07-r2",
        64,
        "Carlos (portaria)",
        "Era visita da unidade 3/201, que não avisou. Veículo liberado."
      ),
    ],
  }),
];

const buildNotices = (): Notice[] => [
  notice(
    "n-01",
    "Manutenção da caixa d'água",
    "O fornecimento será interrompido das 8h às 14h para limpeza semestral da caixa d'água. Recomendamos armazenar água para o período.",
    {
      start: day(0),
      startTime: "07:00",
      end: day(0),
      endTime: "23:59",
      createdAt: at(28),
    }
  ),
  notice(
    "n-02",
    "Nova regra para visitantes na piscina",
    "A partir deste mês, cada unidade pode levar no máximo quatro visitantes à área da piscina aos fins de semana, com cadastro prévio na portaria.",
    {
      start: day(-5),
      startTime: "09:00",
      createdAt: at(130),
    }
  ),
  notice(
    "n-03",
    "Assembleia ordinária — convocação",
    "Fica convocada a assembleia geral ordinária para a prestação de contas do exercício e eleição do conselho fiscal. Pauta completa em anexo.",
    {
      audience: "proprietarios",
      tenants: false,
      attachment: "convocacao-assembleia.pdf",
      start: day(3),
      startTime: "08:00",
      end: day(20),
      endTime: "20:00",
      createdAt: at(20),
    }
  ),
  notice(
    "n-04",
    "Dedetização das áreas comuns",
    "A dedetização acontecerá na próxima semana. Mantenha portas e janelas fechadas durante a aplicação nas áreas próximas à sua unidade.",
    {
      start: day(6),
      startTime: "07:30",
      end: day(7),
      endTime: "18:00",
      createdAt: at(12),
    }
  ),
  notice(
    "n-05",
    "Obra na unidade 1/202",
    "Haverá obra com ruído na unidade 1/202 entre 9h e 17h, de segunda a sexta, pelas próximas duas semanas.",
    {
      audience: "unidade",
      unitId: "u-1-202",
      start: day(-1),
      startTime: "09:00",
      end: day(13),
      endTime: "17:00",
      email: false,
      createdAt: at(34),
    }
  ),
  notice(
    "n-06",
    "Horário especial de Natal na portaria",
    "Durante o feriado a portaria funcionará com equipe reduzida. Encomendas não serão recebidas no dia 25.",
    {
      start: day(-40),
      startTime: "08:00",
      end: day(-25),
      endTime: "23:59",
      finished: true,
      createdAt: at(1000),
    }
  ),
];

const log = (
  id: string,
  entityId: string,
  hoursAgo: number,
  actor: string,
  message: string
): Log => ({
  id,
  entityId,
  at: at(hoursAgo),
  actor,
  message,
});

// Histórico só dos registros que mudaram de situação, na ordem mais recente primeiro.
const buildLogs = (): Log[] => [
  log("l-01", "v-08", 3, "Carlos (portaria)", "Entrada registrada (demonstração)"),
  log(
    "l-02",
    "v-08",
    3.05,
    "Carlos (portaria)",
    "Autorização confirmada pelo operador · Morador atendeu o interfone"
  ),
  log("l-03", "v-07", 1.8, "Carlos (portaria)", "Entrada registrada (demonstração)"),
  log("l-04", "v-07", 1.85, "Carlos (portaria)", "Autorizada por pré-autorização válida"),
  log("l-05", "v-06", 2.3, "Denise (portaria)", "Entrada registrada (demonstração)"),
  log(
    "l-06",
    "v-06",
    2.4,
    "Denise (portaria)",
    "Autorização confirmada pelo operador · Moradora confirmou pelo aplicativo"
  ),
  log(
    "l-07",
    "v-05",
    1.6,
    "Carlos (portaria)",
    "Autorização confirmada pelo operador · Morador ligou avisando"
  ),
  log("l-08", "v-04", 1.2, "Carlos (portaria)", "Autorizada por pré-autorização válida"),
  log("l-09", "v-09", 5, "Carlos (portaria)", "Acesso negado · Moradora não reconheceu a entrega"),
  log(
    "l-10",
    "v-10",
    7.5,
    "Denise (portaria)",
    "Acesso negado · Venda porta a porta não permitida"
  ),
  log("l-11", "v-11", 17, "Denise (portaria)", "Saída registrada"),
  log("l-12", "v-11", 25.8, "Denise (portaria)", "Entrada registrada (demonstração)"),
  log("l-13", "v-12", 20.7, "Carlos (portaria)", "Saída registrada"),
  log("l-14", "v-15", 26.5, "Carlos (portaria)", "Saída registrada"),
  log("l-15", "v-15", 28.8, "Carlos (portaria)", "Entrada registrada (demonstração)"),
  log("l-16", "m-04", 6.8, "Carlos (portaria)", "Destinatário avisado (demonstração)"),
  log("l-17", "m-05", 8.5, "Carlos (portaria)", "Destinatário avisado (demonstração)"),
  log("l-18", "m-07", 20, "Denise (portaria)", "Retirada registrada · Otávio Brandão"),
  log("l-19", "m-08", 26, "Carlos (portaria)", "Retirada registrada · Camila Bustamante"),
  log("l-20", "m-09", 44, "Carlos (portaria)", "Retirada registrada · Wagner Tavares"),
  log(
    "l-21",
    "i-01",
    6,
    "Síndico",
    "Resposta registrada · Material comprado, troca marcada para amanhã de manhã."
  ),
  log(
    "l-22",
    "i-02",
    11,
    "Carlos (portaria)",
    "Resposta registrada · Mola frouxa. Empresa de manutenção acionada."
  ),
  log(
    "l-23",
    "i-06",
    96,
    "Síndico",
    "Ocorrência encerrada · Rolamento trocado e bomba testada. Ruído cessou."
  ),
  log(
    "l-24",
    "i-07",
    64,
    "Carlos (portaria)",
    "Ocorrência encerrada · Era visita da unidade 3/201, que não avisou."
  ),
  log("l-25", "n-06", 600, "Síndico", "Comunicado finalizado"),
];

/** Condomínio fictício com movimento de portaria, para demonstração. */
export function demoData(): Data {
  return {
    version: 2,
    revision: 0,
    units: buildUnits(),
    residents: buildResidents(),
    permits: buildPermits(),
    visits: buildVisits(),
    mail: buildMails(),
    issues: buildIssues(),
    notices: buildNotices(),
    logs: buildLogs(),
  };
}

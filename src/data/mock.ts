export type AccessStatus = "autorizado" | "negado" | "atencao";
export type CredentialType = "facial" | "tag" | "placa" | "interfone";

export interface AccessEvent {
  id: string;
  status: AccessStatus;
  person: string;
  role: "Morador" | "Visitante" | "Prestador" | "Veículo";
  door: string;
  time: string;
  credential: CredentialType;
  reason?: string;
  plate?: string;
  device?: string;
  history?: { time: string; label: string }[];
}

export interface Person {
  id: string;
  name: string;
  role: "Morador" | "Visitante" | "Prestador";
  unit: string;
  credentials: CredentialType[];
  active: boolean;
}

export type DeviceStatus = "online" | "offline" | "atencao";
export interface Device {
  id: string;
  name: string;
  model: string;
  type: "Facial" | "Placa (LPR)" | "TAG/RFID" | "Interfone IP";
  location: string;
  status: DeviceStatus;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  owner: string;
  unit: string;
  type: "Morador" | "Visitante" | "Prestador";
  lastAccess: string;
}

export const accessEvents: AccessEvent[] = [
  {
    id: "e1",
    status: "autorizado",
    person: "João da Silva",
    role: "Morador",
    door: "Entrada Principal",
    time: "16:42",
    credential: "facial",
    device: "Control iD iDFace Max",
    history: [
      { time: "08:12", label: "Entrada" },
      { time: "12:30", label: "Saída" },
    ],
  },
  {
    id: "e2",
    status: "negado",
    person: "Carlos Pereira",
    role: "Visitante",
    door: "Entrada Principal",
    time: "16:39",
    credential: "facial",
    reason: "Credencial inválida",
    device: "Control iD iDFace Max",
  },
  {
    id: "e3",
    status: "atencao",
    person: "Portão da Garagem",
    role: "Veículo",
    door: "Garagem",
    time: "16:31",
    credential: "placa",
    reason: "Portão aberto há 8 minutos",
    device: "Hikvision 406",
  },
  {
    id: "e4",
    status: "autorizado",
    person: "Maria Souza",
    role: "Morador",
    door: "Garagem",
    time: "16:28",
    credential: "tag",
    device: "Control iD Antena TAG",
  },
  {
    id: "e5",
    status: "autorizado",
    person: "ABC-1D23",
    role: "Veículo",
    door: "Garagem",
    time: "16:20",
    credential: "placa",
    plate: "ABC-1D23",
    device: "Hikvision 406",
  },
  {
    id: "e6",
    status: "negado",
    person: "Desconhecido",
    role: "Visitante",
    door: "Entrada Serviço",
    time: "16:11",
    credential: "facial",
    reason: "Face não reconhecida",
    device: "Hikvision 673",
  },
  {
    id: "e7",
    status: "autorizado",
    person: "Pedro Lima",
    role: "Prestador",
    door: "Entrada Serviço",
    time: "15:58",
    credential: "tag",
    device: "Control iD Antena TAG",
  },
  {
    id: "e8",
    status: "atencao",
    person: "Interfone Bloco B",
    role: "Visitante",
    door: "Portaria",
    time: "15:50",
    credential: "interfone",
    reason: "Chamada não atendida",
    device: "Intelbras XPE IP",
  },
];

export const people: Person[] = [
  {
    id: "p1",
    name: "João da Silva",
    role: "Morador",
    unit: "Apto 101",
    credentials: ["facial", "tag"],
    active: true,
  },
  {
    id: "p2",
    name: "Maria Souza",
    role: "Morador",
    unit: "Apto 204",
    credentials: ["facial", "tag", "placa"],
    active: true,
  },
  {
    id: "p3",
    name: "Pedro Lima",
    role: "Prestador",
    unit: "Serviços",
    credentials: ["tag"],
    active: true,
  },
  {
    id: "p4",
    name: "Carlos Pereira",
    role: "Visitante",
    unit: "—",
    credentials: ["facial"],
    active: false,
  },
  {
    id: "p5",
    name: "Ana Costa",
    role: "Morador",
    unit: "Apto 308",
    credentials: ["facial"],
    active: true,
  },
];

export const devices: Device[] = [
  {
    id: "d1",
    name: "Facial Entrada",
    model: "Control iD iDFace Max",
    type: "Facial",
    location: "Entrada Principal",
    status: "online",
  },
  {
    id: "d2",
    name: "Facial Serviço",
    model: "Hikvision 673",
    type: "Facial",
    location: "Entrada Serviço",
    status: "online",
  },
  {
    id: "d3",
    name: "LPR Garagem",
    model: "Hikvision 406",
    type: "Placa (LPR)",
    location: "Garagem",
    status: "atencao",
  },
  {
    id: "d4",
    name: "Antena TAG",
    model: "Control iD Antena TAG",
    type: "TAG/RFID",
    location: "Garagem",
    status: "online",
  },
  {
    id: "d5",
    name: "Interfone Portaria",
    model: "Intelbras XPE IP",
    type: "Interfone IP",
    location: "Portaria",
    status: "offline",
  },
];

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    plate: "ABC-1D23",
    model: "Honda Civic Prata",
    owner: "Maria Souza",
    unit: "Apto 204",
    type: "Morador",
    lastAccess: "16:20",
  },
  {
    id: "v2",
    plate: "EFG-2H45",
    model: "Fiat Toro Branca",
    owner: "Ana Costa",
    unit: "Apto 308",
    type: "Morador",
    lastAccess: "14:05",
  },
  {
    id: "v3",
    plate: "JKL-6M78",
    model: "VW Saveiro",
    owner: "Entrega Express",
    unit: "Prestador",
    type: "Prestador",
    lastAccess: "11:32",
  },
  {
    id: "v4",
    plate: "MNP-9Q01",
    model: "Chevrolet Onix Preto",
    owner: "Visitante",
    unit: "—",
    type: "Visitante",
    lastAccess: "09:47",
  },
];

export const stats = {
  hoje: 142,
  autorizados: 128,
  negados: 9,
  alertas: 5,
};

// Pool para simular o feed ao vivo (novos eventos entrando em tempo real).
export const liveFeedPool: Omit<AccessEvent, "id" | "time">[] = [
  {
    status: "autorizado",
    person: "Ana Costa",
    role: "Morador",
    door: "Entrada Principal",
    credential: "facial",
    device: "Control iD iDFace Max",
  },
  {
    status: "autorizado",
    person: "EFG-2H45",
    role: "Veículo",
    door: "Garagem",
    credential: "placa",
    plate: "EFG-2H45",
    device: "Hikvision 406",
  },
  {
    status: "negado",
    person: "Desconhecido",
    role: "Visitante",
    door: "Entrada Serviço",
    credential: "facial",
    reason: "Face não reconhecida",
    device: "Hikvision 673",
  },
  {
    status: "autorizado",
    person: "Pedro Lima",
    role: "Prestador",
    door: "Entrada Serviço",
    credential: "tag",
    device: "Control iD Antena TAG",
  },
  {
    status: "atencao",
    person: "Portão da Garagem",
    role: "Veículo",
    door: "Garagem",
    credential: "placa",
    reason: "Portão aberto há 6 minutos",
    device: "Hikvision 406",
  },
  {
    status: "negado",
    person: "Roberto Alves",
    role: "Visitante",
    door: "Entrada Principal",
    credential: "facial",
    reason: "Fora do horário permitido",
    device: "Control iD iDFace Max",
  },
  {
    status: "autorizado",
    person: "João da Silva",
    role: "Morador",
    door: "Entrada Principal",
    credential: "facial",
    device: "Control iD iDFace Max",
  },
];

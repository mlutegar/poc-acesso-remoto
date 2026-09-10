import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import {
  isData,
  seed,
  transition,
  validate,
  type Collection,
  type Data,
  type Permit,
  type Resident,
  type Unit,
  type Visit,
} from "./model";

const KEY = "portaris-operations-v1";
type Item = Unit | Resident | Permit | Visit;
function read(): Data {
  const raw = localStorage.getItem(KEY);
  if (!raw) return seed();
  const value: unknown = JSON.parse(raw);
  if (!isData(value)) throw new Error("Formato de dados locais inválido.");
  return value;
}
interface Context {
  data: Data;
  error: string;
  save: (collection: Collection, item: Item) => void;
  act: (id: string, action: Parameters<typeof transition>[2], reason: string) => void;
}
const Ctx = createContext<Context | null>(null);
export function OperationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [initial] = useState(() => {
    try {
      return { data: read(), error: "" };
    } catch {
      return {
        data: seed(),
        error:
          "Não foi possível ler os dados locais. As gravações foram bloqueadas para preservar o conteúdo existente. Verifique o armazenamento do navegador.",
      };
    }
  });
  const [data, setData] = useState(initial.data);
  const [error, setError] = useState(initial.error);
  const current = useRef(data);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      try {
        const next = read();
        current.current = next;
        setData(next);
      } catch {
        setError(
          "Os dados foram alterados em outra aba e não puderam ser lidos. Recarregue para verificar."
        );
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function commit(update: (data: Data) => Data, entityId: string, message: string) {
    if (error) throw new Error(error);
    let base: Data;
    try {
      base = read();
    } catch {
      throw new Error("Não foi possível ler os dados. Nada foi alterado.");
    }
    if (base.revision !== current.current.revision) {
      current.current = base;
      setData(base);
      throw new Error("Os dados mudaram em outra aba. Revise o cadastro e tente novamente.");
    }
    const next = update(base);
    next.revision = base.revision + 1;
    next.logs = [
      {
        id: crypto.randomUUID(),
        entityId,
        actor: user || "operador",
        at: new Date().toISOString(),
        message,
      },
      ...base.logs,
    ];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      throw new Error(
        "Não foi possível salvar: armazenamento indisponível ou cheio. Seus dados anteriores foram preservados."
      );
    }
    current.current = next;
    setData(next);
  }
  function save(collection: Collection, item: Item) {
    const existed = current.current[collection].some((x) => x.id === item.id);
    commit(
      (base) => {
        validate(base, collection, item);
        return {
          ...base,
          [collection]: [...base[collection].filter((x) => x.id !== item.id), item],
        };
      },
      item.id,
      `${existed ? "Cadastro atualizado" : "Cadastro criado"}${"active" in item ? (item.active ? " · ativo" : " · inativo") : ""}`
    );
  }
  function act(id: string, action: Parameters<typeof transition>[2], reason: string) {
    const labels = {
      authorize: "Autorização confirmada pelo operador",
      permit: "Autorizada por pré-autorização válida",
      enter: "Entrada registrada (demonstração)",
      deny: "Acesso negado",
      finish: "Saída registrada",
    };
    commit(
      (base) => ({
        ...base,
        visits: base.visits.map((v) => (v.id === id ? transition(base, id, action, reason) : v)),
      }),
      id,
      `${labels[action]}${reason.trim() ? ` · ${reason.trim()}` : ""}`
    );
  }
  return <Ctx.Provider value={{ data, error, save, act }}>{children}</Ctx.Provider>;
}
export function useOperations() {
  const value = useContext(Ctx);
  if (!value) throw new Error("OperationsProvider ausente");
  return value;
}

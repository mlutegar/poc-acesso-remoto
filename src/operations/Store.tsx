import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import { demoData } from "./demo";
import {
  issueTransition,
  mailTransition,
  migrate,
  noticeTransition,
  seed,
  transition,
  validate,
  type Collection,
  type Data,
  type Entity,
} from "./model";

const KEY = "portaris-operations-v1";
type Item = Entity;
function read(): Data {
  const raw = localStorage.getItem(KEY);
  if (!raw) return demoData();
  const value = migrate(JSON.parse(raw) as unknown);
  if (!value) throw new Error("Formato de dados locais inválido.");
  return value;
}
interface Context {
  data: Data;
  error: string;
  save: (collection: Collection, item: Item) => void;
  act: (id: string, action: Parameters<typeof transition>[2], reason: string) => void;
  actMail: (id: string, action: Parameters<typeof mailTransition>[2], text: string) => void;
  actIssue: (id: string, action: Parameters<typeof issueTransition>[2], text: string) => void;
  actNotice: (id: string, action: Parameters<typeof noticeTransition>[2]) => void;
  reset: () => void;
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
  // Aplica a transição da entidade e registra a mesma linha de histórico dos cadastros.
  function change(
    collection: "visits" | "mail" | "issues" | "notices",
    id: string,
    next: (base: Data) => Item,
    label: string,
    detail: string
  ) {
    commit(
      (base) => ({
        ...base,
        [collection]: (base[collection] as Item[]).map((x) => (x.id === id ? next(base) : x)),
      }),
      id,
      `${label}${detail.trim() ? ` · ${detail.trim()}` : ""}`
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
    change("visits", id, (base) => transition(base, id, action, reason), labels[action], reason);
  }
  function actMail(id: string, action: Parameters<typeof mailTransition>[2], text: string) {
    const labels = {
      notify: "Destinatário avisado (demonstração)",
      pickup: "Retirada registrada",
    };
    change("mail", id, (base) => mailTransition(base, id, action, text), labels[action], text);
  }
  function actIssue(id: string, action: Parameters<typeof issueTransition>[2], text: string) {
    const labels = {
      reply: "Resposta registrada",
      close: "Ocorrência encerrada",
      pin: "Ocorrência fixada",
      unpin: "Ocorrência desafixada",
    };
    change(
      "issues",
      id,
      (base) => issueTransition(base, id, action, text, new Date(), user || "operador"),
      labels[action],
      text
    );
  }
  function actNotice(id: string, action: Parameters<typeof noticeTransition>[2]) {
    const labels = { finish: "Comunicado finalizado", reopen: "Comunicado reaberto" };
    change("notices", id, (base) => noticeTransition(base, id, action), labels[action], "");
  }
  // Recarrega o condomínio de demonstração, descartando o que estiver gravado.
  function reset() {
    const next = demoData();
    next.logs = [
      {
        id: crypto.randomUUID(),
        entityId: "",
        actor: user || "operador",
        at: new Date().toISOString(),
        message: "Dados de demonstração recarregados",
      },
      ...next.logs,
    ];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setError("Não foi possível gravar os dados de demonstração neste navegador.");
      return;
    }
    current.current = next;
    setData(next);
    setError("");
  }
  return (
    <Ctx.Provider value={{ data, error, save, act, actMail, actIssue, actNotice, reset }}>
      {children}
    </Ctx.Provider>
  );
}
export function useOperations() {
  const value = useContext(Ctx);
  if (!value) throw new Error("OperationsProvider ausente");
  return value;
}

import { useSearchParams } from "react-router-dom";
import { useOperations } from "./Store";
import { Empty, formatDate, Modal } from "./UI";

export const PAGE_SIZE = 15;

// Filtros, busca e paginação vivem na URL, como nas telas do bloco 1.
export function useListParams() {
  const [params, setParams] = useSearchParams();
  const update = (name: string, value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (name === "tab") next.delete("filter");
        value ? next.set(name, value) : next.delete(name);
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  const query = params.get("q") || "";
  const tab = params.get("tab") || "active";
  const filter = params.get("filter") || "";
  const pageOf = (total: number) =>
    Math.min(
      Math.max(1, Number(params.get("page")) || 1),
      Math.max(1, Math.ceil(total / PAGE_SIZE))
    );
  const goTo = (page: number) =>
    setParams((previous) => {
      previous.set("page", String(page));
      return previous;
    });
  const clear = () => setParams({ tab });
  return { query, tab, filter, update, pageOf, goTo, clear };
}

export function Tabs({
  tab,
  options,
  onSelect,
}: {
  tab: string;
  options: [string, string][];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="op-tabs" aria-label="Situação do registro">
      {options.map(([value, label]) => (
        <button
          key={value}
          aria-pressed={tab === value}
          className={tab === value ? "selected" : ""}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Pagination({
  total,
  page,
  onGo,
}: {
  total: number;
  page: number;
  onGo: (page: number) => void;
}) {
  return (
    <footer className="op-list-footer">
      <span>
        {total} registro(s) · página {page} de {Math.max(1, Math.ceil(total / PAGE_SIZE))}
      </span>
      <div>
        <button className="op-button small" disabled={page <= 1} onClick={() => onGo(page - 1)}>
          Anterior
        </button>
        <button
          className="op-button small"
          disabled={page * PAGE_SIZE >= total}
          onClick={() => onGo(page + 1)}
        >
          Próxima
        </button>
      </div>
    </footer>
  );
}

export function History({ id, onClose }: { id: string; onClose: () => void }) {
  const { data } = useOperations();
  const logs = data.logs.filter((l) => l.entityId === id);
  return (
    <Modal title="Histórico do registro" onClose={onClose}>
      <div className="op-form">
        <p className="op-muted">Horário de Brasília · alterações desta demonstração</p>
        {logs.length ? (
          <ol className="op-timeline">
            {logs.map((l) => (
              <li key={l.id}>
                <strong>{l.message}</strong>
                <small>
                  {formatDate(l.at)} · {l.actor}
                </small>
              </li>
            ))}
          </ol>
        ) : (
          <Empty text="Este registro ainda não recebeu alterações." />
        )}
        <button className="op-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
}

// Aviso e erro no topo da lista, com o mesmo comportamento das telas anteriores.
export function Feedback({
  notice,
  error,
  onDismiss,
}: {
  notice: string;
  error: string;
  onDismiss: () => void;
}) {
  return (
    <>
      {error && (
        <p role="alert" className="op-error">
          {error}
        </p>
      )}
      {notice && (
        <div role="status" className="op-notice">
          {notice}
          <button aria-label="Fechar aviso" onClick={onDismiss}>
            ×
          </button>
        </div>
      )}
    </>
  );
}

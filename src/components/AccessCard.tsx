import type { AccessEvent } from "../data/mock";

const styles: Record<string, { border: string; ring: string; icon: string; label: string }> = {
  autorizado: { border: "border-l-success", ring: "text-success", icon: "🟢", label: "ACESSO AUTORIZADO" },
  negado: { border: "border-l-danger", ring: "text-danger", icon: "🔴", label: "ACESSO NEGADO" },
  atencao: { border: "border-l-warning", ring: "text-warning", icon: "🟠", label: "ATENÇÃO" },
};

const credLabel: Record<string, string> = {
  facial: "Facial",
  tag: "TAG",
  placa: "Placa",
  interfone: "Interfone",
};

export default function AccessCard({
  event,
  onOpen,
  onAction,
  fresh,
}: {
  event: AccessEvent;
  onOpen?: (e: AccessEvent) => void;
  onAction?: (e: AccessEvent, action: string) => void;
  fresh?: boolean;
}) {
  const s = styles[event.status];
  const showActions = event.status !== "autorizado";

  return (
    <div
      className={`rounded-lg border-l-4 bg-card p-4 shadow-card ${s.border} ${fresh ? "animate-slide-in" : ""}`}
    >
      <button
        onClick={() => onOpen?.(event)}
        className="w-full text-left"
        aria-label={`${s.label}: ${event.person}. Ver detalhes.`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold tracking-wide ${s.ring}`}>
            {s.icon} {s.label}
          </span>
          <span className="text-xs font-medium text-ink/50">{event.time}</span>
        </div>
        <p className="mt-2 text-lg font-bold text-ink">{event.person}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-ink/60">
          <span>{event.role}</span>
          <span>Porta: {event.door}</span>
          <span>{credLabel[event.credential]}</span>
        </div>
        {event.reason && (
          <p className={`mt-2 text-sm font-medium ${s.ring}`}>Motivo: {event.reason}</p>
        )}
      </button>

      {showActions && onAction && (
        <div className="mt-3 flex gap-2 border-t border-ink/5 pt-3">
          <button
            onClick={() => onAction(event, "abrir")}
            className="rounded-md bg-success/10 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success/20"
          >
            Abrir porta
          </button>
          <button
            onClick={() => onAction(event, "interfone")}
            className="rounded-md bg-blue/10 px-3 py-1.5 text-xs font-semibold text-blue hover:bg-blue/20"
          >
            Interfone
          </button>
          <button
            onClick={() => onAction(event, "negar")}
            className="rounded-md bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20"
          >
            Negar
          </button>
        </div>
      )}
    </div>
  );
}

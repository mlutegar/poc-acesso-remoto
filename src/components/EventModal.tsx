import { useEffect } from "react";
import type { AccessEvent } from "../data/mock";
import StatusBadge from "./StatusBadge";

const credLabel: Record<string, string> = {
  facial: "Facial",
  tag: "TAG",
  placa: "Placa",
  interfone: "Interfone",
};

export default function EventModal({
  event,
  onClose,
}: {
  event: AccessEvent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!event) return null;
  const isPlate = event.credential === "placa";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Detalhe do acesso"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Detalhe do acesso</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-ink/50 hover:text-ink">
            ✕
          </button>
        </div>

        <div className="p-5">
          <div className="flex gap-4">
            {/* Captura (facial ou placa) */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-navy/90 text-4xl text-white/70">
              {isPlate ? "🚗" : "👤"}
            </div>
            <div className="flex-1">
              <StatusBadge status={event.status} />
              <p className="mt-2 text-xl font-bold text-ink">{event.person}</p>
              <p className="text-sm text-ink/60">{event.role}</p>
              {isPlate && event.plate && (
                <p className="mt-1 inline-block rounded border border-ink/20 px-2 py-0.5 font-mono text-sm font-bold text-ink">
                  {event.plate}
                </p>
              )}
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-ink/50">Porta</dt>
              <dd className="font-medium text-ink">{event.door}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Horário</dt>
              <dd className="font-medium text-ink">{event.time}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Credencial</dt>
              <dd className="font-medium text-ink">{credLabel[event.credential]}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Dispositivo</dt>
              <dd className="font-medium text-ink">{event.device ?? "—"}</dd>
            </div>
            {event.reason && (
              <div className="col-span-2">
                <dt className="text-ink/50">Motivo</dt>
                <dd className="font-medium text-danger">{event.reason}</dd>
              </div>
            )}
          </dl>

          {event.history && event.history.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-ink">Histórico do dia</p>
              <ul className="space-y-1">
                {event.history.map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink/70">
                    <span className="font-mono text-ink/50">{h.time}</span>
                    <span>{h.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button className="flex-1 rounded-lg bg-success py-2 text-sm font-semibold text-white hover:opacity-90">
              Abrir porta
            </button>
            <button className="flex-1 rounded-lg bg-blue py-2 text-sm font-semibold text-white hover:opacity-90">
              Chamar interfone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

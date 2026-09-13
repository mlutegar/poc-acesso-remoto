import type { AccessStatus, DeviceStatus } from "../data/mock";

const map: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  autorizado: { label: "Autorizado", dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  negado: { label: "Negado", dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
  atencao: { label: "Atenção", dot: "bg-warning", bg: "bg-warning/10", text: "text-warning" },
  online: { label: "Online", dot: "bg-success", bg: "bg-success/10", text: "text-success" },
  offline: { label: "Offline", dot: "bg-danger", bg: "bg-danger/10", text: "text-danger" },
};

export default function StatusBadge({ status }: { status: AccessStatus | DeviceStatus }) {
  const s = map[status] ?? map.atencao;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "navy" | "success" | "danger" | "warning";
}) {
  const bar: Record<string, string> = {
    navy: "bg-blue",
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning",
  };
  return (
    <div className="relative overflow-hidden rounded-xl bg-card p-5 shadow-card">
      <span className={`absolute left-0 top-0 h-full w-1 ${bar[accent]}`} />
      <p className="text-sm font-medium text-ink/60">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
    </div>
  );
}

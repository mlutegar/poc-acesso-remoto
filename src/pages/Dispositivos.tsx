import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import { devices } from "../data/mock";
import { useLayout } from "../hooks/useLayout";

export default function Dispositivos() {
  const { openMenu } = useLayout();
  return (
    <>
      <Topbar title="Dispositivos" onMenu={openMenu} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((d) => (
            <div key={d.id} className="rounded-xl bg-card p-5 shadow-card">
              <div className="flex items-start justify-between">
                <span className="rounded-md bg-navy/5 px-2 py-0.5 text-xs font-semibold text-navy dark:bg-white/10 dark:text-white/70">
                  {d.type}
                </span>
                <StatusBadge status={d.status} />
              </div>
              <p className="mt-3 text-lg font-bold text-ink">{d.name}</p>
              <p className="text-sm text-ink/60">{d.model}</p>
              <p className="mt-2 text-xs text-ink/40">📍 {d.location}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

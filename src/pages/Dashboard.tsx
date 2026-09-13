import { useState } from "react";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import AccessCard from "../components/AccessCard";
import StatusBadge from "../components/StatusBadge";
import EventModal from "../components/EventModal";
import Toast from "../components/Toast";
import { devices, stats, type AccessEvent } from "../data/mock";
import { useLiveFeed } from "../hooks/useLiveFeed";
import { useLayout } from "../hooks/useLayout";

export default function Dashboard() {
  const { openMenu } = useLayout();
  const { events, paused, setPaused } = useLiveFeed();
  const [selected, setSelected] = useState<AccessEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleAction = (e: AccessEvent, action: string) => {
    const map: Record<string, string> = {
      abrir: `Porta "${e.door}" aberta manualmente`,
      interfone: `Chamando interfone — ${e.door}`,
      negar: `Acesso de ${e.person} negado pelo operador`,
    };
    notify(map[action] ?? "Ação registrada");
  };

  return (
    <>
      <Topbar title="Operação" onMenu={openMenu} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Acessos hoje" value={stats.hoje} accent="navy" />
          <StatCard label="Autorizados" value={stats.autorizados} accent="success" />
          <StatCard label="Negados" value={stats.negados} accent="danger" />
          <StatCard label="Alertas" value={stats.alertas} accent="warning" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="xl:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Feed ao vivo</h2>
              <button
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-ink"
              >
                <span
                  className={`h-2 w-2 rounded-full ${paused ? "bg-ink/30" : "animate-pulse bg-blue"}`}
                />
                {paused ? "Pausado" : "Tempo real"}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {events.slice(0, 6).map((e, i) => (
                <AccessCard
                  key={e.id}
                  event={e}
                  fresh={i === 0 && e.id.startsWith("live")}
                  onOpen={setSelected}
                  onAction={handleAction}
                />
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div>
              <h2 className="mb-3 text-lg font-bold text-ink">Câmeras</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Entrada", "Garagem", "Serviço", "Portaria"].map((c) => (
                  <div
                    key={c}
                    className="flex aspect-video items-center justify-center rounded-lg bg-navy/90 text-xs font-medium text-white/60"
                  >
                    <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-danger" /> {c}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-bold text-ink">Dispositivos</h2>
              <div className="space-y-2">
                {devices.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-lg bg-card p-3 shadow-card"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{d.name}</p>
                      <p className="text-xs text-ink/50">{d.location}</p>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <EventModal event={selected} onClose={() => setSelected(null)} />
      <Toast message={toast} />
    </>
  );
}

import Topbar from "../components/Topbar";
import { vehicles } from "../data/mock";
import { useLayout } from "../hooks/useLayout";

const badge: Record<string, string> = {
  Morador: "bg-success/10 text-success",
  Visitante: "bg-warning/10 text-warning",
  Prestador: "bg-blue/10 text-blue",
};

export default function Veiculos() {
  const { openMenu } = useLayout();
  return (
    <>
      <Topbar title="Veículos (LPR)" onMenu={openMenu} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <p className="mb-4 text-sm text-ink/50">
          Acesso veicular por leitura de placa (Hikvision 406) e TAG (Control iD).
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-xl bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="rounded border-2 border-ink/20 bg-bg px-3 py-1 font-mono text-base font-bold tracking-wider text-ink">
                  {v.plate}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${badge[v.type]}`}>
                  {v.type}
                </span>
              </div>
              <p className="mt-3 text-base font-bold text-ink">{v.model}</p>
              <p className="text-sm text-ink/60">{v.owner} • {v.unit}</p>
              <p className="mt-2 text-xs text-ink/40">Último acesso: {v.lastAccess}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

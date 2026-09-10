import { useState } from "react";
import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import EventModal from "../components/EventModal";
import { accessEvents, type AccessStatus, type AccessEvent } from "../data/mock";
import { useLayout } from "../hooks/useLayout";

const filters: { key: AccessStatus | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "autorizado", label: "Autorizados" },
  { key: "negado", label: "Negados" },
  { key: "atencao", label: "Atenção" },
];

const credLabel: Record<string, string> = {
  facial: "Facial",
  tag: "TAG",
  placa: "Placa",
  interfone: "Interfone",
};

export default function Eventos() {
  const { openMenu } = useLayout();
  const [filter, setFilter] = useState<AccessStatus | "todos">("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<AccessEvent | null>(null);

  const rows = accessEvents.filter(
    (e) =>
      (filter === "todos" || e.status === filter) &&
      (query === "" || e.person.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <Topbar title="Eventos de Acesso" onMenu={openMenu} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f.key ? "bg-navy text-white" : "bg-card text-ink/60 shadow-card hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pessoa…"
            className="ml-auto rounded-lg border border-ink/15 bg-card px-3 py-1.5 text-sm outline-none focus:border-blue"
            aria-label="Buscar por pessoa"
          />
        </div>

        <div className="overflow-x-auto rounded-xl bg-card shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Pessoa</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Porta</th>
                <th className="px-5 py-3">Credencial</th>
                <th className="px-5 py-3">Horário</th>
                <th className="px-5 py-3">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="cursor-pointer border-b border-ink/5 last:border-0 hover:bg-bg/60"
                >
                  <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3 font-medium text-ink">{e.person}</td>
                  <td className="px-5 py-3 text-ink/70">{e.role}</td>
                  <td className="px-5 py-3 text-ink/70">{e.door}</td>
                  <td className="px-5 py-3 text-ink/70">{credLabel[e.credential]}</td>
                  <td className="px-5 py-3 text-ink/70">{e.time}</td>
                  <td className="px-5 py-3 text-ink/50">{e.reason ?? "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-ink/40">
                    Nenhum evento encontrado para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <EventModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}

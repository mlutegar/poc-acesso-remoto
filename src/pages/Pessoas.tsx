import { useState } from "react";
import Topbar from "../components/Topbar";
import { people } from "../data/mock";
import { useLayout } from "../hooks/useLayout";

const credLabel: Record<string, string> = {
  facial: "Facial",
  tag: "TAG",
  placa: "Placa",
  interfone: "Interfone",
};

export default function Pessoas() {
  const { openMenu } = useLayout();
  const [query, setQuery] = useState("");
  const list = people.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <Topbar title="Pessoas" onMenu={openMenu} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pessoa…"
          className="mb-4 w-full max-w-xs rounded-lg border border-ink/15 bg-card px-3 py-1.5 text-sm outline-none focus:border-blue"
          aria-label="Buscar por pessoa"
        />
        {list.length === 0 ? (
          <p className="py-12 text-center text-ink/40">Nenhuma pessoa encontrada.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <div key={p.id} className="rounded-xl bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-ink/50">{p.role} • {p.unit}</p>
                    </div>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${p.active ? "bg-success" : "bg-danger"}`}
                    title={p.active ? "Ativo" : "Inativo"}
                    aria-label={p.active ? "Ativo" : "Inativo"}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.credentials.map((c) => (
                    <span key={c} className="rounded-md bg-blue/10 px-2 py-0.5 text-xs font-medium text-blue">
                      {credLabel[c]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

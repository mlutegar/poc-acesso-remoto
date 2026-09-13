import { NavLink } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";
import BrandMark from "./BrandMark";

const links = [
  { to: "/", label: "Operação", icon: "▦", end: true },
  { to: "/eventos", label: "Eventos de Acesso", icon: "≣" },
  { to: "/pessoas", label: "Pessoas", icon: "☺" },
  { to: "/veiculos", label: "Veículos (LPR)", icon: "⛢" },
  { to: "/dispositivos", label: "Dispositivos", icon: "⚏" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { preset } = useTheme();

  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed z-40 flex h-full w-64 shrink-0 flex-col bg-navy text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <BrandMark size={40} />
          <div>
            <p className="text-lg font-bold leading-tight">{preset.name}</p>
            <p className="text-[11px] leading-tight text-white/50">{preset.tagline}</p>
          </div>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center text-base">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 py-5 text-[11px] text-white/40">
          POC • White-label
          <br />
          Cliente âncora: R Johnson
        </div>
      </aside>
    </>
  );
}

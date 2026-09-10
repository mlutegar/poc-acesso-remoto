import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Topbar({
  title,
  onMenu,
}: {
  title: string;
  onMenu?: () => void;
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-ink/10 bg-card px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Abrir menu"
          className="text-xl text-ink/60 lg:hidden"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg font-bold text-ink sm:text-xl">{title}</h1>
          <p className="hidden text-xs text-ink/50 sm:block">Condomínio Modelo • Portaria Central</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success md:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          Online
        </span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white"
          aria-label="Sair"
          title="Sair"
        >
          OP
        </button>
      </div>
    </header>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";
import { useAuth } from "../auth/AuthProvider";
import BrandMark from "../components/BrandMark";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname?: string } } };
  const { preset } = useTheme();
  const { login } = useAuth();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login("operador");
    navigate(location.state?.from?.pathname ?? "/", { replace: true });
  };

  return (
    <div className="flex h-screen">
      <div className="relative hidden flex-1 flex-col justify-between bg-navy p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <BrandMark size={44} />
          <span className="text-2xl font-bold">{preset.name}</span>
        </div>
        <div>
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">
            Portaria remota e controle de acesso, em um só lugar.
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Identificação por facial, TAG e placa. Status visual em tempo real para uma
            operação mais segura e intuitiva.
          </p>
          <div className="mt-8 flex gap-6 text-sm">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Autorizado</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-danger" /> Negado</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Atenção</span>
          </div>
        </div>
        <p className="text-xs text-white/40">{preset.tagline}</p>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-bg px-6">
        <div className="absolute right-4 top-4"><ThemeSwitcher /></div>
        <form className="w-full max-w-sm" onSubmit={submit}>
          <h1 className="text-2xl font-bold text-ink">Acessar o painel</h1>
          <p className="mt-1 text-sm text-ink/50">Entre com suas credenciais de operador.</p>

          <label className="mt-8 block text-sm font-medium text-ink" htmlFor="user">Usuário</label>
          <input
            id="user"
            defaultValue="operador"
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-card px-3.5 py-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
          />

          <label className="mt-4 block text-sm font-medium text-ink" htmlFor="pass">Senha</label>
          <input
            id="pass"
            type="password"
            defaultValue="123456"
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-card px-3.5 py-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Entrar
          </button>
          <p className="mt-4 text-center text-xs text-ink/40">POC • Protótipo front-end</p>
        </form>
      </div>
    </div>
  );
}

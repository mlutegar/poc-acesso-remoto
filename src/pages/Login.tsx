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
    <div className="sh-login">
      <div className="sh-login-top">
        <div className="sh-top-inner">
          <div className="sh-brand text-white">
            <BrandMark size={36} />
            <div>
              <strong>{preset.name}</strong>
              <small>Controle de acesso</small>
            </div>
          </div>
          <span className="sh-phone text-white">Condomínio Modelo · (61) 3000-0000</span>
        </div>
      </div>
      <form className="sh-login-box" onSubmit={submit}>
        <h1>Acesso ao sistema</h1>
        <label htmlFor="user">Usuário</label>
        <input id="user" defaultValue="operador" autoComplete="username" />
        <label htmlFor="pass">Senha</label>
        <input id="pass" type="password" defaultValue="123456" autoComplete="current-password" />
        <button type="submit" className="op-button primary w-full">
          Entrar
        </button>
        <div className="sh-login-foot">
          <span>Ambiente de demonstração</span>
          <ThemeSwitcher />
        </div>
      </form>
    </div>
  );
}

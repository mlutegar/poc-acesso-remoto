import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth } from "./auth/AuthProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import Operations from "./operations/Operations";
import MailPage from "./operations/Mail";
import Issues from "./operations/Issues";
import Notices from "./operations/Notices";
import Veiculos from "./pages/Veiculos";
import Dispositivos from "./pages/Dispositivos";
import Previsto from "./pages/Previsto";
import { MENU, type MenuItem } from "./components/Layout";

// Itens do menu sem tela própria caem na página de módulo previsto.
const BUILT = new Set([
  "/visitas",
  "/correspondencias",
  "/condominos",
  "/residencias",
  "/pre-autorizacoes",
  "/ocorrencias",
  "/comunicados",
  "/operacao",
  "/eventos",
  "/veiculos",
  "/dispositivos",
]);
const planned = (items: MenuItem[]): string[] =>
  items.flatMap((i) => (i.children ? planned(i.children) : i.to && !BUILT.has(i.to) ? [i.to] : []));

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/visitas" replace />} />
        <Route path="/visitas" element={<Operations key="visits" kind="visits" />} />
        <Route path="/condominos" element={<Operations key="residents" kind="residents" />} />
        <Route path="/residencias" element={<Operations key="units" kind="units" />} />
        <Route path="/pre-autorizacoes" element={<Operations key="permits" kind="permits" />} />
        <Route path="/correspondencias" element={<MailPage />} />
        <Route path="/ocorrencias" element={<Issues />} />
        <Route path="/comunicados" element={<Notices />} />
        <Route path="/operacao" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/pessoas" element={<Navigate to="/condominos" replace />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/dispositivos" element={<Dispositivos />} />
        {planned(MENU).map((to) => (
          <Route key={to} path={to} element={<Previsto />} />
        ))}
        <Route path="*" element={<Navigate to="/visitas" replace />} />
      </Route>
    </Routes>
  );
}

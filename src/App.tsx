import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth } from "./auth/AuthProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import Operations from "./operations/Operations";
import Veiculos from "./pages/Veiculos";
import Dispositivos from "./pages/Dispositivos";

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
        <Route path="/operacao" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/pessoas" element={<Navigate to="/condominos" replace />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/dispositivos" element={<Dispositivos />} />
        <Route path="*" element={<Navigate to="/visitas" replace />} />
      </Route>
    </Routes>
  );
}

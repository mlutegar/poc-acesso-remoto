import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth } from "./auth/AuthProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import Pessoas from "./pages/Pessoas";
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/pessoas" element={<Pessoas />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/dispositivos" element={<Dispositivos />} />
      </Route>
    </Routes>
  );
}

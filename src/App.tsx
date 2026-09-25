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
import CommonAreas from "./operations/CommonAreas";
import Pets from "./operations/Pets";
import Bikes from "./operations/Bikes";
import Rotas from "./preview/Rotas";
import Dispositivos from "./preview/Dispositivos";
import Gatilhos from "./preview/Gatilhos";
import Credenciais from "./preview/Credenciais";
import CredenciaisVisitante from "./preview/CredenciaisVisitante";
import RelatorioAcessos from "./preview/RelatorioAcessos";
import Usuarios from "./preview/Usuarios";
import Funcionarios from "./preview/Funcionarios";
import Enquetes from "./preview/Enquetes";
import Assembleias from "./preview/Assembleias";
import Achados from "./preview/Achados";
import Manutencoes from "./preview/Manutencoes";
import Bloqueios from "./preview/Bloqueios";
import Documentos from "./preview/Documentos";
import Produtos from "./preview/Produtos";
import Inventarios from "./preview/Inventarios";
import Objetos from "./preview/Objetos";
import Fornecedores from "./preview/Fornecedores";
import Procedimentos from "./preview/Procedimentos";
import Turnos from "./preview/Turnos";
import RelatorioVisitas from "./preview/RelatorioVisitas";
import RelatorioCorrespondencias from "./preview/RelatorioCorrespondencias";
import Diario from "./preview/Diario";
import Ligacoes from "./preview/Ligacoes";
import FilaSip from "./preview/FilaSip";
import BioRfid from "./preview/BioRfid";
import LogNotificacoes from "./preview/LogNotificacoes";
import LogEmails from "./preview/LogEmails";
import LogUsuarios from "./preview/LogUsuarios";
import Acionadores from "./preview/Acionadores";
import Cameras from "./preview/Cameras";
import Condominio from "./preview/Condominio";

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
        <Route path="/areas-comuns" element={<CommonAreas />} />
        <Route path="/dispositivos" element={<Dispositivos />} />
        <Route path="/animais" element={<Pets />} />
        <Route path="/bicicletas" element={<Bikes />} />
        <Route path="/rotas" element={<Rotas />} />
        <Route path="/gatilhos" element={<Gatilhos />} />
        <Route path="/credenciais" element={<Credenciais />} />
        <Route path="/credenciais-visitante" element={<CredenciaisVisitante />} />
        <Route path="/relatorios/acessos" element={<RelatorioAcessos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/enquetes" element={<Enquetes />} />
        <Route path="/assembleias" element={<Assembleias />} />
        <Route path="/achados" element={<Achados />} />
        <Route path="/manutencoes" element={<Manutencoes />} />
        <Route path="/bloqueios" element={<Bloqueios />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/inventarios" element={<Inventarios />} />
        <Route path="/objetos" element={<Objetos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/procedimentos" element={<Procedimentos />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/relatorios/visitas" element={<RelatorioVisitas />} />
        <Route path="/relatorios/correspondencias" element={<RelatorioCorrespondencias />} />
        <Route path="/diario" element={<Diario />} />
        <Route path="/ligacoes" element={<Ligacoes />} />
        <Route path="/fila-sip" element={<FilaSip />} />
        <Route path="/bio-rfid" element={<BioRfid />} />
        <Route path="/log-notificacoes" element={<LogNotificacoes />} />
        <Route path="/log-emails" element={<LogEmails />} />
        <Route path="/log-usuarios" element={<LogUsuarios />} />
        <Route path="/acionadores" element={<Acionadores />} />
        <Route path="/cameras" element={<Cameras />} />
        <Route path="/condominio" element={<Condominio />} />
        <Route path="*" element={<Navigate to="/visitas" replace />} />
      </Route>
    </Routes>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BarraLateral from "./components/BarraLateral";
import Login from "./pages/Login/Login";
import EstadoCabañas from "./pages/Cabañas/EstadoCabañas";
import ListaCabañas from "./pages/Cabañas/ListaCabañas";
import AñadirReservas from "./pages/Reservas/AñadirReservas";
import ListaReservas from "./pages/Reservas/ListaReservas";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Reportes from "./pages/Reportes/Reportes";


function App() {
  return (

    <Router>
      <Header />
      <BarraLateral />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Reportes" element={<Reportes />} />
        <Route path="/estado-cabañas" element={<EstadoCabañas />} />
        <Route path="/lista-cabañas" element={<ListaCabañas />} />
        <Route path="/añadir-reservas" element={<AñadirReservas />} />
        <Route path="/lista-reservas" element={<ListaReservas />} />
        <Route path="/cerrar-sesion" element={<Login/>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
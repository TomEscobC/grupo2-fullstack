import { useState } from "react";
import "./ListaReservas.css";

const ListaReservas = () => {
  const [filtroRut, setFiltroRut] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const reservas = [
    { cliente: "Juan Perez", rut: "12345678-9", habitacion: "Habitación 01", entrada: "2025-03-15", salida: "2025-03-20", creacion: "2025-01-12", estado: "Confirmada" },
    { cliente: "Maria Gonzalez", rut: "13334567-6", habitacion: "Habitación 02", entrada: "2025-04-01", salida: "2025-04-07", creacion: "2025-02-20", estado: "Pendiente" },
    { cliente: "Carla Vera", rut: "13345678-3", habitacion: "Habitación 03", entrada: "2025-05-05", salida: "2025-05-12", creacion: "2025-01-30", estado: "Pendiente" },
    { cliente: "Pedro Rodriguez", rut: "18345678-2", habitacion: "Habitación 04", entrada: "2024-10-10", salida: "2024-10-15", creacion: "2024-09-22", estado: "Confirmada" },
    { cliente: "Matias Jorquera", rut: "14345678-1", habitacion: "Habitación 05", entrada: "2024-11-20", salida: "2024-11-25", creacion: "2024-11-10", estado: "Confirmada" },
  ];

  const handleFechaInput = (value) => {
    const formattedValue = value
      .replace(/\D/g, "")
      .replace(/^(\d{4})(\d{0,2})?(\d{0,2})?$/, (_, y, m, d) =>
        [y, m, d].filter(Boolean).join("-")
      );
    setFiltroFecha(formattedValue);
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    return (
      reserva.rut.includes(filtroRut) &&
      reserva.estado.toLowerCase().includes(filtroEstado.toLowerCase()) &&
      reserva.creacion.includes(filtroFecha)
    );
  });

  return (
    <div className="content-listares">
      <h1 className="titulo mt-4">Buscador de Reservas</h1>
      <div className="buscadores-container">
        <div className="buscador">
          <label htmlFor="rutFilter">Filtrar por RUT:</label>
          <input
            type="text"
            id="rutFilter"
            placeholder="Ingrese RUT"
            value={filtroRut}
            onChange={(e) => setFiltroRut(e.target.value)}
          />
        </div>
        <div className="buscador">
          <label htmlFor="estadoFilter">Filtrar por Estado:</label>
          <select
            id="estadoFilter"
            className="estado-filter"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
        <div className="buscador">
          <label htmlFor="fechaCreacionFilter">Filtrar por Fecha de Creación:</label>
          <input
            type="text"
            id="fechaCreacionFilter"
            placeholder="Ingrese Fecha (AAAA-MM-DD)"
            value={filtroFecha}
            onChange={(e) => handleFechaInput(e.target.value)}
          />
        </div>
      </div>
      <table className="table table-bordered">
        <thead className="table-secondary">
          <tr>
            <th scope="col">Cliente</th>
            <th scope="col">Rut</th>
            <th scope="col">Habitación</th>
            <th scope="col">Fecha de Entrada</th>
            <th scope="col">Fecha de Salida</th>
            <th scope="col">Fecha de Creación</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservasFiltradas.map((reserva, index) => (
            <tr key={index}>
              <td>{reserva.cliente}</td>
              <td>{reserva.rut}</td>
              <td>{reserva.habitacion}</td>
              <td>{reserva.entrada}</td>
              <td>{reserva.salida}</td>
              <td>{reserva.creacion}</td>
              <td>{reserva.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaReservas;
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, } from "@tanstack/react-table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

// Constantes
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];
const API_BASE_URL = "http://localhost:5000/api/reservations";

const App = () => {
  // Estados
  const [reservations, setReservations] = useState([]);
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    roomType: "",
    minRevenue: 0
  });
  const [selectedChart, setSelectedChart] = useState("bar");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Recuperar preferencia de modo oscuro del localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Memorizar columnas para evitar re-renderizados
  const columns = useMemo(() => [
    { 
      accessorKey: "month", 
      header: "Mes", 
      cell: (info) => info.getValue(),
      sortable: true
    },
    { 
      accessorKey: "total_reservations", 
      header: "Total Reservas", 
      cell: (info) => info.getValue().toLocaleString(),
      sortable: true
    },
    { 
      accessorKey: "revenue", 
      header: "Ingresos", 
      cell: (info) => `$${info.getValue().toLocaleString()}`,
      sortable: true
    },
    { 
      accessorKey: "average_stay", 
      header: "Estancia Promedio", 
      cell: (info) => `${info.getValue()} días`,
      sortable: true
    },
    { 
      accessorKey: "roomType", 
      header: "Tipo de Habitación", 
      cell: (info) => info.getValue(),
      sortable: true
    }
  ], []);

  // Función memoizada para procesar datos de tipo de habitación
  const processRoomTypeData = useCallback((data) => {
    const roomTypeCounts = data.reduce((acc, res) => {
      if (res.roomType) {
        acc[res.roomType] = (acc[res.roomType] || 0) + res.total_reservations;
      }
      return acc;
    }, {});

    return Object.keys(roomTypeCounts).map((key) => ({
      name: key,
      value: roomTypeCounts[key],
    }));
  }, []);

  // Función memoizada para fetchData
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let url = API_BASE_URL;
      let params = new URLSearchParams();

      if (filters.month) params.append("month", filters.month);
      if (filters.roomType) params.append("roomType", filters.roomType);
      if (filters.minRevenue) params.append("minRevenue", filters.minRevenue);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setReservations(response.data);
      setRoomTypeData(processRoomTypeData(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("⚠️ Error cargando datos. Inténtalo de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, processRoomTypeData]);

  // Efecto para cargar datos
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Efecto para guardar preferencia de modo oscuro
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Memorizar estadísticas para evitar recálculos
  const statistics = useMemo(() => {
    const totalReservations = reservations.reduce((sum, res) => sum + res.total_reservations, 0);
    const totalRevenue = reservations.reduce((sum, res) => sum + res.revenue, 0);
    const averageStay = reservations.length > 0 
      ? (reservations.reduce((sum, res) => sum + res.average_stay, 0) / reservations.length).toFixed(1) 
      : 0;
    const highestRevenueMonth = reservations.length > 0
      ? reservations.reduce((max, res) => res.revenue > max.revenue ? res : max, reservations[0])
      : null;
    
    return { totalReservations, totalRevenue, averageStay, highestRevenueMonth };
  }, [reservations]);

  // Instancia de tabla memoizada
  const table = useReactTable({
    data: reservations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      }
    }
  });

  // Manejador de cambio de filtros
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Manejador para cambiar modo oscuro
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Estilos del tema
  const theme = {
    backgroundColor: darkMode ? "#1a1a1a" : "#fff",
    color: darkMode ? "#f0f0f0" : "#333",
    cardBg: darkMode ? "#333" : "#f4f4f4",
    borderColor: darkMode ? "#555" : "#ddd",
    buttonPrimary: darkMode ? "#4a90e2" : "#28a745",
    buttonSecondary: darkMode ? "#555" : "#f0f0f0",
    tableBg: darkMode ? "#333" : "#fff",
    tableHeaderBg: darkMode ? "#444" : "#f4f4f4",
    tableRowHover: darkMode ? "#444" : "#f9f9f9",
  };

  return (
    <div className="dashboard-container" style={{ 
      width: "90%", 
      maxWidth: "1200px",
      margin: "30px auto", 
      backgroundColor: theme.backgroundColor, 
      color: theme.color, 
      padding: "25px", 
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease"
    }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{ fontSize: "1.8rem", margin: 0 }}>📊 Dashboard de Reservas</h1>
        
        <button
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          style={{
            padding: "8px 12px",
            borderRadius: "5px",
            backgroundColor: theme.buttonSecondary,
            color: darkMode ? "#fff" : "#333",
            cursor: "pointer",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
        >
          {darkMode ? "🌞 Modo Claro" : "🌙 Modo Oscuro"}
        </button>
      </header>

      {/* Panel de filtros */}
      <section className="filters-panel" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        marginBottom: "25px",
        padding: "15px",
        backgroundColor: theme.cardBg,
        borderRadius: "8px"
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="month-filter" style={{ display: "block", marginBottom: "5px" }}>Mes:</label>
          <select 
            id="month-filter"
            value={filters.month}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.backgroundColor,
              color: theme.color
            }}
          >
            <option value="">Todos los meses</option>
            <option value="Enero">Enero</option>
            <option value="Febrero">Febrero</option>
            <option value="Marzo">Marzo</option>
            <option value="Abril">Abril</option>
          </select>
        </div>
        
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="room-type-filter" style={{ display: "block", marginBottom: "5px" }}>Tipo de Habitación:</label>
          <select 
            id="room-type-filter"
            value={filters.roomType}
            onChange={(e) => handleFilterChange("roomType", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.backgroundColor,
              color: theme.color
            }}
          >
            <option value="">Todos los tipos</option>
            <option value="Estándar">Estándar</option>
            <option value="Suite">Suite</option>
            <option value="Deluxe">Deluxe</option>
          </select>
        </div>
        
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label htmlFor="min-revenue" style={{ display: "block", marginBottom: "5px" }}>Ingresos Mínimos:</label>
          <input 
            id="min-revenue"
            type="number" 
            value={filters.minRevenue}
            onChange={(e) => handleFilterChange("minRevenue", Number(e.target.value))}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.backgroundColor,
              color: theme.color
            }}
          />
        </div>
      </section>

      {/* Tarjetas de estadísticas */}
      <section className="statistics-cards" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px",
        marginBottom: "30px"
      }}>
        <StatCard 
          title="📊 Total Reservas" 
          value={statistics.totalReservations.toLocaleString()} 
          theme={theme}
        />
        <StatCard 
          title="💰 Ingresos Totales" 
          value={`$${statistics.totalRevenue.toLocaleString()}`}
          theme={theme}
        />
        <StatCard 
          title="🏨 Estancia Promedio" 
          value={`${statistics.averageStay} días`}
          theme={theme}
        />
        {statistics.highestRevenueMonth && (
          <StatCard 
            title="🏆 Mes con Mayor Ingreso" 
            value={statistics.highestRevenueMonth.month}
            subvalue={`$${statistics.highestRevenueMonth.revenue.toLocaleString()}`}
            theme={theme}
          />
        )}
      </section>

      {/* Selección de gráfico */}
      <section className="chart-controls" style={{ marginBottom: "20px" }}>
        <label htmlFor="chart-selector" style={{ marginRight: "10px" }}>📊 Tipo de Gráfico: </label>
        <select 
          id="chart-selector"
          onChange={(e) => setSelectedChart(e.target.value)} 
          value={selectedChart}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: `1px solid ${theme.borderColor}`,
            backgroundColor: theme.backgroundColor,
            color: theme.color
          }}
        >
          <option value="bar">Gráfico de Barras</option>
          <option value="pie">Gráfico de Torta</option>
          <option value="line">Gráfico de Línea</option>
        </select>
      </section>

      {/* Visualización de gráficos */}
      <section className="chart-display" style={{ 
        backgroundColor: theme.cardBg, 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "30px"
      }}>
        {isLoading ? (
          <LoadingIndicator theme={theme} />
        ) : error ? (
          <ErrorMessage error={error} theme={theme} />
        ) : (
          <>
            {selectedChart === "bar" && <BarChartComponent data={reservations} theme={theme} />}
            {selectedChart === "pie" && <PieChartComponent data={roomTypeData} theme={theme} />}
            {selectedChart === "line" && <LineChartComponent data={reservations} theme={theme} />}
          </>
        )}
      </section>

      {/* Tabla completa con búsqueda, exportación y paginación */}
      <section className="data-table-section">
        <h2 style={{ marginBottom: "15px" }}>📑 Datos de Reservas</h2>
        <TableComponent table={table} theme={theme} />
      </section>
    </div>
  );
};

// Componente de Tarjeta Estadística
const StatCard = ({ title, value, subvalue, theme }) => (
  <div style={{ 
    backgroundColor: theme.cardBg, 
    padding: "20px", 
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    ":hover": {
      transform: "translateY(-5px)"
    }
  }}>
    <h3 style={{ fontSize: "1.1rem", marginTop: 0, marginBottom: "10px" }}>{title}</h3>
    <p style={{ fontSize: "1.8rem", fontWeight: "bold", margin: 0 }}>{value}</p>
    {subvalue && <p style={{ fontSize: "1rem", opacity: 0.8, marginTop: "5px" }}>{subvalue}</p>}
  </div>
);

// Componente de Indicador de Carga
const LoadingIndicator = ({ theme }) => (
  <div style={{ textAlign: "center", padding: "40px 0" }}>
    <div style={{ 
      fontSize: "1.5rem", 
      fontWeight: "bold",
      color: theme.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    }}>
      <span style={{ 
        display: "inline-block", 
        animation: "spin 1.5s linear infinite",
        "@keyframes spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      }}>⏳</span>
      Cargando datos...
    </div>
  </div>
);

// Componente de Mensaje de Error
const ErrorMessage = ({ error, theme }) => (
  <div style={{ 
    textAlign: "center", 
    padding: "40px 0", 
    color: "#ff6b6b" 
  }}>
    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{error}</p>
    <button 
      onClick={() => window.location.reload()}
      style={{
        marginTop: "15px",
        padding: "8px 15px",
        borderRadius: "5px",
        backgroundColor: theme.buttonPrimary,
        color: "white",
        border: "none",
        cursor: "pointer"
      }}
    >
      🔄 Reintentar
    </button>
  </div>
);

// Componente de Gráfico de Barras mejorado
const BarChartComponent = ({ data, theme }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor} />
      <XAxis dataKey="month" tick={{ fill: theme.color }} />
      <YAxis tick={{ fill: theme.color }} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: theme.cardBg, 
          color: theme.color,
          border: `1px solid ${theme.borderColor}`
        }}
      />
      <Legend />
      <Bar dataKey="total_reservations" name="Reservas" fill="#8884d8" />
      <Bar dataKey="revenue" name="Ingresos ($)" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);

// Componente de Gráfico de Torta mejorado
const PieChartComponent = ({ data, theme }) => (
  <ResponsiveContainer width="100%" height={400}>
    <PieChart>
      <Pie 
        data={data} 
        dataKey="value" 
        nameKey="name" 
        cx="50%" 
        cy="50%" 
        outerRadius={150}
        fill="#8884d8" 
        labelLine={true}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ 
          backgroundColor: theme.cardBg, 
          color: theme.color,
          border: `1px solid ${theme.borderColor}`
        }}
        formatter={(value) => [`${value} reservas`, 'Cantidad']}
      />
      <Legend 
        formatter={(value) => <span style={{ color: theme.color }}>{value}</span>}
      />
    </PieChart>
  </ResponsiveContainer>
);

// Componente de Gráfico de Línea mejorado
const LineChartComponent = ({ data, theme }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor} />
      <XAxis dataKey="month" tick={{ fill: theme.color }} />
      <YAxis tick={{ fill: theme.color }} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: theme.cardBg, 
          color: theme.color,
          border: `1px solid ${theme.borderColor}`
        }}
      />
      <Legend 
        formatter={(value) => <span style={{ color: theme.color }}>{value}</span>}
      />
      <Line type="monotone" dataKey="revenue" name="Ingresos ($)" stroke="#82ca9d" strokeWidth={2} />
      <Line type="monotone" dataKey="total_reservations" name="Reservas" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// Componente de Tabla mejorado
const TableComponent = ({ table, theme }) => {
  const [globalFilter, setGlobalFilter] = useState("");

  const exportToCSV = useCallback(() => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Encabezados
      csvContent += table.getHeaderGroups().map(headerGroup =>
        headerGroup.headers.map(header => `"${header.column.columnDef.header}"`).join(",")
      ).join("\n") + "\n";
      
      // Datos
      csvContent += table.getRowModel().rows.map(row =>
        row.getVisibleCells().map(cell => `"${cell.getValue() || ''}"`).join(",")
      ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `reservas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error al exportar datos. Inténtalo de nuevo.");
    }
  }, [table]);

  return (
    <div style={{ backgroundColor: theme.tableBg, borderRadius: "8px", padding: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Buscar reservas..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setGlobalFilter?.(e.target.value);
            }}
            aria-label="Buscar en tabla de reservas"
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "5px",
              border: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.backgroundColor,
              color: theme.color,
            }}
          />
        </div>
        
        <button
          onClick={exportToCSV}
          aria-label="Exportar datos a CSV"
          style={{
            padding: "10px 15px",
            backgroundColor: theme.buttonPrimary,
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          📥 Exportar a CSV
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table 
          style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            border: `1px solid ${theme.borderColor}`,
            borderRadius: "8px",
            overflow: "hidden"
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ backgroundColor: theme.tableHeaderBg }}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    style={{ 
                      padding: "12px", 
                      textAlign: "left",
                      color: theme.color,
                      borderBottom: `2px solid ${theme.borderColor}`,
                      cursor: header.column.getCanSort() ? "pointer" : "default",
                      userSelect: "none"
                    }}
                    onClick={header.column.getToggleSortingHandler?.()}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "asc" ? " 🔼" : " 🔽"
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id}
                  style={{ 
                    borderBottom: `1px solid ${theme.borderColor}`,
                    ":hover": {
                      backgroundColor: theme.tableRowHover
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      style={{ 
                        padding: "12px",
                        color: theme.color,
                        transition: "background-color 0.2s ease" 
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={table.getAllColumns().length}
                  style={{ 
                    padding: "20px", 
                    textAlign: "center",
                    color: theme.color, 
                  }}
                >
                  No se encontraron datos con los filtros actuales
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación Mejorados */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: "15px", 
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div>
          <span style={{ marginRight: "10px" }}>Filas por página:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: `1px solid ${theme.borderColor}`,
              backgroundColor: theme.backgroundColor,
              color: theme.color
            }}
          >
            {[5, 10, 20, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: theme.buttonSecondary,
              color: theme.color,
              cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
              border: "none",
              opacity: table.getCanPreviousPage() ? 1 : 0.5
            }}
          >
            ⏮️ Primera
          </button>
          
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: theme.buttonSecondary,
              color: theme.color,
              cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed",
              border: "none",
              opacity: table.getCanPreviousPage() ? 1 : 0.5
            }}
          >
            ⬅️ Anterior
          </button>
          
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: theme.buttonSecondary,
              color: theme.color,
              cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
              border: "none",
              opacity: table.getCanNextPage() ? 1 : 0.5
            }}
          >
            Siguiente ➡️
          </button>
          
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              backgroundColor: theme.buttonSecondary,
              color: theme.color,
              cursor: table.getCanNextPage() ? "pointer" : "not-allowed",
              border: "none",
              opacity: table.getCanNextPage() ? 1 : 0.5
            }}
          >
            Última ⏭️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;

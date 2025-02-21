// controllers/reportController.js
const Report = require("../models/Report");
const Reservation = require("../models/Reservation"); // Asumimos que existe este modelo

// Obtener reportes (generados dinámicamente desde Reservation)
const getReports = async (req, res) => {
  try {
    const { month, roomType, minRevenue } = req.query;
    let reservationFilter = {};

    // Filtro por mes (formato YYYY-MM)
    if (month) {
      const [year, monthIndex] = month.split("-");
      reservationFilter.checkinDate = {
        $gte: new Date(year, monthIndex - 1, 1),
        $lt: new Date(year, monthIndex, 0), // Último día del mes
      };
    }

    const reservations = await Reservation.find(reservationFilter).populate("cabin");

    // Generar datos agregados
    const aggregatedData = reservations.reduce((acc, res) => {
      const checkinMonth = res.checkinDate.toLocaleString("es", { month: "long" }).capitalize();
      const stayDuration = (res.checkoutDate - res.checkinDate) / (1000 * 60 * 60 * 24); // Días
      const revenue = stayDuration * (res.cabin?.pricePerNight || 100); // $100 por defecto si no hay precio

      const existing = acc.find((item) => item.month === checkinMonth && item.roomType === (res.cabin?.type || "Desconocido"));
      if (existing) {
        existing.total_reservations += 1;
        existing.revenue += revenue;
        existing.average_stay = (existing.average_stay * (existing.total_reservations - 1) + stayDuration) / existing.total_reservations;
      } else {
        acc.push({
          month: checkinMonth,
          total_reservations: 1,
          revenue,
          average_stay: stayDuration,
          roomType: res.cabin?.type || "Desconocido",
        });
      }
      return acc;
    }, []);

    // Aplicar filtros adicionales
    let filteredData = aggregatedData;
    if (minRevenue) {
      filteredData = filteredData.filter((item) => item.revenue >= Number(minRevenue));
    }
    if (roomType) {
      filteredData = filteredData.filter((item) => item.roomType === roomType);
    }

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error obteniendo reportes" });
  }
};

// Generar y guardar reportes (opcional, si quieres persistirlos)
const generateReports = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("cabin");

    const aggregatedData = reservations.reduce((acc, res) => {
      const checkinMonth = res.checkinDate.toLocaleString("es", { month: "long" }).capitalize();
      const stayDuration = (res.checkoutDate - res.checkinDate) / (1000 * 60 * 60 * 24);
      const revenue = stayDuration * (res.cabin?.pricePerNight || 100);

      const existing = acc.find((item) => item.month === checkinMonth && item.roomType === (res.cabin?.type || "Desconocido"));
      if (existing) {
        existing.total_reservations += 1;
        existing.revenue += revenue;
        existing.average_stay = (existing.average_stay * (existing.total_reservations - 1) + stayDuration) / existing.total_reservations;
      } else {
        acc.push({
          month: checkinMonth,
          total_reservations: 1,
          revenue,
          average_stay: stayDuration,
          roomType: res.cabin?.type || "Desconocido",
        });
      }
      return acc;
    }, []);

    // Guardar en la colección Report
    await Report.deleteMany({}); // Limpiar reportes anteriores (opcional)
    await Report.insertMany(aggregatedData);

    res.status(201).json({ message: "Reportes generados y guardados", data: aggregatedData });
  } catch (error) {
    console.error("Error generando reportes:", error);
    res.status(500).json({ message: "Error generando reportes" });
  }
};

// Helper para capitalizar
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {
  getReports,
  generateReports,
};
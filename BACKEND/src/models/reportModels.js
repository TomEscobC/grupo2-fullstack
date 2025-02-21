// models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true, // Ejemplo: "Enero", "Febrero", etc.
  },
  total_reservations: {
    type: Number,
    required: true,
    min: 0,
  },
  revenue: {
    type: Number,
    required: true,
    min: 0,
  },
  average_stay: {
    type: Number,
    required: true,
    min: 0,
  },
  roomType: {
    type: String,
    enum: ["Estándar", "Suite", "Deluxe", "Desconocido"], // Ajusta según tus tipos reales
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: "__v" });

module.exports = mongoose.model("Report", reportSchema);
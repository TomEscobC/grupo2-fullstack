// models/Reservation.js
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  cabin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabin", // Referencia al modelo Cabin
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Referencia al modelo Client
    required: true,
  },
  clientDocumentType: {
    type: String,
    enum: ["RUT", "DNI", "Pasaporte"],
    required: true,
  },
  checkinDate: {
    type: Date,
    required: true,
  },
  checkoutDate: {
    type: Date,
    required: true,
  },
  adults: {
    type: Number,
    required: true,
    min: 1,
  },
  children: {
    type: Number,
    required: true,
    min: 0,
  },
  hasHotTub: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ["Crédito", "Débito", "Efectivo", "Transferencia"],
    required: true,
  },
  paymentOrigin: {
    type: String,
    enum: ["Nacional", "Internacional"],
    required: true,
  },
  isHistorical: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: "__v" });

// Middleware para actualizar updatedAt
reservationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
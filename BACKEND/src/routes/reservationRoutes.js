const express = require("express");
const { obtenerReservas, crearReserva, actualizarReserva, eliminarReserva } = require("../controllers/reservationController");

const router = express.Router();

router.get("/", obtenerReservas);  // Método para recibir todas las reservas.
router.post("/", crearReserva);    // Método para crear una nueva reserva.
router.put("/:id", actualizarReserva); // Método para actualizar una reserva por ID.
router.delete("/:id", eliminarReserva); // Método para eliminar una reserva por ID.

module.exports = router;

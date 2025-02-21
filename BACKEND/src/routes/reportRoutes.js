// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { getReports, generateReports } = require("../controllers/reportController");

// Rutas para reportes
router.get("/", getReports); // Obtener reportes para el dashboard
router.post("/generate", generateReports); // Generar y guardar reportes (opcional)

module.exports = router;
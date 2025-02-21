require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const conectarDB = require("../config/db"); // Ajusté la ruta relativa
const session = require("express-session");
const jwt = require("jsonwebtoken");

// Rutas
const clientRoutes = require("./routes/clientRoutes");
const cabinRoutes = require("./routes/cabinRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const registerRoutes = require("./routes/registerRoutes");
const reportRoutes = require("./routes/reportRoutes"); // Nueva ruta para reportes
const loginRoutes = require("./controllers/loginController");

const app = express();

// Configuración de CORS
app.use(cors({
  origin: "http://localhost:5173", // URL del frontend (ajusta si cambia)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Habilita cookies/sesiones si es necesario
}));

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(express.json());

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || "default-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Cambia a true en producción con HTTPS
}));

// Middleware para autenticar JWT
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Extrae el token después de "Bearer"

  console.log("Token recibido:", token); // Debugging

  if (!token) {
    return res.status(401).json({ message: "Falta el token de autenticación" });
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY || "chlk"); // Verifica el token
    console.log("Token verificado:", user); // Debugging
    req.user = user; // Asigna el usuario decodificado al request
    next();
  } catch (error) {
    console.error("Error verificando token:", error); // Debugging
    return res.status(403).json({ message: "Token no válido" });
  }
}

// Rutas públicas
app.use("/api/auth", loginRoutes); // Login no requiere autenticación

// Rutas protegidas con JWT
app.use("/api", authenticateToken); // Aplica middleware a todas las rutas /api/*
app.use("/api/clients", clientRoutes);
app.use("/api/cabins", cabinRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/reportes", reportRoutes); // Nueva ruta para reportes

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
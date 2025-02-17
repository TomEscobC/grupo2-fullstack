require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Módulo bcrypt para el hash de los datos de register
const conectarDB = require("../config/db");  // Asegúrate de que la ruta sea correcta
const session = require('express-session'); // Importa express-session para gestionar el inicio de usuario
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para gestionar JWT

// Rutas de cliente, cabaña, Reserva
const clientRoutes = require("../routes/clientRoutes");
const cabinRoutes = require("../routes/cabinRoutes");
const reservationRoutes = require("../routes/reservationRoutes");
const registerRoutes = require("../routes/registerRoutes");
const loginRoutes = require("../controllers/loginController");


const app = express();

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(express.json());
app.use(cors());

//Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Middleware para authenticar JWT
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Falta el token de autenticación' });
    }

    jwt.verify(token, process.env.SECRET_KEY || 'chlk', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = user;
        next();
    });
}

app.use("/api/auth", loginRoutes); // Ruta para el login

app.use("/api", authenticateToken); // Usar authenticateToken para proteger las rutas

// Rutas con prefijo /api/
app.use("/api/clients", clientRoutes);  // Ruta para clientes
app.use("/api/cabins", cabinRoutes);  // Ruta para cabañas
app.use("/api/reservations", reservationRoutes);  // Ruta para reservas
app.use("/api/register", registerRoutes); //Ruta para crear usuarios

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

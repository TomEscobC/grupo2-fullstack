const express = require('express');
const jwt = require('jsonwebtoken');
const User = require("../models/usersModels");
const router = express.Router();

// Secret key para JWT
const SECRET_KEY = 'chlk';

router.post('/login', express.json(), async (req, res) => {
    const { username, password } = req.body;

    // Validación que se han rellenado los campos obligatorios
    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        // Encuentra al usuario
        const user = await User.findOne({ username });
        console.log('Usuario encontrado:', user); // Log para verificar usuario encontrado

        // Usuario no encontrado
        if (!user) {
            return res.status(401).json({ message: 'Usuario no autorizado' });
        }

        // Verifica la contraseña
        const matchPass = await user.comparePassword(password);
        console.log('Contraseña verificada:', matchPass); // Log para verificar contraseña

        if (!matchPass) {
            return res.status(401).json({ message: 'Contraseña incorrecta, inténtelo de nuevo' });
        }

        // Crea un token JWT
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error en el servidor:', error); // Log de error en el servidor
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

module.exports = router;

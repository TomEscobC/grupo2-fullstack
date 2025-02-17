const express = require("express");
const { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente } = require("../controllers/clientController");

const router = express.Router();

router.get("/", obtenerClientes);  // Método para obtener todos los clientes.
router.post("/", crearCliente);    // Método para crear un nuevo cliente.
router.put("/:id", actualizarCliente); //  Método para actualizar un cliente por ID.
router.delete("/:id", eliminarCliente); // Método para eliminar un cliente por ID.

module.exports = router;

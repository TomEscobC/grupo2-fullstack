const Reservation = require("../models/reservationModels");
const Cabin = require("../models/cabinModels");
const Client = require("../models/clientModels");

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reservation.find()
            .populate("cabin") 
            .populate("client", "name documentNumber email phone");  // ✅ Poblamos el cliente correctamente

        console.log("📌 Reservas obtenidas:", reservas);
        res.json(reservas);
    } catch (error) {
        console.error("❌ Error al obtener reservas:", error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// Crear una nueva reserva
const crearReserva = async (req, res) => {
    try {
        console.log("🔍 BODY RECIBIDO:", req.body);

        const { client, cabin, clientDocumentType, clientDocumentNumber, checkinDate, checkoutDate, adults, children, hasHotTub, paymentMethod, paymentOrigin } = req.body;

        // Convertir fechas a objetos Date
        const fechaHoy = new Date();
        const fechaCheckin = new Date(checkinDate);
        const fechaCheckout = new Date(checkoutDate);

        // Verificar si la cabaña existe
        const cabanaDisponible = await Cabin.findById(cabin);
        if (!cabanaDisponible) {
            return res.status(400).json({ mensaje: "La cabaña no existe" });
        }

        // Buscar la última reserva de la cabaña
        const ultimaReserva = await Reservation.findOne({ cabin }).sort({ checkoutDate: -1 });

        // Si hay una reserva activa, verificar que la nueva comience después
        if (ultimaReserva && fechaCheckin <= new Date(ultimaReserva.checkoutDate)) {
            return res.status(400).json({
                mensaje: `Cabaña no disponible en estas fechas, la última reserva termina el ${ultimaReserva.checkoutDate}`
            });
        }

        // Crear la nueva reserva
        const nuevaReserva = new Reservation({
            client,
            cabin,
            clientDocumentType,
            clientDocumentNumber,
            checkinDate: fechaCheckin,
            checkoutDate: fechaCheckout,
            adults,
            children,
            hasHotTub,
            paymentMethod,
            paymentOrigin,
            isHistorical: fechaCheckout < fechaHoy // Solo marcar como histórica si la fecha final ya pasó
        });

        await nuevaReserva.save();

        // 🔹 Nueva Lógica para cambiar estado de la cabaña
        if (fechaCheckin <= fechaHoy && fechaCheckout >= fechaHoy) {
            // Si la reserva cubre la fecha actual, marcar la cabaña como "Ocupada"
            cabanaDisponible.status = "Ocupada";
        } else {
            // Si la reserva es futura o ya terminó, la cabaña queda "Disponible"
            cabanaDisponible.status = "Disponible";
        }

        await cabanaDisponible.save();

        console.log("✅ Reserva creada con éxito:", nuevaReserva);
        res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error("❌ Error al crear reserva:", error);
        res.status(500).json({ mensaje: "Error al crear reserva", error });
    }
};

// ✅ **Corrección en eliminarReserva (Línea 100)**
const eliminarReserva = async (req, res) => {
    try {
        const reservaEliminada = await Reservation.findByIdAndDelete(req.params.id);  // 🔥 CORREGIDO

        if (!reservaEliminada) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }

        // Marcar la cabaña como disponible nuevamente
        const cabana = await Cabin.findById(reservaEliminada.cabin);
        if (cabana) {
            cabana.status = "Disponible";
            await cabana.save();
        }

        res.json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar reserva", error });
    }
};

// Actualizar una reserva
const actualizarReserva = async (req, res) => {
    try {
        const reservaActualizada = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservaActualizada) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        res.json(reservaActualizada);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar reserva", error });
    }
};

module.exports = {
    obtenerReservas,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};

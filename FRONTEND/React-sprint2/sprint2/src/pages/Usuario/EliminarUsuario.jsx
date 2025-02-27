import React, { useState } from "react";
import "./EliminarUsuario.css";

const DeleteUser = () => {
  const [userId, setUserId] = useState(""); // Estado para almacenar el ID del usuario
  const [errors, setErrors] = useState(""); // Estado para manejar errores

  // Manejador de cambios para el campo de entrada
  const handleChange = (e) => {
    setUserId(e.target.value);
  };

  // Validación del formulario
  const validar = () => {
    let error = "";
    if (!userId) error = "Requerido";
    return error;
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario
    const formError = validar();
    if (formError) {
      setErrors(formError);
      console.error("Form validation error:", formError);
      return;
    }

    // Confirmación antes de eliminar
    const confirmation = window.confirm(
      `¿Estás seguro de que deseas eliminar el usuario con id "${userId}"?`
    );
    if (!confirmation) {
      return;
    }

    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Debes iniciar sesión para eliminar un usuario.");
        return;
      }

      console.log("Token enviado al backend:", token);

      // Realizar la solicitud DELETE al backend
      const response = await fetch(`http://localhost:3000/api/register/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the user");
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);
      alert("Usuario eliminado exitosamente");

      // Limpiar el campo de ID después de eliminar
      setUserId("");
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
        console.error("Respuesta del servidor:", error.response.data);
      } else {
        alert("Error al conectar con el servidor");
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="delete-form">
      <div className="form-group">
        <h2>Eliminar Usuario</h2>
        <label htmlFor="userId">ID de usuario</label>
        <input
          id="userId"
          name="userId"
          type="text"
          onChange={handleChange}
          value={userId}
        />
        {errors && <div className="error">{errors}</div>}
      </div>
      <button type="submit" className="submit-button">
        Eliminar
      </button>
    </form>
  );
};

export default DeleteUser;
import React, { useState } from "react";
import "./CrearUsuario.css";

const NewUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validar = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = "Requerido";
    if (!formData.password) formErrors.password = "Requerido";
    if (!formData.confirmPassword) formErrors.confirmPassword = "Requerido";
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Las contraseñas deben coincidir.";
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validar();
    if (Object.keys(formErrors).length === 0) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Debes iniciar sesión para registrar un nuevo usuario.");
          return;
        }

        console.log("Token enviado al backend:", token);

        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register the user");
        }

        const data = await response.json();
        console.log("Respuesta del backend:", data);

        alert("Usuario registrado exitosamente");
      } catch (error) {
        if (error.response) {
          alert(`Error: ${error.response.data.message}`);
          console.error("Respuesta del servidor:", error.response.data);
        } else {
          alert("Error al conectar con el servidor");
          console.error("Error:", error.message);
        }
      }
    } else {
      setErrors(formErrors);
      console.error("Form validation errors:", formErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
      <h2>Registrar Nuevo Usuario</h2>
        <label htmlFor="username">Nombre de usuario</label>
        <input
          id="username"
          name="username"
          type="text"
          onChange={handleChange}
          value={formData.username}
        />
        {errors.username && <div className="error">{errors.username}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirma tu contraseña</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          onChange={handleChange}
          value={formData.confirmPassword}
        />
        {errors.confirmPassword && (
          <div className="error">{errors.confirmPassword}</div>
        )}
      </div>
      <button type="submit" className="submit-button">
        Registrar
      </button>
    </form>
  );
};

export default NewUser;

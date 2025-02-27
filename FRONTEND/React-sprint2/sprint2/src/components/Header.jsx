import React from "react";
import { Link } from "react-router-dom";

function Header() {
  // Recuperar el nombre de usuario del localStorage
  const username = localStorage.getItem("username") || "Invitado";

  return (
    <header>
      <div className="header">
        {/* Logo */}
        <img
          src="Uploads/logo_CHELENKO-copy-White-Final.png"
          alt="Logo Chelenko"
        />

        {/* Contenedor de Usuario */}
        <div className="contenedor-usuario">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>

          {/* Mensaje de Bienvenida */}
          <p className="username">Bienvenido/a: {username}</p>
        </div>

        {/* Enlace para Desconectarse */}
        <p id="desconectarse">
          <Link to="/">Desconectarse</Link>
        </p>
      </div>
    </header>
  );
}

export default Header;
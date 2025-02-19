import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginD.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState(""); // Cambié 'email' por 'username'
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error anterior

    try {
      // Realiza la solicitud POST con fetch
      const response = await fetch("http://localhost:3000/api/auth/login", { // Cambié la URL de login
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username, // Usamos 'username' en lugar de 'email'
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar el token en el localStorage o estado global
        localStorage.setItem("token", data.token);

        // Redirigir o realizar alguna acción tras iniciar sesión
        window.location.href = "/reportes";  // Aquí puedes redirigir a donde desees
      } else {
        setError(data.message || "Error de autenticación");
      }
    } catch (err) {
      setError("Error al comunicarse con el servidor");
    }
  };

  return (
<div className="login">
  <form onSubmit={handleSubmit}>
    <h2 className="text-center">Inicio de sesión</h2>

    {error && <p className="text-danger">{error}</p>}

    <div className="form-group">
      <label htmlFor="username">Usuario</label>
      <div className="input-group">
        <input
          type="text" 
          className="form-control"
          id="username"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  
        />
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="password">Contraseña</label>
      <div className="input-group">
        <input
          type={passwordVisible ? "text" : "password"}
          className="form-control"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={togglePassword}
          >
            <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
          </button>
        </div>
      </div>
    </div>

    <button type="submit" className="btn btn-primary">
      Iniciar sesión
    </button>
  </form>
</div>

  );
}

export default Login;

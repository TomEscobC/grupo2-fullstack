import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginD.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    document.getElementById("email").textContent = email;
    document.getElementById("password").textContent = password;
  };
  return (
    <div className="login">
        <form onSubmit={handleSubmit}>
        <h2 className="text-center">Inicio de sesión</h2>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <a href="/reportes" className="link-blanco">Iniciar sesión</a>
        </button>
      </form>

    </div>
  );
}

export default Login;
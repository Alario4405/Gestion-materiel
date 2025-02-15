
import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import css from "./css/login.module.css";
import { AuthContext } from '../Components/AuthContext'; // Import AuthContext
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
     console.log("Envoi de la requête avec les données suivantes :");
     console.log({ email, password });
    try {
      const response = await axios.post(
        "http://localhost:8085/login", // Corrected URL (removed apostrophe)
        {
          email,
          password,
        }
      );

      // Log request data (optional, for debugging purposes)
      console.log("Request data:", { email, password });
      console.log("Login successful:", response.data); // Log response for debugging
      // Handle successful login
      localStorage.setItem("authToken", response.data.token);
      setIsLoggedIn(true); // Update authentication state
      navigate("/home");
    } catch (error) {
      // Handle errors gracefully
      console.error("Login error:", error); // Log error details for troubleshooting
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className={`${css.dashboard} dashboard`}>
      {/* Section d'image de fond */}

      <div className={css.topBaseGradients}>
        <div className="gradient-blue"></div>
        <div className="gradient-orange"></div>
        <div className="gradient-red"></div>
      </div>

      {/* Boîte de connexion */}
      <div className={`${css.login_box} theme-container`}>
        <h2 className="mb-4">Connexion</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className={css.form_label}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className={css.form_label}>
              Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

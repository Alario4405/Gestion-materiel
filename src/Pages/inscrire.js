import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import css from "./css/login.module.css";

const Inscrire = () => {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setmdp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleinscrire = async (e) => {
    e.preventDefault();
     console.log("Envoi de la requête avec les données suivantes :");
     console.log({ nom,telephone,email, mdp });
    try {
      const data = { nom, telephone, email, mdp};
      const response =await axios.post("http://localhost:8085/utilisateur/ajout", data);
      

      // Log request data (optional, for debugging purposes)
      console.log("Request data:", { email, mdp });

      // Handle successful login
      localStorage.setItem("authToken", response.data.token);
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
        <h2 className="mb-4">Inscrire</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleinscrire}>
          <div className="mb-3">
            <label htmlFor="nom" className={css.form_label}>
              Nom complet
            </label>
            <input
              type="text"
              className="form-control"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telephone" className={css.form_label}>
              Telephone
            </label>
            <input
              type="text"
              className="form-control"
              id="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>
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
            <label htmlFor="mdp" className={css.form_label}>
              Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              id="mdp"
              value={mdp}
              onChange={(e) => setmdp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscrire;

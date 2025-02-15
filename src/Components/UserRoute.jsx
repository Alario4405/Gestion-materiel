import React, { useContext } from 'react';

import { Link, NavLink, Outlet, useNavigate,Navigate } from "react-router-dom";
import { FaHome, FaUser, FaDoorOpen, FaList, FaChalkboardTeacher, FaToolbox, FaCalendarCheck, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import css from "./UserRoute.module.css";
import { AuthContext } from './AuthContext';

const UserRoute = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // Fonction de déconnexion avec SweetAlert pour confirmation
  const handleLogout = () => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false); // Update state for immediate re-render
        navigate("/login");
        Swal.fire('Déconnecté!', 'Vous avez été déconnecté avec succès.', 'success');
      }
    });
  };

  return (
    isLoggedIn ? (
    <div className={css.container} id="navbg">
      <div className={css.menu}>
        <>
      <nav
        className="navbar  navbar-dark"
        // style={{ backgroundColor: "#343a40" }}
      >
        <div className="container">
          <Link to="/" className="navbar-brand fs-4">
            SPRAY INFO
              </Link>
                 <div className={css.ligne}></div>
              
          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}

              <div>
          
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink to="/home" className="nav-link fs-6">
                  <FaHome className="me-2" id={css.me} />
                  Home
                </NavLink>
                  </li>
              <li className="nav-item">
                <NavLink to="/globale" className="nav-link fs-6">
                  <FaChalkboardTeacher className="me-2" id={css.me} />
                  Globale
                </NavLink>
                  </li>
              <li className="nav-item">
                <NavLink to="/formation" className="nav-link fs-6">
                  <FaChalkboardTeacher className="me-2" id={css.me} />
                  Formation
                </NavLink>
                  </li>
                  
              <li className="nav-item">
                <NavLink to="/location/salle" className="nav-link fs-6">
                  <FaBoxOpen className="me-2" id={css.me} />
                  Location salle
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/location/materiel" className="nav-link fs-6">
                  <FaCalendarCheck className="me-2" id={css.me} />
                  Location matériel
                </NavLink>
                  </li>
                 <div className={css.ligne2}></div>

              <li className="nav-item">
                <NavLink to="/client" className="nav-link fs-6">
                  <FaUser className="me-2" id={css.me} />
                  Client
                </NavLink>
                  </li>
                  <li className="nav-item">
                <NavLink to="/materiel" className="nav-link fs-6">
                  <FaToolbox className="me-2" id={css.me} />
                  Matériel
                </NavLink>
                  </li>
              <li className="nav-item">
                <NavLink to="/salle" className="nav-link fs-6">
                  <FaDoorOpen className="me-2" id={css.me} />
                  Salle
                </NavLink>
                  </li>
                  
              <li className="nav-item">
                <NavLink to="/categorie" className="nav-link fs-6">
                  <FaList className="me-2" id={css.me} />
                  Catégorie
                </NavLink>
              </li>
              
              
              
              
              
            </ul>
            {/* <form className="d-flex me-2">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Rechercher..."
                aria-label="Search"
              />
              <button className="btn btn-outline-light" type="submit">
                Rechercher
              </button>
            </form> */}
            <button className="btn btn-outline-danger  navv" onClick={handleLogout}>
              Déconnecter
            </button>
          </div>
        </div>
      </nav>

     
    </>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />  
  )
);
};

export default UserRoute;

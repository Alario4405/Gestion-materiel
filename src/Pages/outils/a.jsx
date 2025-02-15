import React, { useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"; // Import Navigate
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
      <>
        <div className={css.container} id="navbg">
          <div className={css.menu}>
            <>
              <nav className="navbar navbar-dark"> {/* Updated to match existing code */}
                <div className="container">
                  <Link to="/" className="navbar-brand fs-4">
                    SPRAY INFO
                  </Link>
                  <div className={css.ligne}></div>
                  {/* ... rest of navigation bar content */}
                  <button className="btn btn-outline-danger  navv" onClick={handleLogout}>
                    Déconnecter
                  </button>
                </div>
              </nav>
            </>
          </div>
          <Outlet /> {/* Display protected content */}
        </div>
      </>
    ) : (
      <Navigate to="/login" replace />  {/* Redirect to login on unauthorized access */}
    )
  );
};

export default UserRoute;
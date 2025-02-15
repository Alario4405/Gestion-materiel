import moment from 'moment/moment';
import css from './Layout.module.css';
import { BiSearch } from 'react-icons/bi';
import '../../index.css';

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import UserRoute from '../UserRoute';
import 'moment/locale/fr'; // Import French locale
moment.locale('fr');

const Layout = () => {
  const { pathname } = useLocation();

  const getTitle = () => {
    switch (pathname) {
      case '/formation':
        return 'Formation';
      case '/location/salle':
        return 'Location Salle';
      case '/location/materiel':
        return 'Location Materiel';
      case '/materiel':
        return 'Matériel';
      case '/salle':
        return 'Salle';
      case '/categorie':
        return 'Categorie';
      case '/client':
        return 'Client';
      case '/home':
        return 'Acceuil';
      case '/globale':
        return 'Globale';
      default:
        return 'Recherche'; // Use a default title for other routes
    }
  };

  return (
    <div className={css.container} id='navbg'>
      <UserRoute />

      {/* Marking the dashboard as the default route */}
      {pathname === "/" && <Navigate to="home" />}

      <div className={`${css.dashboard} dashboard`}>
        <div className={css.topBaseGradients}>
          <div className='gradient-blue'></div>
          <div className='gradient-orange'></div>
          <div className='gradient-red'></div>
        </div>

        <div className={css.header}>
          <span>{moment().format("dddd, Do MMMM YYYY")}</span>
          {/* <span>Date aujourdui</span> */}

          <div className={css.titre}>
            <p><span>{getTitle()}</span></p>  {/* Use getTitle() directly for the title */}
          </div>

          <div className={css.profile}>
            {/* <img src='./../../public/logo512.png' alt='person image'/> */}
            <div className={css.details}>
              <span>Admin</span>
              <span>admin@gmail.com</span>
            </div>
          </div>
        </div>

        <div className={css.content}>
          <Outlet />
         </div>
      </div>
    </div>
  );
};

export default Layout;
/* import logo from './logo.svg';
import './App.css'; */
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  
} from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import UserRoute from "./Components/UserRoute";
import Utilisateur from './Pages/Utilisateur';
import Salle from './Pages/Salle';
import Categorie from './Pages/Categorie';
import Formation from './Pages/Formation';
import Materiel from './Pages/Materiel';
import Globale from './Pages/Globale';
import LocationSalle from './Pages/Location_salle';
import LocationMateriel from './Pages/Location_materiel';
import Layout from "./Components/Layout/Layout";
import Inscrire from './Pages/inscrire';
import { AuthContext, AuthProvider } from './Components/AuthContext'; 
function App() {
  return (
    <>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/inscrire" element={<Inscrire />} />
          
          <Route path="/" element={<Layout />}>
      
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/client" element={<Utilisateur />} />
            <Route exact path="/salle" element={<Salle />} />
            <Route exact path="/categorie" element={<Categorie />} />
            <Route exact path="/formation" element={<Formation />} />
            <Route exact path="/materiel" element={<Materiel />} />
            <Route exact path="/location/materiel" element={<LocationMateriel />} />
            <Route exact path="/globale" element={<Globale />} />
            <Route exact path="/location/salle" element={<LocationSalle />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      </AuthProvider>
    </>
  );
}

export default App;

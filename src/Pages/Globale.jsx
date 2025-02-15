import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import axios from 'axios';
import { Table, Button, Modal, Form, FormControl, FormGroup, FormLabel  } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
// import { FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { ChromePicker } from 'react-color';
import css from './css/Location.module.css'
import './Formation.css'
import 'moment/locale/fr'; // Import French locale
moment.locale('fr');
const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Globale() {
  const [eventos, setEventos] = useState([]); // Initialize events state
  const [selectedFormation, setSelectedFormation] = useState(null); // Track selected formation

  const [salles, setSalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFormation, setCurrentFormation] = useState({ id_f: '', nom: '', date_debut: '', date_fin: '',id_s: '', couleur: '',});
  const [openColorPickerOnEventSelect, setOpenColorPickerOnEventSelect] = useState(true); // État initial : ouvrir le sélecteur par défaut

  const [selectedColor, setSelectedColor] = useState('');
  const [displayColorPicker, setDisplayColorPicker] = useState(false); 
  
    // États pour les filtres
    const [showFormations, setShowFormations] = useState(true);
    const [showLocations, setShowLocations] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
  
    // Fonction pour filtrer les événements
   const filteredEvents = () => {
    return eventos.filter((event) => {
      return (
        (showFormations && event.type === 'formation') ||
        (showLocations && event.type === 'location') ||
       (showFormations && showLocations && event.type === 'formation_location')
      );
    });
  };
  
    // ... (reste du code)
  
  const eventStyle = (event) => ({
    style: {
      backgroundColor: event.color, // Customize event background color
      // height: '30px', // Increased default height (optional)
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      
    }
  });
  const moverEventos = (data) => {
    const { start, end } = data;
    const updatedEvents = eventos.map((event) => {
      if (event.id === data.event.id) {
        return {
          ...event,
          start: new Date(start),
          end: new Date(end)
        };
      }
      return event;
    });
    setEventos(updatedEvents); // Update events state with new positions
  };

  // Handle event selection (click on an event)

  const handleEventClose = () => {
    setSelectedFormation(null); // Clear selected formation state
    setShowModal(false);
  };




  const fetchFormations = async () => {
    try {
      // Fetch formations and locations separately
      const formationsResponse = await axios.get('http://localhost:8085/formation');
      const locationsResponse = await axios.get('http://localhost:8085/location/salle');

      // Combine and format the data
      const formattedEvents = [...formationsResponse.data.map(formation => ({
        id: formation.id_f,
         title: `${formation.nom} (F)`,
        start: moment(formation.date_debut).toDate(),
        end: moment(formation.date_fin).toDate(),
        color: formation.couleur,
        // color:'#FA0408', 
        id_s: formation.id_s,
        type: 'formation',
      })), ...locationsResponse.data.map(location => ({
        id: location.id_l,
        title: `${location.nom_utilisateur || 'Utilisateur inconnu'} (L)`,
        start: moment(location.date_location).toDate(),
        end: moment(location.date_retour).toDate(),
        color: location.couleur,
        // color:'#397F06',
        id_s: location.id_s,
        type: 'location',
      }))];

      setEventos(formattedEvents);
    }  catch (error) {
      console.error('Error fetching formations:', error);
      // Gérer les erreurs de manière appropriée (e.g., message d'erreur)
    }
  };
  // Récupérer toutes les catégories pour le select
  const fetchSalles = async () => {
    try {
      const response = await axios.get('http://localhost:8085/salle');
      setSalles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

    useEffect(() => {
      fetchFormations();
      fetchSalles();
  }, []);

  // Ajouter ou modifier une formation


  // Fonctions pour ouvrir le modal
  // const handleShowAdd = () => { setShowModal(true); setEditMode(false); setCurrentFormation({ id_f: '', nom: '', date_debut: '', date_fin: '' , couleur: '#07799E' }); };

  // Supprimer une formation

const messages = {
  allDay: 'Toute la journée',
  previous: 'Précédent',
  next: 'Suivant',
  today: 'Aujourd\'hui',
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Ordre du jour',
  hours: 'Heures',
  minutes: 'Minutes',
  time: 'Heure', // Time
  event: 'Événement', // Event
  
};
  return (
    <div className={css.container}>
      <div className={`${css.dashboard} theme-container`}>
      <div className="toolbar">
          
      <FormGroup>
            <FormLabel>Afficher :</FormLabel>
            <Form.Check label="Afficher les formations" checked={showFormations} onChange={(e) => setShowFormations(e.target.checked)}/>
            <Form.Check label="Afficher les locations" checked={showLocations} onChange={(e) => setShowLocations(e.target.checked)}/>
          </FormGroup>
      </div>
      <div className="calandrio">
        <DragAndDropCalendar
          defaultDate={moment().toDate()}
            defaultView="month"
            views={['month', 'day', 'agenda']}
            // events={eventos}
            events={filteredEvents()} // Utiliser la fonction pour obtenir les événements filtrés
            
  messages={messages}
            
          localizer={localizer}
          resizable
          moverEventos={moverEventos} // Pass moverEventos function for drag-and-drop
          onEventResize={moverEventos} // Update events on resize
          eventPropGetter={eventStyle}
          
          className="calendar"
        />
      </div>
      
      
     
    </div>
    </div>
  );
}

export default Globale;
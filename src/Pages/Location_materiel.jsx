import React, { useState, useEffect } from 'react';
import moment from 'moment';


import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { ChromePicker } from 'react-color';
import css from './css/Location.module.css'

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function LocationMateriel() {
  const [eventos, setEventos] = useState([]); // Initialize events state
  const [selectedlocation, setSelectedlocation] = useState(null); // Track selected location

  const [salles, setSalles] = useState([]);
  const [materiels, setMateriels] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);

  const [locations, setlocations] = useState([]);
  const [filteredlocations, setFilteredlocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ id_l: '', id_u: '', date_location: '', date_retour: '',id_m: '', couleur: '',});
  const [openColorPickerOnEventSelect, setOpenColorPickerOnEventSelect] = useState(true); // État initial : ouvrir le sélecteur par défaut

  const [selectedColor, setSelectedColor] = useState('');
  const [displayColorPicker, setDisplayColorPicker] = useState(false); 
  
  
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
const handleEventSelect = (selectedEvent) => {
    setSelectedlocation(selectedEvent);

    // Met à jour currentLocation immédiatement avec les données de l'événement sélectionné
    setCurrentLocation({
        ...currentLocation,
        id_l: selectedEvent.id, // Assurez-vous que l'ID est correct
      id_u: selectedEvent.title,
        date_location: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm'), // Formatage pour datetime-local
      date_retour: moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm'),
        id_m: selectedEvent.id_m || 'NULL', // Set default to '0' if id_m is not provided
      // id: selectedEvent.id || 'NULL',  // Set default to '0' if id is not provided
      couleur: selectedEvent.color || '', // Set default empty string if color is not provided
      
    });
  setSelectedColor(selectedEvent.color || '');
    if (openColorPickerOnEventSelect) {
      setDisplayColorPicker(false);
    }
    console.log("Event data:", selectedEvent); 
    setShowModal(true);
    setEditMode(true);
};
  const handleEventClose = () => {
    setSelectedlocation(null); // Clear selected location state
    setShowModal(false);
  };

  const handleClick = () => {
  setDisplayColorPicker(!displayColorPicker);
};

const handleChangeComplete = (color) => {
    setSelectedColor(color.hex); // Update selected color state
    setCurrentLocation({ ...currentLocation, couleur: color.hex }); // Update currentLocation with color immediately
  };
  
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8085/location/materiel');
      const formattedEvents = response.data.map((location) => ({
        id: location.id_l,
        // title: location.id_u,
        title: location.nom_utilisateurr || 'Utilisateur inconnu',

        start: moment(location.date_location).toDate(),
        end: moment(location.date_retour).toDate(),
        color: location.couleur,
        id_m: location.id,
      }));
      setEventos(formattedEvents); // Mise à jour des événements avec les données formatées
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Gérer les erreurs de manière appropriée (e.g., message d'erreur)
    }
  };
  // Récupérer toutes les catégories pour le select
  const fetchUtilisateurs = async () => {
    try {
      const response = await axios.get('http://localhost:8085/utilisateur');
      setUtilisateurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  // const fetchSalles = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8085/salle');
  //     setSalles(response.data);
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des catégories:", error);
  //   }
  // };

  const fetchMateriels = async () => {
    try {
      const response = await axios.get('http://localhost:8085/materiel');
      setMateriels(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des matériels:", error);
    }
  };

  
    useEffect(() => {
      fetchLocations();
      // fetchSalles();
      fetchMateriels();
      fetchUtilisateurs();
  }, []);

  // Ajouter ou modifier une location
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id_u, date_location, date_retour, id_m, couleur } = currentLocation;
    
    if (new Date(date_retour) < new Date(date_location)) {
      Swal.fire('Erreur!', 'La date de fin doit être postérieure à la date de début.', 'error');
      return;
    }

    try {
    //   if (!couleur) {
    // Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
    // return;
  
      if (editMode) {
        await axios.put(`http://localhost:8085/location/materiel/modifier/${currentLocation.id_l}`, { id_u, date_location, date_retour, id_m, couleur });
        Swal.fire('Modifié!', 'location modifiée avec succès.', 'success');
      } else {
        await axios.post('http://localhost:8085/location/materiel/ajout', { id_u, date_location, date_retour, id_m, couleur });
        Swal.fire('Ajouté!', 'location ajoutée avec succès.', 'success');
      }

      setShowModal(false);
      setCurrentLocation({ id_l: '', id_u: '', date_location: '', date_retour: '' , id_m: '',});
      setEditMode(false);
      fetchLocations()

    } catch (error) {
      console.error(error);
  if (error.response && error.response.status === 409) {
    Swal.fire('Erreur!', error.response.data, 'error');
  } else {
    Swal.fire('Erreur!', 'Une erreur s\'est produite.', 'error');
  }
    }
  };

  // Fonctions pour ouvrir le modal
  const handleShowAdd = () => { setShowModal(true); setEditMode(false); setCurrentLocation({ id_l: '', id_u: '', date_location: '', date_retour: '', id_m: '' , couleur: '#07799E' }); };

  // Supprimer une location
  const handleDelete = async (id_l) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8085/location/materiel/supprimer/${id_l}`);
        Swal.fire('Supprimé!', 'location supprimée avec succès.', 'success');
        fetchLocations();
        setShowModal(false);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        Swal.fire('Erreur!', 'Erreur lors de la suppression.', 'error');
      }
    }
  };
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
          <button className="btn btn-outline-primary mb-2" onClick={handleShowAdd} >
        <FaPlus /> Ajouter une Location
      </button>
      </div>
      <div className="calandrio">
        <DragAndDropCalendar
          defaultDate={moment().toDate()}
            defaultView="month"
            views={['month', 'day', 'agenda']}
            
            events={eventos}
  messages={messages}
            
          localizer={localizer}
          resizable
          moverEventos={moverEventos} // Pass moverEventos function for drag-and-drop
          onEventResize={moverEventos} // Update events on resize
          onSelectEvent={handleEventSelect}
          eventPropGetter={eventStyle}
          
          className="calendar"
        />
      </div>
      
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Modifier la location' : 'Ajouter une location'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          {showModal && ( // Vérifie seulement si le modal est ouvert
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formClient">
              <Form.Label>Client</Form.Label>
              <Form.Control
                as="select"
                value={currentLocation.id_u}
                onChange={(e) => setCurrentLocation({ ...currentLocation, id_u: e.target.value })}
                required
              >
                <option value="">Sélectionnez un client</option>
                {utilisateurs.map((utilisateur) => (
                  <option key={utilisateur.id_u} value={utilisateur.nom}>
                    {utilisateur.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>


            <Form.Group controlId="formDateDebut" className="mt-2">
              <Form.Label>Date Début</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentLocation.date_location}
                onChange={(e) => setCurrentLocation({ ...currentLocation, date_location: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateRetour" className="mt-2">
              <Form.Label>Date Retour</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentLocation.date_retour}
                onChange={(e) => setCurrentLocation({ ...currentLocation, date_retour: e.target.value })}
                required
              />
              </Form.Group>

            {/* <Form.Group controlId="formSalle">
              <Form.Label>Salle</Form.Label>
              <Form.Control
                as="select"
                  value={currentLocation.id_m }
                onChange={(e) => setCurrentLocation({ ...currentLocation, id_m: e.target.value })}
                // required
              >
                <option value="">Sélectionner une salle</option>
                {salles.map((salle) => (
                  <option key={salle.id_m} value={salle.id_m}>
                    {salle.nom}
                  </option>
                ))}
              </Form.Control>
              </Form.Group> */}
            
            <Form.Group controlId="formMateriel">
              <Form.Label>Matériel</Form.Label>
              <Form.Control
                as="select"
                value={currentLocation.id_m}
                onChange={(e) => setCurrentLocation({ ...currentLocation, id_m: e.target.value })}
                // required
              >
                <option value="">Sélectionnez un matériel</option>
                {materiels.map((materiel) => (
                  <option key={materiel.id_m} value={materiel.id}>
                    {materiel.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formColor">
            <Form.Label>Couleur</Form.Label>
            <div style={{ backgroundColor: selectedColor, width: '50px', height: '30px', cursor: 'pointer' }} onClick={handleClick} />
            {displayColorPicker ? (
                  <div style={{ position: 'relative', left: '10px' }}>
                <ChromePicker color={selectedColor} onChangeComplete={handleChangeComplete} />
              </div>
            ) : null}
          
            </Form.Group>

            {/* <Button className="btn btn-success mt-3" type="submit">
              {editMode ? 'Modifier' : 'Ajouter'}
              </Button> */}
              {/* Conditional rendering of buttons based on editMode */}
        {editMode ? (
          <>
            <Button className="btn btn-primary mr-2" type="submit">
              Enregistrer
            </Button>
            <Button className="btn btn-danger" onClick={() => handleDelete(currentLocation.id_l)}>
              Supprimer
            </Button>
          </>
        ) : (
          <Button className="btn btn-success mt-3" type="submit">
            Ajouter
          </Button>
        )}
          </Form>
        )}
          
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
}

export default LocationMateriel;
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
import './Formation.css'
import 'moment/locale/fr'; // Import French locale
moment.locale('fr');
const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Formation() {
  const [eventos, setEventos] = useState([]); // Initialize events state
  const [selectedFormation, setSelectedFormation] = useState(null); // Track selected formation

  const [salles, setSalles] = useState([]);
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFormation, setCurrentFormation] = useState({ id_f: '', nom: '', date_debut: '', date_fin: '',id_s: '', couleur: '',});
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
    setSelectedFormation(selectedEvent);

    // Met à jour currentFormation immédiatement avec les données de l'événement sélectionné
    setCurrentFormation({
        ...currentFormation,
        id_f: selectedEvent.id, // Assurez-vous que l'ID est correct
        nom: selectedEvent.title,
        date_debut: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm'), // Formatage pour datetime-local
      date_fin: moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm'),
        id_s: selectedEvent.id_s || 'NULL',
      couleur: selectedEvent.color || '', // Set default empty string if color is not provided
      
    });
  setSelectedColor(selectedEvent.color || '');
    if (openColorPickerOnEventSelect) {
      setDisplayColorPicker(false);
    }
    console.log("couleur:", currentFormation.couleur)
    setShowModal(true);
    setEditMode(true);
};
  const handleEventClose = () => {
    setSelectedFormation(null); // Clear selected formation state
    setShowModal(false);
  };

  const handleClick = () => {
  setDisplayColorPicker(!displayColorPicker);
};

const handleChangeComplete = (color) => {
    setSelectedColor(color.hex); // Update selected color state
    setCurrentFormation({ ...currentFormation, couleur: color.hex }); // Update currentFormation with color immediately
  };

  const fetchFormations = async () => {
    try {
      const response = await axios.get('http://localhost:8085/formation');
      const formattedEvents = response.data.map((formation) => ({
        id: formation.id_f,
        title: formation.nom,
        start: moment(formation.date_debut).toDate(),
        end: moment(formation.date_fin).toDate(),
        color: formation.couleur,
        id_s: formation.id_s,

      }));
      setEventos(formattedEvents); // Mise à jour des événements avec les données formatées
    } catch (error) {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, date_debut, date_fin, id_s, couleur } = currentFormation;
    if (!id_s) {
        Swal.fire('Erreur!', 'Veuillez sélectionner une salle.', 'error');
        return;
    }

    if (new Date(date_fin) < new Date(date_debut)) {
      Swal.fire('Erreur!', 'La date de fin doit être postérieure à la date de début.', 'error');
      return;
    }

    try {
    //   if (!couleur) {
    // Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
    // return;
  
      if (editMode) {
        await axios.put(`http://localhost:8085/formation/modifier/${currentFormation.id_f}`, { nom, date_debut, date_fin, id_s, couleur });
        Swal.fire('Modifié!', 'Formation modifiée avec succès.', 'success');
      } else {
        await axios.post('http://localhost:8085/formation/ajout', { nom, date_debut, date_fin, id_s, couleur });
        Swal.fire('Ajouté!', 'Formation ajoutée avec succès.', 'success');
      }

      setShowModal(false);
      setCurrentFormation({ id_f: '', nom: '', date_debut: '', date_fin: '' , id_s: '',});
      setEditMode(false);
      fetchFormations()

    } catch (error) {
      console.error(error);
  if (error.response && error.response.status === 408) {
    Swal.fire('Erreur!', error.response.data, 'error');
  } else {
    Swal.fire('Erreur!', 'Une erreur s\'est produite.', 'error');
  }
    }
  };

  // Fonctions pour ouvrir le modal
  const handleShowAdd = () => { setShowModal(true); setEditMode(false); setCurrentFormation({ id_f: '', nom: '', date_debut: '', date_fin: '' , couleur: '#07799E' }); };

  // Supprimer une formation
  const handleDelete = async (id_f) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelbutton: true,
      confirmbuttonColor: '#3085d6',
      cancelbuttonColor: '#d33',
      confirmbuttonText: 'Oui, supprimer!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8085/formation/supprimer/${id_f}`);
        Swal.fire('Supprimé!', 'Formation supprimée avec succès.', 'success');
        fetchFormations();
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
        <FaPlus /> Ajouter une Formation
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
        <Modal.Header closebutton>
          <Modal.Title>{editMode ? 'Modifier la Formation' : 'Ajouter une Formation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          {showModal && ( // Vérifie seulement si le modal est ouvert
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={currentFormation.nom}
                onChange={(e) => setCurrentFormation({ ...currentFormation, nom: e.target.value })}
                  required
                  // readOnly={!editMode}
                  
              />
            </Form.Group>
            <Form.Group controlId="formDateDebut" className="mt-2">
              <Form.Label>Date Début</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentFormation.date_debut}
                onChange={(e) => setCurrentFormation({ ...currentFormation, date_debut: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateFin" className="mt-2">
              <Form.Label>Date Fin</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentFormation.date_fin}
                onChange={(e) => setCurrentFormation({ ...currentFormation, date_fin: e.target.value })}
                required
              />
              </Form.Group>

            <Form.Group controlId="formSalle">
              <Form.Label>Salle</Form.Label>
              <Form.Control
                as="select"
                value={currentFormation.id_s}
                onChange={(e) => setCurrentFormation({ ...currentFormation, id_s: e.target.value })}
                required
              >
                <option value="">Sélectionner une salle</option>
                {salles.map((salle) => (
                  <option key={salle.id_s} value={salle.id_s}>
                    {salle.nom}
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

            
              {/* Conditional rendering of buttons based on editMode */}
        {editMode ? (
          <>
            <Button className="btn btn-primary mr-2" type="submit">
              Enregistrer
            </Button>
            <Button className="btn btn-danger" onClick={() => handleDelete(currentFormation.id_f)}>
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

export default Formation;
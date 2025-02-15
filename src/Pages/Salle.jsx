import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
// import css from "./css/u";
import css from "./css/Style.module.css";

const Salle = () => {
  const [salles, setSalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSalle, setCurrentSalle] = useState({ id_s: '', nom: '', occupation: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer toutes les salles
  const fetchSalles = async () => {
    try {
      const response = await axios.get('http://localhost:8085/salle');
      setSalles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des salles:", error);
      Swal.fire('Erreur!', 'Échec de la récupération des salles.', 'error');
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  // Ajouter ou modifier une salle
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, occupation } = currentSalle;

    try {
      if (editMode) {
        await axios.put(`http://localhost:8085/salle/modifier/${currentSalle.id_s}`, { nom, occupation });
        Swal.fire('Modifié!', 'Salle modifiée avec succès.', 'success');
      } else {
        await axios.post('http://localhost:8085/salle/ajout', { nom, occupation });
        Swal.fire('Ajouté!', 'Salle ajoutée avec succès.', 'success');
      }

      setShowModal(false);
      setCurrentSalle({ id_s: '', nom: '', occupation: '' });
      setEditMode(false);
      fetchSalles();
    } catch (error) {
      console.error(editMode ? "Erreur lors de la modification:" : "Erreur lors de l'ajout:", error);
      Swal.fire('Erreur!', editMode ? 'Erreur lors de la modification.' : 'Erreur lors de l\'ajout.', 'error');
    }
  };

  // Ouvrir le modal pour ajouter une salle
  const handleShowAdd = () => {
    setShowModal(true);
    setEditMode(false);
    setCurrentSalle({ id_s: '', nom: '', occupation: '' });
  };

  // Ouvrir le modal pour modifier une salle
  const handleShowEdit = (salle) => {
    setShowModal(true);
    setEditMode(true);
    setCurrentSalle(salle);
  };

  // Supprimer une salle
  const handleDelete = async (id_s) => {
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
        await axios.delete(`http://localhost:8085/salle/supprimer/${id_s}`);
        Swal.fire('Supprimé!', 'Salle supprimée avec succès.', 'success');
        fetchSalles();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        Swal.fire('Erreur!', 'Erreur lors de la suppression.', 'error');
      }
    }
  };

  // Filtrer les salles en fonction de la recherche
  const filteredSalles = salles.filter((salle) =>
    salle.id_s.toString().includes(searchTerm) ||
    salle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salle.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={css.container}>
      <div className={`${css.dashboard} theme-container`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-primary" onClick={handleShowAdd}>
          <FaPlus /> Ajouter une Salle
          </button>
          <div className="input-group w-50">
        <Form.Control
          type="text"
          placeholder="Rechercher par ID, Nom ou Occupation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
            className="form-control text-muted"
          />
          <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div className="scroll">
      <Table hover className="mt-3">
          <thead className="table-secondary">

          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Occupation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalles.map((salle) => (
            <tr key={salle.id_s}>
              <td>{salle.id_s}</td>
              <td>{salle.nom}</td>
              <td>{salle.occupation}</td>
              <td>
                <button className="btn btn-outline-primary me-2" onClick={() => handleShowEdit(salle)} title="Modifier">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn btn-outline-danger me-2r" onClick={() => handleDelete(salle.id_s)} title="Supprimer">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
</div>
      {/* Modal pour Ajouter/Modifier une Salle */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closebutton>
          <Modal.Title>{editMode ? 'Modifier la Salle' : 'Ajouter une Salle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNom" className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={currentSalle.nom}
                onChange={(e) => setCurrentSalle({ ...currentSalle, nom: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formOccupation" className="mb-3">
              <Form.Label>Occupation</Form.Label>
              <Form.Control
                type="text"
                value={currentSalle.occupation}
                onChange={(e) => setCurrentSalle({ ...currentSalle, occupation: e.target.value })}
                required
              />
            </Form.Group>
            <button className="btn btn-success" type="submit">
              {editMode ? 'Modifier' : 'Ajouter'}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
};

export default Salle;

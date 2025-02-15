import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

const Formation = () => {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFormation, setCurrentFormation] = useState({
    id_f: "",
    nom: "",
    date_debut: "",
    date_fin: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer toutes les formations
  const fetchFormations = async () => {
    try {
      const response = await axios.get("http://localhost:8085/formation");
      setFormations(response.data);
      setFilteredFormations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des formations:", error);
      Swal.fire(
        "Erreur!",
        "Erreur lors de la récupération des formations.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Filtrer les formations selon le terme de recherche
  useEffect(() => {
    const filtered = formations.filter((formation) => {
      const term = searchTerm.toLowerCase();
      return (
        formation.id_f.toString().includes(term) ||
        formation.nom.toLowerCase().includes(term) ||
        formation.date_debut.includes(term) ||
        formation.date_fin.includes(term)
      );
    });
    setFilteredFormations(filtered);
  }, [searchTerm, formations]);

  // Ajouter ou modifier une formation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, date_debut, date_fin } = currentFormation;

    if (new Date(date_fin) < new Date(date_debut)) {
      Swal.fire(
        "Erreur!",
        "La date de fin doit être postérieure à la date de début.",
        "error"
      );
      return;
    }

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:8085/formation/modifier/${currentFormation.id_f}`,
          { nom, date_debut, date_fin }
        );
        Swal.fire("Modifié!", "Formation modifiée avec succès.", "success");
      } else {
        await axios.post("http://localhost:8085/formation/ajout", {
          nom,
          date_debut,
          date_fin,
        });
        Swal.fire("Ajouté!", "Formation ajoutée avec succès.", "success");
      }

      setShowModal(false);
      setCurrentFormation({ id_f: "", nom: "", date_debut: "", date_fin: "" });
      setEditMode(false);
      fetchFormations();
    } catch (error) {
      console.error(
        editMode
          ? "Erreur lors de la modification:"
          : "Erreur lors de l'ajout:",
        error
      );
      Swal.fire(
        "Erreur!",
        editMode
          ? "Erreur lors de la modification."
          : "Erreur lors de l'ajout.",
        "error"
      );
    }
  };

  // Fonctions pour ouvrir le modal
  const handleShowAdd = () => {
    setShowModal(true);
    setEditMode(false);
    setCurrentFormation({ id_f: "", nom: "", date_debut: "", date_fin: "" });
  };
  const handleShowEdit = (formation) => {
    setShowModal(true);
    setEditMode(true);
    setCurrentFormation(formation);
  };

  // Supprimer une formation
  const handleDelete = async (id_f) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8085/formation/supprimer/${id_f}`);
        Swal.fire("Supprimé!", "Formation supprimée avec succès.", "success");
        fetchFormations();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        Swal.fire("Erreur!", "Erreur lors de la suppression.", "error");
      }
    }
  };

  return (
    <div className="container mt-4">
      <input type="color" />
      <div className="mb-3">
        <h4>Recherche</h4>
        <Form.Control
          type="text"
          placeholder="Rechercher par ID, Nom, Date Début ou Date Fin"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button className="btn btn-success mb-2" onClick={handleShowAdd}>
        <FaPlus /> Ajouter une Formation
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFormations.map((formation) => (
            <tr key={formation.id_f}>
              <td>{formation.id_f}</td>
              <td>{formation.nom}</td>
              <td>{formation.date_debut}</td>
              <td>{formation.date_fin}</td>
              <td>
                <Button
                  className="btn btn-primary me-2"
                  onClick={() => handleShowEdit(formation)}
                  title="Modifier"
                >
                  <i className="bi bi-pencil-square"></i>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(formation.id_f)}
                  title="Supprimer"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour Ajouter/Modifier une Formation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Modifier la Formation" : "Ajouter une Formation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={currentFormation.nom}
                onChange={(e) =>
                  setCurrentFormation({
                    ...currentFormation,
                    nom: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateDebut" className="mt-2">
              <Form.Label>Date Début</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentFormation.date_debut}
                onChange={(e) =>
                  setCurrentFormation({
                    ...currentFormation,
                    date_debut: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateFin" className="mt-2">
              <Form.Label>Date Fin</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentFormation.date_fin}
                onChange={(e) =>
                  setCurrentFormation({
                    ...currentFormation,
                    date_fin: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Button className="btn btn-success mt-3" type="submit">
              {editMode ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Formation;

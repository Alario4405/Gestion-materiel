import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import css from "./css/Style.module.css";

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); // Pour stocker les catégories filtrées
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [currentCategorie, setCurrentCategorie] = useState({
    id_c: "",
    nom: "",
  });

  // Récupérer toutes les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8085/categorie");
      setCategories(response.data);
      setFilteredCategories(response.data); // Initialiser les catégories filtrées
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtrer les catégories selon le terme de recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = categories.filter(
      (categorie) =>
        categorie.id_c.toString().includes(e.target.value) ||
        categorie.nom.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  // Ajouter ou modifier une catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom } = currentCategorie;

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:8085/categorie/modifier/${currentCategorie.id_c}`,
          { nom }
        );
        Swal.fire("Modifié!", "Catégorie modifiée avec succès.", "success");
      } else {
        await axios.post("http://localhost:8085/categorie/ajout", { nom });
        Swal.fire("Ajouté!", "Catégorie ajoutée avec succès.", "success");
      }

      setShowModal(false);
      setCurrentCategorie({ id_c: "", nom: "" });
      setEditMode(false);
      fetchCategories(); // Rafraîchir la liste des catégories
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

  // Ouvrir le modal pour ajouter une catégorie
  const handleShowAdd = () => {
    setShowModal(true);
    setEditMode(false);
    setCurrentCategorie({ id_c: "", nom: "" });
  };

  // Ouvrir le modal pour modifier une catégorie
  const handleShowEdit = (categorie) => {
    setShowModal(true);
    setEditMode(true);
    setCurrentCategorie(categorie);
  };

  // Supprimer une catégorie
  const handleDelete = async (id_c) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelbutton: true,
      confirmbuttonColor: "#3085d6",
      cancelbuttonColor: "#d33",
      confirmbuttonText: "Oui, supprimer!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8085/categorie/supprimer/${id_c}`);
        Swal.fire("Supprimé!", "Catégorie supprimée avec succès.", "success");
        fetchCategories(); // Rafraîchir la liste des catégories
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        Swal.fire("Erreur!", "Erreur lors de la suppression.", "error");
      }
    }
  };

  return (
    <div className={css.container}>
      <div className={`${css.dashboard} theme-container`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-outline-primary mb-2"
            onClick={handleShowAdd}
          >
            <FaPlus /> Ajouter une Catégorie
          </button>

          {/* Champ de recherche */}
          <div className="input-group w-50">
            <Form.Control
              type="text"
              placeholder="Rechercher "
              value={searchTerm}
              onChange={handleSearch}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((categorie) => (
                <tr key={categorie.id_c}>
                  <td>{categorie.id_c}</td>
                  <td>{categorie.nom}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => handleShowEdit(categorie)}
                      title="Modifier"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger me-2"
                      onClick={() => handleDelete(categorie.id_c)}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal pour Ajouter/Modifier une Catégorie */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closebutton>
            <Modal.Title>
              {editMode ? "Modifier la Catégorie" : "Ajouter une Catégorie"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNom">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  value={currentCategorie.nom}
                  onChange={(e) =>
                    setCurrentCategorie({
                      ...currentCategorie,
                      nom: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <button className="btn btn-success" type="submit">
                {editMode ? "Modifier" : "Ajouter"}
              </button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Categorie;

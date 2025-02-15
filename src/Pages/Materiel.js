import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import css from "./css/Style.module.css";

const Materiel = () => {
  const [materiels, setMateriels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salles, setSalles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMateriel, setCurrentMateriel] = useState({
    id: "",
    nom: "",
    reference: "",
    etat: "",
    prix: "",
    quantite: "",
    id_c: "",
    id_s: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche

  // Récupérer tous les matériels
  const fetchMateriels = async () => {
    try {
      const response = await axios.get("http://localhost:8085/materiel");
      setMateriels(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des matériels:", error);
    }
  };

  // Récupérer toutes les catégories pour le select
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8085/categorie");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  // Récupérer toutes les catégories pour le select
  const fetchSalles = async () => {
    try {
      const response = await axios.get("http://localhost:8085/salle");
      setSalles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des salle:", error);
    }
  };

  useEffect(() => {
    fetchMateriels();
    fetchCategories();
    fetchSalles();
  }, []);

  // Ajouter ou modifier un matériel
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nom, reference, etat, prix, quantite, id_c, id_s } =
      currentMateriel;

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:8085/materiel/modifier/${currentMateriel.id}`,
          { nom, reference, etat, prix, quantite, id_c, id_s }
        );
        Swal.fire("Modifié!", "Matériel modifié avec succès.", "success");
      } else {
        await axios.post("http://localhost:8085/materiel/ajout", {
          nom,
          reference,
          etat,
          prix,
          quantite,
          id_c,
          id_s,
        });
        Swal.fire("Ajouté!", "Matériel ajouté avec succès.", "success");
      }

      setShowModal(false);
      setCurrentMateriel({
        id: "",
        nom: "",
        reference: "",
        etat: "",
        prix: "",
        quantite: "",
        id_c: "",
        id_s: "",
      });
      setEditMode(false);
      fetchMateriels(); // Rafraîchir la liste des matériels
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

  // Ouvrir le modal pour ajouter un matériel
  const handleShowAdd = () => {
    setShowModal(true);
    setEditMode(false);
    setCurrentMateriel({
      id: "",
      nom: "",
      reference: "",
      etat: "",
      prix: "",
      quantite: "",
      id_c: "",
      id_s: "",
    });
  };

  // Ouvrir le modal pour modifier un matériel
  const handleShowEdit = (materiel) => {
    setShowModal(true);
    setEditMode(true);
    setCurrentMateriel(materiel);
  };

  // Supprimer un matériel
  const handleDelete = async (id) => {
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
        await axios.delete(`http://localhost:8085/materiel/supprimer/${id}`);
        Swal.fire("Supprimé!", "Matériel supprimé avec succès.", "success");
        fetchMateriels(); // Rafraîchir la liste des matériels
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        Swal.fire("Erreur!", "Erreur lors de la suppression.", "error");
      }
    }
  };

  // Filtrer les matériels en fonction du terme de recherche
  const filteredMateriels = materiels.filter((materiel) => {
    const category =
      categories.find((c) => c.id_c === materiel.id_c)?.nom || "Inconnu";
    const Sal = salles.find((c) => c.id_s === materiel.id_s)?.nom || "Inconnu";
    return (
      materiel.id.toString().includes(searchTerm) ||
      materiel.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.etat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.prix.toString().includes(searchTerm) ||
      materiel.quantite.toString().includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Sal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={css.container}>
      <div className={`${css.dashboard} theme-container`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-primary" onClick={handleShowAdd}>
            <FaPlus /> Ajouter un Matériel
          </button>
          <div className="input-group w-50">
            <Form.Control
              type="text"
              placeholder="Rechercher par ID, nom, référence, état, prix, quantité ou catégorie"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th>Référence</th>
                <th>État</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Catégorie</th>
                <th>Salles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMateriels.map((materiel) => (
                <tr key={materiel.id}>
                  <td>{materiel.id}</td>
                  <td>{materiel.nom}</td>
                  <td>{materiel.reference}</td>
                  <td>{materiel.etat}</td>
                  <td>{materiel.prix}</td>
                  <td>{materiel.quantite}</td>
                  <td>
                    {categories.find((c) => c.id_c === materiel.id_c)?.nom ||
                      "Inconnu"}
                  </td>
                  <td>
                    {salles.find((c) => c.id_s === materiel.id_s)?.nom ||
                      "Inconnu"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => handleShowEdit(materiel)}
                      title="Modifier"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger me-2"
                      onClick={() => handleDelete(materiel.id)}
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

        {/* Modal pour Ajouter/Modifier un Matériel */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closebutton>
            <Modal.Title>
              {editMode ? "Modifier le Matériel" : "Ajouter un Matériel"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNom">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  value={currentMateriel.nom}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      nom: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="formReference">
                <Form.Label>Référence</Form.Label>
                <Form.Control
                  type="text"
                  value={currentMateriel.reference}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      reference: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEtat">
                <Form.Label>État</Form.Label>
                <Form.Control
                  as="select"
                  value={currentMateriel.etat}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      etat: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Sélectionner l'état</option>
                  <option value="Neuf">Neuf</option>
                  <option value="En cours d'utilisation">
                    En cours d'utilisation
                  </option>
                  <option value="En panne">En panne</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formPrix">
                <Form.Label>Prix</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={currentMateriel.prix}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      prix: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="formQuantite">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  type="number"
                  value={currentMateriel.quantite}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      quantite: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="formCategorie">
                <Form.Label>Catégorie</Form.Label>
                <Form.Control
                  as="select"
                  value={currentMateriel.id_c}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      id_c: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id_c} value={categorie.id_c}>
                      {categorie.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formSalle">
                <Form.Label>Salle</Form.Label>
                <Form.Control
                  as="select"
                  value={currentMateriel.id_s}
                  onChange={(e) =>
                    setCurrentMateriel({
                      ...currentMateriel,
                      id_s: e.target.value,
                    })
                  }
                  // required
                >
                  <option value="">Sélectionner une Salle</option>
                  {salles.map((salle) => (
                    <option key={salle.id_s} value={salle.id_s}>
                      {salle.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <button variant="primary" type="submit" className="mt-3">
                {editMode ? "Enregistrer les modifications" : "Ajouter"}
              </button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Materiel;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import css from "./css/Style.module.css";

function Utilisateur() {
  const [user, setUser] = useState([]);
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [idSelected, setIdSelected] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8085/utilisateur");
      setUser(res.data);
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la récupération des utilisateurs', 'error');
    }
    setLoading(false);
  };

  const openModal = (user = null) => {
    if (user) {
      setIdSelected(user.id_u);
      setNom(user.nom);
      setTelephone(user.telephone);
      setEmail(user.email);
    } else {
      setIdSelected('');
      setNom('');
      setTelephone('');
      setEmail('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!nom || !telephone || !email) {
      Swal.fire({title:'Erreur', 
                text: 'Tous les champs sont obligatoires!', 
                icon: 'error',
                // style: 'width: 100px; height: 100px;'
                width: '200px',
                height: '10px'});
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      Swal.fire('Erreur', "L'email doit être un email @gmail.com!", 'error');
      return;
    }

    const action = idSelected ? "modifier" : "ajout";
    const confirmationMessage = idSelected
      ? "Vous êtes sur le point de modifier cet utilisateur!"
      : "Vous êtes sur le point d'ajouter un utilisateur!";

    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: confirmationMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, continuer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = { nom, telephone, email };
          if (idSelected) {
            await axios.put(`http://localhost:8085/utilisateur/modifier/${idSelected}`, data);
            Swal.fire('Modifié!', "L'utilisateur a été modifié.", 'success');
          } else {
            await axios.post("http://localhost:8085/utilisateur/ajout", data);
            Swal.fire('Ajouté!', "L'utilisateur a été ajouté.", 'success');
          }
          fetchAPI();
          closeModal();
        } catch (error) {
          Swal.fire('Erreur', `Erreur lors de ${action} de l'utilisateur`, 'error');
        }
      }
    });
  };

  const handleDelete = async (id_u) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8085/utilisateur/supprimer/${id_u}`);
          fetchAPI();
          Swal.fire('Supprimé!', "L'utilisateur a été supprimé.", 'success');
        } catch (error) {
          Swal.fire('Erreur', "Erreur lors de la suppression de l'utilisateur", 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const usersFilter = user.filter((user) => {
    if (search === "") return true;
    return (
      user.id_u.toString().toLowerCase().includes(search.toLowerCase()) ||
      user.nom.toLowerCase().includes(search.toLowerCase()) ||
      user.telephone.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className={css.container}>
      <div className={`${css.dashboard} theme-container`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-primary" onClick={() => openModal()}>
            <i className="bi bi-plus-lg"></i> Ajouter
          </button>
          <div className="input-group w-50">
            <input
              type="search"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control text-muted"
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <div className="scroll">
          <table className="table table-hover">
            <thead className="table-secondary" >
              <tr>
                <th>ID</th>
                <th>Nom Complet</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
              <tbody>
                
              {usersFilter.map((user, index) => (
                
                <tr key={index} style={{ backgroundColor: 'lightblue' }} onClick={() => openModal(user)} >
                  <td>{user.id_u}</td>
                  <td>{user.nom}</td>
                  <td>{user.telephone}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => openModal(user)}
                      title="Modifier"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(user.id_u)}
                      title="Supprimer"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>

              ))}
            </tbody>
          </table></div>
        )}

        {isModalOpen && (
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {idSelected ? "Modifier Client" : "Ajouter Client"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nom" className="form-label">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telephone" className="form-label">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      id="telephone"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Annuler
                  </button>
                  <button className="btn btn-success" onClick={handleSubmit}>
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Utilisateur;

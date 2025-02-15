import React, { useState } from 'react'
import { Button, Modal, Form, Row, Col, Collapse } from 'react-bootstrap'

function Adicionar(onAdicionar) {
  const [novoEvento, setNovoEveno] = useState({
    title: '',
    start: '',
    end: '',
    desc: '',
    color: '',
    tipo: '',

  });
  const [expand, setExpand] = useState(false);

  const handleChange = (e) => {
    const { nome, value } = e.target;
    setNovoEveno({ ...novoEvento, [nome]: value });
  }

  const handleToggleExpanded = (e) => {
    e.stopPropagation();
    setExpand(!expand)
  }

  const handleSubmit = (e) => {
    e.preventDafault();
  }
  return (
    <div className="adidcionar p-3 rounded border border-white">
      <h3>Adicconapda</h3>
      
        <Modal.Header closeButton>
          <Modal.Title>'Modifier la FormationAjouter une Formation'</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
        
                
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateDebut" className="mt-2">
              <Form.Label>Date Début</Form.Label>
              <Form.Control
                type="date"
          
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateFin" className="mt-2">
              <Form.Label>Date Fin</Form.Label>
              <Form.Control
                type="date"
                required
              />
            </Form.Group>
            <Button className='btn btn-success mt-3' type="submit">
            </Button>
          </Form>
        </Modal.Body>
      
    </div>
  )
}

export default Adicionar

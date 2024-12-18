import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function DeleteCategoryModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete category named "{props.name}"? This
          action is irreversible and will delete all threads belonging to the
          category.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteCategoryModal;

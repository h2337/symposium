import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteCategory } from "../../api/category";

function DeleteCategoryModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleDelete() {
    deleteCategory(props.token, props.id)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("Category deleted.");
          props.postDeleteCallback();
        } else {
          toast.error("Failed to delete the category, try again.");
        }
      })
      .catch((e) => toast.error("Failed to delete the category, try again."));
  }

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
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function mapStateToProps(state) {
  return {
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(DeleteCategoryModal);

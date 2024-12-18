import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { SketchPicker } from "react-color";
import { createCategory } from "../../api/category";

function CreateNewCategoryModal(props) {
  const [name, setName] = useState("");
  const [createNewCategoryModalShow, setCreateNewCategoryModalShow] = useState(
    false
  );

  const handleCreateNewCategoryModalClose = () =>
    setCreateNewCategoryModalShow(false);
  const handleCreateNewCategoryModalShow = () =>
    setCreateNewCategoryModalShow(true);

  let selectedColor;
  function handleColorChangeComplete(color) {
    selectedColor = color.hex.substring(1);
  }

  function handleChange(event) {
    if (event.target.name === "name") {
      setName(event.target.value);
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) {
      handleCreateNewCategorySubmit();
    }
  }

  function handleCreateNewCategorySubmit() {
    createCategory(props.token, name, selectedColor)
      .then((r) => {
        if (r.status === 200) {
          props.postCreateCallback();
          handleCreateNewCategoryModalClose();
          toast.success("New category created!");
        } else {
          toast.error("Failed to create a new category, try again.");
        }
      })
      .catch((e) => toast.error("Failed to create a new category, try again."));
  }

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleCreateNewCategoryModalShow}
      >
        Create new category
      </Button>
      <Modal
        show={createNewCategoryModalShow}
        onHide={handleCreateNewCategoryModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group controlId="color">
              <Form.Label>Color</Form.Label>
              <div style={{ margin: "auto", display: "table" }}>
                <SketchPicker
                  color="#000000"
                  onChangeComplete={handleColorChangeComplete}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCreateNewCategoryModalClose}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateNewCategorySubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function mapStateToProps(state) {
  return {
    token: state.user.token, // TODO: Pass this from parent component
  };
}

export default connect(mapStateToProps)(CreateNewCategoryModal);

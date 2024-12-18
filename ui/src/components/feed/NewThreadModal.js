import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createThread } from "../../api/thread";

function NewThreadModal(props) {
  const [show, setShow] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (props.categories === undefined || props.categories.length === 0) {
      toast.error("No categories exist, threads cannot be created.");
    } else {
      setEditorValue("");
      setShow(true);
    }
  };

  function handleChange(event) {
    if (event.target.name === "title") setTitle(event.target.value);
    else if (event.target.name === "category") setCategory(event.target.value);
  }

  function handleSubmit() {
    let categoryId;
    let categoryObject = props.categories.find((c) => c.name === category);
    if (categoryObject === undefined) categoryId = props.categories[0].id;
    else categoryId = categoryObject.id;
    createThread(props.token, title, editorValue, categoryId)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("New thread created!");
        } else {
          toast.error("Failed to create a new thread, try again.");
        }
      })
      .catch((e) => toast.error("Failed to create a new thread, try again."));
  }

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        style={{ width: "100%", whiteSpace: "nowrap" }}
      >
        <i className="fa fa-plus"></i> New Thread
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    onChange={handleChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    name="category"
                    onChange={handleChange}
                    value={category}
                  >
                    {props.categories.map((category, i) => (
                      <option key={i}>{category.name}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Form.Row>
            </Form.Group>
          </Form>
          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
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

export default connect(mapStateToProps)(NewThreadModal);

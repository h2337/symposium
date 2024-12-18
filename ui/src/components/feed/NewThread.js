import React, { useState } from "react";
import { Button, Modal, Form, Dropdown } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function NewThread(props) {
  const [show, setShow] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [title, setTitle] = useState("");

  function handleChange(event) {
    setTitle(event.target.value);
  }

  function handleSubmit() {
    console.log(props.categories);
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        New Thread
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Dropdown>
                <Dropdown.Toggle variant="primary">Category</Dropdown.Toggle>

                <Dropdown.Menu>
                  {props.categories.map((category, i) => (
                    <Dropdown.Item key={i}>
                      <i
                        className="fa fa-circle fa-xs"
                        style={{ color: "#" + category.color, fontSize: 10 }}
                      ></i>{" "}
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
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

export default NewThread;

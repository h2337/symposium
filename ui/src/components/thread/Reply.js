import React, { useState } from "react";
import { Button, Modal, Form, Dropdown, Col } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createThread } from "../../api/thread";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { createPost } from "../../api/post";

function Reply(props) {
  const [show, setShow] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  function handleSubmit() {
    createPost(props.token, parseInt(props.threadID), editorValue)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("Replied!");
          props.postReplyCallback();
        } else {
          toast.error("Failed to create a new reply, try again.");
        }
      })
      .catch((e) => toast.error("Failed to create a new reply, try again."));
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Reply
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            Reply
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

export default connect(mapStateToProps)(Reply);
import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPost } from "../../api/post";

function ReplyModal(props) {
  const [show, setShow] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        style={{ width: "100%", whiteSpace: "nowrap" }}
      >
        <i className="fa fa-reply"></i> Reply
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

export default connect(mapStateToProps)(ReplyModal);

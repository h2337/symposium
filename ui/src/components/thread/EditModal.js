import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createUseStyles } from "react-jss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { editPost } from "../../api/post";

function EditModal(props) {
  const [show, setShow] = useState(false);
  const [editorValue, setEditorValue] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setEditorValue(props.post.content);
  }, [props.post]);

  function handleSubmit() {
    editPost(props.token, props.post.id, editorValue)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("Post edited!");
          window.location.reload(false);
        } else {
          toast.error("Failed to edit the post, try again.");
        }
      })
      .catch((e) => toast.error("Failed to edit the post, try again."));
  }

  const classes = createUseStyles({
    postEditButton: {
      padding: "2px",
      transition: "0.3s",
      "&:hover": {
        backgroundColor: "#dcdcdc",
      },
    },
  })();

  const postEditButtonClasses = `fa fa-pencil ${classes.postEditButton}`;

  return (
    <>
      <i
        className={postEditButtonClasses}
        style={{ float: "right" }}
        onClick={handleShow}
      ></i>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
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
            Edit
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

export default connect(mapStateToProps)(EditModal);

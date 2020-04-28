import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createToken } from "../../../api/token";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { LOGIN } from "../../../redux/actionTypes";

function SignInModal(props) {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleLogin() {
    createToken(username, password)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("Successfully logged in!");
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            props.onLogin(
              username,
              responseBodyObject.email,
              responseBodyObject.access,
              responseBodyObject.token
            );
          });
        } else {
          toast.error("Login failed, try again.");
        }
      })
      .catch((e) => toast.error("Login failed, try again."));
  }

  function handleChange(event) {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) {
      handleLogin();
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Sign in
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Email address or username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email or username"
                name="username"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Sign in
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onLogin: (username, email, access, token) =>
    dispatch({ type: LOGIN, username, email, access, token }),
});

export default connect(null, mapDispatchToProps)(SignInModal);
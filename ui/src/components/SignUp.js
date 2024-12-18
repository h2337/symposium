import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createAccount } from "../api/account";

function SignUp() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSignUp() {
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      passwordRepeat === ""
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (password !== passwordRepeat) {
      toast.error("Passwords are not the same, try again.");
      return;
    }
    if (password.length < 6) {
      toast.error("Minimum password length is 6, try again.");
      return;
    }
    createAccount(username, email, password)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("Successfully registered!");
        } else {
          toast.error("Registration failed, try again.");
        }
      })
      .catch((e) => toast.error("Registration failed, try again."));
  }

  function handleChange(event) {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "email") {
      setEmail(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    } else if (event.target.name === "passwordRepeat") {
      setPasswordRepeat(event.target.value);
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) {
      handleSignUp();
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Sign up
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
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
            <Form.Group controlId="passwordRepeat">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password again"
                name="passwordRepeat"
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
          <Button variant="primary" onClick={handleSignUp}>
            Sign up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignUp;

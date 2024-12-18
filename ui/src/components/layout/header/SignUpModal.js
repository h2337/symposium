import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  CLOSE_TOUR,
  TOUR_CHANGE_STEP,
  OPEN_TOUR,
} from "../../../redux/actionTypes";
import { createUser } from "../../../api/user";

function SignUpModal(props) {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const { handleSubmit, register, errors } = useForm();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    props.onCloseTour();
    setShow(true);
  };

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
    createUser(username, email, password)
      .then((r) => {
        if (r.status === 200) {
          handleClose();
          toast.success("Successfully registered!");
        } else {
          toast.error("Registration failed, try again."); // TODO: Show detailed error
        }
      })
      .catch((e) => toast.error("Registration failed, try again."));
    props.onTourChangeStep(1);
    props.onOpenTour();
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

  /* TODO: Fix this
  function handleKeyDown(event) {
    if (event.which === 13) {
      handleSubmit(handleSignUp);
    }
  }
  */

  return (
    <>
      <Button variant="primary" onClick={handleShow} id="sign-up-button">
        <i className="fa fa-user-plus"></i> Sign up
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
                //onKeyDown={handleKeyDown}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleChange}
                //onKeyDown={handleKeyDown}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <span style={{ color: "red" }}>
                {errors.email && errors.email.message}
              </span>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                ref={register({
                  validate: (value) =>
                    value.length > 5 ||
                    "Password should be at least 6 characters long",
                })}
                //onKeyDown={handleKeyDown}
              />
              <span style={{ color: "red" }}>
                {errors.password && errors.password.message}
              </span>
            </Form.Group>
            <Form.Group controlId="passwordRepeat">
              <Form.Label>Repeat password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password again"
                name="passwordRepeat"
                onChange={handleChange} // TODO: Check password equivalence here
                //onKeyDown={handleKeyDown}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit(handleSignUp)}>
            Sign up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onCloseTour: () => dispatch({ type: CLOSE_TOUR }),
  onTourChangeStep: (step) => dispatch({ type: TOUR_CHANGE_STEP, step }),
  onOpenTour: () => dispatch({ type: OPEN_TOUR }),
});

export default connect(null, mapDispatchToProps)(SignUpModal);

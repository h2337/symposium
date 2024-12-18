import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import {
  LOGIN,
  CLOSE_TOUR,
  OPEN_TOUR,
  TOUR_CHANGE_STEP,
} from "../../../redux/actionTypes";
import { createToken } from "../../../api/token";

function SignInModal(props) {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies([]);
  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    props.onCloseTour();
    setShow(true);
  };

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
              responseBodyObject.user.id,
              responseBodyObject.user.email,
              responseBodyObject.user.access,
              responseBodyObject.token
            );
            setCookie("username", username, { path: "/" });
            setCookie("userID", responseBodyObject.user.id, { path: "/" });
            setCookie("email", responseBodyObject.user.email, { path: "/" });
            setCookie("access", responseBodyObject.user.access, { path: "/" });
            setCookie("token", responseBodyObject.token, { path: "/" });
            history.push("/");
          });
        } else {
          toast.error("Login failed, try again."); // TODO: Show detailed error
        }
      })
      .catch((e) => toast.error("Login failed, try again."));
    props.onTourChangeStep(2);
    props.onOpenTour();
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
      <Button variant="primary" onClick={handleShow} id="sign-in-button">
        <i className="fa fa-sign-in"></i> Sign in
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
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
  onCloseTour: () => dispatch({ type: CLOSE_TOUR }),
  onTourChangeStep: (step) => dispatch({ type: TOUR_CHANGE_STEP, step }),
  onOpenTour: () => dispatch({ type: OPEN_TOUR }),
});

export default connect(null, mapDispatchToProps)(SignInModal);

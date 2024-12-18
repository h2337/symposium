import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { connect } from "react-redux";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { toast } from "react-toastify";
import { LOGOUT } from "../../../redux/actionTypes";
import { useHistory, Link } from "react-router-dom";

function Header(props) {
  const history = useHistory();

  function handleLogout() {
    props.onLogout();
    history.push("/");
    toast.success("Logged out.");
  }

  function handleAdminPanelClick() {
    history.push("/admin");
  }

  let userButtons;
  if (props.username.length > 0 && props.token.length > 0) {
    if (props.access == "99")
      userButtons = (
        <>
          <Button variant="primary" onClick={handleAdminPanelClick}>
            Admin
          </Button>
          &nbsp;
          <Button variant="primary" onClick={handleLogout}>
            Log out
          </Button>
        </>
      );
    else
      userButtons = (
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      );
  } else {
    userButtons = (
      <>
        <SignUp></SignUp>
        &nbsp;
        <SignIn></SignIn>
      </>
    );
  }

  return (
    <>
      <Navbar bg="light">
        <Navbar.Brand>
          <Link to="/">Symposium</Link>
        </Navbar.Brand>
        <Nav className="justify-content-end" style={{ width: "100%" }}>
          {userButtons}
        </Nav>
      </Navbar>
    </>
  );
}

function mapStateToProps(state) {
  return {
    username: state.user.username,
    token: state.user.token,
    access: state.user.access,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

import React from "react";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { LOGOUT } from "../../../redux/actionTypes";
import SignUpModal from "./SignUpModal";
import SignInModal from "./SignInModal";

function Header(props) {
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies([]);

  function handleLogout() {
    removeCookie("username", { path: "/" });
    removeCookie("userID", { path: "/" });
    removeCookie("token", { path: "/" });
    removeCookie("access", { path: "/" });
    removeCookie("email", { path: "/" });
    props.onLogout();
    history.push("/");
    toast.success("Logged out.");
  }

  function handleAdminPanelClick() {
    history.push("/admin");
  }

  function handleProfileClick() {
    history.push("/profile/" + props.userID);
  }

  return (
    <>
      <Navbar bg="light">
        <Navbar.Brand>
          <Link to="/">Symposium</Link>
        </Navbar.Brand>
        <Nav className="justify-content-end" style={{ width: "100%" }}>
          {props.username.length > 0 && props.token.length > 0 ? (
            <Dropdown drop="left">
              <Dropdown.Toggle variant="primary">
                <img
                  src={
                    "http://" +
                    process.env.API_URL +
                    "/avatars/" +
                    props.userID +
                    ".jpg"
                  }
                  width="25"
                  height="25"
                  style={{ borderRadius: "50%" }}
                />
                &nbsp;
                {props.username}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleProfileClick}>
                  <i className="fa fa-user"></i> Profile
                </Dropdown.Item>
                {props.access == "99" && (
                  <Dropdown.Item onClick={handleAdminPanelClick}>
                    <i className="fa fa-cogs"></i> Admin panel
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={handleLogout}>
                  <i className="fa fa-sign-out"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <SignUpModal></SignUpModal>
              &nbsp;
              <SignInModal></SignInModal>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
}

function mapStateToProps(state) {
  return {
    userID: state.user.id,
    username: state.user.username,
    token: state.user.token,
    access: state.user.access,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

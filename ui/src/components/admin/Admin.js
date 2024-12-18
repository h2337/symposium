import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import { useEffect } from "react";
import Categories from "./Categories";
import { LOGIN } from "../../redux/actionTypes";

function Admin(props) {
  const [cookies, setCookie] = useCookies([]);
  useEffect(() => {
    if (
      cookies.token !== undefined &&
      cookies.token.length > 0 &&
      cookies.username !== undefined &&
      cookies.username.length > 0
    ) {
      props.onLogin(
        cookies.username,
        cookies.userID,
        cookies.email,
        cookies.access,
        cookies.token
      );
    }
  }, []);

  return (
    <Tabs defaultActiveKey="categories">
      <Tab eventKey="general" title="General" disabled></Tab>
      <Tab eventKey="categories" title="Categories">
        <Categories />
      </Tab>
      <Tab eventKey="users" title="Users" disabled></Tab>
    </Tabs>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
});

export default connect(null, mapDispatchToProps)(Admin);

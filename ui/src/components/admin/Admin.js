import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useCookies } from "react-cookie";
import { Tabs, Tab } from "react-bootstrap";
import { LOGIN } from "../../redux/actionTypes";
import Categories from "./Categories";
import GeneralSettings from "./GeneralSettings";

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
    <Tabs defaultActiveKey="general">
      <Tab eventKey="general" title="General">
        <GeneralSettings />
      </Tab>
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

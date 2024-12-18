import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Categories from "./Categories";

function Admin(props) {
  return (
    <Tabs defaultActiveKey="general">
      <Tab eventKey="general" title="General"></Tab>
      <Tab eventKey="categories" title="Categories">
        <Categories />
      </Tab>
      <Tab eventKey="users" title="Users" disabled></Tab>
    </Tabs>
  );
}

export default Admin;

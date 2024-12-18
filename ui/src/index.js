import React from "react";
import ReactDOM from "react-dom";
import Feed from "./components/feed/Feed";
import Admin from "./components/admin/Admin";
import Header from "./components/layout/header/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Feed} />
          <Route path="/category/:categoryId" component={Feed} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

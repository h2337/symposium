import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CookiesProvider } from "react-cookie";
import store from "./redux/store";
import Feed from "./components/feed/Feed";
import Admin from "./components/admin/Admin";
import Header from "./components/layout/header/Header";
import Thread from "./components/thread/Thread";
import Profile from "./components/profile/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Feed} />
            <Route path="/category/:categoryID" component={Feed} />
            <Route path="/thread/:threadID" component={Thread} />
            <Route path="/admin" component={Admin} />
            <Route path="/profile/:userID" component={Profile} />
          </Switch>
        </Router>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

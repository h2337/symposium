import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import {
  Navbar,
  Nav,
  Dropdown,
  Button,
  Badge,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import { useCookies } from "react-cookie";
import Tour from "reactour";
import { LOGOUT, START_TOURING } from "../../../redux/actionTypes";
import { getSettings } from "../../../api/setting";
import SignUpModal from "./SignUpModal";
import SignInModal from "./SignInModal";
import {
  getNotifications,
  getUnseenNotificationCount,
  markNotificationsSeen,
} from "../../../api/notification";

function Header(props) {
  const [siteName, setSiteName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [unseenNotificationCount, setUnseenNotifcationCount] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    getSettings()
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            setSiteName(responseBodyObject.siteName);
            document.title = responseBodyObject.siteName;
            if (responseBodyObject.isInitialized === "false")
              props.onStartTouring();
          });
        } else {
          toast.error("Failed to load the settings.");
        }
      })
      .catch((e) => toast.error("Failed to load the settings."));
  }, []);

  useEffect(() => {
    if (props.isTouring) setIsTourOpen(props.isTourOpen);
  }, [props.isTourOpen]);

  let notificationCountFetcher = undefined;

  useEffect(() => {
    if (props.token.length > 0) {
      if (notificationCountFetcher === undefined) {
        notificationCountFetcher = setInterval(() => {
          fetchUnseenNotificationCount();
        }, 5000);
      }
      fetchUnseenNotificationCount();
    }
  }, [props.token, notifications]);

  useEffect(() => {
    if (notifications.length > 0) {
      let ids = [];
      notifications.forEach(function (item, index) {
        ids.push(item.id);
      });
      if (props.token.length > 0) markNotificationsSeen(props.token, ids);
    }
  }, [notifications]);

  function closeTour() {
    setIsTourOpen(false);
  }

  const tourSteps = [
    {
      selector: "#sign-up-button",
      content:
        "Let's get started by setting up your forums! First, you should sign up your admin account.",
    },
    {
      selector: "#sign-in-button",
      content: "Sign in to your newly registered admin account.",
    },
    {
      selector: "#user-bar",
      content:
        "Navigate to the admin panel through your user bar and customize the settings, also create few categories so threads can be created!",
    },
  ];

  function fetchUnseenNotificationCount() {
    getUnseenNotificationCount(props.token)
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            setUnseenNotifcationCount(responseBodyObject.count);
          });
        } else {
          toast.error("Failed to fetch notifications");
        }
      })
      .catch((e) => toast.error("Failed to fetch notifications."));
  }

  function handleLogout() {
    removeCookie("username", { path: "/" });
    removeCookie("userID", { path: "/" });
    removeCookie("token", { path: "/" });
    removeCookie("access", { path: "/" });
    removeCookie("email", { path: "/" });
    props.onLogout();
    history.push("/?loggedOut=1");
    toast.success("Logged out.");
  }

  function handleAdminPanelClick() {
    history.push("/admin");
  }

  function handleProfileClick() {
    history.push("/profile/" + props.userID);
  }

  function loadNotifications() {
    getNotifications(props.token, Header.notificationPage++, 10)
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            if (responseBodyObject.length === 0) setHasMoreNotifications(false);
            setNotifications((notifications) => [
              ...notifications,
              ...responseBodyObject,
            ]);
          });
        } else {
          toast.error("Failed to fetch notifications");
        }
      })
      .catch((e) => toast.error("Failed to fetch notifications."));
  }

  function resetNotifications() {
    Header.notificationPage = 0;
    setNotifications([]);
    setHasMoreNotifications(true);
  }

  function formatDate(date) {
    let d = new Date(date);
    let minutes = d.getMinutes();
    return (
      d.toDateString() +
      " " +
      d.getHours() +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes)
    );
  }

  function handleNotificationClick(notification) {
    history.push(notification.link);
  }

  return (
    <>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        startAt={props.step}
      />
      <Navbar bg="light">
        <Navbar.Brand>
          <Link to="/">{siteName}</Link>
        </Navbar.Brand>
        <Nav className="justify-content-end" style={{ width: "100%" }}>
          {props.username.length > 0 && props.token.length > 0 ? (
            <>
              <Dropdown drop="left" id="user-bar">
                <Dropdown.Toggle variant="primary">
                  <img
                    src={
                      "http://" +
                      process.env.API_URL +
                      "/avatars/" +
                      props.userID
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
              <Dropdown drop="left" style={{ marginLeft: "5px" }}>
                <div onClick={resetNotifications}>
                  <Dropdown.Toggle variant="primary">
                    <i className="fa fa-bell"></i>{" "}
                    <Badge variant="light">{unseenNotificationCount}</Badge>
                  </Dropdown.Toggle>
                </div>

                <Dropdown.Menu
                  style={{
                    width: "250px",
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  <InfiniteScroll
                    loadMore={loadNotifications}
                    hasMore={hasMoreNotifications}
                    initialLoad={true}
                    threshold={1}
                    useWindow={false}
                    loader={<div></div>}
                  >
                    {notifications.map((v, i) => (
                      <>
                        <a onClick={() => handleNotificationClick(v)}>
                          <Row
                            style={{ width: "100%", margin: "0", padding: "0" }}
                          >
                            <Col xs={1}>
                              {!v.seen && (
                                <i
                                  className="fa fa-circle"
                                  style={{ fontSize: "0.3em", color: "blue" }}
                                />
                              )}
                            </Col>
                            <Col xs={6}>{v.content}</Col>
                            <Col xs={4}>
                              <span style={{ fontSize: "0.7em" }}>
                                {formatDate(v.createdAt)}
                              </span>
                            </Col>
                          </Row>
                        </a>
                        <hr></hr>
                      </>
                    ))}
                  </InfiniteScroll>
                </Dropdown.Menu>
              </Dropdown>
            </>
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
    isTouring: state.tour.isTouring,
    isTourOpen: state.tour.isTourOpen,
    step: state.tour.step,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch({ type: LOGOUT }),
  onStartTouring: () => dispatch({ type: START_TOURING }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

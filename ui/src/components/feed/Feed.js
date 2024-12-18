import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { LOGIN } from "../../redux/actionTypes";
import {
  Container,
  Row,
  Col,
  Badge,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { createUseStyles } from "react-jss";
import InfiniteScroll from "react-infinite-scroller";
import { useMediaQuery } from "react-responsive";
import { useCookies } from "react-cookie";
import queryString from "query-string";
import { getCategories } from "../../api/category";
import { getThreads } from "../../api/thread";
import NewThreadModal from "./NewThreadModal";

function Feed(props) {
  const [threads, setThreads] = useState([]);
  const [hasMoreThreads, setHasMoreThreads] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { categoryID } = useParams();
  const [cookies, setCookie] = useCookies([]);
  const history = useHistory();
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  Feed.websocketNewThread = function (thread) {
    if (
      threads.find((e) => e.id === thread.id) === undefined &&
      (categoryID === undefined || categoryID == thread.categoryID)
    )
      setThreads([thread].concat(threads));
  };

  useEffect(() => {
    let threadsSocket = new WebSocket(
      "ws://" + process.env.API_URL + "/api/ws/thread"
    );
    threadsSocket.onmessage = function (event) {
      Feed.websocketNewThread(JSON.parse(event.data));
    };
  }, []);

  useEffect(() => {
    if (
      props.token !== undefined &&
      props.token.length > 0 &&
      props.username !== undefined &&
      props.username.length > 0
    ) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      if (
        queryString.parse(props.location.search).loggedOut != "1" &&
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
    }
  }, [props.token]);

  useEffect(() => {
    resetFeed();
    initialLoad();
  }, [categoryID]);

  async function initialLoad() {
    await loadCategories();
    loadThreads();
  }

  function loadCategories() {
    return new Promise((resolve) => {
      getCategories()
        .then((r) => {
          if (r.status === 200) {
            r.text().then((responseBody) => {
              let responseBodyObject = JSON.parse(responseBody);
              setCategories(responseBodyObject);
              resolve("Categories loaded");
            });
          } else {
            toast.error("Failed to load the categories.");
          }
        })
        .catch((e) => toast.error("Failed to load the categories."));
    });
  }

  function resetFeed() {
    Feed.threadPage = 0;
    setThreads([]);
    setHasMoreThreads(true);
  }

  function loadThreads() {
    getThreads(categoryID, Feed.threadPage++, 20)
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            if (responseBodyObject.length === 0) setHasMoreThreads(false);
            setThreads((threads) => [...threads, ...responseBodyObject]);
          });
        } else {
          toast.error("Failed to fetch threads");
        }
      })
      .catch((e) => toast.error("Failed to fetch threads."));
  }

  function openThread(thread) {
    history.push("/thread/" + thread.id);
  }

  const classes = createUseStyles({
    feedThreadBox: {
      width: "100%",
      cursor: "pointer",
      transition: "0.3s",
      borderRadius: "5px",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    },
  })();

  return (
    <>
      <Container>
        <Row>
          {!isMobile && (
            <Col xs="2">
              {isLoggedIn && (
                <>
                  <br></br>
                  <NewThreadModal categories={categories}></NewThreadModal>
                  <br></br>
                </>
              )}
              <br></br>
              <Badge variant={categoryID === undefined ? "primary" : "light"}>
                <Link
                  to={"/"}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <i
                    className="fa fa-circle"
                    style={{ color: "#000000", fontSize: 10 }}
                  ></i>{" "}
                  <span>All Categories</span>
                </Link>
              </Badge>
              {categories.map((v, i) => (
                <div key={i}>
                  <Badge variant={v.id == categoryID ? "primary" : "light"}>
                    <Link
                      to={"/category/" + v.id}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <i
                        className="fa fa-circle"
                        style={{ color: "#" + v.color, fontSize: 10 }}
                      ></i>{" "}
                      <span>{v.name}</span>
                    </Link>
                  </Badge>
                </div>
              ))}
            </Col>
          )}
          <Col lg="10">
            {isMobile && (
              <>
                <DropdownButton
                  title="Categories"
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    display: "inline-block",
                  }}
                >
                  <Dropdown.Item onClick={() => history.push("/")}>
                    <Badge
                      variant={categoryID === undefined ? "primary" : "light"}
                    >
                      <i
                        className="fa fa-circle"
                        style={{ color: "#000000", fontSize: 10 }}
                      ></i>{" "}
                      <span>All Categories</span>
                    </Badge>
                  </Dropdown.Item>
                  {categories.map((v, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() => history.push("/category/" + v.id)}
                    >
                      <Badge variant={v.id == categoryID ? "primary" : "light"}>
                        <i
                          className="fa fa-circle"
                          style={{
                            color: "#" + v.color,
                            fontSize: 10,
                          }}
                        ></i>{" "}
                        {v.name}
                      </Badge>
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                {isLoggedIn && (
                  <div
                    style={{
                      float: "right",
                      marginTop: "20px",
                      marginBotton: "20px",
                    }}
                  >
                    <NewThreadModal categories={categories}></NewThreadModal>
                  </div>
                )}
              </>
            )}

            <br></br>
            <InfiniteScroll
              loadMore={loadThreads}
              hasMore={hasMoreThreads}
              initialLoad={false}
              threshold={1}
              loader={<div></div>}
            >
              {threads.map((v, i) => (
                <div key={i}>
                  <div
                    className={classes.feedThreadBox}
                    onClick={() => openThread(v)}
                    style={{ marginBottom: "10px" }}
                  >
                    <a>
                      <Container fluid>
                        <Row style={{ marginBottom: "5px" }}>
                          <img
                            src={
                              "http://" +
                              process.env.API_URL +
                              "/avatars/" +
                              v.userID
                            }
                            width="40"
                            height="40"
                            style={{
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <div style={{ display: "inline" }}>
                            <h6
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: "1em",
                              }}
                            >
                              {v != undefined && v.title}
                            </h6>
                            <span
                              style={{
                                fontSize: "0.7em",
                                marginRight: "10px",
                                color: "gray",
                                fontWeight: "bolder",
                              }}
                            >
                              {new Date(v.createdAt).toDateString()}
                            </span>
                          </div>
                          <div className="ml-auto">
                            <Badge
                              style={{
                                backgroundColor:
                                  "#" +
                                  categories.find(
                                    (category) => category.id === v.categoryID
                                  ).color,
                              }}
                            >
                              <span style={{ color: "white" }}>
                                {" "}
                                {
                                  categories.find(
                                    (category) => category.id === v.categoryID
                                  ).name
                                }
                              </span>
                            </Badge>{" "}
                            <i className="fa fa-comments"></i>{" "}
                            <span
                              style={{
                                fontSize: "0.8em",
                                fontWeight: "bolder",
                              }}
                            >
                              {v.postCount}
                            </span>
                          </div>
                        </Row>
                      </Container>
                    </a>
                  </div>
                </div>
              ))}
              {!hasMoreThreads && (
                <div
                  style={{
                    margin: "auto",
                    display: "table",
                  }}
                >
                  No more recent threads
                </div>
              )}{" "}
            </InfiniteScroll>
          </Col>
        </Row>
      </Container>
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
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

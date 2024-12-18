import React, { useState } from "react";
import { connect } from "react-redux";
import NewThread from "./NewThread";
import { LOAD_CATEGORIES, OPEN_THREAD } from "../../redux/actionTypes";
import {
  Container,
  Row,
  Col,
  Badge,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { createUseStyles } from "react-jss";
import { useEffect } from "react";
import { getCategories } from "../../api/category";
import { getThreads } from "../../api/thread";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import { Link, useParams, useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

function Feed(props) {
  const [threads, setThreads] = useState([]);
  const [hasMoreThreads, setHasMoreThreads] = useState(true);
  const [categories, setCategories] = useState([]);
  const { categoryID } = useParams();
  const history = useHistory();
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  useEffect(() => {
    resetFeed();
    initialLoad();
  }, [categoryID]);

  let isLoggedIn = false; // TODO: Does this belong here?
  if (props.username.length > 0 && props.token.length > 0) {
    isLoggedIn = true;
  }

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
              props.onCategoryLoad(responseBodyObject);
              resolve("Categories loaded");
            });
          } else {
            toast.error("Failed to load the categories");
          }
        })
        .catch((e) => toast.error("Failed to load the categories"));
    });
  }

  function resetFeed() {
    Feed.threadPage = 0;
    setThreads([]);
    setHasMoreThreads(true);
  }

  function newThreadCallback() {
    resetFeed();
    initialLoad();
  }

  const classes = createUseStyles({
    feedThreadBox: {
      width: "100%",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },
  })();

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
    props.onThreadOpen(thread);
    history.push("/thread/" + thread.id);
  }

  return (
    <>
      <Container fluid>
        <Row>
          {!isMobile && (
            <Col xs="2">
              {isLoggedIn && (
                <>
                  <br></br>
                  <NewThread
                    categories={categories}
                    postCreateCallback={newThreadCallback}
                  ></NewThread>
                  <br></br>
                </>
              )}
              <br></br>
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
          <Col xs="10">
            {isMobile && (
              <>
                {isLoggedIn && (
                  <>
                    <br></br>
                    <NewThread categories={categories}></NewThread>
                    <br></br>
                  </>
                )}
                <br></br>
                <DropdownButton title="Categories">
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
                  >
                    <h5 style={{ marginBottom: 0 }}>
                      {v != undefined && v.title}
                    </h5>
                    <i
                      className="fa fa-circle fa-xs"
                      style={{
                        color:
                          "#" +
                          categories.find(
                            (category) => category.id === v.categoryID
                          ).color,
                        fontSize: 10,
                      }}
                    ></i>{" "}
                    {
                      categories.find(
                        (category) => category.id === v.categoryID
                      ).name
                    }
                  </div>
                  <hr></hr>
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
  onCategoryLoad: (categories) =>
    dispatch({ type: LOAD_CATEGORIES, categories }),
  onThreadOpen: (thread) => dispatch({ type: OPEN_THREAD, thread }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

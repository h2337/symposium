import React, { useState } from "react";
import { connect } from "react-redux";
import NewThread from "./NewThread";
import { LOGOUT, LOAD_CATEGORIES } from "../../redux/actionTypes";
import {
  Container,
  Row,
  Col,
  Spinner,
  Badge,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { createUseStyles } from "react-jss";
import { useEffect } from "react";
import { loadCategories } from "../../api/category";
import { loadThreads } from "../../api/thread";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

function Feed(props) {
  const [threads, setThreads] = useState([]);
  const [hasMoreThreads, setHasMoreThreads] = useState(true);
  const [categories, setCategories] = useState([]);
  const { categoryId } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });

  useEffect(() => {
    Feed.threadPage = 0;
    initialLoad();
  }, []);

  useEffect(() => {
    resetFeed();
  }, [categoryId]);

  useEffect(() => {
    if (threads.length === 0) getThreads();
  }, [threads]);

  let isLoggedIn = false; // TODO: Does this belong here?
  if (props.username.length > 0 && props.token.length > 0) {
    isLoggedIn = true;
  }

  async function initialLoad() {
    await getCategories();
    getThreads();
  }

  function getCategories() {
    return new Promise((resolve) => {
      loadCategories()
        .then((r) => {
          if (r.status === 200) {
            r.text().then((responseBody) => {
              let responseBodyObject = JSON.parse(responseBody);
              setCategories(responseBodyObject.categories);
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

  const classes = createUseStyles({
    feedThreadBox: {
      width: "100%",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },
  })();

  function getThreads() {
    loadThreads(categoryId, Feed.threadPage++, 10)
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            if (responseBodyObject.threads.length === 0)
              setHasMoreThreads(false);
            setThreads(threads.concat(responseBodyObject.threads));
          });
        } else {
          toast.error("Failed to fetch threads");
        }
      })
      .catch((e) => toast.error("Failed to fetch threads."));
  }

  return (
    <>
      <Container>
        <Row>
          {!isMobile && (
            <Col xs="2">
              {isLoggedIn && (
                <>
                  <br></br>
                  <NewThread
                    categories={categories}
                    postCreateCallback={resetFeed}
                  ></NewThread>
                  <br></br>
                </>
              )}
              <br></br>
              {categories.map((v, i) => (
                <div key={i}>
                  <Badge variant={v.id == categoryId ? "primary" : "light"}>
                    <Link
                      to={"/category/" + v.id}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <i
                        className="fa fa-circle"
                        style={{
                          color: "#" + v.color,
                          fontSize: 10,
                        }}
                      ></i>{" "}
                      {v.name}
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
                    <Dropdown.Item key={i} href={"/category/" + v.id}>
                      <Badge variant={v.id == categoryId ? "primary" : "light"}>
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
              loadMore={getThreads}
              hasMore={hasMoreThreads}
              initialLoad={false}
              threshold={1}
              loader={<Spinner animation="grow" />} // TODO: Align to center
            >
              {threads.map((v, i) => (
                <div key={i}>
                  <div
                    className={classes.feedThreadBox}
                    onClick={(e) => console.log(v)}
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
                            (category) => category.id === v.categoryId
                          ).color,
                        fontSize: 10,
                      }}
                    ></i>{" "}
                    {
                      categories.find(
                        (category) => category.id === v.categoryId
                      ).name
                    }
                  </div>
                  <hr></hr>
                </div>
              ))}
              {!hasMoreThreads && <div>No more threads!</div>} // TODO: Align to
              center
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
  onLogout: () => dispatch({ type: LOGOUT }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

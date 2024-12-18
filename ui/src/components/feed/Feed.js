import React, { useState } from "react";
import { connect } from "react-redux";
import NewThread from "./NewThread";
import { LOGOUT, LOAD_CATEGORIES } from "../../redux/actionTypes";
import { Container, Row, Col, Spinner, Badge } from "react-bootstrap";
import { createUseStyles } from "react-jss";
import { useEffect } from "react";
import { loadCategories } from "../../api/category";
import { loadThreads } from "../../api/thread";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import { Link, useParams } from "react-router-dom";

function Feed(props) {
  const [threads, setThreads] = useState([]);
  const [hasMoreThreads, setHasMoreThreads] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    getCategories();
    getThreads();
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

  function getCategories() {
    loadCategories()
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            props.onLoadCategories(responseBodyObject.categories); // TODO: Why Redux?
          });
        } else {
          toast.error("Failed to load the categories");
        }
      })
      .catch((e) => toast.error("Failed to load the categories"));
  }

  function resetFeed() {
    InfiniteScroll.threadPage = 0;
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
    if (
      InfiniteScroll.threadPage === NaN ||
      InfiniteScroll.threadPage === undefined
    )
      InfiniteScroll.threadPage = 0;
    loadThreads(categoryId, InfiniteScroll.threadPage++, 10)
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
          <Col xs="2">
            {isLoggedIn && (
              <>
                <br></br>
                <NewThread></NewThread>
                <br></br>
              </>
            )}
            <br></br>
            {props.categories.map((v, i) => (
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
          <Col xs="10">
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
                          props.categories.find(
                            (category) => category.id === v.categoryId
                          ).color,
                        fontSize: 10,
                      }}
                    ></i>{" "}
                    {
                      props.categories.find(
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
    categories: state.category.categories,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch({ type: LOGOUT }),
  onLoadCategories: (categories) =>
    dispatch({ type: LOAD_CATEGORIES, categories }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

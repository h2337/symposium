import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Spinner, Container, Row, Col, Badge, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import DOMPurify from "dompurify";
import { LOAD_CATEGORIES, LOGIN } from "../../redux/actionTypes";
import { getThread } from "../../api/thread";
import { getPosts } from "../../api/post";
import { getCategories } from "../../api/category";
import Reply from "./Reply";

function Thread(props) {
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [thread, setThread] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(undefined);
  const [cookies, setCookie] = useCookies([]);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const { threadID } = useParams();
  useEffect(() => {
    Thread.postPage = 0;
    if (props.thread === undefined) {
      getThread(threadID)
        .then((r) => {
          if (r.status === 200) {
            r.text().then((responseBody) => {
              let responseBodyObject = JSON.parse(responseBody);
              setThread(responseBodyObject);
            });
          } else {
            toast.error("Failed to fetch the thread");
          }
        })
        .catch((e) => toast.error("Failed to fetch the thread."));
    } else {
      setThread(props.thread);
    }
    if (props.categories === undefined || props.categories.length === 0) {
      getCategories()
        .then((r) => {
          if (r.status === 200) {
            r.text().then((responseBody) => {
              let responseBodyObject = JSON.parse(responseBody);
              setCategories(responseBodyObject);
              props.onCategoryLoad(responseBodyObject);
            });
          } else {
            toast.error("Failed to load the categories");
          }
        })
        .catch((e) => toast.error("Failed to load the categories"));
    } else {
      setCategories(props.categories);
    }
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

  useEffect(() => {
    if (
      categories !== undefined &&
      categories.length > 0 &&
      thread !== undefined
    )
      setCategory(
        categories.find((category) => category.id === thread.categoryID)
      );
  }, [categories]);

  function loadPosts() {
    getPosts(thread.id, Thread.postPage++, 20)
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            if (responseBodyObject.length === 0) setHasMorePosts(false);
            setPosts((posts) => [...posts, ...responseBodyObject]);
          });
        } else {
          toast.error("Failed to fetch posts.");
        }
      })
      .catch((e) => toast.error("Failed to fetch posts."));
  }

  function postReplyCallback() {
    Thread.postPage = 0;
    setPosts([]);
    setHasMorePosts(true);
    loadPosts();
  }

  function formatDate(date) {
    let d = new Date(date);
    return d.toDateString() + " " + d.getHours() + ":" + d.getMinutes();
  }

  return (
    <>
      {thread === undefined || category === undefined ? (
        <Spinner
          style={{ margin: "auto", display: "table" }}
          animation="border"
        />
      ) : (
        <Container>
          <Row>
            <Col>
              <Badge variant="light">
                <i
                  className="fa fa-circle"
                  style={{ color: "#" + category.color, fontSize: 10 }}
                ></i>{" "}
                <span>{category.name}</span>
              </Badge>
              <h3>{thread.title}</h3>
              {isMobile && (
                <Reply
                  threadID={threadID}
                  postReplyCallback={postReplyCallback}
                />
              )}
            </Col>
          </Row>
          <br></br>
          <Row>
            {!isMobile && (
              <Col xs="1">
                <Reply
                  threadID={threadID}
                  postReplyCallback={postReplyCallback}
                />
              </Col>
            )}
            <Col xs="11">
              <InfiniteScroll
                loadMore={loadPosts}
                hasMore={hasMorePosts}
                initialLoad={true}
                threshold={1}
                loader={<div></div>}
                style={{ width: "100%" }}
              >
                {posts.map((v, i) => (
                  <>
                    <Container>
                      <Row>
                        <Col xs="1">
                          <Link to={"/profile/" + v.userID}>
                            <img
                              src={
                                "http://" +
                                process.env.API_URL +
                                "/avatars/" +
                                v.userID +
                                ".jpg"
                              }
                              width="50"
                              height="50"
                              style={{ borderRadius: "50%" }}
                            />
                          </Link>
                        </Col>
                        <Col xs="11">
                          <div
                            style={{
                              fontSize: "0.8em",
                              fontWeight: "bold",
                              marginBottom: "10px",
                            }}
                          >
                            <Link
                              to={"/profile/" + v.userID}
                              style={{ textDecoration: "none", color: "gray" }}
                            >
                              {v.username}
                            </Link>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(v.content),
                            }}
                          ></div>
                          <div
                            style={{
                              float: "right",
                              fontSize: "0.8em",
                              fontStyle: "italic",
                              color: "grey",
                            }}
                          >
                            {formatDate(v.createdAt)}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                    <hr></hr>
                  </>
                ))}
              </InfiniteScroll>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    thread: state.thread.currentThread,
    categories: state.category.categories,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onCategoryLoad: (categories) =>
    dispatch({ type: LOAD_CATEGORIES, categories }),
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Thread);

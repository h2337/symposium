import React, { useState } from "react";
import { Spinner, Container, Row, Col, Badge, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getThread } from "../../api/thread";
import { getPosts } from "../../api/post";
import { getCategories } from "../../api/category";
import { LOAD_CATEGORIES } from "../../redux/actionTypes";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";
import DOMPurify from "dompurify";
import Reply from "./Reply";

function Thread(props) {
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [thread, setThread] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(undefined);
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
          toast.error("Failed to fetch posts");
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

  return (
    <>
      {thread === undefined || category === undefined ? (
        <Spinner
          style={{ margin: "auto", display: "table" }}
          animation="border"
        />
      ) : (
        <Container fluid>
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
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs="1">
              <Reply
                threadID={threadID}
                postReplyCallback={postReplyCallback}
              />
            </Col>
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
                    <Card style={{ width: "100%" }}>
                      <Card.Body>
                        <img
                          src={
                            process.env.API_URL +
                            "/avatars/" +
                            v.userID +
                            ".jpg"
                          }
                          width="50"
                          height="50"
                          style={{ borderRadius: "50%" }}
                        />
                        &nbsp;
                        {v.username}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(v.content),
                          }}
                        ></div>
                      </Card.Body>
                    </Card>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Thread);

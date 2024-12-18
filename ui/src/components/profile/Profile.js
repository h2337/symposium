import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createUseStyles } from "react-jss";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import DOMPurify from "dompurify";
import $ from "jquery";
import { LOGIN, OPEN_THREAD } from "../../redux/actionTypes";
import { getUser, uploadAvatar } from "../../api/user";
import { getPostsByUserID } from "../../api/post";

function Profile(props) {
  const [cookies, setCookie] = useCookies([]);
  const [posts, setPosts] = useState([]);
  const [profileColor, setProfileColor] = useState("");
  const [user, setUser] = useState(undefined);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { userID } = useParams();
  const history = useHistory();

  useEffect(() => {
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
    getUser(userID)
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            setUser(responseBodyObject);
          });
        } else {
          toast.error("Failed to fetch the user.");
        }
      })
      .catch((e) => toast.error("Failed to fetch the user."));
    Profile.postPage = 0;
    loadPosts();
  }, []);

  function loadPosts() {
    if (Profile.postPage === undefined) return;
    getPostsByUserID(userID, Profile.postPage++, 20)
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

  function openThread(postAndThread) {
    props.onThreadOpen({
      title: postAndThread.threadTitle,
      id: postAndThread.threadID,
      categoryID: postAndThread.threadCategoryID,
      createdAt: postAndThread.threadCreatedAt,
    });
    history.push("/thread/" + postAndThread.threadID);
  }

  function handleAvatarUpload(avatar) {
    if (avatar.size > 1024000) {
      toast.error("Uploaded avatar image can't be more than 1MB.");
      return;
    }
    if (avatar.type === undefined) return;
    if (avatar.type != "image/jpeg" && avatar.type != "image/png") {
      toast.error("Uploaded file is not a JPEG or PNG file.");
      return;
    }
    uploadAvatar(props.token, avatar)
      .then((r) => {
        if (r.status === 200) {
          window.location.reload(true);
        } else {
          toast.error("Failed to change the avatar, try again.");
        }
      })
      .catch((e) => toast.error("Failed to change the avatar, try again."));
  }

  function handleChangeAvatarClick() {
    const $input = $('<input type="file" accept="image/png, image/jpeg">');
    $input
      .appendTo("body")
      .hide()
      .click()
      .on("input", (e) => {
        handleAvatarUpload($(e.target)[0].files[0]);
      });
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

  const classes = createUseStyles({
    changeAvatarButton: {
      width: "45px",
      height: "20px",
      borderRadius: "5px",
      top: "50%",
      left: "50%",
      transform: "translate(60%, -100%)",
      color: "white",
      fontSize: "0.8em",
      cursor: "pointer",
      backgroundColor: "rgba(200, 200, 200, 0.5)",
      "&:hover": {
        backgroundColor: "rgba(200, 200, 200, 1)",
      },
    },
  })();

  return (
    <Container>
      <br></br>
      <Row>
        <div>
          <img
            src={"http://" + process.env.API_URL + "/avatars/" + userID}
            width="100"
            height="100"
            style={{ borderRadius: "50%" }}
          />
          {props.userID === userID && (
            <div
              className={classes.changeAvatarButton}
              onClick={handleChangeAvatarClick}
            >
              Change
            </div>
          )}
        </div>
        <div style={{ paddingTop: "50px", paddingLeft: "50px" }}>
          {user !== undefined && user.username}
        </div>
      </Row>
      <hr></hr>
      <Row>
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
                  <Link
                    style={{
                      marginLeft: "10px",
                      fontSize: "0.8em",
                      marginBottom: "20px",
                    }}
                    onClick={() => openThread(v)}
                  >
                    {v.threadTitle}
                  </Link>
                </Row>
                <Row>
                  <Col md="1">
                    <Link to={"/profile/" + v.userID}>
                      <img
                        src={
                          "http://" +
                          process.env.API_URL +
                          "/avatars/" +
                          v.userID
                        }
                        width="50"
                        height="50"
                        style={{ borderRadius: "50%" }}
                      />
                    </Link>
                  </Col>
                  <Col md="11">
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
                    <span
                      style={{
                        float: "right",
                        fontSize: "0.7em",
                        fontWeight: "bolder",
                        color: "grey",
                      }}
                    >
                      {formatDate(v.createdAt)}
                    </span>
                  </Col>
                </Row>
              </Container>
              <hr></hr>
            </>
          ))}
        </InfiniteScroll>
      </Row>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    userID: state.user.id,
    username: state.user.username,
    token: state.user.token,
    access: state.user.access,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
  onThreadOpen: (thread) => dispatch({ type: OPEN_THREAD, thread }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

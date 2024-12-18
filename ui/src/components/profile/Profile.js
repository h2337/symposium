import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { LOGIN } from "../../redux/actionTypes";
import { Container, Row, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUser } from "../../api/user";
import { getPostsByUserID } from "../../api/post";
import InfiniteScroll from "react-infinite-scroller";

function Profile(props) {
  const [cookies, setCookie] = useCookies([]);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(undefined);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { userID } = useParams();
  useEffect(() => {
    Profile.postPage = 0;
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
          toast.error("Failed to fetch the user");
        }
      })
      .catch((e) => toast.error("Failed to fetch the user."));
  }, []);

  function loadPosts() {
    if (Profile.postPage === undefined) Profile.postPage = 0;
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

  // TODO: Navigating out and back leads to no posts being shown
  return (
    <Container>
      <br></br>
      <Row>
        <img
          src={process.env.API_URL + "/avatars/" + userID + ".jpg"}
          width="100"
          height="100"
          style={{ borderRadius: "50%" }}
        />
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
              <Card style={{ width: "100%" }}>
                <Card.Body></Card.Body>
              </Card>
              <hr></hr>
            </>
          ))}
        </InfiniteScroll>
      </Row>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
});

export default connect(null, mapDispatchToProps)(Profile);

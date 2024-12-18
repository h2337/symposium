import React from "react";
import { useCookies } from "react-cookie";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LOGIN } from "../../redux/actionTypes";

function Profile(props) {
  const [cookies, setCookie] = useCookies([]);
  const { userID } = useParams();
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
  }, []);

  return <>hello + {userID}</>;
}

const mapDispatchToProps = (dispatch) => ({
  onLogin: (username, id, email, access, token) =>
    dispatch({ type: LOGIN, username, id, email, access, token }),
});

export default connect(null, mapDispatchToProps)(Profile);

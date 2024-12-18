import React from "react";
import { connect } from "react-redux";
import NewThread from "./NewThread";
import { LOGOUT } from "../redux/actionTypes";

function App(props) {
  let isLoggedIn = false;
  if (props.username.length > 0 && props.token.length > 0) {
    isLoggedIn = true;
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-2">
            {isLoggedIn && (
              <>
                <br></br>
                <NewThread></NewThread>
                <br></br>
              </>
            )}
            <br></br>
            <div>
              <a href="">
                <i
                  className="fa fa-circle"
                  style={{ color: "red", fontSize: 10 }}
                ></i>{" "}
                Music
              </a>
            </div>
            <div>
              <a href="">
                <i
                  className="fa fa-circle fa-xs"
                  style={{ color: "blue", fontSize: 10 }}
                ></i>{" "}
                Tech
              </a>
            </div>
          </div>
          <div className="col-10">
            <br></br>
            <div className="feed-thread-box">
              <h5 style={{ marginBottom: 0 }}>Thread title example</h5>
              <i
                className="fa fa-circle fa-xs"
                style={{ color: "blue", fontSize: 10 }}
              ></i>{" "}
              Tech
            </div>
            <hr></hr>
            <div
              className="feed-thread-box"
              onClick={(e) => console.log("Clicked")}
            >
              <h5 style={{ marginBottom: 0 }}>Another thread title example</h5>
              <i
                className="fa fa-circle fa-xs"
                style={{ color: "red", fontSize: 10 }}
              ></i>{" "}
              Music
            </div>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

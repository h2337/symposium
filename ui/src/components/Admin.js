import React from "react";
import { connect } from "react-redux";
import { LOGOUT } from "../redux/actionTypes";

function Admin(props) {
  return <div>shit</div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

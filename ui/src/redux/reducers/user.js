import { LOGIN, LOGOUT } from "../actionTypes";

const initialState = {
  username: "",
  token: "",
  userId: "",
  email: "",
  access: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        username: action.username,
        token: action.token,
        email: action.email,
        access: action.access,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        username: "",
        token: "",
        email: "",
        access: "",
      };
    }
    default:
      return state;
  }
}

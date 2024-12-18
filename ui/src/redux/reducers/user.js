import { LOGIN, LOGOUT } from "../actionTypes";

const initialState = {
  username: "",
  id: "",
  token: "",
  email: "",
  access: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        username: action.username,
        id: action.id,
        token: action.token,
        email: action.email,
        access: action.access,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        username: "",
        id: "",
        token: "",
        email: "",
        access: "",
      };
    }
    default:
      return state;
  }
}

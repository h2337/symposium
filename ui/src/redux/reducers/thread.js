import { OPEN_THREAD } from "../actionTypes";

const initialState = {
  currentThread: undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case OPEN_THREAD: {
      return {
        ...state,
        currentThread: action.thread,
      };
    }
    default:
      return state;
  }
}

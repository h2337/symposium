import { LOAD_CATEGORIES } from "../actionTypes";

const initialState = {
  categories: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CATEGORIES: {
      return {
        ...state,
        categories: action.categories,
      };
    }
    default:
      return state;
  }
}

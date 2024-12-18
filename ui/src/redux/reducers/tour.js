import {
  START_TOURING,
  STOP_TOURING,
  OPEN_TOUR,
  CLOSE_TOUR,
  TOUR_CHANGE_STEP,
} from "../actionTypes";

const initialState = {
  isTouring: false,
  isTourOpen: false,
  step: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_TOURING: {
      return {
        ...state,
        isTouring: true,
        isTourOpen: true,
      };
    }
    case STOP_TOURING: {
      return {
        ...state,
        isTouring: false,
      };
    }
    case OPEN_TOUR: {
      return {
        ...state,
        isTourOpen: true,
      };
    }
    case CLOSE_TOUR: {
      return {
        ...state,
        isTourOpen: false,
      };
    }
    case TOUR_CHANGE_STEP: {
      return {
        ...state,
        step: action.step,
      };
    }
    default:
      return state;
  }
}

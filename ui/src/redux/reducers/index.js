import { combineReducers } from "redux";
import user from "./user";
import category from "./category";
import thread from "./thread";
import tour from "./tour";

export default combineReducers({ user, category, thread, tour });

import { combineReducers } from "redux";
import user from "./user";
import category from "./category";
import thread from "./thread";

export default combineReducers({ user, category, thread });

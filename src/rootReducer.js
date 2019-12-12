import { combineReducers } from "redux";

import auth from "./modulesDuck/authDuck";
import feed from "./modulesDuck/feedDuck";
import tags from "./modulesDuck/tagsDuck";
import tuts from "./modulesDuck/tutsDuck";
import user from "./modulesDuck/userDuck";

export default (state, action) => {
  const rootReducer = combineReducers({ auth, feed, tags, tuts, user });
  return rootReducer(state, action);
};

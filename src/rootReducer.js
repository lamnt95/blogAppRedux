import { combineReducers } from "redux";

import auth from "./modulesDuck/authDuck";
import feed from "./modulesDuck/feedDuck";
import tags from "./modulesDuck/tagsDuck";
import tuts from "./modulesDuck/tutsDuck";
import user from "./modulesDuck/userDuck";
import actionDuck from "./modulesDuck/actionDuck";

export default (config = {}) => (state, action) => {
  const { isTest } = config;
  const duckTest = isTest ? { actionDuck } : {};
  const rootReducer = combineReducers({
    auth,
    feed,
    tags,
    tuts,
    user,
    ...duckTest
  });
  return rootReducer(state, action);
};

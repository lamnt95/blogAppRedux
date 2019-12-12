import _ from "lodash";
import { combineReducers } from "redux";
import { MODE_TEST_STORE } from "./constant";

import auth from "./modulesDuck/authDuck";
import feed from "./modulesDuck/feedDuck";
import tags from "./modulesDuck/tagsDuck";
import tuts from "./modulesDuck/tutsDuck";
import user from "./modulesDuck/userDuck";
import actionDuck from "./modulesDuck/actionDuck";

export default (config = {}) => (state, action) => {
  const { mode } = config;
  const duckTest = _.has(MODE_TEST_STORE, mode) ? { actionDuck } : {};
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

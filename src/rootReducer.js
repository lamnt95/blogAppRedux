import _ from "lodash";
import { combineReducers } from "redux";
import { MODE_TEST_STORE } from "./constant";

import auth from "./reducers/authDuck";
import feed from "./reducers/feedDuck";
import tags from "./reducers/tagsDuck";
import tuts from "./reducers/tutsDuck";
import user from "./reducers/userDuck";
import actionDuck from "./reducers/actionDuck";
import comment from "./reducers/commentDuck";

export default (config = {}) => (state, action) => {
  const { mode } = config;
  const duckTest = _.has(MODE_TEST_STORE, mode) ? { actionDuck } : {};
  const rootReducer = combineReducers({
    auth,
    feed,
    tags,
    tuts,
    user,
    comment,
    ...duckTest
  });
  return rootReducer(state, action);
};

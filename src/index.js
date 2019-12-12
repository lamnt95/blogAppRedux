import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";

import rootReducer from "./rootReducer";
import rootEpic from "./rootEpic";
import rootMiddleware from "./middlewares";

export default config => {
  const initState = {};

  const epicMiddleware = createEpicMiddleware();
  const enhances = [applyMiddleware(...rootMiddleware, epicMiddleware)];

  const store = createStore(rootReducer, initState, compose(...enhances));

  epicMiddleware.run(rootEpic);
  return store;
};

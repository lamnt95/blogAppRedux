import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";

import getRootReducer from "./rootReducer";
import rootEpic from "./rootEpic";
import getRootMiddleware from "./middlewares";

export default (config = {}) => {
  const { isTest } = config || {};
  const initState = {};

  const epicMiddleware = createEpicMiddleware();
  const enhances = [
    applyMiddleware(...getRootMiddleware({ isTest }), epicMiddleware)
  ];

  const store = createStore(
    getRootReducer({ isTest }),
    initState,
    compose(...enhances)
  );

  epicMiddleware.run(rootEpic);
  return store;
};

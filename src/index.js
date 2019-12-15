import "rxjs";
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";

import getRootReducer from "./rootReducer";
import rootEpic from "./rootEpic";
import getRootMiddleware from "./middlewares";

export default (config = {}) => {
  const { mode, initialState = {} } = config || {};
  const initState = { ...initialState };

  const epicMiddleware = createEpicMiddleware();
  const enhances = [
    applyMiddleware(...getRootMiddleware({ mode }), epicMiddleware)
  ];

  const store = createStore(
    getRootReducer({ mode }),
    initState,
    compose(...enhances)
  );

  epicMiddleware.run(rootEpic);
  return store;
};

import { MODE_TEST_STORE } from "../constant";
import {
  actions as actionDuckActions,
  types as actionDuckTypes
} from "../reducers/actionDuck";

const testMiddleware = (config = {}) => store => next => action => {
  const { mode } = config;
  const { type, payload } = action;

  if (type === actionDuckTypes.ADD_CURRENT_ACTION) {
    return next(action);
  }

  store.dispatch(
    actionDuckActions.addCurrentAction({
      currentAction: action,
      currentState: store.getState()
    })
  );

  if (mode === MODE_TEST_STORE.LOG) {
    console.log(" ");
    console.log("***** ACTION *****");
    console.log(`TYPE ${type}`);
    console.log("PAYLOAD");
    console.log(payload);
    console.log("NEXT STATE");
    console.log(store.getState());
    console.log(" ");
  }
  next(action);
};

export default testMiddleware;

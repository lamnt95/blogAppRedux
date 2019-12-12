import {
  actions as actionDuckActions,
  types as actionDuckTypes
} from "../modulesDuck/actionDuck";

const testMiddleware = store => next => action => {
  const { type } = action;

  if (type === actionDuckTypes.ADD_CURRENT_ACTION) {
    return next(action);
  }

  store.dispatch(
    actionDuckActions.addCurrentAction({
      currentAction: action,
      currentState: store.getState()
    })
  );

  // console.log(action.type);
  next(action);
};

export default testMiddleware;

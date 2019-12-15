import _ from "lodash";
import Immutable from "seamless-immutable";

export const types = {
  ADD_CURRENT_ACTION: "ACTION_DUCK/ADD_CURRENT_ACTION"
};

export const actions = {
  addCurrentAction: (payload, meta) => ({
    type: types.ADD_CURRENT_ACTION,
    payload,
    meta
  })
};

const getCurrentAction = state => _.get(state.actionDuck, "currentAction");

const getCurrentState = state => {
  const currentState = { ..._.get(state.actionDuck, "currentState") };
  delete currentState.actionDuck;
  return currentState;
};

const getNewState = state => {
  const newState = { ...state };
  delete newState.actionDuck;
  return newState;
};

export const selectors = {
  getCurrentAction,
  getCurrentState,
  getNewState
};

export const initialState = {
  currentAction: { type: "" },
  currentState: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_CURRENT_ACTION: {
      const { currentAction, currentState } = action.payload || {};
      return Immutable.from(state).merge({ currentAction, currentState });
    }

    default:
      return state;
  }
};

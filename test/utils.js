import { selectors as actionDuckSelectors } from "../src/reducers/actionDuck";

export const getStore = store => {
  const state = store.getState();
  const previusState = actionDuckSelectors.getCurrentState(state);
  const newState = actionDuckSelectors.getNewState(state);
  const action = actionDuckSelectors.getCurrentAction(state) || {};
  return { previusState, newState, ...action };
};

export default {};

import Immutable from "seamless-immutable";
import _ from "lodash";

export const types = {
  ADD_MANY_USER: "USER/ADD_MANY_USER"
};

export const actions = {
  addManyUser: (payload, meta) => ({
    type: types.ADD_MANY_USER,
    payload,
    meta
  })
};

const getUserDuckData = state => state.user;
const getUser = (state, username) => _.get(state, `user.${username}`);
export const selectors = {
  getUser,
  getUserDuckData
};

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MANY_USER: {
      const users = _.get(action, "payload.users");
      const usersKeyBy = _.keyBy(users, "username");
      const newState = Immutable.merge(state, usersKeyBy, { deep: true });
      return newState;
    }
    default:
      return state;
  }
};

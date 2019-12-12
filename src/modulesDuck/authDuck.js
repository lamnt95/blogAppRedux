import _ from "lodash";
import Immutable from "seamless-immutable";
import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";

import authServices from "../services/authServices";
import { Observable } from "rxjs";

export const types = {
  INIT_AUTH_START: "AUTH/INIT_AUTH_START",
  INIT_AUTH_SUCCESS: "AUTH/INIT_AUTH_SUCCESS",
  INIT_AUTH_FAIL: "AUTH/INIT_AUTH_FAIL",
  REGISTER_START: "AUTH/REGISTER_START",
  REGISTER_SUCCESS: "AUTH/REGISTER_SUCCESS",
  REGISTER_FAIL: "AUTH/REGISTER_FAIL",
  ADD_ACCESS_TOKEN: "AUTH/ADD_ACCESS_TOKEN",
  ADD_USER_NAME_LOGIN: "AUTH/ADD_USER_NAME_LOGIN"
};

export const actions = {
  initAuthStart: (payload, meta) => ({
    type: types.INIT_AUTH_START,
    payload,
    meta
  }),
  initAuthSuccess: (payload, meta) => ({
    type: types.INIT_AUTH_SUCCESS,
    payload,
    meta
  }),
  initAuthFail: (error, meta) => ({
    type: types.INIT_AUTH_FAIL,
    error,
    meta
  }),
  registerStart: (payload, meta) => ({
    type: types.REGISTER_START,
    payload,
    meta
  }),
  registerSuccess: (payload, meta) => ({
    type: types.REGISTER_SUCCESS,
    payload,
    meta
  }),
  registerFail: (error, meta) => ({
    type: types.REGISTER_FAIL,
    error,
    meta
  }),
  addAccessToken: (payload, meta) => ({
    type: types.ADD_ACCESS_TOKEN,
    payload,
    meta
  }),
  addUserNameLogin: (payload, meta) => ({
    type: types.ADD_USER_NAME_LOGIN,
    payload,
    meta
  })
};

const getAccessToken = state => _.get(state, "auth.accessToken");
const getUserNameLogin = state => _.get(state, "auth.username");
const checkIsGuest = state => getAccessToken(state) === undefined;

export const selectors = {
  checkIsGuest,
  getAccessToken,
  getUserNameLogin
};

export const initialState = {
  accessToken: undefined,
  username: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_ACCESS_TOKEN: {
      const accessToken = _.get(action, "payload.user.token");
      const newState = Immutable.setIn(state, ["accessToken"], accessToken);
      return newState;
    }
    case types.ADD_USER_NAME_LOGIN: {
      const username = _.get(action, "payload.user.username");
      const newState = Immutable.setIn(state, ["username"], username);
      return newState;
    }
    default: {
      return state;
    }
  }
};

const initAuthStartEpic = action$ =>
  action$.pipe(
    ofType(types.INIT_AUTH_START),
    switchMap(
      ({ meta }) =>
        new Promise(resolve => {
          authServices
            .login()
            .then(payload => {
              resolve(actions.initAuthSuccess(payload, meta));
            })
            .catch(error => {
              resolve(actions.initAuthFail(error, meta));
            });
        })
    )
  );

const initAuthSuccessEpic = action$ =>
  action$.pipe(
    ofType(types.INIT_AUTH_SUCCESS, types.REGISTER_SUCCESS),
    switchMap(
      ({ payload }) =>
        new Observable(observer => {
          observer.next(actions.addAccessToken(payload));
          observer.next(actions.addUserNameLogin(payload));
        })
    )
  );

const registerStartEpic = action$ =>
  action$.pipe(
    ofType(types.REGISTER_START),
    switchMap(
      ({ payload, meta }) =>
        new Promise(resolve => {
          authServices
            .register(payload)
            .then(res => {
              resolve(actions.registerSuccess(res, meta));
            })
            .catch(error => {
              resolve(actions.registerFail(error, meta));
            });
        })
    )
  );

export const epics = [
  initAuthStartEpic,
  initAuthSuccessEpic,
  registerStartEpic
];

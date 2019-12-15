import Immutable from "seamless-immutable";
import _ from "lodash";
import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";

import tagServices from "../services/tagServices";

export const types = {
  FETCH_TAGS_START: "TAGS/FETCH_TAGS_START",
  FETCH_TAGS_SUCCESS: "TAGS/FETCH_TAGS_SUCCESS",
  FETCH_TAGS_FAIL: "TAGS/FETCH_TAGS_FAIL",
  ADD_MANY_TAGS: "TAGS/ADD_MANY_TAGS"
};

export const actions = {
  fetchTagsStart: (payload, meta) => ({
    type: types.FETCH_TAGS_START,
    payload,
    meta
  }),
  fetchTagsSuccess: (payload, meta) => ({
    type: types.FETCH_TAGS_SUCCESS,
    payload,
    meta
  }),
  fetchTagssFail: (error, meta) => ({
    type: types.FETCH_TAGS_FAIL,
    error,
    meta
  }),
  addManyTags: (payload, meta) => ({
    type: types.ADD_MANY_TAGS,
    payload,
    meta
  })
};

const getTags = state => _.get(state, "tags");

export const selectors = { getTags };

const initialState = Immutable.from([]);

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MANY_TAGS: {
      const tags = _.get(action, "payload.tags");
      const newState = Immutable.from(tags);
      return newState;
    }
    default:
      return state;
  }
};

const fetchTagsStartEpic = action$ =>
  action$.pipe(
    ofType(types.FETCH_TAGS_START),
    switchMap(
      () =>
        new Promise(resolve => {
          tagServices
            .fetchTag()
            .then(tags => {
              resolve(actions.fetchTagsSuccess(tags));
            })
            .catch(error => {
              resolve(actions.fetchTagsFail(error));
            });
        })
    )
  );

const fetchTagsSuccessEpic = action$ =>
  action$.pipe(
    ofType(types.FETCH_TAGS_SUCCESS),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          resolve(actions.addManyTags(payload));
        })
    )
  );

export const epics = [fetchTagsStartEpic, fetchTagsSuccessEpic];

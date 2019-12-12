import Immutable from "seamless-immutable";
import _ from "lodash";
import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";

import { selectors as authSelectors } from "./authDuck";
import tutsServices from "../services/tutsServices";

export const types = {
  ADD_MANY_TUTS: "ADD_MANY_TUTS",
  LIKE_TUT_START: "LIKE_TUT_START",
  LIKE_TUT_SUCCESS: "LIKE_TUT_SUCCESS",
  LIKE_TUT_FAIL: "LIKE_TUT_FAIL",
  UN_LIKE_TUT_START: "UN_LIKE_TUT_START",
  UN_LIKE_TUT_SUCCESS: "UN_LIKE_TUT_SUCCESS",
  UN_LIKE_TUT_FAIL: "UN_LIKE_TUT_FAIL"
};

export const actions = {
  addManyTuts: (payload, meta) => ({
    type: types.ADD_MANY_TUTS,
    payload,
    meta
  }),
  likeTutStart: (payload, meta) => ({
    type: types.LIKE_TUT_START,
    payload,
    meta
  }),
  likeTutSuccess: (payload, meta) => ({
    type: types.LIKE_TUT_SUCCESS,
    payload,
    meta
  }),
  likeTutFail: (error, meta) => ({
    type: types.LIKE_TUT_FAIL,
    error,
    meta
  }),
  unLikeTutStart: (payload, meta) => ({
    type: types.UN_LIKE_TUT_START,
    payload,
    meta
  }),
  unLikeTutSuccess: (payload, meta) => ({
    type: types.UN_LIKE_TUT_SUCCESS,
    payload,
    meta
  }),
  unLikeTutFail: (error, meta) => ({
    type: types.UN_LIKE_TUT_FAIL,
    error,
    meta
  })
};

const getTuts = (state, id) => _.get(state, `tuts.${id}`);

const getTutsFavoritesCount = (state, id) =>
  _.get(state, `tuts.${id}.favoritesCount`);
const getTutsSlug = (state, id) => _.get(state, `tuts.${id}.slug`);
const getTutsFavorited = (state, id) => _.get(state, `tuts.${id}.favorited`);
const getTutsAuthor = (state, id) => _.get(state, `tuts.${id}.author.username`);

export const selectors = {
  getTuts,
  getTutsSlug,
  getTutsAuthor,
  getTutsFavorited,
  getTutsFavoritesCount
};

const initialState = Immutable.from({});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MANY_TUTS: {
      const tuts = _.get(action, "payload.tuts");
      const tutsKeyBy = _.keyBy(tuts, "id");
      const newState = Immutable.merge(state, tutsKeyBy, { deep: true });
      return newState;
    }
    case types.LIKE_TUT_START: {
      const tuts = _.get(action, "payload.tuts") || {};
      if (_.isEmpty(tuts)) return state;
      const { id } = tuts[0];
      const favoritesCount = _.get(state, `${id}.favoritesCount`) + 1;
      const newState = Immutable.setIn(state, [id], {
        ...state[id],
        favoritesCount,
        favorited: true
      });
      return newState;
    }
    case types.UN_LIKE_TUT_START: {
      const tuts = _.get(action, "payload.tuts") || {};
      if (_.isEmpty(tuts)) return state;
      const { id } = tuts[0];
      const favoritesCount = _.get(state, `${id}.favoritesCount`) - 1;
      const newState = Immutable.setIn(state, [id], {
        ...state[id],
        favoritesCount,
        favorited: false
      });
      return newState;
    }
    default:
      return state;
  }
};

const likeTutStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.LIKE_TUT_START),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          const state = store.value;
          const { tuts } = payload;
          const { id } = tuts[0];
          const accessToken = authSelectors.getAccessToken(state);
          const slug = tutsSelectors.getTutsSlug(state, id);
          tutsServices
            .likeTut(accessToken, slug)
            .then(tuts => {
              resolve(actions.likeTutSuccess(tuts));
            })
            .catch(error => {
              resolve(actions.likeTutFail(error));
            });
        })
    )
  );

const unLikeTutStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.UN_LIKE_TUT_START),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          const state = store.value;
          const { tuts } = payload;
          const { id } = tuts[0];
          const accessToken = authSelectors.getAccessToken(state);
          const slug = tutsSelectors.getTutsSlug(state, id);
          tutsServices
            .unLikeTut(accessToken, slug)
            .then(tuts => {
              resolve(actions.unLikeTutSuccess(tuts));
            })
            .catch(error => {
              resolve(actions.unLikeTutFail(error));
            });
        })
    )
  );

export const epics = [likeTutStartEpic, unLikeTutStartEpic];

import Immutable from "seamless-immutable";
import _ from "lodash";
import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";

import { selectors as authSelectors } from "./authDuck";
import tutsServices from "../services/tutsServices";

const filterDataTuts = tuts =>
  tuts.map(
    ({
      title,
      body,
      updatedAt,
      description,
      favorited,
      favoritesCount,
      id,
      slug,
      author,
      tagList
    }) => ({
      title,
      body,
      updatedAt,
      description,
      favorited,
      favoritesCount,
      id,
      slug,
      tagList,
      author: { username: author.username }
    })
  );

export const types = {
  ADD_MANY_TUTS: "TUTS/ADD_MANY_TUTS",
  LIKE_TUT_START: "TUTS/LIKE_TUT_START",
  LIKE_TUT_SUCCESS: "TUTS/LIKE_TUT_SUCCESS",
  LIKE_TUT_FAIL: "TUTS/LIKE_TUT_FAIL",
  UN_LIKE_TUT_START: "TUTS/UN_LIKE_TUT_START",
  UN_LIKE_TUT_SUCCESS: "TUTS/UN_LIKE_TUT_SUCCESS",
  UN_LIKE_TUT_FAIL: "TUTS/UN_LIKE_TUT_FAIL",
  GET_ONE_TUT_START: "TUTS/GET_ONE_TUT_START",
  GET_ONE_TUT_SUCCESS: "TUTS/GET_ONE_TUT_SUCCESS",
  GET_ONE_TUT_FAIL: "TUTS/GET_ONE_TUT_FAIL"
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
  }),
  getOneTutStart: (payload, meta) => ({
    type: types.GET_ONE_TUT_START,
    payload,
    meta
  }),
  getOneTutSuccess: (payload, meta) => ({
    type: types.GET_ONE_TUT_SUCCESS,
    payload,
    meta
  }),
  getOneTutFail: (error, meta) => ({
    type: types.GET_ONE_TUT_FAIL,
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
const getTutsDuckData = state => state.tuts;

export const selectors = {
  getTuts,
  getTutsSlug,
  getTutsAuthor,
  getTutsFavorited,
  getTutsFavoritesCount,
  getTutsDuckData
};

const initialState = Immutable.from({});

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MANY_TUTS: {
      const tuts = filterDataTuts(_.get(action, "payload.tuts"));
      const tutsKeyBy = _.keyBy(tuts, "id");
      const newState = Immutable.merge(state, tutsKeyBy, { deep: true });
      return newState;
    }
    case types.LIKE_TUT_START: {
      const tuts = _.get(action, "payload.tuts") || [];
      if (_.isEmpty(tuts)) return state;
      const { id } = _.head(tuts);
      const favoritesCount = _.get(state, `${id}.favoritesCount`) + 1;
      const newState = Immutable.setIn(state, [id], {
        ...state[id],
        favoritesCount,
        favorited: true
      });
      return newState;
    }
    case types.UN_LIKE_TUT_START: {
      const tuts = _.get(action, "payload.tuts") || [];
      if (_.isEmpty(tuts)) return state;
      const { id } = _.head(tuts) || {};
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
          const { id } = _.head(tuts) || {};
          const accessToken = authSelectors.getAccessToken(state);
          const slug = selectors.getTutsSlug(state, id);
          tutsServices
            .likeTut(accessToken, slug)
            .then(res => {
              resolve(actions.likeTutSuccess(res));
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
          const { tuts } = payload.tuts;
          const { id } = _.head(tuts) || {};
          const accessToken = authSelectors.getAccessToken(state);
          const slug = selectors.getTutsSlug(state, id);
          tutsServices
            .unLikeTut(accessToken, slug)
            .then(res => {
              resolve(actions.unLikeTutSuccess(res));
            })
            .catch(error => {
              resolve(actions.unLikeTutFail(error));
            });
        })
    )
  );

const getOneTutStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.GET_ONE_TUT_START),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          const state = store.value;
          const accessToken = authSelectors.getAccessToken(state);
          const { tuts } = payload;
          const { id } = _.head(tuts) || {};
          const slug = selectors.getTutsSlug(state, id);

          tutsServices
            .getOneTut(accessToken, slug)
            .then(tut => resolve(actions.getOneTutSuccess({ tuts: [tut] })))
            .catch(error => resolve(actions.getOneTutFail(error)));
        })
    )
  );

const addManyTutsEpic = action$ =>
  action$.pipe(
    ofType(types.GET_ONE_TUT_SUCCESS),
    switchMap(({ payload }) => Promise.resolve(actions.addManyTuts(payload)))
  );

export const epics = [
  likeTutStartEpic,
  unLikeTutStartEpic,
  getOneTutStartEpic,
  addManyTutsEpic
];

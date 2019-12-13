import Immutable from "seamless-immutable";
import _ from "lodash";
import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";

import { selectors as authSelectors } from "./authDuck";
import commentServices from "../services/commentServices";

export const types = {
  CREATE_COMMENT_START: "COMMENT/CREATE_COMMENT_START",
  CREATE_COMMENT_SUCCESS: "COMMENT/CREATE_COMMENT_SUCCESS",
  CREATE_COMMENT_FAIL: "COMMENT/CREATE_COMMENT_FAIL",
  GET_COMMENT_START: "COMMENT/GET_COMMENT_START",
  GET_COMMENT_SUCCESS: "COMMENT/GET_COMMENT_SUCCESS",
  GET_COMMENT_FAIL: "COMMENT/GET_COMMENT_FAIL",
  DELETE_COMMENT_START: "COMMENT/DELETE_COMMENT_START",
  DELETE_COMMENT_SUCCESS: "COMMENT/DELETE_COMMENT_SUCCESS",
  DELETE_COMMENT_FAIL: "COMMENT/DELETE_COMMENT_FAIL",
  ADD_MANY_COMMENT: "COMMENT/ADD_MANY_COMMENT",
  REMOVE_MANY_COMMENT: "COMMENT/REMOVE_MANY_COMMENT"
};

export const actions = {
  addManyComment: (payload, meta) => ({
    type: types.ADD_MANY_COMMENT,
    payload,
    meta
  }),
  removeManyComment: (payload, meta) => ({
    type: types.REMOVE_MANY_COMMENT,
    payload,
    meta
  }),
  createCommentStart: (payload, meta) => ({
    type: types.CREATE_COMMENT_START,
    payload,
    meta
  }),
  createCommentSuccess: (payload, meta) => ({
    type: types.CREATE_COMMENT_SUCCESS,
    payload,
    meta
  }),
  createCommentFail: (error, meta) => ({
    type: types.CREATE_COMMENT_FAIL,
    error,
    meta
  }),
  getCommentStart: (payload, meta) => ({
    type: types.GET_COMMENT_START,
    payload,
    meta
  }),
  getCommentSuccess: (payload, meta) => ({
    type: types.GET_COMMENT_SUCCESS,
    payload,
    meta
  }),
  getCommentFail: (error, meta) => ({
    type: types.GET_COMMENT_FAIL,
    error,
    meta
  }),
  deleteCommentStart: (payload, meta) => ({
    type: types.DELETE_COMMENT_START,
    payload,
    meta
  }),
  deleteCommentSuccess: (payload, meta) => ({
    type: types.DELETE_COMMENT_SUCCESS,
    payload,
    meta
  }),
  deleteCommentFail: (error, meta) => ({
    type: types.DELETE_COMMENT_FAIL,
    error,
    meta
  })
};

const getCommentDuckData = state => state.comment;
export const selectors = { getCommentDuckData };

export const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MANY_COMMENT: {
      const { tutId, commentsData } = action.payload;
      const commentsDataKeyBy = _.keyBy(commentsData, "id");
      const currentCommentsData = state[tutId] || {};
      const newCommentsData = Immutable.merge(
        currentCommentsData,
        commentsDataKeyBy,
        {
          deep: true
        }
      );
      return Immutable.setIn(state, [tutId], newCommentsData);
    }

    case types.REMOVE_MANY_COMMENT: {
      const { tutId, commentsData } = action.payload;
      const currentState = { ...state };
      _.forEach(commentsData, ({ id }) => {
        if (_.has(state, tutId)) {
          delete currentState[tutId][id];
        }
      });
      return Immutable.from(currentState);
    }

    default:
      return state;
  }
};

const getCommentStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.GET_COMMENT_START),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          const state = store.value;
          const accessToken = authSelectors.getAccessToken(state);
          const { tuts } = payload;
          const { id: tutId, slug } = tuts || {};

          commentServices
            .getComments(accessToken, slug)
            .then(commentsData =>
              resolve(actions.getCommentSuccess({ tutId, commentsData }))
            )
            .catch(error => resolve(actions.getCommentFail(error)));
        })
    )
  );

const createCommentStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.CREATE_COMMENT_START),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          const state = store.value;
          const accessToken = authSelectors.getAccessToken(state);
          const { tuts } = payload;
          const { id: tutId, slug } = tuts || {};

          commentServices
            .createComment(accessToken, slug)
            .then(commentsData =>
              resolve(actions.createCommentSuccess({ tutId, commentsData }))
            )
            .catch(error => resolve(actions.createCommentFail(error)));
        })
    )
  );

const deleteCommentStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.DELETE_COMMENT_START),
    switchMap(
      ({ payload }) =>
        new Promise(resolve => {
          const state = store.value;
          const accessToken = authSelectors.getAccessToken(state);
          const { tuts, comments } = payload;
          const { id: tutId, slug } = tuts || {};
          const { id: idComment } = _.head(comments);

          commentServices
            .deleteComment(accessToken, slug, idComment)
            .then(() =>
              resolve(
                actions.deleteCommentSuccess({
                  tutId,
                  commentsData: [{ id: idComment }]
                })
              )
            )
            .catch(error => resolve(actions.deleteCommentFail(error)));
        })
    )
  );

const addManyCommentEpic = action$ =>
  action$.pipe(
    ofType(types.GET_COMMENT_SUCCESS, types.CREATE_COMMENT_SUCCESS),
    switchMap(({ payload }) => Promise.resolve(actions.addManyComment(payload)))
  );

const removeManyCommentEpic = action$ =>
  action$.pipe(
    ofType(types.DELETE_COMMENT_SUCCESS),
    switchMap(({ payload }) =>
      Promise.resolve(actions.removeManyComment(payload))
    )
  );

export const epics = [
  getCommentStartEpic,
  addManyCommentEpic,
  createCommentStartEpic,
  deleteCommentStartEpic,
  removeManyCommentEpic
];

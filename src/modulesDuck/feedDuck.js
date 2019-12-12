import Immutable from "seamless-immutable";
import _ from "lodash";
import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";

import { selectors as authSelectors } from "./authDuck";
import feedServices from "../services/feedServices";

export const types = {
  FETCH_FEED_START: "FEED/FETCH_FEED_START",
  FETCH_FEED_SUCCESS: "FEED/FETCH_FEED_SUCCESS",
  FETCH_FEED_FAIL: "FEED/FETCH_FEED_FAIL",
  ADD_MANY_COMMON_FEED: "FEED/ADD_MANY_COMMON_FEED"
};

export const actions = {
  fetchFeedStart: (payload, meta) => ({
    type: types.FETCH_FEED_START,
    payload,
    meta
  }),
  fetchFeedSuccess: (payload, meta) => ({
    type: types.FETCH_FEED_SUCCESS,
    payload,
    meta
  }),
  fetchFeedFail: (error, meta) => ({
    type: types.FETCH_FEED_FAIL,
    error,
    meta
  }),
  addManyCommonFeed: (payload, meta) => ({
    type: types.ADD_MANY_COMMON_FEED,
    payload,
    meta
  })
};

const getFeed = state => _.get(state, "feed.common");
const getFeedDuckData = state => state.feed;
export const selectors = { getFeed, getFeedDuckData };

export const initialState = Immutable.from({ common: [] });

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MANY_COMMON_FEED: {
      const feeds = _.get(action, "payload.articles");
      const feedsID = feeds.map(({ id }) => id);
      const newState = Immutable.setIn(state, ["common"], feedsID);
      return newState;
    }

    default: {
      return state;
    }
  }
};

const fetchFeedStartEpic = (action$, store) =>
  action$.pipe(
    ofType(types.FETCH_FEED_START),
    switchMap(
      () =>
        new Promise(resolve => {
          const state = store.value;
          const accessToken = authSelectors.getAccessToken(state);
          feedServices
            .fetchFeed(accessToken)
            .then(feeds => {
              resolve(actions.fetchFeedSuccess(feeds));
            })
            .catch(error => {
              resolve(actions.fetchFeedFail(error));
            });
        })
    )
  );

const fetchFeedSuccessEpic = action$ =>
  action$.pipe(
    ofType(types.FETCH_FEED_SUCCESS),
    switchMap(({ payload }) =>
      Promise.resolve(actions.addManyCommonFeed(payload))
    )
  );

export const epics = [fetchFeedStartEpic, fetchFeedSuccessEpic];

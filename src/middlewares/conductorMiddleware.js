import _ from "lodash";

import { types as feedTypes } from "../modulesDuck/feedDuck";
import {
  actions as tutsActions,
  types as tutsType
} from "../modulesDuck/tutsDuck";
import { actions as userActions } from "../modulesDuck/userDuck";
import { types as authTypes } from "../modulesDuck/authDuck";

const convertFeedToTutsPayload = tuts => ({ tuts });

const convertFeedToUserPayload = articlesData => ({
  users: articlesData.map(({ author }) => ({
    ...author
  }))
});

const convertTutsToUserPayload = tutPayload => {
  const { tuts } = tutPayload;
  return { users: tuts.map(({ author }) => ({ ...author })) };
};

function convertAuthToUserPayload(payload) {
  const { user } = payload;
  const { username, bio, image, email } = user || {};
  if (_.isEmpty(username)) return { users: [{}] };
  return { users: [{ username, bio, image, email }] };
}

const conductorMiddleware = store => next => action => {
  switch (action.type) {
    case feedTypes.FETCH_FEED_SUCCESS: {
      const { articles } = action.payload || {};
      const tutsPayload = convertFeedToTutsPayload(articles);
      const userPayload = convertFeedToUserPayload(articles);
      store.dispatch(tutsActions.addManyTuts(tutsPayload));
      store.dispatch(userActions.addManyUser(userPayload));
      break;
    }

    case authTypes.REGISTER_SUCCESS:
    case authTypes.INIT_AUTH_SUCCESS: {
      const usersPayload = convertAuthToUserPayload(action.payload);
      store.dispatch(userActions.addManyUser(usersPayload));
      break;
    }

    case tutsType.UPDATE_TUT_SUCCESS:
    case tutsType.CREATE_TUT_SUCCESS:
    case tutsType.GET_ONE_TUT_SUCCESS: {
      const userPayload = convertTutsToUserPayload(action.payload);
      store.dispatch(userActions.addManyUser(userPayload));
      break;
    }

    default:
      break;
  }

  next(action);
};

export default conductorMiddleware;

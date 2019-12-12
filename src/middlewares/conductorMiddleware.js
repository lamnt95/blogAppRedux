import _ from "lodash";

import { types as feedTypes } from "../modulesDuck/feedDuck";
import { actions as tutsActions } from "../modulesDuck/tutsDuck";
import { actions as userActions } from "../modulesDuck/userDuck";
import { types as authTypes } from "../modulesDuck/authDuck";

const getTutsPayload = articlesData => ({
  tuts: articlesData.map(
    ({
      title,
      body,
      updatedAt,
      description,
      favorited,
      favoritesCount,
      id,
      slug,
      author
    }) => ({
      title,
      body,
      updatedAt,
      description,
      favorited,
      favoritesCount,
      id,
      slug,
      author: { username: author.username }
    })
  )
});

const getUserPayload = articlesData => ({
  users: articlesData.map(({ author }) => ({
    ...author
  }))
});

function getUserPayloadLoginSuccess(payload) {
  const { user } = payload;
  const { username, bio, image, email } = user || {};
  if (_.isEmpty(username)) return { users: [{}] };
  return { users: [{ username, bio, image, email }] };
}

const conductorMiddleware = store => next => action => {
  switch (action.type) {
    case feedTypes.FETCH_FEED_SUCCESS: {
      const { articles } = action.payload || {};
      const tutsPayload = getTutsPayload(articles);
      const userPayload = getUserPayload(articles);
      ``;
      store.dispatch(tutsActions.addManyTuts(tutsPayload));
      store.dispatch(userActions.addManyUser(userPayload));
      break;
    }

    case authTypes.REGISTER_SUCCESS:
    case authTypes.INIT_AUTH_SUCCESS: {
      const usersPayload = getUserPayloadLoginSuccess(action.payload);
      store.dispatch(userActions.addManyUser(usersPayload));
      break;
    }

    default:
      break;
  }

  next(action);
};

export default conductorMiddleware;

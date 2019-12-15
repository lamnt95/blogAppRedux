import _ from "lodash";
import createStore from "../../src";
import {
  actions as feedActions,
  types as feedTypes,
  selectors as feedSelectors
} from "../../src/reducers/feedDuck";
import { selectors as userSelectors } from "../../src/reducers/userDuck";
import { selectors as tutsSelectors } from "../../src/reducers/tutsDuck";
import feedServices from "../../src/services/feedServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe(feedTypes.FETCH_FEED_START, () => {
  it("flow", () => {
    jest.mock("../../src/services/feedServices");
    feedServices.fetchFeed = jest.fn().mockImplementation(() =>
      Promise.resolve({
        articles: [
          {
            id: "abcd1234",
            slug: "how-to-train-your-dragon",
            title: "How to train your dragon",
            description: "Ever wonder how?",
            body: "It takes a Jacobian",
            tagList: ["dragons", "training"],
            createdAt: "2016-02-18T03:22:56.637Z",
            updatedAt: "2016-02-18T03:48:35.824Z",
            favorited: false,
            favoritesCount: 0,
            author: {
              username: "jake",
              bio: "I work at statefarm",
              image: "https://i.stack.imgur.com/xHWG8.jpg",
              following: false
            }
          }
        ],
        articlesCount: 1
      })
    );

    const expectFeedDuckState = { common: ["abcd1234"] };
    const expectTutsDuckState = {
      abcd1234: {
        id: "abcd1234",
        slug: "how-to-train-your-dragon",
        title: "How to train your dragon",
        description: "Ever wonder how?",
        body: "It takes a Jacobian",
        tagList: ["dragons", "training"],
        updatedAt: "2016-02-18T03:48:35.824Z",
        favorited: false,
        favoritesCount: 0,
        author: {
          username: "jake"
        }
      }
    };
    const expectUserDuckState = {
      jake: {
        username: "jake",
        bio: "I work at statefarm",
        image: "https://i.stack.imgur.com/xHWG8.jpg",
        following: false
      }
    };

    const store = createStore({ mode: MODE_TEST_STORE.TEST });
    store.subscribe(() => {
      const { previusState, newState, type } = getStore(store);
      if (
        !_.isEqual(previusState, newState) &&
        type === feedTypes.ADD_MANY_COMMON_FEED
      ) {
        expect(feedSelectors.getFeedDuckData(newState)).toEqual(
          expectFeedDuckState
        );
        expect(tutsSelectors.getTutsDuckData(newState)).toEqual(
          expectTutsDuckState
        );
        expect(userSelectors.getUserDuckData(newState)).toEqual(
          expectUserDuckState
        );
      }
    });
    store.dispatch(feedActions.fetchFeedStart());
  });
});

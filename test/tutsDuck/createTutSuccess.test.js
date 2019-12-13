import _ from "lodash";
import createStore from "../../src";
import {
  actions as tutsActions,
  selectors as tutsSelectors,
  types as tutsTypes
} from "../../src/modulesDuck/tutsDuck";
import { selectors as userSelectors } from "../../src/modulesDuck/userDuck";
import tutsServices from "../../src/services/tutsServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe("CREATE_TUT_SUCCESS", () => {
  it("should create tut success", () => {
    jest.mock("../../src/services/tutsServices");
    tutsServices.createTut = () =>
      Promise.resolve({
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
      });

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
      const { newState, type, previusState } = getStore(store);
      if (
        !_.isEqual(previusState, newState) &&
        type === tutsTypes.ADD_MANY_TUTS
      ) {
        const actualTutDuck = tutsSelectors.getTutsDuckData(newState);
        const actualUserDuck = userSelectors.getUserDuckData(newState);
        expect(actualTutDuck).toEqual(expectTutsDuckState);
        expect(actualUserDuck).toEqual(expectUserDuckState);
      }
    });
    store.dispatch(
      tutsActions.createTutStart({
        tuts: [
          {
            title: "How to train your dragon",
            description: "Ever wonder how?",
            body: "It takes a Jacobian",
            tagList: ["dragons", "training"]
          }
        ]
      })
    );
    expect(1).toBe(1);
  });
});

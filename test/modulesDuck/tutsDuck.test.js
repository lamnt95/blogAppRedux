import _ from "lodash";
import createStore from "../../src";
import {
  actions as tutsActions,
  selectors as tutsSelectors,
  types as tutsTypes
} from "../../src/modulesDuck/tutsDuck";
import tutsServices from "../../src/services/tutsServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe("tutsDuck", () => {
  describe("LIKE_TUT_START", () => {
    it("right", () => {
      jest.mock("../../src/services/tutsServices");
      tutsServices.likeTut = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: "abcd1234",
          favoritesCount: 2,
          slug: "tut-abcd-1234"
        })
      );

      const initialState = {
        tuts: {
          abcd1234: { id: "abcd1234", favoritesCount: 1, slug: "tut-abcd-1234" }
        }
      };

      const expectTutsDuckState = {
        abcd1234: {
          id: "abcd1234",
          favoritesCount: 2,
          slug: "tut-abcd-1234",
          favorited: true
        }
      };

      const store = createStore({ mode: MODE_TEST_STORE.TEST, initialState });
      store.subscribe(() => {
        const { newState, type } = getStore(store);
        if (type === tutsTypes.LIKE_TUT_SUCCESS) {
          const actualTutDuck = tutsSelectors.getTutsDuckData(newState);
          expect(actualTutDuck).toEqual(expectTutsDuckState);
        }
      });
      store.dispatch(tutsActions.likeTutStart({ tuts: [{ id: "abcd1234" }] }));
    });
  });

  describe("UN_LIKE_TUT_START", () => {
    it("right", () => {
      jest.mock("../../src/services/tutsServices");
      tutsServices.unLikeTut = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: "abcd1234",
          favoritesCount: 9,
          slug: "tut-abcd-1234"
        })
      );

      const initialState = {
        tuts: {
          abcd1234: {
            id: "abcd1234",
            favoritesCount: 10,
            slug: "tut-abcd-1234",
            favorited: true
          }
        }
      };

      const expectTutsDuckState = {
        abcd1234: {
          id: "abcd1234",
          favoritesCount: 9,
          slug: "tut-abcd-1234",
          favorited: false
        }
      };

      const store = createStore({ mode: MODE_TEST_STORE.TEST, initialState });
      store.subscribe(() => {
        const { newState, type } = getStore(store);
        if (type === tutsTypes.UN_LIKE_TUT_SUCCESS) {
          const actualTutDuck = tutsSelectors.getTutsDuckData(newState);
          expect(actualTutDuck).toEqual(expectTutsDuckState);
        }
      });
      store.dispatch(
        tutsActions.unLikeTutStart({ tuts: [{ id: "abcd1234" }] })
      );
    });
  });

  describe("GET_ONE_TUT_START", () => {
    it("right", () => {
      jest.mock("../../src/services/tutsServices");
      tutsServices.getOneTut = jest.fn().mockImplementation(() =>
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
        })
      );

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

      const store = createStore({ mode: MODE_TEST_STORE.TEST });
      store.subscribe(() => {
        const { newState, type, previusState } = getStore(store);
        if (
          !_.isEqual(previusState, newState) &&
          type === tutsTypes.ADD_MANY_TUTS
        ) {
          const actualTutDuck = tutsSelectors.getTutsDuckData(newState);
          expect(actualTutDuck).toEqual(expectTutsDuckState);
        }
      });
      store.dispatch(
        tutsActions.getOneTutStart({ tuts: [{ id: "abcd1234" }] })
      );
    });
  });
});

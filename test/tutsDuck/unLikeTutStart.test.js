import _ from "lodash";
import createStore from "../../src";
import {
  actions as tutsActions,
  selectors as tutsSelectors,
  types as tutsTypes
} from "../../src/reducers/tutsDuck";
import tutsServices from "../../src/services/tutsServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe(tutsTypes.UN_LIKE_TUT_START, () => {
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
    store.dispatch(tutsActions.unLikeTutStart({ tuts: [{ id: "abcd1234" }] }));
  });
});

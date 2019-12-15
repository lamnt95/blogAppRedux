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

describe(tutsTypes.LIKE_TUT_START, () => {
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

import _ from "lodash";
import createStore from "../../src";
import {
  actions as tutsActions,
  selectors as tutsSelectors,
  types as tutsTypes
} from "../../src/modulesDuck/tutsDuck";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe("REMOVE_MANY_TUTS", () => {
  it("should remove many tut success", () => {
    const initialState = {
      tuts: {
        tutId1: {
          id: "tutId1",
          slug: "slug-1",
          title: "title-1"
        },
        tutId2: {
          id: "tutId2",
          slug: "slug-2",
          title: "title-2"
        },
        tutId3: {
          id: "tutId3",
          slug: "slug-3",
          title: "title-3"
        },
        tutId4: {
          id: "tutId4",
          slug: "slug-4",
          title: "title-4"
        },
        tutId5: {
          id: "tutId5",
          slug: "slug-5",
          title: "title-5"
        }
      }
    };
    const expectTutsDuckState = {
      tutId2: {
        id: "tutId2",
        slug: "slug-2",
        title: "title-2"
      },
      tutId5: {
        id: "tutId5",
        slug: "slug-5",
        title: "title-5"
      }
    };

    const store = createStore({ mode: MODE_TEST_STORE.TEST, initialState });
    store.subscribe(() => {
      const { newState, type, previusState } = getStore(store);
      if (
        !_.isEqual(previusState, newState) &&
        type === tutsTypes.REMOVE_MANY_TUTS
      ) {
        const actualTutDuck = tutsSelectors.getTutsDuckData(newState);
        expect(actualTutDuck).toEqual(expectTutsDuckState);
      }
    });
    store.dispatch(
      tutsActions.removeManyTuts({
        tuts: [
          {
            id: "tutId1"
          },
          { id: "tutId3" },
          { id: "tutId4" }
        ]
      })
    );
  });
});

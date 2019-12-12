import _ from "lodash";
import createStore from "../../src";
import {
  actions as tagsActions,
  types as tagsTypes,
  selectors as tagsSelectors
} from "../../src/modulesDuck/tagsDuck";
import { MODE_TEST_STORE } from "../../src/constant";
import tagsServices from "../../src/services/tagServices";
import { getStore } from "../utils";
import { exportAllDeclaration } from "@babel/types";

describe("tagsDuck", () => {
  describe("FETCH_TAGS_START", () => {
    it("flow", () => {
      jest.mock("../../src/services/tagServices");
      tagsServices.fetchTag = jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ tags: ["react", "angular", "vue", "reactNative"] })
        );
      const expectTagsDuckState = ["react", "angular", "vue", "reactNative"];
      const store = createStore({ mode: MODE_TEST_STORE.TEST });
      store.subscribe(() => {
        const { previusState, newState, type } = getStore(store);
        if (!_.isEqual(previusState, newState)) {
          const actualState = tagsSelectors.getTags(newState);
          expect(actualState).toEqual(expectTagsDuckState);
        }
      });
      store.dispatch(tagsActions.fetchTagsStart());
    });
  });
});

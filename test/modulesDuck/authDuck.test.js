import _ from "lodash";
import createStore from "../../src";
import {
  actions as authActions,
  types as authTypes
} from "../../src/modulesDuck/authDuck";
import { selectors as actionDuckSelectors } from "../../src/modulesDuck/actionDuck";
import authServices from "../../src/services/authServices";
import { MODE_TEST_STORE } from "../../src/constant";

describe("authduck", () => {
  describe("INIT_AUTH_START", () => {
    it("test", () => {
      jest.mock("../../src/services/authServices");
      authServices.login = jest.fn().mockImplementation(() =>
        Promise.resolve({
          user: {
            token: "1234",
            username: "john",
            bio: "bio",
            image: "image",
            email: "email"
          }
        })
      );
      const expectState = {
        auth: { accessToken: "1234", username: "john" },
        feed: { common: [] },
        tags: [],
        tuts: {},
        user: {
          john: { username: "john", bio: "bio", image: "image", email: "email" }
        }
      };
      const store = createStore({ mode: MODE_TEST_STORE.LOG });
      store.subscribe(() => {
        const state = store.getState();
        const previusState = actionDuckSelectors.getCurrentState(state);
        const newState = actionDuckSelectors.getNewState(state);
        const { type: lastType } =
          actionDuckSelectors.getCurrentAction(state) || {};
        if (
          !_.isEqual(previusState, newState) &&
          lastType === authTypes.ADD_USER_NAME_LOGIN
        ) {
          expect(expectState).toEqual(newState);
        }
      });
      store.dispatch(authActions.initAuthStart());
    });
  });
});

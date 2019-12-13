import _ from "lodash";
import createStore from "../../src";
import {
  actions as authActions,
  types as authTypes
} from "../../src/modulesDuck/authDuck";
import { selectors as userSelectors } from "../../src/modulesDuck/userDuck";
import authServices from "../../src/services/authServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe(authTypes.REGISTER_START, () => {
  it("flow", () => {
    jest.mock("../../src/services/authServices");
    authServices.register = jest.fn().mockImplementation(() =>
      Promise.resolve({
        user: {
          token: "abcd1234",
          username: "johnny",
          bio: "bio",
          image: "image",
          email: "john@gmail.vn"
        }
      })
    );

    const expectAuthDuckState = { accessToken: "abcd1234", username: "johnny" };
    const expectUserDuckState = {
      johnny: {
        username: "johnny",
        bio: "bio",
        image: "image",
        email: "john@gmail.vn"
      }
    };

    const store = createStore({ mode: MODE_TEST_STORE.TEST });
    store.subscribe(() => {
      const { previusState, newState, type } = getStore(store);
      if (
        !_.isEqual(previusState, newState) &&
        type === authTypes.ADD_USER_NAME_LOGIN
      ) {
        const actualAuthDuck = authSelectors.getAuthDuckData(newState);
        const actualUserDuck = userSelectors.getUserDuckData(newState);
        expect(actualAuthDuck).toEqual(expectAuthDuckState);
        expect(actualUserDuck).toEqual(expectUserDuckState);
      }
    });
    store.dispatch(
      authActions.registerStart({
        username: "johnny",
        email: "john@gmail.vn",
        password: "*****"
      })
    );
  });
});

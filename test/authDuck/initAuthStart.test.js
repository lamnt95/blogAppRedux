import _ from "lodash";
import createStore from "../../src";
import {
  actions as authActions,
  types as authTypes
} from "../../src/modulesDuck/authDuck";
import authServices from "../../src/services/authServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe(authTypes.INIT_AUTH_START, () => {
  it("flow", () => {
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
    const store = createStore({ mode: MODE_TEST_STORE.TEST });
    store.subscribe(() => {
      const { previusState, newState, type } = getStore(store);
      if (
        !_.isEqual(previusState, newState) &&
        type === authTypes.ADD_USER_NAME_LOGIN
      ) {
        expect(expectState).toEqual(newState);
      }
    });
    store.dispatch(authActions.initAuthStart());
  });
});

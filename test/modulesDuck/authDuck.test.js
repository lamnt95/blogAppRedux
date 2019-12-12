import createStore from "../../src";
import { actions as authActions } from "../../src/modulesDuck/authDuck";
import authServices from "../../src/services/authServices";

describe("authduck", () => {
  describe("INIT_AUTH_START", () => {
    it("test", () => {
      jest.mock("../../src/services/authServices");
      authServices.login = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ user: { token: "1234" } }));

      const store = createStore();
      store.dispatch(authActions.initAuthStart());
      store.subscribe(() => {
        console.log(store.getState());
      });
      expect(1).toBe(1);
    });
  });
});

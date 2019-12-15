import _ from "lodash";
import createStore from "../../src";
import {
  actions as userActions,
  types as userTypes,
  selectors as userSelectors
} from "../../src/reducers/userDuck";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe(userTypes.ADD_MANY_USER, () => {
  it("reducer", () => {
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
        type === userTypes.ADD_MANY_USER
      ) {
        const actualState = userSelectors.getUserDuckData(newState);
        expect(actualState).toEqual(expectUserDuckState);
      }
    });
    store.dispatch(
      userActions.addManyUser({
        users: [
          {
            username: "johnny",
            bio: "bio",
            image: "image",
            email: "john@gmail.vn"
          }
        ]
      })
    );
  });
});

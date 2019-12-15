import _ from "lodash";
import createStore from "../../src";
import {
  actions as commentActions,
  selectors as commentSelectors,
  types as commentTypes
} from "../../src/reducers/commentDuck";
import commentServices from "../../src/services/commentServices";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe("GET_COMMENT_SUCCESS", () => {
  it("get comment success", () => {
    jest.mock("../../src/services/authServices");
    commentServices.getComments = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "commentId1",
          body: "It takes a Jacobian",
          author: {
            username: "jake"
          }
        }
      ])
    );

    const initialState = {
      comment: {
        tutId2: {
          commentId3: {
            id: "commentId3",
            body: "Body comment 3",
            author: {
              username: "jake"
            }
          }
        }
      }
    };

    const expectCommentDuckState = {
      tutId1: {
        commentId1: {
          id: "commentId1",
          body: "It takes a Jacobian",
          author: {
            username: "jake"
          }
        }
      },
      tutId2: {
        commentId3: {
          id: "commentId3",
          body: "Body comment 3",
          author: {
            username: "jake"
          }
        }
      }
    };
    const store = createStore({ mode: MODE_TEST_STORE.TEST, initialState });
    store.subscribe(() => {
      const { newState, type, previusState } = getStore(store);
      if (
        !_.isEqual(previusState, newState) &&
        type === commentTypes.ADD_MANY_COMMENT
      ) {
        const actualCommentDuck = commentSelectors.getCommentDuckData(newState);
        expect(actualCommentDuck).toEqual(expectCommentDuckState);
      }
    });
    store.dispatch(
      commentActions.getCommentStart({
        tuts: { id: "tutId1", slug: "hello" }
      })
    );
  });
});

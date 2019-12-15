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

describe("CREATE_COMMENT_SUCCESS", () => {
  it("create comment success", () => {
    jest.mock("../../src/services/authServices");
    commentServices.createComment = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: "commentId1",
          body: "Body comment 1",
          author: {
            username: "jake"
          }
        }
      ])
    );

    const initialState = {
      comment: {
        tutId1: {
          commentId0: {
            id: "commentId0",
            body: "Body comment 0",
            author: {
              username: "jake"
            }
          }
        }
      }
    };

    const expectCommentDuckState = {
      tutId1: {
        commentId0: {
          id: "commentId0",
          body: "Body comment 0",
          author: {
            username: "jake"
          }
        },
        commentId1: {
          id: "commentId1",
          body: "Body comment 1",
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
      commentActions.createCommentStart({
        tuts: {
          body: "Body comment 1",
          id: "tutId1",
          slug: "hello world"
        }
      })
    );
  });
});

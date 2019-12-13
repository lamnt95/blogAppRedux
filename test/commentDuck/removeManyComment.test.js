import _ from "lodash";
import createStore from "../../src";
import {
  actions as commentActions,
  selectors as commentSelectors,
  types as commentTypes
} from "../../src/modulesDuck/commentDuck";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe("REMOVE_MANY_COMMENT", () => {
  it("Remove exist comment", () => {
    const initialState = {
      comment: {
        tutId1: {
          commentId1: {
            id: "commentId1",
            body: "Body comment 1",
            author: {
              username: "jake"
            }
          },
          commentId2: {
            id: "commentId2",
            body: "Body comment 2",
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
      }
    };

    const expectCommentDuckState = {
      tutId1: {
        commentId1: {
          id: "commentId1",
          body: "Body comment 1",
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
        type === commentTypes.REMOVE_MANY_COMMENT
      ) {
        const actualCommentDuck = commentSelectors.getCommentDuckData(newState);
        expect(actualCommentDuck).toEqual(expectCommentDuckState);
      }
    });
    store.dispatch(
      commentActions.removeManyComment({
        tuts: { id: "tutId1" },
        comments: [{ id: "commentId2" }]
      })
    );
  });
});

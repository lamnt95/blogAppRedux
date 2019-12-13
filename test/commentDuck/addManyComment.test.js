import _ from "lodash";
import createStore from "../../src";
import {
  actions as commentActions,
  selectors as commentSelectors,
  types as commentTypes
} from "../../src/modulesDuck/commentDuck";
import { MODE_TEST_STORE } from "../../src/constant";
import { getStore } from "../utils";

describe("ADD_MANY_COMMENT", () => {
  it("Add new comment", () => {
    const expectCommentDuckState = {
      tutId1: {
        commentId1: {
          id: "commentId1",
          body: "It takes a Jacobian",
          author: {
            username: "jake"
          }
        }
      }
    };
    const store = createStore({ mode: MODE_TEST_STORE.TEST });
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
      commentActions.addManyComment({
        tutId: "tutId1",
        commentsData: [
          {
            id: "commentId1",
            body: "It takes a Jacobian",
            author: {
              username: "jake"
            }
          }
        ]
      })
    );
  });

  it("Update exist comment", () => {
    const initialState = {
      comment: {
        tutId1: {
          commentId1: {
            id: "commentId1",
            body: "Body comment 1",
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
      commentActions.addManyComment({
        tutId: "tutId1",
        commentsData: [
          {
            id: "commentId1",
            body: "It takes a Jacobian",
            author: {
              username: "jake"
            }
          }
        ]
      })
    );
  });
});

import {
  types as authTypes,
  actions as authActions,
  selectors as authSelectors
} from "./authDuck";
import {
  types as feedTypes,
  actions as feedActions,
  selectors as feedSelectors
} from "./feedDuck";
import {
  types as tagsTypes,
  actions as tagsActions,
  selectors as tagsSelectors
} from "./tagsDuck";
import {
  types as tutsTypes,
  actions as tutsActions,
  selectors as tutsSelectors
} from "./tutsDuck";
import {
  types as userTypes,
  actions as userActions,
  selectors as userSelectors
} from "./userDuck";
import {
  types as actionTypes,
  actions as actionActions,
  selectors as actionSelectors
} from "./actionDuck";
import {
  types as commentTypes,
  actions as commentActions,
  selectors as commentSelectors
} from "./commentDuck";

export default {
  authTypes,
  authActions,
  authSelectors,
  feedTypes,
  feedActions,
  feedSelectors,
  tagsTypes,
  tagsActions,
  tagsSelectors,
  tutsTypes,
  tutsActions,
  tutsSelectors,
  userTypes,
  userActions,
  userSelectors,
  actionTypes,
  actionActions,
  actionSelectors,
  commentTypes,
  commentActions,
  commentSelectors
};

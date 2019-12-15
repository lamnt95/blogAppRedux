import { combineEpics } from "redux-observable";

import { epics as authEpics } from "./reducers/authDuck";
import { epics as feedEpics } from "./reducers/feedDuck";
import { epics as tagsEpics } from "./reducers/tagsDuck";
import { epics as tutsEpics } from "./reducers/tutsDuck";
import { epics as commentEpics } from "./reducers/commentDuck";

export default combineEpics(
  ...authEpics,
  ...feedEpics,
  ...tagsEpics,
  ...tutsEpics,
  ...commentEpics
);

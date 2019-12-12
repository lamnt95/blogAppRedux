import { combineEpics } from "redux-observable";

import { epics as authEpics } from "./modulesDuck/authDuck";
import { epics as feedEpics } from "./modulesDuck/feedDuck";
import { epics as tagsEpics } from "./modulesDuck/tagsDuck";
import { epics as tutsEpics } from "./modulesDuck/tutsDuck";

export default combineEpics(
  ...authEpics,
  ...feedEpics,
  ...tagsEpics,
  ...tutsEpics
);

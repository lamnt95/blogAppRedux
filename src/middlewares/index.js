import _ from "lodash";
import { MODE_TEST_STORE } from "../constant";
import conductorMiddleware from "./conductorMiddleware";
import getTestMiddleware from "./testMiddleware";

export default (config = {}) => {
  const { mode } = config;
  const middlewaresTest = _.has(MODE_TEST_STORE, mode)
    ? [getTestMiddleware({ mode })]
    : [];
  const middlewares = [...middlewaresTest, conductorMiddleware];
  return middlewares;
};

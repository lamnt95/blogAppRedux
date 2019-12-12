import conductorMiddleware from "./conductorMiddleware";
import testMiddleware from "./testMiddleware";

export default (config = {}) => {
  const { isTest } = config;
  const middlewaresTest = isTest ? [testMiddleware] : [];
  const middlewares = [...middlewaresTest, conductorMiddleware];
  return middlewares;
};

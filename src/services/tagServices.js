import axios from "axios";
import _ from "lodash";
import config from "../config";

const fetchTag = () => {
  const url = `${config.conduitApi}/api/tags`;
  return axios.get(url).then(data => _.get(data, "data"));
};

export default { fetchTag };

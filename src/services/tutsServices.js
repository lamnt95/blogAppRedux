import axios from "axios";
import config from "../config";

const likeTut = (accessToken, slug) => {
  const url = `${config.conduitApi}/api/articles/${slug}/favorite`;
  const headers = {
    Authorization: `Token ${accessToken}`
  };
  return axios.request({ url, method: "POST", headers });
};

const unLikeTut = (accessToken, slug) => {
  const url = `${config.conduitApi}/api/articles/${slug}/favorite`;
  const headers = {
    Authorization: `Token ${accessToken}`
  };
  return axios.request({ url, method: "DELETE", headers });
};

const getOneTut = (accessToken, slug) => Promise.resolve();

export default { likeTut, unLikeTut, getOneTut };

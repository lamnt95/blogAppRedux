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

const createTut = (accessToken, tut) => {
  const { title, description, body, tagList } = tut || {};
  const data = { title, description, body, tagList };
  const url = `${config.conduitApi}/api/articles`;
  const headers = {
    Authorization: `Token ${accessToken}`
  };
  return axios.request({ url, method: "POST", headers, data });
};

export default { likeTut, unLikeTut, getOneTut, createTut };

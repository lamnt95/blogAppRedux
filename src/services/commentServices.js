import axios from "axios";
import config from "../config";

const getComments = (accessToken, slug) => {
  const url = `${config.conduitApi}/api/articles/${slug}/comments`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  return axios.request({ url, method: "GET", headers }).then(res => res.data);
};

const createComment = (accessToken, slug) => {
  const url = `${config.conduitApi}/api/articles/${slug}/comments`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };
  return axios.request({ url, method: "POST", headers }).then(res => res.data);
};

export default { getComments, createComment };

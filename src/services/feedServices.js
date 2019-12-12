import axios from "axios";
import _ from "lodash";
import uuid from "uuid";
import config from "../config";

const fetchFeed = accessToken => {
  const url = `${config.conduitApi}/api/articles?limit=10&offset=0`;
  const body = {};
  const header = {
    Authorization: `Bearer ${accessToken}`
  };
  return axios
    .get(url, body, header)
    .then(res => {
      const articles = _.get(res, "data.articles");
      const articlesCount = _.get(res, "data.articlesCount");
      const articlesAddID = articles.map(item => ({ ...item, id: uuid() }));
      return { articles: articlesAddID, articlesCount };
    })
    .catch(error => {
      console.log("error" + error);
    });
};

export default { fetchFeed };

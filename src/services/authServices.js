import axios from "axios";
import config from "../config";

export const login = () => {
  const url = `${config.conduitApi}/api/users/login`;
  const body = {
    user: { email: "tunglam20132208@gmail.com", password: "tunglam95" }
  };
  return axios.post(url, body).then(res => res.data);
};

export const register = ({ username, email, password }) => {
  const url = `${config.conduitApi}/api/users`;
  const data = {
    user: { email, password, username }
  };
  return axios.request({ url, data, method: "POST" }).then(res => res.data);
};

export default { login, register };

import axios from "axios";
import { getAccessToken } from "./AuthService";

export const getAllArticle = () => {
  return axios
    .get(`http://127.0.0.1:8000/api/master/artikel`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json"
      },
    })
}

export const getArticle = (id) => {
  return axios
    .get(`http://127.0.0.1:8000/api/master/artikel/` + id, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json"
      },
    })
};

export const createArticle = (article) => {
  return axios
    .post(`http://127.0.0.1:8000/api/master/artikel`, article, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      },
    })
};

export const updateArticle = (id, article) => {
  return axios
    .post(`http://127.0.0.1:8000/api/master/artikel/` + id, article, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      },
    })
};

export const deleteArticle = (id) => {
  return axios
    .delete(`http://127.0.0.1:8000/api/master/artikel/` + id, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};
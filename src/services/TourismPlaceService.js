import axios from "axios";
import { getAccessToken } from "./AuthService";

export const getAllTourismPlace = () => {
  return axios
    .get(`http://127.0.0.1:8000/api/master/wisata`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json"
      },
    })
};

export const getTourismPlace = (id) => {
  return axios
    .get(`http://127.0.0.1:8000/api/master/wisata` + id, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json"
      },
    })
};

export const createTourismPlace = (tourismPlace) => {
  return axios
    .post(`http://127.0.0.1:8000/api/master/wisata`, tourismPlace, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};

export const updateTourismPlace = (id, tourismPlace) => {
  return axios
    .put(`http://127.0.0.1:8000/api/master/wisata` + id, tourismPlace, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};

export const deleteTourismPlace = (id) => {
  return axios
    .delete(`http://127.0.0.1:8000/api/master/wisata` + id, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};
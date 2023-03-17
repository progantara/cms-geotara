import axios from "axios";
import { getAccessToken } from "./AuthService";

export const getAllAccomodation = () => {
  return axios
    .get(`http://127.0.0.1:8000/api/master/sponsorship/penginapan`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json"
      },
    })
}

export const getAccomodation = (id) => {
  return axios
    .get(`http://127.0.0.1:8000/api/master/sponsorship/penginapan` + id, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json"
      },
    })
};

export const createAccomodation = (accomodation) => {
  return axios
    .post(`http://127.0.0.1:8000/api/master/sponsorship/penginapan`, accomodation, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};

export const updateAccomodation = (id, accomodation) => {
  return axios
    .put(`http://127.0.0.1:8000/api/master/sponsorship/penginapan` + id, accomodation, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};

export const deleteAccomodation = (id) => {
  return axios
    .delete(`http://127.0.0.1:8000/api/master/sponsorship/penginapan` + id, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    })
};
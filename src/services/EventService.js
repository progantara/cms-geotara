import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllEvents = () => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/event`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const getEvent = (id) => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/event/` + id, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const createEvent = (event) => {
  return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/event`, event, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const updateEvent = (id, event) => {
  return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/event/` + id, event, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const deleteEvent = (id) => {
  return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/event/` + id, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
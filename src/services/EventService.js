import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllEvents = () => {
  return axios.get(`http://127.0.0.1:8000/api/master/event`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const getEvent = (id) => {
  return axios.get(`http://127.0.0.1:8000/api/master/event/` + id, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const createEvent = (event) => {
  return axios.post(`http://127.0.0.1:8000/api/master/event`, event, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const updateEvent = (id, event) => {
  return axios.post(`http://127.0.0.1:8000/api/master/event/` + id, event, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const deleteEvent = (id) => {
  return axios.delete(`http://127.0.0.1:8000/api/master/event/` + id, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
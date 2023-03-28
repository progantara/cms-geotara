import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllDistrik = () => {
  return axios.get(`http://127.0.0.1:8000/api/master/lokasi/distrik`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const getAllDistrikByCode = (code) => {
  return axios.get(`http://127.0.0.1:8000/api/master/lokasi/distrik/` + code, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
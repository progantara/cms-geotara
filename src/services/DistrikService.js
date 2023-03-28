import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllDistrik = () => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/lokasi/distrik`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const getAllDistrikByCode = (code) => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/lokasi/distrik/` + code, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
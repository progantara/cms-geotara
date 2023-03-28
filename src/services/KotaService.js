import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllKota = () => {
  return axios.get(`http://127.0.0.1:8000/api/master/lokasi/kota`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const getAllKotaByCode = (code) => {
  return axios.get(`http://127.0.0.1:8000/api/master/lokasi/kota/` + code, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
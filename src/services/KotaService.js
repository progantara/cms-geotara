import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllKota = () => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/lokasi/kota`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};

export const getAllKotaByCode = (code) => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/lokasi/kota/` + code, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
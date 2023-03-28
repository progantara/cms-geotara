import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllProvinsi = () => {
  return axios.get(`http://127.0.0.1:8000/api/master/lokasi/provinsi`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
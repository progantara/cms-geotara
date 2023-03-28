import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllProvinsi = () => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/lokasi/provinsi`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
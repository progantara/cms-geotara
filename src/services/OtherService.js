import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getDashboard = () => {
  return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/dashboard`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json',
    },
  });
};
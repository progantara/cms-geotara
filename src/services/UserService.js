import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllUser = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/user`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getUser = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/user/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createUser = (user) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/auth/register`, user, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const updateUser = (id, user) => {
	return axios.put(process.env.REACT_APP_API_BASE_URL + `/master/user/` + id, user, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const deleteUser = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/user/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

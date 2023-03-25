import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllUser = () => {
	return axios.get(`http://127.0.0.1:8000/api/master/user`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getUser = (id) => {
	return axios.get(`http://127.0.0.1:8000/api/master/user/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createUser = (user) => {
	return axios.post(`http://127.0.0.1:8000/api/master/auth/register`, user, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const updateUser = (id, user) => {
	return axios.put(`http://127.0.0.1:8000/api/master/user/` + id, user, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const deleteUser = (id) => {
	return axios.delete(`http://127.0.0.1:8000/api/master/user/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

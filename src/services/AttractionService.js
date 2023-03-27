import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllAttraction = () => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/atraksi/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAttraction = (id) => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/atraksi/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createAttraction = (attraction) => {
	return axios.post(`http://127.0.0.1:8000/api/master/sponsorship/atraksi/`, attraction, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const updateAttraction = (id, attraction) => {
	return axios.put(`http://127.0.0.1:8000/api/master/sponsorship/atraksi/` + id, attraction, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const deleteAttraction = (id) => {
	return axios.delete(`http://127.0.0.1:8000/api/master/sponsorship/atraksi/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

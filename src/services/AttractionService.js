import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllAttraction = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/atraksi/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAttraction = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/atraksi/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createAttraction = (attraction) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/atraksi/`, attraction, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateAttraction = (id, attraction) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/atraksi/` + id, attraction, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteAttraction = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/atraksi/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

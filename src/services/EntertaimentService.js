import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllEntertaiment = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/entertaiment/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getEntertaiment = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/entertaiment/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createEntertaiment = (Entertaiment) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/entertaiment/`, Entertaiment, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateEntertaiment = (id, Entertaiment) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/entertaiment/` + id, Entertaiment, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteEntertaiment = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/entertaiment/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

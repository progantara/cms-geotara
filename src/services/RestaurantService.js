import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllRestaurant = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/restoran/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getRestaurant = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/restoran/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createRestaurant = (restaurant) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/restoran/`, restaurant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateRestaurant = (id, restaurant) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/restoran/` + id, restaurant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteRestaurant = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/restoran/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

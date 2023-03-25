import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllRestaurant = () => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/restoran/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getRestaurant = (id) => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/restoran/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createRestaurant = (restaurant) => {
	console.log(restaurant);
	return axios.post(`http://127.0.0.1:8000/api/master/sponsorship/restoran/`, restaurant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const updateRestaurant = (id, restaurant) => {
	return axios.put(`http://127.0.0.1:8000/api/master/sponsorship/restoran/` + id, restaurant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const deleteRestaurant = (id) => {
	return axios.delete(`http://127.0.0.1:8000/api/master/sponsorship/restoran/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

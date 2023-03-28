import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllTour = () => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/tour/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getTour = (id) => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/tour/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createTour = (tour) => {
	return axios.post(`http://127.0.0.1:8000/api/master/sponsorship/tour/`, tour, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateTour = (id, tour) => {
	return axios.post(`http://127.0.0.1:8000/api/master/sponsorship/tour/` + id, tour, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteTour = (id) => {
	return axios.delete(`http://127.0.0.1:8000/api/master/sponsorship/tour/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

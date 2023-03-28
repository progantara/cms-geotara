import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllTour = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/tour/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getTour = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/tour/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createTour = (tour) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/tour/`, tour, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateTour = (id, tour) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/tour/` + id, tour, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteTour = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/tour/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

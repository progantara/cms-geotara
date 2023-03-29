import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllTourismPlace = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getTourismPlace = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createTourismPlace = (tourismPlace) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/wisata`, tourismPlace, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateTourismPlace = (id, tourismPlace) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/wisata/` + id, tourismPlace, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteTourismPlace = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/wisata/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

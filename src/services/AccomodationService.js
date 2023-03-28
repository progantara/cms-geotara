import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllAccomodation = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/penginapan/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAccomodation = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/penginapan/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createAccomodation = (accomodation) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/penginapan/`, accomodation, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateAccomodation = (id, accomodation) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/penginapan/` + id, accomodation, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteAccomodation = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/penginapan/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

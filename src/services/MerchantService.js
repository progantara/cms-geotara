import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllMerchant = () => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/merchant/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getMerchant = (id) => {
	return axios.get(`http://127.0.0.1:8000/api/master/sponsorship/merchant/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createMerchant = (restaurant) => {
	return axios.post(`http://127.0.0.1:8000/api/master/sponsorship/merchant/`, restaurant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateMerchant = (id, restaurant) => {
	return axios.post(`http://127.0.0.1:8000/api/master/sponsorship/merchant/` + id, restaurant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteMerchant = (id) => {
	return axios.delete(`http://127.0.0.1:8000/api/master/sponsorship/merchant/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllMerchant = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/merchant/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getMerchant = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/merchant/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createMerchant = (merchant) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/merchant/`, merchant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateMerchant = (id, merchant) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/merchant/` + id, merchant, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteMerchant = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/sponsorship/merchant/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

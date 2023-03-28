import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllArticle = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/artikel`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getArticle = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/artikel/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createArticle = (article) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/artikel`, article, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateArticle = (id, article) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/artikel/` + id, article, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const deleteArticle = (id) => {
	return axios.delete(process.env.REACT_APP_API_BASE_URL + `/master/artikel/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

import axios from 'axios';
import { getAccessToken } from './AuthService';

export const getAllDesa = () => {
	return axios.get(`http://127.0.0.1:8000/api/master/lokasi/desa/`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAllDesaByCode = (code) => {
	return axios.get(`http://127.0.0.1:8000/api/master/lokasi/desa/` + code, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAllDesaSelect = async () => {
	const response = await axios.get('http://127.0.0.1:8000/api/master/lokasi/desa/', {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
	return response.data.data.map((item) => ({
		id: item._id,
		kode: item.kode,
		nama: item.nama,
	}));
};

export const getDesa = (id) => {
	return axios.get(`http://127.0.0.1:8000/api/master/lokasi/desa/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const createDesa = (desa) => {
	return axios.post(`http://127.0.0.1:8000/api/master/lokasi/desa/`, desa, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const updateDesa = (id, desa) => {
	return axios.put(`http://127.0.0.1:8000/api/master/lokasi/desa/` + id, desa, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const deleteDesa = (id) => {
	return axios.delete(`http://127.0.0.1:8000/api/master/lokasi/desa/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

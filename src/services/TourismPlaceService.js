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

export const getTourismPlaceByDetail = (id) => {
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

export const getAllKategori = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata-kategori`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getKategori = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata-kategori/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAllSubKategori = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata-subkategori`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getSubKategori = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata-subkategori/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getAllSubKategoriByKategori = (name) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata-subkategori/kategori/` + name, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
};

export const getParentDesa = (kode) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/lokasi/desa/parent/` + kode, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: 'application/json',
		},
	});
}
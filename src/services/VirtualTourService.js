import axios from "axios";
import { getAccessToken } from "./AuthService";

export const getAllView = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/wisata-view`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: "application/json",
		},
	});
};

export const getView = (id) => {
	return axios.get(
		process.env.REACT_APP_API_BASE_URL + `/master/wisata-view/` + id,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
			},
		}
	);
};

export const createView = (view) => {
	return axios.post(
		process.env.REACT_APP_API_BASE_URL + `/master/wisata-view`,
		view,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
				"Content-Type": "multipart/form-data",
			},
		}
	);
};

export const updateView = (id, view) => {
	return axios.post(
		process.env.REACT_APP_API_BASE_URL + `/master/wisata-view/` + id,
		view,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
				"Content-Type": "multipart/form-data",
			},
		}
	);
};

export const deleteView = (id) => {
	return axios.delete(
		process.env.REACT_APP_API_BASE_URL + `/master/wisata-view/` + id,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
};

export const getAllSpotByView = (id) => {
	return axios.get(
		process.env.REACT_APP_API_BASE_URL + `/master/wisata-view/spot/` + id,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
			},
		}
	);
};

export const getAllSpot = () => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/spot`, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: "application/json",
		},
	});
};

export const getSpot = (id) => {
	return axios.get(process.env.REACT_APP_API_BASE_URL + `/master/spot/` + id, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: "application/json",
		},
	});
};

export const createSpot = (spot) => {
	return axios.post(process.env.REACT_APP_API_BASE_URL + `/master/spot`, spot, {
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			Accept: "application/json",
			"Content-Type": "multipart/form-data",
		},
	});
};

export const updateSpot = (id, spot) => {
	return axios.post(
		process.env.REACT_APP_API_BASE_URL + `/master/spot/` + id,
		spot,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
				"Content-Type": "multipart/form-data",
			},
		}
	);
};

export const deleteSpot = (id) => {
	return axios.delete(
		process.env.REACT_APP_API_BASE_URL + `/master/spot/` + id,
		{
			headers: {
				Authorization: `Bearer ${getAccessToken()}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	);
};

import axios from "axios";
import swal from "sweetalert";
import { loginConfirmedAction, logout } from "../store/actions/AuthActions";

export function login(email, password) {
	const postData = {
		email,
		password,
	};
	return axios.post(`http://127.0.0.1:8000/api/master/auth/login`, postData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Accept: "application/json, text-plain, /",
		},
	});
}

export function formatError(errorResponse) {
	switch (errorResponse.message) {
		case "Unauthorized":
			//return 'Email not found';
			swal("Oops", "Login Invalid", "error", { button: "Try Again!" });
			break;

		default:
			return "";
	}
}

export function saveTokenInLocalStorage(tokenDetails) {
	tokenDetails.expireDate = new Date(
		new Date().getTime() + 1000 * 60 * 60 * 24
	);
	localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
	setTimeout(() => {
		dispatch(logout(history));
	}, timer);
}

export function checkAutoLogin(dispatch, history) {
	const tokenDetailsString = localStorage.getItem("userDetails");
	let tokenDetails = "";
	if (!tokenDetailsString) {
		dispatch(logout(history));
		return;
	}

	tokenDetails = JSON.parse(tokenDetailsString);
	let expireDate = new Date(tokenDetails.expireDate);
	let todaysDate = new Date();

	if (todaysDate > expireDate) {
		dispatch(logout(history));
		return;
	}
	dispatch(loginConfirmedAction(tokenDetails));

	const timer = expireDate.getTime() - todaysDate.getTime();
	runLogoutTimer(dispatch, timer, history);
}

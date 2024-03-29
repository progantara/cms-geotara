import axios from "axios";
import Swal from "sweetalert2";
import { loginConfirmedAction, logout } from "../store/actions/AuthActions";

export const login = (email, password) => {
	const postData = {
		email,
		password,
	};
	return axios.post(
		process.env.REACT_APP_API_BASE_URL + `/master/auth/login`,
		postData,
		{
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
};

export const formatSuccess = (successResponse) => {
	Swal.fire({
		title: "Success",
		text: "Login successful",
		icon: "success",
		showConfirmButton: false,
		timer: 1500,
		timerProgressBar: true,
		onBeforeOpen: () => {
			Swal.showLoading();
		},
	});
	return successResponse;
};

export const formatError = (errorResponse) => {
	switch (errorResponse.data.message) {
		case "Invalid email or password":
			Swal.fire("Oops", "Invalid email or password", "error", {
				button: "Try Again!",
			});
			return "Invalid email or password";

		case "Validation failed":
			if (
				errorResponse.data.errors.email &&
				errorResponse.data.errors.password
			) {
				Swal.fire("Oops", "Email and Password are required", "error", {
					button: "Try Again!",
				});
				return "Email and Password are required";
			} else if (errorResponse.data.errors.email[0] == "Email field is required") {
				Swal.fire("Oops", "Email is required", "error", {
					button: "Try Again!",
				});
				return "Email is required";
      } else if (errorResponse.data.errors.email[0] == "Invalid email format") {
				Swal.fire("Oops", "Invalid email format", "error", {
					button: "Try Again!",
				});
				return "Invalid email format";
			} else if (errorResponse.data.errors.password) {
				Swal.fire("Oops", "Password is required", "error", {
					button: "Try Again!",
				});
				return "Password is required";
			}

		default:
			return "";
	}
};

export const saveTokenInLocalStorage = (tokenDetails) => {
	tokenDetails.expireDate = new Date(
		new Date().getTime() + 1000 * 60 * 60 * 24
	);
	localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
};

export const runLogoutTimer = (dispatch, timer, history) => {
	setTimeout(() => {
		dispatch(logout(history));
	}, timer);
};

export const checkAutoLogin = (dispatch, history) => {
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
};

export const getAccessToken = () => {
	const tokenDetailsString = localStorage.getItem("userDetails");
	let tokenDetails = "";
	if (!tokenDetailsString) {
		return;
	}

	tokenDetails = JSON.parse(tokenDetailsString);
	return tokenDetails.access_token;
};

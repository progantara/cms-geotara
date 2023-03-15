import {
	LOADING_TOGGLE_ACTION,
	LOGIN_CONFIRMED_ACTION,
	LOGIN_FAILED_ACTION,
	LOGOUT_ACTION,
} from "../actions/AuthActions";

const initialState = {
	auth: {
		email: "",
		accessToken: "",
	},
	errorMessage: "",
	successMessage: "",
	showLoading: false,
};

export function AuthReducer(state = initialState, action) {
	if (action.type === LOGIN_CONFIRMED_ACTION) {
		return {
			...state,
			auth: {
                email: action.payload.email,
                accessToken: action.payload.access_token,
            },
			errorMessage: "",
			successMessage: "Login Successfully Completed",
			showLoading: false,
		};
	}

	if (action.type === LOGOUT_ACTION) {
		return {
			...state,
			errorMessage: "",
			successMessage: "",
			auth: {
				email: "",
				accessToken: "",
			},
		};
	}

	if (action.type === LOGIN_FAILED_ACTION) {
		return {
			...state,
			errorMessage: action.payload.message,
			successMessage: "",
			showLoading: false,
		};
	}

	if (action.type === LOADING_TOGGLE_ACTION) {
		return {
			...state,
			showLoading: action.payload,
		};
	}
	return state;
}

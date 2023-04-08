import {
	LOADING_TOGGLE_ACTION,
	LOGIN_CONFIRMED_ACTION,
	LOGIN_FAILED_ACTION,
	LOGOUT_ACTION,
} from "../actions/AuthActions";

const initialState = {
	auth: {
        user: {
            name: "",
            email: "",
            role: ""
        },
		access_token: "",
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
                user: {
                    name: action.payload.user.name,
                    email: action.payload.user.email,
                    role: action.payload.user.role
                },
                access_token: action.payload.access_token,
            },
			errorMessage: "",
			successMessage: "Login successful",
			showLoading: false,
		};
	}

	if (action.type === LOGOUT_ACTION) {
		return {
			...state,
			errorMessage: "",
			successMessage: "",
			auth: {
                auth: {
                    user: {
                        name: "",
                        email: "",
                        role: ""
                    },
                    access_token: "",
                },
            },
		};
	}

	if (action.type === LOGIN_FAILED_ACTION) {
		return {
			...state,
			errorMessage: action.payload,
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

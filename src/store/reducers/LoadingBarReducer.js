const initialState = {
	progress: 0,
	show: false,
};

export const LoadingBarReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SHOW_LOADING_BAR":
			return { ...state, show: true };
		case "HIDE_LOADING_BAR":
			return { ...state, show: false };
		case "SET_LOADING_PROGRESS":
			return { ...state, progress: action.payload };
		default:
			return state;
	}
};

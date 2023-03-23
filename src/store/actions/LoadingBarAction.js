export const showLoadingBar = () => ({
	type: 'SHOW_LOADING_BAR',
});

export const hideLoadingBar = () => ({
	type: 'HIDE_LOADING_BAR',
});

export const setLoadingProgress = (progress) => ({
	type: 'SET_LOADING_PROGRESS',
	payload: progress,
});

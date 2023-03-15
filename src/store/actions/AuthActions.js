import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
} from '../../services/AuthService';

export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function logout(history) {
    localStorage.removeItem('userDetails');
    history.push('/login');
    return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(email, password, history) {
    return (dispatch) => {
        login(email, password)
            .then((response) => {
                console.log(response)
                saveTokenInLocalStorage({
                    email: response.data.email,
                    acccessToken: response.data.access_token,
                });
                runLogoutTimer(
                    dispatch,
                    1000 * 60 * 60 * 24,
                    history,
                );
                dispatch(loginConfirmedAction(response.data));
				history.push('/dashboard');                
            })
            .catch((error) => {
				// console.log(error);
                const errorMessage = formatError(error.response);
                dispatch(loginFailedAction(errorMessage));
            });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}

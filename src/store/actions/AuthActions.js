import axios from "axios";
import {
  formatError,
  formatSuccess,
  login,
  runLogoutTimer,
  saveTokenInLocalStorage,
} from "../../services/AuthService";

export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";

export const signupAction = (name, email, password, passwordConfirmation) => {
  return async (dispatch) => {
    dispatch({ type: LOADING_TOGGLE_ACTION });
    try {
      const role = "pengelola";
      const response = await axios.post(
        process.env.REACT_APP_API_BASE_URL + `/master/auth/register`,
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role
        }
      );
      console.log(response.data);
      dispatch({ type: LOADING_TOGGLE_ACTION });
      // trigger login action
      dispatch(loginAction(email, password));
    } catch (error) {
      dispatch({ type: LOADING_TOGGLE_ACTION });
      dispatch({ type: LOGIN_FAILED_ACTION, payload: formatError(error) });
    }
  };
};

export function logout(history) {
  localStorage.removeItem("userDetails");
  history.push("/login");
  return {
    type: LOGOUT_ACTION,
  };
}

export function loginAction(email, password, history) {
  return (dispatch) => {
    login(email, password)
      .then((response) => {
        saveTokenInLocalStorage({
          user: {
            name: response.data.data.user.name,
            email: response.data.data.user.email,
            role: response.data.data.user.role,
          },
          access_token: response.data.data.access_token,
        });
        runLogoutTimer(dispatch, 1000 * 60 * 60 * 24, history);
        const successMessage = formatSuccess(response.data.data);
        setTimeout(() => {
          dispatch(loginConfirmedAction(successMessage));
          history.push("/dashboard");
          // window.location.reload();
        }, 1500);
      })
      .catch((error) => {
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

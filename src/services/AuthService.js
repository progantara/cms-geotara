import axios from "axios";
import swal from "sweetalert";
import { loginConfirmedAction, logout } from "../store/actions/AuthActions";

export const login = (email, password) => {
  const postData = {
    email,
    password,
  };
  return axios.post(`http://127.0.0.1:8000/api/master/auth/login`, postData, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const formatError = (errorResponse) => {
  switch (errorResponse.name) {
    case "Error":
      swal("Oops", "Login Invalid", "error", { button: "Try Again!" });
      return errorResponse;

    default:
      return "";
  }
};

export const saveTokenInLocalStorage = (tokenDetails) => {
  tokenDetails.expireDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
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

import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import {
	loadingToggleAction,
	loginAction,
} from "../../store/actions/AuthActions";

function Login(props) {
	const [email, setEmail] = useState("");
	let errorsObj = { email: "", password: "" };
	const [errors, setErrors] = useState(errorsObj);
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();

	function onLogin(e) {
		e.preventDefault();
		let error = false;
		const errorObj = { ...errorsObj };
		if (email === "") {
			errorObj.email = "Email is required";
			error = true;
		}
		if (password === "") {
			errorObj.password = "Password is required";
			error = true;
		}
		setErrors(errorObj);
		if (error) {
			return;
		}
		dispatch(loadingToggleAction(true));
		dispatch(loginAction(email, password, props.history));
	}

	return (
		<div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
			<div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
				<div className="d-flex justify-content-center h-100 align-items-center">
					<div className="authincation-content style-2">
						<div className="row no-gutters">
							<div className="col-xl-12 tab-content">
								<div id="sign-in" className="auth-form form-validation">
									{props.errorMessage && (
										<Alert
											variant="danger"
											className="alert-dismissible solid fade show"
										>
											{
												<svg
													viewBox="0 0 24 24"
													width="24"
													height="24"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="me-2"
												>
													<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
													<line x1="12" y1="9" x2="12" y2="13"></line>
													<line x1="12" y1="17" x2="12.01" y2="17"></line>
												</svg>
											}
											<strong>Error!</strong> {props.errorMessage}
										</Alert>
									)}
									{props.successMessage && (
										<Alert
											variant="success"
											className="alert-dismissible solid fade show"
										>
											{
												<svg
													viewBox="0 0 24 24"
													width="24"
													height="24"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="me-2"
												>
													<polyline points="9 11 12 14 22 4"></polyline>
													<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
												</svg>
											}
											<strong>Success!</strong> {props.successMessage}
										</Alert>
									)}
									<form onSubmit={onLogin} className="form-validate">
										<h3 className="text-center mb-4 text-black">
											Login CMS Geotara
										</h3>
										<div className="form-group mb-3">
											<label className="mb-1" htmlFor="val-email">
												<strong>Email</strong>
											</label>
											<div>
												<input
													type="text"
													className="form-control"
													value={email}
													id="email"
													onChange={(e) => setEmail(e.target.value)}
													placeholder="Type Your Email Address"
												/>
											</div>
											{errors.email && (
												<div className="text-danger fs-12">{errors.email}</div>
											)}
										</div>
										<div className="form-group mb-3">
											<label className="mb-1">
												<strong>Password</strong>
											</label>
											<input
												type="password"
												className="form-control"
												value={password}
												id="password"
												placeholder="Type Your Password"
												onChange={(e) => setPassword(e.target.value)}
											/>
											{errors.password && (
												<div className="text-danger fs-12">
													{errors.password}
												</div>
											)}
										</div>
										<div className="text-center form-group mb-3">
											<button
												type="submit"
												className="btn btn-primary btn-block"
												id="submit_login"
											>
												Masuk
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.errorMessage,
		successMessage: state.auth.successMessage,
		showLoading: state.auth.showLoading,
	};
};
export default connect(mapStateToProps)(Login);

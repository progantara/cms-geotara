import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import {
  loadingToggleAction,
  signupAction,
} from "../../store/actions/AuthActions";
// image
//import logo from "../../images/logo-full.png";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  function onSignUp(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) return;
    dispatch(loadingToggleAction(true));
    dispatch(
      signupAction(name, email, password, confirmPassword, props.history)
    );
  }

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      {/* <Link to="/login">
							<img src={logo} alt="" />
						</Link> */}
                    </div>
                    <h3 className="text-center mb-4 text-black">
                      Daftarkan Akun Anda
                    </h3>
                    {props.errorMessage && (
                      <div className="">{props.errorMessage}</div>
                    )}
                    {props.successMessage && (
                      <div className="">{props.successMessage}</div>
                    )}
                    <form onSubmit={onSignUp}>
                      <div className="form-group mb-3">
                        <label className="mb-1 ">
                          <strong>Nama</strong>
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setName(e.target.value)}
                          className="form-control border border-dark"
                          placeholder="Masukan nama Anda"
                          required
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 ">
                          <strong>Email</strong>
                        </label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control border border-dark"
                          placeholder="Masukan email Anda"
                          required
                        />
                      </div>
                      {errors.email && <div>{errors.email}</div>}
                      <div className="form-group mb-3">
                        <label className="mb-1 ">
                          <strong>Password</strong>
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-control border border-dark"
						  placeholder="Masukan password Anda"
                          required
                        />
                      </div>
                      {errors.password && <div>{errors.password}</div>}
                      <div className="form-group mb-3">
                        <label className="mb-1 ">
                          <strong>Konfirmasi Password</strong>
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-control border border-dark"
                          placeholder="Masukan ulang password Anda"
                          required
                        />
                      </div>
                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Daftar
                        </button>
                      </div>
                    </form>
                    <div className="new-account mt-3">
                      <p className="">
                        Sudah punya akun?{" "}
                        <Link className="text-primary" to="/login">
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
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

export default connect(mapStateToProps)(Register);

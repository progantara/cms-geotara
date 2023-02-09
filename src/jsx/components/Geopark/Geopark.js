import React, { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SRLWrapper } from "simple-react-lightbox";
//** Import Image */
import profile02 from "../../../images/profile/2.jpg";
import profile03 from "../../../images/profile/3.jpg";
import profile04 from "../../../images/profile/4.jpg";
import profile08 from "../../../images/profile/geopark.jpeg";
import profile from "../../../images/profile/Si_Tara.png";
import PageTitle from "../../layouts/PageTitle";

const Geopark = () => {
  const [activeToggle, setActiveToggle] = useState("posts");
  const [cameraModal1, setCameraModal1] = useState(false);
  const [cameraModal2, setCameraModal2] = useState(false);
  const [cameraModal3, setCameraModal3] = useState(false);
  const options = {
    settings: {
      overlayColor: "#000000",
    },
  };
  return (
    <Fragment>
      <PageTitle activeMenu="Profile" motherMenu="Geopark" />
      <div className="row">
        <div className="col-lg-12">
          <div className="profile card card-body px-3 pt-3 pb-0">
            <div className="profile-head">
              <div className="photo-content ">
                <div className="cover-photo rounded"></div>
              </div>
              <div className="position-absolute top-0 end-0">
                {/* Modal 1*/}
                <Modal
                  show={cameraModal1}
                  onHide={() => setCameraModal1(false)}
                  className="modal fade"
                  id="cameraModal"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Ganti Cover</h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        onClick={() => setCameraModal1(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="input-group mb-3">
                        <button className="input-group-text">Upload</button>
                        <div className="form-file">
                          <input
                            type="file"
                            className="form-file-input form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
                <Link
                  to="/app-profile"
                  className="btn btn-success light pt-3 pb-3 px-3"
                  data-toggle="modal"
                  data-target="#cameraModal"
                  onClick={() => setCameraModal1(true)}
                >
                  <i className="bi bi-pencil m-1" />{" "}
                </Link>
              </div>
              <div className="profile-info">
                <div className="profile-photo">
                  <img
                    src={profile}
                    className="img-fluid rounded-circle"
                    alt="profile"
                  />
                </div>
                <div className="profile-details">
                  <div className="profile-name px-3 pt-2">
                    <h4 className="text-primary">Sitara</h4>
                  </div>
                  <div className="profile-email px-2 pt-2">
                    <h4 className="text-muted mb-0">geotara@email.com</h4>
                    <p>Email</p>
                  </div>
                  <div className="p-2">
                    {/* Modal 2*/}
                    <Modal
                      show={cameraModal2}
                      onHide={() => setCameraModal2(false)}
                      className="modal fade"
                      id="cameraModal"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Ganti Profile</h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-dismiss="modal"
                            onClick={() => setCameraModal2(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="input-group mb-3">
                            <button className="input-group-text">Upload</button>
                            <div className="form-file">
                              <input
                                type="file"
                                className="form-file-input form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <Link
                      to="/app-profile"
                      className="btn btn-success light pt-2 pb-2 px-2"
                      data-toggle="modal"
                      data-target="#cameraModal"
                      onClick={() => setCameraModal2(true)}
                    >
                      <i className="bi bi-pencil m-1" />{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div class="text">
                    <h5 className="text-success">Gallery</h5>
                  </div>
                  <div className="position-absolute top-100 start-100 translate-middle">
                    {/* Modal 3*/}
                    <Modal
                      show={cameraModal3}
                      onHide={() => setCameraModal3(false)}
                      className="modal fade"
                      id="cameraModal"
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Upload Galler</h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-dismiss="modal"
                            onClick={() => setCameraModal3(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="input-group mb-3">
                            <button className="input-group-text">Upload</button>
                            <div className="form-file">
                              <input
                                type="file"
                                className="form-file-input form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                    <Link
                      to="/app-profile"
                      className="btn btn-success light pt-2 pb-2 px-2"
                      data-toggle="modal"
                      data-target="#cameraModal"
                      onClick={() => setCameraModal3(true)}
                    >
                      <i className="bi bi-pencil m-1" />{" "}
                    </Link>
                  </div>
                  <div className="profile-interest ">
                    <SRLWrapper options={options}>
                      <div className="row sp4">
                        <div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
                          <a href={profile02}>
                            {" "}
                            <img
                              src={profile02}
                              alt="Pantai"
                              className="img-fluid"
                            />{" "}
                          </a>
                        </div>
                        <div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
                          <a href={profile03}>
                            {" "}
                            <img
                              src={profile03}
                              alt="Curug Cimaung"
                              className="img-fluid"
                            />
                          </a>
                        </div>
                        <div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
                          <a href={profile04}>
                            <img
                              src={profile04}
                              alt="profile"
                              className="img-fluid"
                            />{" "}
                          </a>
                        </div>
                        <div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
                          {" "}
                          <a href={profile02}>
                            <img
                              src={profile02}
                              alt="profile"
                              className="img-fluid"
                            />{" "}
                          </a>
                        </div>
                        <div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
                          <a
                            href={profile03}
                            className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col"
                          >
                            <img
                              src={profile03}
                              alt="profile"
                              className="img-fluid"
                            />
                          </a>
                        </div>
                        <div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
                          <a
                            href={profile04}
                            className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col"
                          >
                            <img
                              src={profile04}
                              alt="profile"
                              className="img-fluid"
                            />
                          </a>
                        </div>
                      </div>
                    </SRLWrapper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card">
            <div className="card-body">
              <div className="profile-tab">
                <div className="custom-tab-1">
                  <ul className="nav nav-tabs">
                    <li
                      className="nav-item"
                      onClick={() => setActiveToggle("posts")}
                    >
                      <Link
                        to="#my-posts"
                        data-toggle="tab"
                        className={`nav-link ${
                          activeToggle === "posts" ? "active show" : ""
                        }`}
                      >
                        Posts Artikel
                      </Link>
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => setActiveToggle("aboutMe")}
                    >
                      <Link
                        to="#about-me"
                        data-toggle="tab"
                        className={`nav-link ${
                          activeToggle === "aboutMe" ? "active show" : ""
                        }`}
                      >
                        About Me
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="#profile-settings"
                        data-toggle="tab"
                        onClick={() => setActiveToggle("setting")}
                        className={`nav-link ${
                          activeToggle === "setting" ? "active show" : ""
                        }`}
                      >
                        Setting
                      </Link>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      id="my-posts"
                      className={`tab-pane fade ${
                        activeToggle === "posts" ? "active show" : ""
                      }`}
                    >
                      <div className="my-post-content pt-3">
                        <div className="profile-uoloaded-post border-bottom-1 pb-5">
                          <img
                            src={profile08}
                            alt=""
                            className="img-fluid w-100 rounded"
                          />
                          <Link className="post-title" to="/post-details">
                            <h3 className="text-black">Geopark Ciletuh</h3>
                          </Link>
                          <p>
                            Terbentang sejauh 128 hektare dan berada di antara 8
                            kecamatan serta 74 desa/kelurahan, tentu kamu masih
                            bertanya-tanya di mana sebenarnya letak dari Geopark
                            Ciletuh. Apabila kamu berkunjung dari wilayah
                            Pelabuhanratu, kawasan Geopark Ciletuh hanya
                            berjarak 37 km. Sementara itu, dari Bandung kamu
                            perlu menempuh sekitar 184 km. Berbeda dari kedua
                            daerah tersebut, apabila kamu berkunjung ke Geopark
                            Ciletuh dari Kota Jakarta, maka perlu menempuh jarak
                            sekitar 166 km atau 4 jam perjalanan. Untuk
                            menghindari kemacetan, kamu bisa berangkat dari pagi
                            ya!
                          </p>
                          <button className="btn btn-success me-2">
                            <span className="me-2">
                              {" "}
                              <i className="fa fa-heart" />
                              200K
                            </span>
                            Like
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      id="about-me"
                      className={`tab-pane fade ${
                        activeToggle === "aboutMe" ? "active show" : ""
                      }`}
                    >
                      <div className="profile-about-me">
                        <div className="pt-4 border-bottom-1 pb-3">
                          <h4 className="text-success">About Me</h4>
                          <p className="mb-2">
                            Geopark Ciletuh-Palabuhanratu memiliki luas 126.100
                            hektar atau 1.261 km2. Meliputi 74 desa, di 8
                            kecamatan yaitu Kecamatan Ciracap, Surade, Ciemas,
                            Waluran, Simpenan, Palabuhanratu, Cikakak, dan
                            Cisolok. Geopark Ciletuh ditetapkan sebagai Geopark
                            Nasional oleh Komite Geopark Nasional Indonesia
                            (KNGI) bersama Komite Nasional Indonesia untuk
                            UNESCO (KNIU) pada 22 Desember 2015. Perluasan dan
                            perubahan nama geopark menjadi Ciletuh-Palabuhanratu
                            diresmikan oleh panitia yang sama pada 21 Juni 2016
                            dan ditetapkan sebagai UNESCO Global Geopark pada 17
                            April 2018 dengan tema geopark “Subduction Fossil,
                            Plato Jampang, Magmatic Path Shift”.
                          </p>
                        </div>
                      </div>
                      <div className="profile-personal-info">
                        <h4 className="text-success mb-4">
                          Personal Information
                        </h4>
                        <div className="row mb-2">
                          <div className="col-3">
                            <h5 className="f-w-500">
                              {" "}
                              Name<span className="pull-right">:</span>
                            </h5>
                          </div>
                          <div className="col-9">
                            <span>Geotara</span>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-3">
                            <h5 className="f-w-500">
                              Email<span className="pull-right">:</span>
                            </h5>
                          </div>
                          <div className="col-9">
                            <span>Geotara@Gmail.com</span>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-3">
                            <h5 className="f-w-500">
                              {" "}
                              Telepon<span className="pull-right">:</span>
                            </h5>
                          </div>
                          <div className="col-9">
                            <span>+62 812-345-678</span>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-3">
                            <h5 className="f-w-500">
                              {" "}
                              Location<span className="pull-right">:</span>
                            </h5>
                          </div>
                          <div className="col-9">
                            <span>Bandung, Jawabarat, Indonesia</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id="profile-settings"
                      className={`tab-pane fade ${
                        activeToggle === "setting" ? "active show" : ""
                      }`}
                    >
                      <div className="pt-3">
                        <div className="settings-form">
                          <h4 className="text-success">Account Setting</h4>
                          <form onSubmit={(e) => e.preventDefault()}>
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <label className="form-label ">Email</label>
                                <input
                                  type="email"
                                  placeholder="Email"
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group mb-3 col-md-6">
                                <label className="form-label">Password</label>
                                <input
                                  type="password"
                                  placeholder="Password"
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Address</label>
                              <input
                                type="text"
                                placeholder="1234 Main St"
                                className="form-control"
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label className="form-label">Address 2</label>
                              <input
                                type="text"
                                placeholder="Apartment, studio, or floor"
                                className="form-control"
                              />
                            </div>
                            <div className="row">
                              <div className="form-group mb-3 col-md-6">
                                <label className="form-label">City</label>
                                <input type="text" className="form-control" />
                              </div>
                              <div className="form-group mb-3 col-md-4">
                                <label className="form-label">State</label>
                                <select
                                  className="form-control"
                                  id="inputState"
                                  defaultValue="option-1"
                                >
                                  <option value="option-1">Choose...</option>
                                  <option value="option-2">Option 1</option>
                                  <option value="option-3">Option 2</option>
                                  <option value="option-4">Option 3</option>
                                </select>
                              </div>
                              <div className="form-group mb-3 col-md-2">
                                <label className="form-label">Zip</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="form-group mb-3">
                              <div className="form-check custom-checkbox">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="gridCheck"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="gridCheck"
                                >
                                  Check me out
                                </label>
                              </div>
                            </div>
                            <button className="btn btn-primary" type="submit">
                              Sign in
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Geopark;
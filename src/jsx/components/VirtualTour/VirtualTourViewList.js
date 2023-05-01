import React, { useEffect, useState } from "react";
import { Alert, Button, Dropdown, Spinner } from "react-bootstrap";
import emojis from "./emojis";
import PageTitle from "../../layouts/PageTitle";
import "./virtualTour.css";
import { Link } from "react-router-dom";
import { checkImageResolution } from "../../../utils/checkImageWidth";

const ViewList = () => {
	const [viewList, setViewList] = useState([]);
	const [viewForm, setViewForm] = useState({
		file360: "",
		file360Preview: "",
	});
	const [message, setMessage] = useState();
	const [activeEditor, setActiveEditor] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const addMoreView = () => {
		if (viewList.length > 0) {
			if (viewList[viewList.length - 1].image) {
				setViewList([...viewList, { id: viewList.length + 1 }]);
			} else {
				setMessage({
					text: "Lengkapi gambar pada view sebelumnya",
					msg: "Error! ",
					emoji: emojis.error,
					variant: "danger",
					icon: "mdi mdi-help",
				});
			}
		} else {
			setViewList([...viewList, { id: viewList.length + 1 }]);
		}
	};

	const changeImage = (e, id) => {
		const newImageList = viewList.map((item) => {
			if (item.id === id) {
				return {
					...item,
					image: e.target.files[0],
				};
			}
			return item;
		});
		setViewList(newImageList);
	};

	const removeImage = (id) => {
		const newImageList = viewList.map((item) => {
			if (item.id === id) {
				return {
					...item,
					image: null,
				};
			}
			return item;
		});
		setViewList(newImageList);
	};

	const removeView = (id) => {
		const newImageList = viewList.filter((item) => item.id !== id);
		setViewList(newImageList);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			setViewForm({
				...viewForm,
				file360: reader.result,
			});
		};
		reader.readAsText(file);
	};

	useEffect(() => {
		setActiveEditor("pannellum");
	}, []);

	return (
		<>
			<PageTitle activeMenu="Virtual Tour" motherMenu="Wisata" />

			<div className="row">
				<div className="col-lg-12">
					<div className="profile card card-body px-3 pt-3 pb-0">
						<div className="profile-head">
							<div className="photo-content">
								<div className="thumbnail-photo rounded">
									<img
										src="https://innap.dexignzone.com/react/demo/static/media/cover.1498d043.jpg"
										alt="Cover photo"
										className="thumbnail-img"
									/>
								</div>
							</div>
							<div className="profile-info">
								<div className="profile-details">
									<div className="profile-name px-3 pt-2 me-3">
										<h4 className="text-primary mb-0">Pantai Pangandaran</h4>
										<p>Nama</p>
									</div>
									<div className="profile-name px-3 pt-2 me-3">
										<h4 className="text-muted mb-0">Alam</h4>
										<p>Kategori</p>
									</div>
									<div className="profile-email px-3 pt-2">
										<Link
											to="/post-details"
											className="btn-rounded btn-dark light btn-xs py-0 me-1"
										>
											Pantai
										</Link>
										<Link
											to="/post-details"
											className="btn-rounded btn-dark light btn-xs py-0 me-1"
										>
											Alam
										</Link>
										<p>Sub Kategori</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row align-items-start">
				<div className="col-lg-4 hidden-xs">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<h2 className="card-title">Deskripsi</h2>
						</div>
						<div className="card-body pb-0">
							<p>
								Lorem Ipsum is simply dummy text of the printing and typesetting
								industry.
							</p>
							<ul className="list-group list-group-flush">
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Provinsi</strong>
									<span className="mb-0">Male</span>
								</li>
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Kota</strong>
									<span className="mb-0">PHD</span>
								</li>
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Distrik</strong>
									<span className="mb-0">Se. Professor</span>
								</li>
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Desa</strong>
									<span className="mb-0">120</span>
								</li>
							</ul>
						</div>
						{activeEditor == "pannellum" && (
							<div className="card-footer pt-0 pb-0 text-center">
								<div className="row">
									<div className="col-6 pt-3 pb-3 border-right">
										<h3 className="mb-1 text-primary">150</h3>
										<span>View</span>
									</div>
									<div className="col-6 pt-3 pb-3 border-right">
										<h3 className="mb-1 text-primary">140</h3>
										<span>Spot</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="col-lg-8 hidden-xs">
					<div className="card">
						<div className="card-header">
							<h2 className="card-title">360 View</h2>
							{activeEditor == "pannellum" ? (
								<>
									<Button
										className="ms-auto me-2"
										variant="secondary btn-rounded"
										onClick={() => setActiveEditor("3dvista")}
									>
										<i className="fa fa-toggle-on" />
										&nbsp;Pannellum Editor
									</Button>
									<Button
										className="me-2"
										variant="primary btn-rounded"
										onClick={addMoreView}
									>
										<span className="btn-icon-start text-primary">
											<i className="fa fa-plus color-primary" />
										</span>
										Tambah
									</Button>
								</>
							) : activeEditor == "3dvista" ? (
								<Button
									className="ms-auto me-2"
									variant="info btn-rounded"
									onClick={() => setActiveEditor("pannellum")}
								>
									<i className="fa fa-toggle-off" />
									&nbsp;3D Vista Editor
								</Button>
							) : (
								<Button
									className="ms-auto me-2"
									variant="danger btn-rounded"
									onClick={() => setActiveEditor("pannellum")}
								>
									<i className="fa fa-toggle-off" />
									&nbsp;No Editor
								</Button>
							)}
						</div>
						<div className="card-body">
							{message && (
								<Alert
									variant={message.variant}
									className="alert-dismissible fade show"
								>
									{message.emoji}
									<strong>{message.msg}</strong>
									{message.text}
									<Button
										variant=""
										className="btn-close"
										data-bs-dismiss="alert"
										aria-label="btn-close"
										onClick={() => setMessage()}
									/>
								</Alert>
							)}

							{activeEditor == "pannellum" ? (
								<div className="row">
									{viewList.map((item) => (
										<div className="col-sm-6" key={item.id}>
											<input
												type="file"
												className="form-control"
												id={`view_${item.id}`}
												hidden
												onChange={(e) => changeImage(e, item.id)}
											/>
											{item.image ? (
												<div className="mb-4 position-relative">
													<img
														src={URL.createObjectURL(item.image)}
														alt="preview"
														className="img-fluid border border-2 border-dark"
														style={{
															width: "100%",
															height: "150px",
														}}
													/>
													<Dropdown className="dropdown ms-auto position-absolute top-0 end-0">
														<Dropdown.Toggle
															variant="dark"
															className="btn-square btn-primary light sharp i-false"
															data-toggle="dropdown"
															aria-expanded="true"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="18px"
																height="18px"
																viewBox="0 0 24 24"
																version="1.1"
															>
																<g
																	stroke="none"
																	strokeWidth="1"
																	fill="none"
																	fillRule="evenodd"
																>
																	<rect
																		x="0"
																		y="0"
																		width="24"
																		height="24"
																	></rect>
																	<circle
																		fill="#000000"
																		cx="5"
																		cy="12"
																		r="2"
																	></circle>
																	<circle
																		fill="#000000"
																		cx="12"
																		cy="12"
																		r="2"
																	></circle>
																	<circle
																		fill="#000000"
																		cx="19"
																		cy="12"
																		r="2"
																	></circle>
																</g>
															</svg>
														</Dropdown.Toggle>
														<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
															<Button
																className="dropdown-item"
																variant="secondary"
																onClick={() => {}}
															>
																<i className="fa fa-pen text-dark me-2" />
																Edit View
															</Button>
															<Button
																className="dropdown-item"
																variant="danger"
																onClick={() => removeView(item.id)}
															>
																<i className="fa fa-trash text-dark me-2" />
																Hapus View
															</Button>
															<Button
																className="dropdown-item"
																variant="info"
																onClick={() => removeImage(item.id)}
															>
																<i className="fa fa-upload text-dark me-2" />
																Ganti View
															</Button>
															<Button
																className="dropdown-item"
																variant="info"
																onClick={() => {}}
															>
																<i className="fa fa-map-marker text-dark me-2" />
																Kelola Spot
															</Button>
														</Dropdown.Menu>
													</Dropdown>
												</div>
											) : (
												<label htmlFor={`view_${item.id}`} className="mb-4">
													<img
														src="https://via.placeholder.com/400x200/FFFFFF?text=Unggah Gambar 360"
														alt="preview"
														className="img-fluid border border-2 border-dark cursor-pointer"
														style={{
															width: "100%",
															height: "150px",
														}}
													/>
												</label>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="row">
									<div className="basic-form">
										<form>
											<fieldset
												{...(isLoading && { disabled: true })}
												{...(isLoading && {
													style: { filter: "blur(2px)", position: "relative" },
												})}
											>
												<div className="form-group mb-3">
													<label>File 3D Vista*</label>
													<div className="input-group">
														<div className="form-file">
															<input
																type="file"
																className="custom-file-input form-control"
																accept=".html, .htm, .xhtml, .xht"
																onChange={handleFileChange}
															/>
														</div>
														<span className="input-group-text">Upload</span>
													</div>
													<div className="text-danger fs-12">
														* Format file HTML
													</div>
												</div>
											</fieldset>
										</form>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{activeEditor == "3dvista" && (
				<div className="row">
					<div className="col-sm-12">
						<div className="card">
							<div className="card-header">
								<h2 className="card-title">3D Vista HTML Preview</h2>
							</div>
							<div className="card-body pb-0">
								{viewForm.file360Preview && (
									<iframe
										title="preview"
										srcDoc={viewForm.file360Preview}
										style={{
											width: "100%",
											height: "500px",
											border: "none",
										}}
									/>
								)}
								{viewForm.file360 && (
									<iframe
										title="preview"
										srcDoc={viewForm.file360}
										style={{
											width: "100%",
											height: "500px",
											border: "none",
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ViewList;

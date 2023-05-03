import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import "./virtualTour.css";
import { Link, useParams } from "react-router-dom";
import { getTourismPlace } from "../../../services/TourismPlaceService";
import { getParentDesa } from "../../../services/DesaService";
import {
	createView,
	getView,
	deleteView,
	updateView,
} from "../../../services/VirtualTourService";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";

const ViewList = () => {
	const { idWisata } = useParams();

	const [wisata, setWisata] = useState({});
	const [viewList, setViewList] = useState([]);
	const [viewForm, setViewForm] = useState({
		file360: "",
		file360Preview: "",
	});
	const [activeEditor, setActiveEditor] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleAddMoreView = () => {
		if (viewList.length > 0) {
			if (viewList[viewList.length - 1].image) {
				setViewList([...viewList, { id: viewList.length + 1 }]);
			} else {
				Swal.fire({
					title: "Error!",
					text: "Lengkapi gambar pada view sebelumnya",
					icon: "error",
					confirmButtonText: "OK",
				});
			}
		} else {
			setViewList([...viewList, { id: viewList.length + 1 }]);
		}
	};

	const handleCreateView = async (formData) => {
		const res = await createView(formData);
		if (res.status === 201) {
			return res.data.data;
		} else {
			Swal.fire({
				title: "Error!",
				text: "Gagal membuat view",
				icon: "error",
				confirmButtonText: "OK",
			});
			return false;
		}
	};

	const handleUpdateView = async (id, formData) => {
		const res = await updateView(id, formData);
		if (res.status === 200) {
			return res.data.data;
		} else {
			Swal.fire({
				title: "Error!",
				text: "Gagal mengubah view",
				icon: "error",
				confirmButtonText: "OK",
			});
			return false;
		}
	};

	const handleCheckView = async (id) => {
		try {
			const res = await getView(id);
			if (res.status === 200) {
				return res;
			}
		} catch (error) {
			return { status: 404, data: null };
		}
	};

	const handleChangeImage = async (e, id) => {
		const checkView = await handleCheckView(id);
		if (checkView.status === 200) {
			const newImageList = viewList.map((item) => {
				if (item.id === id) {
					const data = new FormData();
					data.append("_method", "PUT");
					data.append("file", e.target.files[0]);

					const res = handleUpdateView(id, data);
					if (res) {
						return {
							...item,
							id: res._id,
							image: e.target.files[0],
						};
					} else {
						return {
							...item,
							id: res._id,
							image: null,
						};
					}
				}
				return item;
			});
			setViewList(newImageList);
		} else {
			const newImageList = viewList.map((item) => {
				if (item.id === id) {
					const data = new FormData();
					data.append("wisata_detail_id", wisata.detail_id);
					data.append("nama", "default");
					data.append("with_cms", 1);
					data.append("file", e.target.files[0]);

					const res = handleCreateView(data);
					if (res) {
						return {
							...item,
							id: res._id,
							image: e.target.files[0],
						};
					} else {
						return {
							...item,
							id: res._id,
							image: null,
						};
					}
				}
				return item;
			});
			setViewList(newImageList);
		}
	};

	const handleRemoveImage = (id) => {
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

	const handleRemoveView = async (id) => {
		const res = await deleteView(id);
		if (res.status === 200) {
			const newImageList = viewList.filter(
				(item) => item.id !== res.data.data._id
			);
			setViewList(newImageList);
		} else {
			Swal.fire({
				title: "Error!",
				text: "Gagal menghapus view",
				icon: "error",
				confirmButtonText: "OK",
			});
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setViewForm({
			...viewForm,
			file360: file,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append("_method", "PUT");
		data.append("file", viewForm.file360);

		const res = await updateView(viewForm.id, data);
		if (res.status === 200) {
			Swal.fire({
				title: "Berhasil!",
				text: "View berhasil diubah",
				icon: "success",
				confirmButtonText: "OK",
			}).then(() => {
				router.push("/wisata");
			});
		} else {
			Swal.fire({
				title: "Error!",
				text: "Gagal mengubah view",
				icon: "error",
				confirmButtonText: "OK",
			});
		}
	};

	const loadData = async () => {
		try {
			const responseWisata = await getTourismPlace(idWisata);
			const responseLokasi = await getParentDesa(
				responseWisata.data.data.lokasi.desa_id
			);
			const newViewList = await Promise.all(
				responseWisata.data.data.detail.views.map(async (item) => {
					const responseView = await getView(item);
					return {
						id: responseView.data.data._id,
						nama: responseView.data.data.nama,
						withCms: responseView.data.data.with_cms,
						image: responseView.data.data.file,
					};
				})
			);
			setViewList(newViewList);
			setWisata({
				id: responseWisata.data.data._id,
				thumbnail: responseWisata.data.data.thumbnail,
				nama: responseWisata.data.data.nama,
				kategori: [...responseWisata.data.data.kategori],
				subKategori: responseWisata.data.data.sub_kategori,
				deskripsi: responseWisata.data.data.deskripsi,
				provinsi: responseLokasi.data.data.provinsi.nama,
				kota: responseLokasi.data.data.kota.nama,
				distrik: responseLokasi.data.data.distrik.nama,
				desa: responseLokasi.data.data.desa.nama,
				detail_id: responseWisata.data.data.detail._id,
				editor: responseWisata.data.data.editor,
			});
			setActiveEditor(responseWisata.data.data.editor === undefined ? "pannellum" : responseWisata.data.data.editor);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		loadData();
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
									{wisata.thumbnail ? (
										<img
											src={
												process.env.REACT_APP_STORAGE_BASE_URL +
												"/wisata/" +
												wisata.thumbnail
											}
											alt="Cover photo"
											className="thumbnail-img"
										/>
									) : (
										<Skeleton height={"20.625rem"} />
									)}
								</div>
							</div>
							<div className="profile-info">
								<div className="profile-details">
									<div className="profile-name px-3 pt-2 me-3">
										<h4 className="text-primary mb-0">
											{wisata.nama ? wisata.nama : <Skeleton />}
										</h4>
										<p>Nama</p>
									</div>
									<div className="profile-name px-3 pt-2 me-3">
										<h4 className="text-muted mb-0">
											{wisata.kategori ? wisata.kategori : <Skeleton />}
										</h4>
										<p>Kategori</p>
									</div>
									<div className="profile-email px-3 pt-2">
										{wisata.subKategori ? (
											wisata.subKategori.map((item, index) => (
												<Link
													key={index}
													to="/post-details"
													className="btn-rounded btn-dark light btn-xs py-0 me-1"
												>
													{item}
												</Link>
											))
										) : (
											<Skeleton />
										)}
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
							<p>{wisata.deskripsi}</p>
							<ul className="list-group list-group-flush">
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Provinsi</strong>
									<span className="mb-0">
										{wisata.provinsi ? (
											wisata.provinsi
										) : (
											<Skeleton width={100} />
										)}
									</span>
								</li>
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Kota</strong>
									<span className="mb-0">
										{wisata.kota ? wisata.kota : <Skeleton width={100} />}
									</span>
								</li>
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Distrik</strong>
									<span className="mb-0">
										{wisata.distrik ? wisata.distrik : <Skeleton width={100} />}
									</span>
								</li>
								<li className="list-group-item d-flex px-0 justify-content-between">
									<strong>Desa</strong>
									<span className="mb-0">
										{wisata.desa ? wisata.desa : <Skeleton width={100} />}
									</span>
								</li>
							</ul>
						</div>
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
										onClick={handleAddMoreView}
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
							{activeEditor == "pannellum" ? (
								<div className="row">
									{viewList.length > 0 ? (
										viewList.map((item) => (
											<div className="col-sm-6" key={item.id}>
												<input
													type="file"
													className="form-control"
													id={`view_${item.id}`}
													hidden
													onChange={(e) => handleChangeImage(e, item.id)}
												/>
												{item.image ? (
													<div className="mb-4 position-relative">
														<img
															src={
																typeof item.image === "string"
																	? process.env.REACT_APP_STORAGE_BASE_URL +
																	  "/view/" +
																	  item.image
																	: URL.createObjectURL(item.image)
															}
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
																<Link
																	className="dropdown-item"
																	variant="secondary"
																	to={"/virtual-tour/view/edit/" + item.id}
																>
																	<i className="fa fa-pen text-dark me-2" />
																	Edit View
																</Link>
																<Button
																	className="dropdown-item"
																	variant="danger"
																	onClick={() => handleRemoveView(item.id)}
																>
																	<i className="fa fa-trash text-dark me-2" />
																	Hapus View
																</Button>
																<Button
																	className="dropdown-item"
																	variant="info"
																	onClick={() => handleRemoveImage(item.id)}
																>
																	<i className="fa fa-upload text-dark me-2" />
																	Ganti View
																</Button>
																<Link
																	className="dropdown-item"
																	variant="info"
																	to={"/virtual-tour/editor/" + item.id}
																>
																	<i className="fa fa-map-marker text-dark me-2" />
																	Kelola Spot
																</Link>
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
										))
									) : (
										<div className="col-sm-6">
											<Skeleton height={"150px"} />
										</div>
									)}
								</div>
							) : (
								<div className="row">
									<div className="basic-form">
										<form onSubmit={handleSubmit}>
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
																accept=".zip"
																onChange={handleFileChange}
															/>
														</div>
														<span className="input-group-text">Upload</span>
													</div>
													<div className="text-danger fs-12">
														* Format file ZIP
													</div>
												</div>
												<div className="form-group mt-4">
													<button
														type="submit"
														className="btn btn-primary me-2"
													>
														Unggah
													</button>
													<Link to="/wisata">
														<button type="button" className="btn btn-warning">
															Kembali
														</button>
													</Link>
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
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ViewList;

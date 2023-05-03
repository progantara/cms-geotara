import React, { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { useHistory, useParams } from "react-router-dom";
import { getView, updateView } from "../../../services/VirtualTourService";
import Swal from "sweetalert2";
import ReactPannellum from "react-pannellum";
import { Button } from "react-bootstrap";
import BeatLoader from "react-spinners/BeatLoader";

const VirtualTourViewForm = () => {
	const { idView } = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [viewForm, setViewForm] = useState({
		nama: "",
		editor: "",
		file: "",
	});

	const viewConfig = {
		autoLoad: true,
		compass: true,
		showFullscreenCtrl: false,
		escapeHTML: true,
		hfov: 200,
	};

	const handleChange = (e) => {
		setViewForm({ ...viewForm, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const data = new FormData();
		data.append("_method", "PUT");
		data.append("nama", viewForm.nama);
		updateView(idView, data)
			.then((res) => {
				Swal.fire({
					title: "Berhasil!",
					text: res.data.message,
					icon: "success",
					confirmButtonText: "OK",
				}).then(() => {
					history.go(0);
				});
				setIsLoading(false);
			})
			.catch((err) => {
				Swal.fire({
					title: "Error!",
					text: err.response.data.message,
					icon: "error",
					confirmButtonText: "OK",
				});
				setIsLoading(false);
			});
	};

	useEffect(() => {
		setIsLoading(true);
		getView(idView)
			.then((res) => {
				setViewForm({
					nama: res.data.data.nama,
					editor: res.data.data.with_cms === 0 ? "3D Vista" : "Pannellum",
					file: res.data.data.file,
				});
				setIsLoading(false);
			})
			.catch((err) => {
				Swal.fire({
					title: "Error!",
					text: err.response.data.message,
					icon: "error",
					confirmButtonText: "OK",
				});
				setIsLoading(false);
			});
	}, []);

	return (
		<>
			<PageTitle activeMenu="Virtual Tour" motherMenu="Wisata" />

			<div className="row">
				<div className="col-md-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Edit View</h4>
						</div>
						<div className="card-body">
							{isLoading && (
								<BeatLoader
									color="#36d7b7"
									cssOverride={{
										position: "absolute",
										top: "50%",
										left: "50%",
										zIndex: "999",
									}}
									size={30}
								/>
							)}
							<form onSubmit={handleSubmit}>
								<fieldset
									{...(isLoading && { disabled: true })}
									{...(isLoading && { style: { filter: "blur(2px)" } })}
								>
									<div className="row">
										<div className="form-group mb-3 col-md-6">
											<label>Nama View</label>
											<input
												type="text"
												className="form-control"
												name="nama"
												placeholder="Masukkan Nama View"
												value={viewForm.nama}
												onChange={handleChange}
												required
											/>
										</div>
										<div className="form-group mb-3 col-md-6">
											<label>Editor</label>
											<input
												type="text"
												className="form-control"
												name="editor"
												value={viewForm.editor}
												disabled
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-12">
											<label>File Preview</label>
											{viewForm.file !== "" && (
												<ReactPannellum
													id="1"
													type="equirectangular"
													sceneId={idView}
													imageSource={
														process.env.REACT_APP_STORAGE_BASE_URL +
														"/view/" +
														viewForm.file
													}
													style={{
														width: "100%",
														height: "500px",
													}}
													config={viewConfig}
												></ReactPannellum>
											)}
										</div>
									</div>
									<button type="submit" className="btn btn-primary me-2">
										Simpan
									</button>
									<Button
										className="ms-auto me-2"
										variant="warning"
										onClick={() => {
											history.back();
										}}
									>
										Kembali
									</Button>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VirtualTourViewForm;

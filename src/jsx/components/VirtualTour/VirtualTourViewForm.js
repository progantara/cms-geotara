import React, { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Link, useParams } from "react-router-dom";
import { getView, updateView } from "../../../services/VirtualTourService";
import Swal from "sweetalert2";

const VirtualTourViewForm = () => {
	const { idView } = useParams();

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
		setSpotForm({ ...spotForm, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append("nama", viewForm.nama);
		updateView(idView, data)
			.then((res) => {
				Swal.fire({
					title: "Berhasil!",
					text: res.data.message,
					icon: "success",
					confirmButtonText: "OK",
				}).then(() => {
					window.location.reload();
				});
			})
			.catch((err) => {
				Swal.fire({
					title: "Error!",
					text: err.response.data.message,
					icon: "error",
					confirmButtonText: "OK",
				});
			});
	};

	useEffect(() => {
		getView(idView)
			.then((res) => {
				setViewForm({
					nama: res.data.data.nama,
					editor: res.data.data.with_cms === 0 ? "3D Vista" : "Pannellum",
					file: res.data.data.file,
				});
			})
			.catch((err) => {
				Swal.fire({
					title: "Error!",
					text: err.response.data.message,
					icon: "error",
					confirmButtonText: "OK",
				});
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
							<form onSubmit={handleSubmit}>
								<div className="row">
									<div className="form-group mb-3 col-md-6">
										<label>Nama View</label>
										<input
											type="text"
											className="form-control"
											name="text"
											placeholder="Masukkan Nama Spot"
											value={viewForm.nama}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group mb-3 col-md-6">
										<label>Editor</label>
										<input
											type="text"
											className="form-control"
											name="text"
											value={viewForm.editor}
											disabled
										/>
									</div>
								</div>
								<div className="row">
									<div className="form-group mb-3 col-md-12">
										<label>File Preview</label>
										<ReactPannellum
											id="1"
											type="equirectangular"
											sceneId="firstScene"
											imageSource={
												process.env.REACT_APP_STORAGE_BASE_URL +
												"/view/" +
												viewForm.file
											}
											style={{
												width: "100%",
												height: "600px",
											}}
											config={viewConfig}
										></ReactPannellum>
									</div>
								</div>
								<button type="submit" className="btn btn-primary me-2">
									Simpan
								</button>
								<Link to="/virtual-tour/editor">
									<button type="button" className="btn btn-warning">
										Kembali
									</button>
								</Link>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VirtualTourViewForm;

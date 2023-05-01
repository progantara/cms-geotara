import React, { useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Link } from "react-router-dom";

const VirtualTourViewForm = () => {
	const [spotForm, setSpotForm] = useState({
		id: 0,
		pitch: 0,
		yaw: 0,
		type: "",
		text: "",
		URL: "",
		sceneId: "",
	});

	const handleChange = (e) => {
		setSpotForm({ ...spotForm, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (spotForm.type === "info") {
			console.log(spotForm);
		} else if (spotForm.type === "scene") {
			console.log(spotForm);
		} else {
			console.log(spotForm);
		}
	};

	return (
		<>
			<PageTitle activeMenu="Virtual Tour" motherMenu="Wisata" />

			<div className="row">
				<div className="col-md-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Edit Spot</h4>
						</div>
						<div className="card-body">
							<form onSubmit={(e) => e.preventDefault()}>
								<div className="row">
									<div className="form-group mb-3 col-md-6">
										<label>Nama Spot</label>
										<input
											type="text"
											className="form-control"
											name="text"
											placeholder="Masukkan Nama Spot"
											value={spotForm.text}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group mb-3 col-md-6">
										<label>Jenis Spot</label>
										<select
											defaultValue={spotForm.type}
											className="form-control"
											name="type"
											onChange={handleChange}
										>
											<option>Pilih...</option>
											<option value="scene">Transisi</option>
											<option value="info">Pranala</option>
										</select>
									</div>
								</div>
								<div className="row">
									{spotForm.type === "info" && (
										<div className="form-group mb-3 col-md-12">
											<label>URL</label>
											<input
												type="text"
												className="form-control"
												name="URL"
												placeholder="https://"
												value={spotForm.URL}
												onChange={handleChange}
											/>
										</div>
									)}
									{spotForm.type === "scene" && (
										<div className="form-group mb-3 col-md-12">
											<label>View</label>
											<select
												defaultValue={"option"}
												className="form-control"
												name="view"
											>
												<option value="option" disabled>
													Choose...
												</option>
												<option value="">Info</option>
												<option value="">Transition</option>
												<option value="">Option 3</option>
											</select>
										</div>
									)}
								</div>
								<div className="row">
									<div className="form-group mb-3 col-md-6">
										<label>Yaw</label>
										<input
											type="text"
											className="form-control"
											name="yaw"
											value={spotForm.yaw}
											onChange={handleChange}
										/>
									</div>
									<div className="form-group mb-3 col-md-6">
										<label>Pitch</label>
										<input
											type="text"
											className="form-control"
											name="pitch"
											value={spotForm.pitch}
											onChange={handleChange}
										/>
									</div>
								</div>
								<button type="submit" className="btn btn-primary me-2">
									Save
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

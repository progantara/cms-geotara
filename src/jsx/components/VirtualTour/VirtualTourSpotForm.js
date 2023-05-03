import React, { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Link, useParams } from "react-router-dom";
import {
	getAllSpotByView,
	getSpot,
	getView,
	updateSpot,
} from "../../../services/VirtualTourService";
import Swal from "sweetalert2";
import BeatLoader from "react-spinners/BeatLoader";
import Select from "react-select";
import { getTourismPlaceByDetail } from "../../../services/TourismPlaceService";
import { Button } from "react-bootstrap";
import ReactPannellum from "react-pannellum";

const ClearIndicator = (props) => {
	const {
		children = "clear all",
		getStyles,
		innerProps: { ref, ...restInnerProps },
	} = props;
	return (
		<div
			{...restInnerProps}
			ref={ref}
			style={getStyles("clearIndicator", props)}
		>
			<div style={{ padding: "0px 5px" }}>{children}</div>
		</div>
	);
};

const ClearIndicatorStyles = (base, state) => ({
	...base,
	cursor: "pointer",
	color: state.isFocused ? "blue" : "black",
});

const VirtualTourSpotForm = () => {
	const { idSpot } = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [spotForm, setSpotForm] = useState({
		id: "",
		pitch: 0,
		yaw: 0,
		tipe: "",
		nama: "",
		url: "",
		sceneId: "",
	});
	const [scenePreview, setScenePreview] = useState("");
	const [sceneList, setSceneList] = useState([]);

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
		setIsLoading(true);
		const data = new FormData();
		data.append("_method", "PUT");
		data.append("pitch", spotForm.pitch);
		data.append("yaw", spotForm.yaw);
		data.append("tipe", spotForm.tipe);
		data.append("nama", spotForm.nama);
		if (spotForm.tipe === "scene") {
			data.append("aksi[view_id]", spotForm.sceneId.value);
		} else if (spotForm.tipe === "info") {
			data.append("aksi[url]", spotForm.url);
		}

		updateSpot(spotForm.id, data)
			.then((res) => {
				Swal.fire({
					title: "Success!",
					text: res.data.message,
					icon: "success",
					confirmButtonText: "OK",
				}).then(() => {
					window.history.back();
				});
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

	const loadData = async (idSpot) => {
		try {
			const res = await getSpot(idSpot);
			setSpotForm({
				id: res.data.data._id,
				pitch: res.data.data.koordinat.pitch,
				yaw: res.data.data.koordinat.yaw,
				tipe: res.data.data.tipe,
				nama: res.data.data.nama,
				url: res.data.data.aksi.url ? res.data.data.aksi.url : "",
				sceneId: res.data.data.aksi.sceneId ? res.data.data.aksi.sceneId : "",
			});
			loadView(res.data.data.view_id);
			setIsLoading(false);
		} catch (err) {
			Swal.fire({
				title: "Error!",
				text: err.response.data.message,
				icon: "error",
				confirmButtonText: "OK",
			});
			setIsLoading(false);
		}
	};

	const loadView = async (idView) => {
		try {
			const res = await getView(idView);
			await loadWisataDetail(res.data.data.wisata_detail_id);
		} catch (err) {
			Swal.fire({
				title: "Error!",
				text: err.response.data.message,
				icon: "error",
				confirmButtonText: "OK",
			});
		}
	};

	const loadWisataDetail = async (idDetailWisata) => {
		try {
			const res = await getTourismPlaceByDetail(idDetailWisata);
			const sceneList = res.data.data.detail.views.map(async (scene) => {
				const res_view = await getView(scene);
				if (res_view) {
					return {
						value: res_view.data.data._id,
						label: res_view.data.data.nama,
						color: "#00B8D9",
					};
				} else {
					Swal.fire({
						title: "Error!",
						text: "Scene not found!",
						icon: "error",
						confirmButtonText: "OK",
					});
				}
			});
			setSceneList(await Promise.all(sceneList));
			setIsLoading(false);
		} catch (err) {
			Swal.fire({
				title: "Error!",
				text: err.response.data.message,
				icon: "error",
				confirmButtonText: "OK",
			});
		}
	};

	useEffect(() => {
		setIsLoading(true);
		loadData(idSpot);
	}, [idSpot]);

	return (
		<>
			<PageTitle activeMenu="Spot Editor" motherMenu="Virtual Tour" />

			<div className="row">
				<div className="col-md-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Edit Spot</h4>
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
											<label>Nama Spot</label>
											<input
												type="text"
												className="form-control"
												name="nama"
												placeholder="Masukkan Nama Spot"
												value={spotForm.nama}
												onChange={handleChange}
											/>
										</div>
										<div className="form-group mb-3 col-md-6">
											<label>Jenis Spot</label>
											<select
												value={spotForm.tipe}
												className="form-control"
												name="tipe"
												onChange={handleChange}
											>
												<option>Pilih...</option>
												<option value="scene">Transisi</option>
												<option value="info">Info</option>
											</select>
										</div>
									</div>
									<div className="row">
										{spotForm.tipe === "info" && (
											<div className="form-group mb-3 col-md-12">
												<label>URL</label>
												<input
													type="text"
													className="form-control"
													name="url"
													placeholder="https://"
													value={spotForm.url}
													onChange={handleChange}
												/>
											</div>
										)}
										{spotForm.tipe === "scene" && (
											<div className="form-group mb-3 col-md-12">
												<label>View</label>
												<Select
													closeMenuOnSelect={true}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={spotForm.sceneId}
													onChange={(e) => {
														setScenePreview("");
														setSpotForm({ ...spotForm, sceneId: e });
														getView(e.value).then((res) => {
															setScenePreview(res.data.data.file);
														});
													}}
													options={sceneList}
												/>
											</div>
										)}
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-6">
											{scenePreview !== "" && spotForm.sceneId !== "" && (
												<ReactPannellum
													id="1"
													type="equirectangular"
													sceneId={spotForm.sceneId.value}
													imageSource={
														process.env.REACT_APP_STORAGE_BASE_URL +
														"/view/" +
														scenePreview
													}
													style={{
														width: "100%",
														height: "200px",
													}}
													config={viewConfig}
												></ReactPannellum>
											)}
										</div>
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

export default VirtualTourSpotForm;

import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { Link, useHistory, useParams } from "react-router-dom";
import {
	createAttraction,
	getAttraction,
	updateAttraction,
} from "../../../services/AttractionService";
import { getAllProvinsi } from "../../../services/ProvinsiService";
import { getAllKotaByCode } from "../../../services/KotaService";
import {
	getAllDistrikByCode,
	getDistrik,
} from "../../../services/DistrikService";
import { getAllDesaByCode, getDesa } from "../../../services/DesaService";
import { format } from "date-fns";
import { fromLonLat, toLonLat } from "ol/proj";
import "ol/ol.css";
import Select from "react-select";
import { RControl, RLayerTile, RMap, ROSM } from "rlayers";
import BeatLoader from "react-spinners/BeatLoader";

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [provinsiId, setProvinsiId] = useState({});
	const [provinsiList, setProvinsiList] = useState([]);
	const [kotaId, setKotaId] = useState({});
	const [kotaList, setKotaList] = useState([]);
	const [distrikId, setDistrikId] = useState({});
	const [distrikList, setDistrikList] = useState([]);
	const [desaList, setDesaList] = useState([]);
	const [inputAttraction, setInputAttraction] = useState({
		nama: "",
		thumbnail: "",
		thumbnail_preview: "",
		harga_tiket: "",
	});
	const [lokasi, setLokasi] = useState({
		lat: "",
		long: "",
		desa_id: {},
		alamat: "",
	});
	const [detail, setDetail] = useState({
		tipe_atraksi: "",
		rating: "",
		deskripsi: "",
		durasi: "",
		kapasitas: "",
	});

	let title = "Tambah Attraction";
	let button = "Simpan";
	if (id !== undefined) {
		title = "Edit Attraction";
		button = "Update";
	}

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

	useEffect(() => {
		if (id !== undefined) {
			getAttraction(id)
				.then((res) => {
					// alert(res.data.data);
					let data = res.data.data;
					setInputAttraction({
						nama: data.nama,
						thumbnail: "",
						thumbnail_preview: data.thumbnail,
						harga_tiket: data.harga_tiket,
					});
					setLokasi({
						lat: data.lokasi.lat,
						long: data.lokasi.long,
						desa_id: data.lokasi.desa_id,
						alamat: data.lokasi.alamat,
					});
					setDetail({
						tipe_atraksi: data.detail.tipe_atraksi,
						rating: data.detail.rating,
						deskripsi: data.detail.deskripsi,
						durasi: data.detail.durasi,
						kapasitas: data.detail.kapasitas,
					});
				})
				.catch((err) => {
					Swal.fire("Gagal!", "Attraction gagal dimuat", "error").then(() => {
						history.push("/attraction");
					});
				});
		} else {
			getAllProvinsi()
				.then((res) => {
					setProvinsiList(
						res.data.data.map((item) => {
							return {
								value: item.kode,
								label: item.nama,
								color: "#00B8D9",
							};
						})
					);
				})
				.catch((err) => {
					Swal.fire("Gagal!", "Provinsi gagal dimuat", "error");
				});
		}
	}, [id, setProvinsiList]);

	const handleChangeAttraction = (e) => {
		const value = e.target.value;
		setInputAttraction({
			...inputAttraction,
			[e.target.name]: value,
		});
	};

	const handleChangeLokasi = (e) => {
		const value = e.target.value;
		setLokasi({
			...lokasi,
			[e.target.name]: value,
		});
	};

	const handleChangeDetail = (e) => {
		const value = e.target.value;
		setDetail({
			...detail,
			[e.target.name]: value,
		});
	};

	const handleImageChange = (e) => {
		const value = e.target.files[0];
		setInputAttraction({
			...inputAttraction,
			[e.target.name]: value,
		});
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append("thumbnail", inputAttraction.thumbnail);
		data.append("nama", inputAttraction.nama);
		data.append("harga_tiket", inputAttraction.harga_tiket);
		data.append("lat", lokasi.lat);
		data.append("long", lokasi.long);
		data.append("desa_id", lokasi.desa_id.value);
		data.append("alamat", lokasi.alamat);
		data.append("tipe_atraksi", detail.tipe_atraksi);
		data.append("rating", detail.rating);
		data.append("deskripsi", detail.deskripsi);
		data.append("durasi", detail.durasi);
		data.append("kapasitas", detail.kapasitas);
		createAttraction(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Attraction berhasil ditambahkan", "success");
				history.push("/attraction");
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append("_method", "put");
		if (inputAttraction.thumbnail !== "")
			data.append("thumbnail", inputAttraction.thumbnail);
		data.append("nama", inputAttraction.nama);
		data.append("harga_tiket", inputAttraction.harga_tiket);
		data.append("lat", lokasi.lat);
		data.append("long", lokasi.long);
		data.append("desa_id", lokasi.desa_id.value);
		data.append("alamat", lokasi.alamat);
		data.append("tipe_atraksi", detail.tipe_atraksi);
		data.append("rating", detail.rating);
		data.append("deskripsi", detail.deskripsi);
		data.append("durasi", detail.durasi);
		data.append("kapasitas", detail.kapasitas);
		updateAttraction(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Attraction berhasil diubah", "success");
				history.push("/attraction");
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			});
	};

	return (
		<div className="h-80">
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">{title}</h4>
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
							<div className="basic-form">
								<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
									<fieldset
										{...(isLoading && { disabled: true })}
										{...(isLoading && { style: { filter: "blur(2px)" } })}
									>
										<div className="row">
											<div className="form-group mb-3">
												<label>Nama Attraction</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan nama attraction"
													name="nama"
													value={inputAttraction.nama}
													onChange={handleChangeAttraction}
												/>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-3">
												<label>Banner</label>
												<div className="input-group">
													<div className="form-file">
														<input
															type="file"
															className="form-file-input form-control"
															name="thumbnail"
															accept="image/*"
															onChange={handleImageChange}
														/>
													</div>
													<span className="input-group-text">Upload</span>
												</div>
												{inputAttraction.thumbnail_preview != "" && (
													<img
														src={
															process.env.REACT_APP_STORAGE_BASE_URL +
															"/attraction/" +
															inputAttraction.thumbnail_preview
														}
														alt="banner"
														className="img-fluid border border-2 border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
												{inputAttraction.thumbnail != "" && (
													<img
														src={URL.createObjectURL(inputAttraction.thumbnail)}
														alt="banner"
														className="img-fluid border border-2 border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-3">
												<label>Harga Tiket</label>
												<input
													type="number"
													className="form-control"
													placeholder="Masukkan harga_tiket attraction"
													name="harga_tiket"
													value={inputAttraction.harga_tiket}
													onChange={handleChangeAttraction}
												/>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4 col-md-4">
												<label>Provinsi</label>
												<Select
													closeMenuOnSelect={true}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={provinsiId}
													onChange={(e) => {
														setProvinsiId(e);
														getAllKotaByCode(e.value)
															.then((res) => {
																setKotaList(
																	res.data.data.map((item) => {
																		return {
																			value: item.kode,
																			label: item.nama,
																			color: "#00B8D9",
																		};
																	})
																);
															})
															.catch((err) => {
																Swal.fire(
																	"Gagal!",
																	"Kota gagal dimuat",
																	"error"
																);
																history.push("/wisata");
															});
													}}
													options={provinsiList}
												/>
											</div>
											<div className="form-group mb-4 col-md-4">
												<label>Kota</label>
												<Select
													closeMenuOnSelect={true}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={kotaId}
													onChange={(e) => {
														setKotaId(e);
														getAllDistrikByCode(e.value)
															.then((res) => {
																setDistrikList(
																	res.data.data.map((item) => {
																		return {
																			value: item.kode,
																			label: item.nama,
																			color: "#00B8D9",
																		};
																	})
																);
															})
															.catch((err) => {
																Swal.fire(
																	"Gagal!",
																	"Distrik gagal dimuat",
																	"error"
																);
																history.push("/wisata");
															});
													}}
													options={kotaList}
												/>
											</div>
											<div className="form-group mb-4 col-md-4">
												<label>Distrik</label>
												<Select
													closeMenuOnSelect={true}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={distrikId}
													onChange={(e) => {
														setDistrikId(e);
														getAllDesaByCode(e.value)
															.then((res) => {
																setDesaList(
																	res.data.data.map((item) => {
																		return {
																			value: item.kode,
																			label: item.nama,
																			color: "#00B8D9",
																		};
																	})
																);
															})
															.catch((err) => {
																Swal.fire(
																	"Gagal!",
																	"Desa gagal dimuat",
																	"error"
																);
																history.push("/wisata");
															});
													}}
													options={distrikList}
												/>
											</div>
											<div className="form-group mb-4 col-md-4">
												<label>Desa</label>
												<Select
													closeMenuOnSelect={true}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={lokasi.desa_id}
													options={desaList}
													name="desa_id"
													onChange={(e) => {
														setLokasi({
															...lokasi,
															desa_id: e,
														});
													}}
												/>
											</div>
											<div className="form-group mb-3 col-md-8">
												<label>Alamat</label>
												<textarea
													className="form-control"
													rows="2"
													name="alamat"
													value={lokasi.alamat}
													onChange={handleChangeLokasi}
												></textarea>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-3 col-md-3">
												<div>
													<label>Longitude</label>
													<input
														type="text"
														className="form-control mb-3"
														placeholder="Pilih pada peta"
														value={lokasi.long}
														disabled
													/>
												</div>
												<div>
													<label>Latitude</label>
													<input
														type="text"
														className="form-control mb-3"
														placeholder="Pilih pada peta"
														value={lokasi.lat}
														disabled
													/>
												</div>
											</div>
											<div className="form-group mb-3 col-md-9">
												<RMap
													width={"100%"}
													height={"60vh"}
													initial={{
														center: fromLonLat([107.448914, -7.100948]),
														zoom: 11,
													}}
													noDefaultControls={true}
													onClick={useCallback((e) => {
														const coords = e.map.getCoordinateFromPixel(
															e.pixel
														);
														const lonlat = toLonLat(coords);
														setLokasi({
															...lokasi,
															long: lonlat[0],
															lat: lonlat[1],
														});
													}, [])}
												>
													<ROSM />
													<RControl.RScaleLine />
													<RControl.RAttribution />
													<RControl.RZoom />
													<RControl.RZoomSlider />
												</RMap>
											</div>
										</div>
										<hr />
										<div className="row">
											<h5>Detail</h5>
											<div className="mb-3 form-group col-md-6">
												<label>Tipe</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan tipe"
													name="tipe_atraksi"
													value={detail.tipe_atraksi}
													onChange={handleChangeDetail}
												/>
											</div>
											<div className="mb-3 form-group col-md-6">
												<label>Rating</label>
												<input
													type="number"
													className="form-control"
													placeholder="Masukkan rating"
													name="rating"
													value={detail.rating}
													onChange={handleChangeDetail}
												/>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-3">
												<label>Deskripsi</label>
												<textarea
													className="form-control"
													rows="2"
													name="deskripsi"
													value={detail.deskripsi}
													onChange={handleChangeDetail}
												></textarea>
											</div>
										</div>
										<div className="row">
											<div className="mb-3 form-group col-md-6">
												<label>Durasi</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan durasi"
													name="durasi"
													value={detail.durasi}
													onChange={handleChangeDetail}
												/>
											</div>
											<div className="mb-3 form-group col-md-6">
												<label>Kapasitas</label>
												<input
													type="number"
													className="form-control"
													placeholder="Masukkan kapasitas"
													name="kapasitas"
													value={detail.kapasitas}
													onChange={handleChangeDetail}
												/>
											</div>
										</div>
										<button type="submit" className="btn btn-primary me-2">
											{button}
										</button>
										<Link to="/attraction">
											<button type="button" className="btn btn-warning">
												Kembali
											</button>
										</Link>
									</fieldset>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

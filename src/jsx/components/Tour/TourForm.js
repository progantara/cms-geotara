import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { Link, useHistory, useParams } from "react-router-dom";
import { createTour, getTour, updateTour } from "../../../services/TourService";
import { getAllProvinsi } from "../../../services/ProvinsiService";
import { getAllKotaByCode } from "../../../services/KotaService";
import { getAllDistrikByCode } from "../../../services/DistrikService";
import { getAllDesaByCode, getParentDesa } from "../../../services/DesaService";
import { format } from "date-fns";
import { fromLonLat, toLonLat } from "ol/proj";
import "ol/ol.css";
import Select from "react-select";
import {
	RControl,
	RFeature,
	RLayerVector,
	RMap,
	ROSM,
	RStyle,
} from "rlayers";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import BeatLoader from "react-spinners/BeatLoader";
import { Point } from "ol/geom";

const locationIcon =
	"https://cdn.jsdelivr.net/npm/rlayers/examples/./svg/location.svg";

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
	const [inputTour, setInputTour] = useState({
		nama: "",
		thumbnail: "",
		thumbnailPreview: "",
		no_telp: "",
		email: "",
		rating: "",
		harga: "",
	});
	const [lokasi, setLokasi] = useState({
		lat: "",
		long: "",
		desa_id: {},
		alamat: "",
	});
	const [detail, setDetail] = useState({
		fasilitas: [""],
		jurusan: [
			{
				tipe: "",
				harga: "",
				thumbnail: "",
				thumbnailPreview: "",
				keberangkatan: "",
				jam_keberangkatan: "",
				tujuan: "",
				estimasi_sampai: "",
			},
		],
	});

	let title = "Tambah Tour";
	let button = "Simpan";
	if (id !== undefined) {
		title = "Edit Tour";
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
			getTour(id)
				.then(async (res) => {
					let data = res.data.data;
					const parentDesa = await getParentDesa(data.lokasi.desa_id);
					setInputTour({
						thumbnail: "",
						thumbnailPreview: data.thumbnail,
						nama: data.nama,
						no_telp: data.no_telp,
						email: data.email,
						harga: data.harga,
						rating: data.rating,
					});
					setLokasi({
						lat: data.lokasi.lat,
						long: data.lokasi.long,
						desa_id: {
							value: parentDesa.data.data.desa.kode,
							label: parentDesa.data.data.desa.nama,
							color: "#00B8D9",
						},
						alamat: data.lokasi.alamat,
					});
					setDetail({
						fasilitas: data.detail.fasilitas,
						jurusan: data.detail.jurusan.map((item) => {
							return {
								tipe: item.tipe,
								harga: item.harga,
								thumbnail: "",
								thumbnailPreview: item.thumbnail,
								keberangkatan: item.keberangkatan,
								jam_keberangkatan: item.jam_keberangkatan,
								tujuan: item.tujuan,
								estimasi_sampai: item.estimasi_sampai,
							};
						}),
					});
					setProvinsiId({
						value: parentDesa.data.data.provinsi.kode,
						label: parentDesa.data.data.provinsi.nama,
						color: "#00B8D9",
					});
					setKotaId({
						value: parentDesa.data.data.kota.kode,
						label: parentDesa.data.data.kota.nama,
						color: "#00B8D9",
					});
					setDistrikId({
						value: parentDesa.data.data.distrik.kode,
						label: parentDesa.data.data.distrik.nama,
						color: "#00B8D9",
					});
				})
				.catch((err) => {
					Swal.fire("Gagal!", "Tour gagal dimuat", "error").then(() => {
						history.push("/tour");
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

	const handleChangeTour = (e) => {
		const value = e.target.value;
		setInputTour({
			...inputTour,
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

	const handleImageChange = (e) => {
		const value = e.target.files[0];
		setInputTour({
			...inputTour,
			[e.target.name]: value,
		});
	};

	const handleDateChange = (e, type) => {
		const selectedTime = e instanceof Date ? e : new Date();
		const newJamOperasional = format(selectedTime, "HH:mm");
		setDetail((prevState) => ({
			...prevState,
			jurusan: [
				{
					...prevState.jurusan[0],
					[type]: newJamOperasional,
				},
				...prevState.jurusan.slice(1),
			],
		}));
	};

	const handleChangeDetail = (e, index = null) => {
		const { name, value } = e.target;
		if (name === "fasilitas") {
			let arr = [];

			// Memeriksa apakah nilai input adalah string dengan koma
			if (typeof value === "string" && value.includes(",")) {
				arr = value.split(",");
			} else {
				arr.push(value);
			}
			setDetail({ ...detail, fasilitas: arr });
		} else {
			const newJurusan = { ...detail.jurusan[index] };
			if (name === "thumbnail") {
				const files = e.target.files[0];
				newJurusan[name] = files;
			} else {
				newJurusan[name] = value;
			}
			const newJurusans = [...detail.jurusan];
			newJurusans[index] = newJurusan;
			setDetail({ ...detail, jurusan: newJurusans });
		}
		console.log(detail);
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append("nama", inputTour.nama);
		data.append("thumbnail", inputTour.thumbnail);
		data.append("lat", lokasi.lat);
		data.append("long", lokasi.long);
		data.append("desa_id", lokasi.desa_id.value);
		data.append("alamat", lokasi.alamat);
		data.append("no_telp", inputTour.no_telp);
		data.append("email", inputTour.email);
		data.append("rating", inputTour.rating);
		data.append("harga", inputTour.rating);
		for (let i = 0; i < detail.fasilitas.length; i++) {
			data.append(`fasilitas[${i}]`, detail.fasilitas[i]);
		}
		for (let i = 0; i < detail.jurusan.length; i++) {
			data.append(`jurusan[${i}][tipe]`, detail.jurusan[i].tipe);
			data.append(`jurusan[${i}][harga]`, detail.jurusan[i].harga);
			data.append(`jurusan[${i}][thumbnail]`, detail.jurusan[i].thumbnail);
			data.append(
				`jurusan[${i}][keberangkatan]`,
				detail.jurusan[i].keberangkatan
			);
			data.append(
				`jurusan[${i}][jam_keberangkatan]`,
				detail.jurusan[i].jam_keberangkatan
			);
			data.append(`jurusan[${i}][tujuan]`, detail.jurusan[i].tujuan);
			data.append(
				`jurusan[${i}][estimasi_sampai]`,
				detail.jurusan[i].estimasi_sampai
			);
		}
		createTour(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Tour berhasil ditambahkan", "success");
				history.push("/tour");
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
		data.append("nama", inputTour.nama);
		if (inputTour.thumbnail !== "")
			data.append("thumbnail", inputTour.thumbnail);
		data.append("lat", lokasi.lat);
		data.append("long", lokasi.long);
		data.append("desa_id", lokasi.desa_id.value);
		data.append("alamat", lokasi.alamat);
		data.append("no_telp", inputTour.no_telp);
		data.append("email", inputTour.email);
		data.append("rating", inputTour.rating);
		data.append("harga", inputTour.rating);
		for (let i = 0; i < detail.fasilitas.length; i++) {
			data.append(`fasilitas[${i}]`, detail.fasilitas[i]);
		}
		for (let i = 0; i < detail.jurusan.length; i++) {
			data.append(`jurusan[${i}][tipe]`, detail.jurusan[i].tipe);
			data.append(`jurusan[${i}][harga]`, detail.jurusan[i].harga);
			if (detail.jurusan[i].thumbnail !== "")
				data.append(`jurusan[${i}][thumbnail]`, detail.jurusan[i].thumbnail);
			data.append(
				`jurusan[${i}][keberangkatan]`,
				detail.jurusan[i].keberangkatan
			);
			data.append(
				`jurusan[${i}][jam_keberangkatan]`,
				detail.jurusan[i].jam_keberangkatan
			);
			data.append(`jurusan[${i}][tujuan]`, detail.jurusan[i].tujuan);
			data.append(
				`jurusan[${i}][estimasi_sampai]`,
				detail.jurusan[i].estimasi_sampai
			);
		}

		updateTour(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Tour berhasil diubah", "success");
				history.push("/tour");
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
										{...(isLoading && {
											style: {
												filter: "blur(2px)",
											},
										})}
									>
										<div className="row">
											<div className="mb-3 form-group">
												<label>Nama Tour</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan nama tour"
													name="nama"
													value={inputTour.nama}
													onChange={handleChangeTour}
												/>
											</div>
										</div>
										<div className="row">
											<div className="mb-3 form-group">
												<label>Thumbnail</label>
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
												{inputTour.thumbnailPreview != "" && (
													<img
														src={
															process.env.REACT_APP_STORAGE_BASE_URL +
															"/tour/" +
															inputTour.thumbnailPreview
														}
														alt="banner"
														className="border border-2 img-fluid border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
												{inputTour.thumbnail != "" && (
													<img
														src={URL.createObjectURL(inputTour.thumbnail)}
														alt="banner"
														className="border border-2 img-fluid border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
											</div>
										</div>
										<div className="row">
											<div className="mb-4 form-group col-md-4">
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
											<div className="mb-4 form-group col-md-4">
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
											<div className="mb-4 form-group col-md-4">
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
											<div className="mb-4 form-group col-md-4">
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
											<div className="mb-3 form-group col-md-8">
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
											<div className="mb-3 form-group col-md-3">
												<div>
													<label>Longitude</label>
													<input
														type="text"
														className="mb-3 form-control"
														placeholder="Pilih pada peta"
														name="long"
														value={lokasi.long}
														onChange={handleChangeLokasi}
													/>
												</div>
												<div>
													<label>Latitude</label>
													<input
														type="text"
														className="mb-3 form-control"
														placeholder="Pilih pada peta"
														name="lat"
														value={lokasi.lat}
														onChange={handleChangeLokasi}
													/>
												</div>
											</div>
											<div className="mb-3 form-group col-md-9">
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
													<RLayerVector>
														<RFeature
															geometry={
																new Point(fromLonLat([lokasi.long, lokasi.lat]))
															}
														>
															<RStyle.RStyle>
																<RStyle.RIcon
																	src={locationIcon}
																	anchor={[0.5, 0.8]}
																/>
															</RStyle.RStyle>
														</RFeature>
													</RLayerVector>
													<RControl.RScaleLine />
													<RControl.RAttribution />
													<RControl.RZoom />
													<RControl.RZoomSlider />
												</RMap>
											</div>
										</div>
										<div className="row">
											<div className="mb-3 form-group col-md-4">
												<label>No Telp</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan nomor telepon"
													name="no_telp"
													onChange={handleChangeTour}
													value={inputTour.no_telp}
												/>
											</div>
											<div className="mb-3 form-group col-md-4">
												<label>Email</label>
												<input
													type="email"
													className="form-control"
													placeholder="Masukkan email"
													name="email"
													onChange={handleChangeTour}
													value={inputTour.email}
												/>
											</div>
											<div className="mb-3 form-group col-md-4">
												<label>Rating</label>
												<input
													type="number"
													min="0"
													max="5"
													step="0.5"
													className="form-control"
													placeholder="Masukkan rating"
													name="rating"
													onChange={handleChangeTour}
													value={inputTour.rating}
												/>
											</div>
										</div>
										<hr />
										<div className="d-flex justify-content-between">
											<span className="font-weight-bold h3">Fasilitas</span>
										</div>
										<div className="row">
											<div className="form-group">
												<label>
													Fasilitas - pisahkan dengan tanda koma ","
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan fasilitas"
													name="fasilitas"
													value={detail.fasilitas}
													onChange={(e) => handleChangeDetail(e)}
												/>
											</div>
										</div>
										<hr />
										{detail.jurusan.map((item, index) => {
											return (
												<div className="mb-4" key={index}>
													<div className="row">
														<div className="d-flex justify-content-between">
															<span className="font-weight-bold h3">
																Jurusan {` ${index + 1}`}
															</span>
															{index ? (
																<button
																	type="button"
																	className="mr-4 btn btn-danger btn-sm"
																	onClick={() => {
																		let newJurusan = [...detail.jurusan];
																		newJurusan.splice(index, 1);
																		setDetail({
																			...detail,
																			jurusan: newJurusan,
																		});
																	}}
																>
																	<i className="fa fa-trash color-danger"></i>
																</button>
															) : null}
														</div>
													</div>
													<div className="row">
														<div className="mb-3 form-group col-md-6">
															<label>Tipe</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan tipe"
																name="tipe"
																value={item.tipe}
																onChange={(e) => handleChangeDetail(e, index)}
															/>
														</div>
														<div className="mb-3 form-group col-md-6">
															<label>Harga</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan harga"
																name="harga"
																value={item.harga}
																onChange={(e) => handleChangeDetail(e, index)}
															/>
														</div>
													</div>
													<div className="row">
														<div className="mb-3 form-group">
															<label>Thumbnail</label>
															<div className="input-group">
																<div className="form-file">
																	<input
																		type="file"
																		className="form-file-input form-control"
																		name="thumbnail"
																		accept="image/*"
																		onChange={(e) =>
																			handleChangeDetail(e, index)
																		}
																	/>
																</div>
																<span className="input-group-text">Upload</span>
															</div>
															{detail.jurusan[index].thumbnailPreview !==
																"" && (
																<img
																	src={
																		process.env.REACT_APP_STORAGE_BASE_URL +
																		"/merchant/detail" +
																		detail.jurusan[index].thumbnailPreview
																	}
																	alt="thumbnail"
																	className="border border-2 img-fluid border-dark rounded-3"
																	style={{
																		width: "40%",
																		height: "auto",
																	}}
																/>
															)}

															{detail.jurusan[index].thumbnail &&
																typeof detail.jurusan[index].thumbnail ===
																	"object" && (
																	<img
																		src={URL.createObjectURL(
																			detail.jurusan[index].thumbnail
																		)}
																		alt="thumbnail"
																		className="border border-2 img-fluid border-dark rounded-3"
																		style={{
																			width: "40%",
																			height: "auto",
																		}}
																	/>
																)}
														</div>
													</div>
													<div className="row">
														<div className="mb-3 form-group col-md-6">
															<label>Keberangkat</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan keberangkatan"
																name="keberangkatan"
																value={item.keberangkatan}
																onChange={(e) => handleChangeDetail(e, index)}
															/>
														</div>
														<div className="mb-3 form-group col-md-6">
															<label>Tujuan</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan tujuan"
																name="tujuan"
																value={item.tujuan}
																onChange={(e) => handleChangeDetail(e, index)}
															/>
														</div>
													</div>
													<div className="row">
														<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
															<label>Jam Keberangkatan</label>
															<MuiPickersUtilsProvider utils={DateFnsUtils}>
																<TimePicker
																	id={"jam_keberangkatan" + index}
																	name="jam_keberangkatan"
																	value={
																		detail.jurusan[index].jam_keberangkatan
																			? new Date(
																					`01/01/1970 ${detail.jurusan[0].jam_keberangkatan}`
																			  )
																			: null
																	}
																	onChange={(e) =>
																		handleDateChange(e, "jam_keberangkatan")
																	}
																/>
															</MuiPickersUtilsProvider>
														</div>
														<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
															<label>Estimasi Sampai</label>
															<MuiPickersUtilsProvider utils={DateFnsUtils}>
																<TimePicker
																	id={"estimasi_sampai" + index}
																	name="estimasi_sampai"
																	value={
																		detail.jurusan[index].estimasi_sampai
																			? new Date(
																					`01/01/1970 ${detail.jurusan[0].estimasi_sampai}`
																			  )
																			: null
																	}
																	onChange={(time) =>
																		handleDateChange(time, "estimasi_sampai")
																	}
																/>
															</MuiPickersUtilsProvider>
														</div>
													</div>
												</div>
											);
										})}
										<div className="row">
											<div className="mb-4 col-md-12">
												<div
													style={{
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}
												>
													<hr
														style={{
															width: "100%",
															margin: "0 10px",
														}}
													/>
													<button
														type="button"
														className="btn btn-info btn-xxs"
														onClick={() => {
															setDetail({
																...detail,
																jurusan: [
																	...detail.jurusan,
																	{
																		tipe: "",
																		harga: "",
																		thumbnail: "",
																		thumbnailPreview: "",
																		keberangkatan: "",
																		jam_keberangkatan: "",
																		tujuan: "",
																		estimasi_sampai: "",
																	},
																],
															});
														}}
													>
														<i className="fa fa-plus color-info"></i>
													</button>
													<hr
														style={{
															width: "100%",
															margin: "0 10px",
														}}
													/>
												</div>
											</div>
										</div>
										<button type="submit" className="btn btn-primary me-2">
											{button}
										</button>
										<Link to="/tour">
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

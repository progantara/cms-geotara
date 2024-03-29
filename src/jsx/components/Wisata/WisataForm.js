import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "react-dropzone-uploader/dist/styles.css";
import { checkImageResolution } from "../../../utils/checkImageWidth";
import Select from "react-select";
import {
	capitalizeEachFirstLetter,
	currencyFormatter,
} from "../../../utils/stringFormatter";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { fromLonLat, toLonLat } from "ol/proj";
import "ol/ol.css";
import { RControl, RFeature, RLayerVector, RMap, ROSM, RStyle } from "rlayers";
import { Point } from "ol/geom";
import {
	createTourismPlace,
	getAllKategori,
	getAllSubKategoriByKategori,
	getParentDesa,
	getTourismPlace,
	updateTourismPlace,
} from "../../../services/TourismPlaceService";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { getAllProvinsi } from "../../../services/ProvinsiService";
import { getAllKotaByCode } from "../../../services/KotaService";
import {
	getAllDistrikByCode,
	getDistrik,
} from "../../../services/DistrikService";
import { getAllDesaByCode, getDesa } from "../../../services/DesaService";
import BeatLoader from "react-spinners/BeatLoader";
import ReactPannellum from "react-pannellum";

const locationIcon =
	"https://cdn.jsdelivr.net/npm/rlayers/examples/./svg/location.svg";

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

const WisataForm = () => {
	const history = useHistory();
	const { id } = useParams();

	let title = "Tambah Wisata";
	let button = "Tambah";
	if (id !== undefined) {
		title = "Edit Wisata";
		button = "Perbarui";
	}

	const [isLoading, setIsLoading] = useState(false);
	const [formWisata, setFormWisata] = useState({
		thumbnail: "",
		thumbnailPreview: "",
		nama: "",
		deskripsi: "",
		kategori: [],
		subkategori: [],
		hargaTiket: "",
		isActive: true,
		jamOperasional: [
			{
				mulai: "",
				akhir: "",
				hari: "",
			},
		],
		desaId: {},
		alamat: "",
		editor: "",
		file360: "",
		file360Preview: "",
	});
	const [long, setLong] = useState(0);
	const [lat, setLat] = useState(0);
	const [provinsiId, setProvinsiId] = useState("");
	const [kotaId, setKotaId] = useState("");
	const [distrikId, setDistrikId] = useState("");
	const [provinsiList, setProvinsiList] = useState([]);
	const [kotaList, setKotaList] = useState([]);
	const [distrikList, setDistrikList] = useState([]);
	const [desaList, setDesaList] = useState([]);
	const [kategoriList, setKategoriList] = useState([]);
	const [subKategoriList, setSubKategoriList] = useState([]);

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const data = new FormData();
		data.append("nama", formWisata.nama);
		data.append("deskripsi", formWisata.deskripsi);
		formWisata.kategori
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`kategori[${index}]`, item);
			});
		formWisata.subkategori
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`sub_kategori[${index}]`, item);
			});
		data.append("harga_tiket", formWisata.hargaTiket);
		data.append("is_active", formWisata.isActive);
		formWisata.jamOperasional.forEach((item, index) => {
			data.append(`jam_operasional[${index}][hari]`, item.hari);
			data.append(`jam_operasional[${index}][mulai]`, item.mulai);
			data.append(`jam_operasional[${index}][akhir]`, item.akhir);
		});
		data.append("lat", lat);
		data.append("long", long);
		data.append("desa_id", formWisata.desaId.value);
		data.append("alamat", formWisata.alamat);
		data.append("thumbnail", formWisata.thumbnail);
		data.append("editor", formWisata.editor.value);
		data.append("file360", formWisata.file360);
		createTourismPlace(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Wisata berhasil ditambahkan", "success");
				history.push("/wisata");
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
		const data = new FormData();
		data.append("_method", "PUT");
		data.append("nama", formWisata.nama);
		data.append("deskripsi", formWisata.deskripsi);
		formWisata.kategori
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`kategori[${index}]`, item);
			});
		formWisata.subkategori
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`sub_kategori[${index}]`, item);
			});
		data.append("harga_tiket", formWisata.hargaTiket);
		data.append("is_active", formWisata.isActive);
		formWisata.jamOperasional.forEach((item, index) => {
			data.append(`jam_operasional[${index}][hari]`, item.hari);
			data.append(`jam_operasional[${index}][mulai]`, item.mulai);
			data.append(`jam_operasional[${index}][akhir]`, item.akhir);
		});
		data.append("lat", lat);
		data.append("long", long);
		data.append("desa_id", formWisata.desaId.value);
		data.append("alamat", formWisata.alamat);
		if (formWisata.thumbnail !== "")
			data.append("thumbnail", formWisata.thumbnail);
		data.append("editor", formWisata.editor.value);
		if (formWisata.file360 !== "") data.append("file360", formWisata.file360);
		updateTourismPlace(id, data)
			.then((res) => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Wisata berhasil diperbarui", "success");
				history.push("/wisata");
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

	useEffect(() => {
		const getTourismData = async () => {
			try {
				setIsLoading(true);
				if (id !== undefined) {
					const res = await getTourismPlace(id);
					const parentDesa = await getParentDesa(res.data.data.lokasi.desa_id);
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
					setFormWisata({
						...formWisata,
						thumbnailPreview: res.data.data.thumbnail,
						nama: res.data.data.nama,
						deskripsi: res.data.data.deskripsi,
						kategori: res.data.data.kategori.map((item) => {
							return {
								value: item,
								label: capitalizeEachFirstLetter(item),
								color: "#00B8D9",
							};
						}),
						subkategori: res.data.data.sub_kategori.map((item) => {
							return {
								value: item,
								label: capitalizeEachFirstLetter(item),
								color: "#00B8D9",
							};
						}),
						file360Preview: res.data.data.file360,
						hargaTiket: res.data.data.harga_tiket,
						isActive: res.data.data.is_active,
						jamOperasional: res.data.data.jam_operasional.map((item) => ({
							mulai: item.mulai,
							akhir: item.akhir,
							hari: item.hari,
						})),
						alamat: res.data.data.lokasi.alamat,
						desaId: {
							value: parentDesa.data.data.desa.kode,
							label: parentDesa.data.data.desa.nama,
							color: "#00B8D9",
						},
						editor: {
							value: res.data.data.editor,
							label: capitalizeEachFirstLetter(res.data.data.editor),
							color: "#00B8D9",
						},
						file360Preview: res.data.data.file360,
					});

					setLat(res.data.data.lokasi.lat);
					setLong(res.data.data.lokasi.long);
					// const prov = await getAllProvinsi();
					// setProvinsiList(
					// 	prov.data.data.map(async (provItem) => {
					// 		const kota = await getAllKotaByCode(provItem.kode);
					// 		setKotaList(
					// 			kota.data.data.map(async (kotaItem) => {
					// 				const distrik = await getAllDistrikByCode(kotaItem.kode);
					// 				setDistrikList(
					// 					distrik.data.data.map(async (distrikItem) => {
					// 						const desa = await getAllDesaByCode(distrikItem.kode);
					// 						setDesaList(
					// 							desa.data.data.map((desaItem) => {
					// 								return {
					// 									value: desaItem.kode,
					// 									label: desaItem.nama,
					// 									color: "#00B8D9",
					// 								};
					// 							})
					// 						);
					// 						return {
					// 							value: distrikItem.kode,
					// 							label: distrikItem.nama,
					// 							color: "#00B8D9",
					// 						};
					// 					})
					// 				);
					// 				return {
					// 					value: kotaItem.kode,
					// 					label: kotaItem.nama,
					// 					color: "#00B8D9",
					// 				};
					// 			})
					// 		);
					// 		return {
					// 			value: provItem.kode,
					// 			label: provItem.nama,
					// 			color: "#00B8D9",
					// 		};
					// 	})
					// );
				}
				setIsLoading(false);
			} catch (err) {
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					console.log(err);
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			}
		};

		const loadListKategori = async () => {
			try {
				const res = await getAllKategori();
				setKategoriList(
					res.data.data.map((item) => {
						return {
							value: item.nama,
							label: capitalizeEachFirstLetter(item.nama),
							color: "#00B8D9",
						};
					})
				);
			} catch (err) {
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					console.log("Error", err);
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			}
		};

		const loadListProvinsi = async () => {
			try {
				const res = await getAllProvinsi();
				setProvinsiList(
					res.data.data.map((item) => {
						return {
							value: item.kode,
							label: capitalizeEachFirstLetter(item.nama),
							color: "#00B8D9",
						};
					})
				);
			} catch (err) {
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					console.log("Error", err);
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			}
		};

		if (id !== undefined) {
			getTourismData();
		} else {
			loadListKategori();
			loadListProvinsi();
		}
	}, []);

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
											<div className="form-group mb-4">
												<label>Nama Wisata</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan nama wisata"
													value={formWisata.nama}
													onChange={(e) =>
														setFormWisata({
															...formWisata,
															nama: e.target.value,
														})
													}
													required
												/>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4">
												<label>Thumbnail</label>
												<div className="input-group">
													<div className="form-file">
														<input
															type="file"
															className="custom-file-input form-control"
															accept="image/*"
															onChange={(event) => {
																checkImageResolution(event.target.files[0])
																	.then(() => {
																		setFormWisata({
																			...formWisata,
																			thumbnail: event.target.files[0],
																		});
																	})
																	.catch((err) => {
																		console.log(err);
																	});
															}}
															required
														/>
													</div>
													<span className="input-group-text">Upload</span>
												</div>
												{formWisata.thumbnailPreview !== "" && (
													<img
														src={
															process.env.REACT_APP_STORAGE_BASE_URL +
															"/wisata/" +
															formWisata.thumbnailPreview
														}
														alt="thumbnail"
														className="img-fluid border border-2 border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
												{formWisata.thumbnail !== "" && (
													<img
														src={URL.createObjectURL(formWisata.thumbnail)}
														alt="thumbnail"
														className="img-fluid border border-2 border-dark rounded-3"
														style={{
															width: "50%",
															height: "300px",
														}}
													/>
												)}
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4">
												<label>File 360</label>
												<div className="input-group">
													<div className="form-file">
														<input
															type="file"
															className="custom-file-input form-control"
															accept="image/*"
															onChange={(event) => {
																setFormWisata({
																	...formWisata,
																	file360: event.target.files[0],
																});
															}}
														/>
													</div>
													<span className="input-group-text">Upload</span>
												</div>
												{formWisata.file360Preview !== "" && (
													<Link
														to={
															"https://portal.geotara.my.id/virtual-tour/view/" +
															id
														}
														target="_blank"
													>
														See Preview
													</Link>
												)}
												{formWisata.file360 !== "" && (
													<ReactPannellum
														id="1"
														type="equirectangular"
														sceneId="firstScene"
														imageSource={URL.createObjectURL(
															formWisata.file360
														)}
														style={{
															width: "40%",
															height: "160px",
														}}
														config={{
															autoLoad: true,
															showFullscreenCtrl: false,
															escapeHTML: true,
														}}
													></ReactPannellum>
												)}
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4">
												<label>Deskripsi</label>
												<textarea
													className="form-control"
													rows="2"
													value={formWisata.deskripsi}
													onChange={(e) => {
														setFormWisata({
															...formWisata,
															deskripsi: e.target.value,
														});
													}}
													required
												></textarea>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4">
												<label>Kategori</label>
												<Select
													closeMenuOnSelect={false}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={formWisata.kategori}
													onChange={(e) => {
														setFormWisata({ ...formWisata, kategori: e });
														Promise.all(
															e.map((item) => {
																return getAllSubKategoriByKategori(item.value)
																	.then((res) => {
																		return res.data.data.map((subkategori) => {
																			return {
																				value: subkategori.nama,
																				label: capitalizeEachFirstLetter(
																					subkategori.nama
																				),
																				color: "#00B8D9",
																			};
																		});
																	})
																	.catch((error) => {
																		Swal.fire(
																			"Gagal!",
																			"Wisata gagal dimuat",
																			"error"
																		).then(() => {
																			history.push("/wisata");
																		});
																		throw error;
																	});
															})
														)
															.then((subKategoriList) => {
																setSubKategoriList(subKategoriList.flat());
															})
															.catch((error) => {
																console.error(error);
															});
													}}
													isMulti
													options={kategoriList}
												/>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4">
												<label>Sub Kategori</label>
												<Select
													closeMenuOnSelect={false}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={formWisata.subkategori}
													onChange={(e) => {
														setFormWisata({ ...formWisata, subkategori: e });
													}}
													isMulti
													options={subKategoriList}
												/>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4 col-md-6">
												<label>
													Harga{" "}
													{currencyFormatter(formWisata.hargaTiket, "id-ID")}
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan harga tiket"
													value={formWisata.hargaTiket}
													onChange={(e) =>
														setFormWisata({
															...formWisata,
															hargaTiket: e.target.value,
														})
													}
												/>
											</div>
											<div className="form-group mb-4 col-md-6">
												<label>Status Aktif</label>
												<select
													value={formWisata.isActive}
													className="form-control"
													onChange={(e) =>
														setFormWisata({
															...formWisata,
															isActive: e.target.value,
														})
													}
												>
													<option value={""}>Pilih Status</option>
													<option value={1}>Aktif</option>
													<option value={0}>Tidak Aktif</option>
												</select>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4 col-md-12">
												<label>Editor</label>
												<Select
													closeMenuOnSelect={true}
													components={{
														ClearIndicator,
													}}
													styles={{
														clearIndicator: ClearIndicatorStyles,
													}}
													value={formWisata.editor}
													onChange={(e) => {
														setFormWisata({ ...formWisata, editor: e });
													}}
													options={[
														{
															value: "pannellum",
															label: "Pannellum",
															color: "#00B8D9",
														},
														{
															value: "3dvista",
															label: "3D Vista",
															color: "#00B8D9",
														},
													]}
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
																			label: capitalizeEachFirstLetter(
																				item.nama
																			),
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
																			label: capitalizeEachFirstLetter(
																				item.nama
																			),
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
																			label: capitalizeEachFirstLetter(
																				item.nama
																			),
																			color: "#00B8D9",
																		};
																	})
																);
															})
															.catch(() => {
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
													value={formWisata.desaId}
													onChange={(e) => {
														setFormWisata({ ...formWisata, desaId: e });
													}}
													options={desaList}
												/>
											</div>
											<div className="form-group mb-4 col-md-8">
												<label>Alamat</label>
												<textarea
													className="form-control"
													rows="2"
													value={formWisata.alamat}
													onChange={(e) => {
														setFormWisata({
															...formWisata,
															alamat: e.target.value,
														});
													}}
												></textarea>
											</div>
										</div>
										<div className="row">
											<div className="form-group mb-4 col-md-3">
												<div>
													<label>Longitude</label>
													<input
														type="text"
														className="form-control mb-3"
														placeholder="Pilih pada peta"
														value={long}
														disabled
													/>
												</div>
												<div>
													<label>Latitude</label>
													<input
														type="text"
														className="form-control mb-3"
														placeholder="Pilih pada peta"
														value={lat}
														disabled
													/>
												</div>
											</div>
											<div className="form-group mb-4 col-md-9">
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
														setLong(lonlat[0]);
														setLat(lonlat[1]);
													}, [])}
												>
													<ROSM />
													<RLayerVector>
														<RFeature
															geometry={new Point(fromLonLat([long, lat]))}
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
										{formWisata.jamOperasional.map((item, index) => {
											return (
												<div className="row" key={index}>
													<div className="col-md-3">
														<label>Hari</label>
														<input
															type="text"
															className="form-control"
															placeholder="Masukkan hari"
															value={item.hari || ""}
															onChange={(e) => {
																let newJamOperasional = [
																	...formWisata.jamOperasional,
																];
																newJamOperasional[index].hari = e.target.value;
																setFormWisata({
																	...formWisata,
																	jamOperasional: newJamOperasional,
																});
															}}
														/>
													</div>
													<div className="col-md-4">
														<label>Waktu Buka</label>
														<MuiPickersUtilsProvider utils={DateFnsUtils}>
															<TimePicker
																autoOk
																label=""
																value={
																	item.mulai
																		? new Date(`01/01/1970 ${item.mulai}`)
																		: null
																}
																onChange={(e) => {
																	const selectedTime =
																		e instanceof Date ? e : new Date();
																	const newJamOperasional = [
																		...formWisata.jamOperasional,
																	];
																	newJamOperasional[index].mulai = format(
																		selectedTime,
																		"HH:mm"
																	);
																	setFormWisata({
																		...formWisata,
																		jamOperasional: newJamOperasional,
																	});
																}}
															/>
														</MuiPickersUtilsProvider>
													</div>
													<div className="col-md-4">
														<label>Waktu Tutup</label>
														<MuiPickersUtilsProvider utils={DateFnsUtils}>
															<TimePicker
																autoOk
																label=""
																value={
																	item.akhir
																		? new Date(`01/01/1970 ${item.akhir}`)
																		: null
																}
																onChange={(e) => {
																	const selectedTime =
																		e instanceof Date ? e : new Date();
																	const newJamOperasional = [
																		...formWisata.jamOperasional,
																	];
																	newJamOperasional[index].akhir = format(
																		selectedTime,
																		"HH:mm"
																	);
																	setFormWisata({
																		...formWisata,
																		jamOperasional: newJamOperasional,
																	});
																}}
															/>
														</MuiPickersUtilsProvider>
													</div>
													{index ? (
														<div className="col-md-1">
															<button
																type="button"
																className="btn btn-danger mt-3 btn-sm"
																onClick={() => {
																	let newJamOperasional = [
																		...formWisata.jamOperasional,
																	];
																	newJamOperasional.splice(index, 1);
																	setFormWisata({
																		...formWisata,
																		jamOperasional: newJamOperasional,
																	});
																}}
															>
																<i className="fa fa-trash color-danger"></i>
															</button>
														</div>
													) : null}
												</div>
											);
										})}
										<div className="row">
											<div className="col-md-12 mb-4">
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
															setFormWisata({
																...formWisata,
																jamOperasional: [
																	...formWisata.jamOperasional,
																	{
																		hari: "",
																		mulai: "",
																		akhir: "",
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
										<Link to="/wisata">
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
};

export default WisataForm;

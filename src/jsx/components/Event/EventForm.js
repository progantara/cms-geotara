import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { checkImageResolution } from "../../../utils/checkImageWidth";
import {
	DatePicker,
	MuiPickersUtilsProvider,
	TimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import Select from "react-select";
import {
	createEvent,
	getEvent,
	updateEvent,
} from "../../../services/EventService";
import Swal from "sweetalert2";
import {
	getAllTourismPlace,
	getTourismPlace,
} from "../../../services/TourismPlaceService";
import BeatLoader from "react-spinners/BeatLoader";
import { currencyFormatter } from "../../../utils/stringFormatter";

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

const EventForm = () => {
	const history = useHistory();
	const { id } = useParams();

	let title = "Tambah Acara";
	let button = "Tambah";
	if (id !== undefined) {
		title = "Edit Acara";
		button = "Perbarui";
	}

	const [isLoading, setIsLoading] = useState(false);
	const [formEvent, setFormEvent] = useState({
		flyerImage: "",
		flyerImagePreview: "",
		nama: "",
		deskripsi: "",
		organizer: {
			nama: "",
			kontak: "",
		},
		harga: "",
		wisata: {},
		startEvent: {
			date: "",
			time: "",
		},
		endEvent: {
			date: "",
			time: "",
		},
	});
	const [wisataList, setWisataList] = useState([]);

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const formData = new FormData();
		formData.append("nama", formEvent.nama);
		formData.append("flyer_image", formEvent.flyerImage);
		formData.append("deskripsi", formEvent.deskripsi);
		formData.append("harga", formEvent.harga);
		formData.append("nama_organizer", formEvent.organizer.nama);
		formData.append("kontak_organizer", formEvent.organizer.kontak);
		formData.append("wisata_id", formEvent.wisata.value);
		formData.append("start_date", formEvent.startEvent.date);
		formData.append("start_time", formEvent.startEvent.time);
		formData.append("end_date", formEvent.endEvent.date);
		formData.append("end_time", formEvent.endEvent.time);
		createEvent(formData)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Acara berhasil ditambahkan", "success");
				history.push("/acara");
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
		const formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("nama", formEvent.nama);
		if (flyerImage !== "") formData.append("flyer_img", formEvent.flyerImage);
		formData.append("deskripsi", formEvent.deskripsi);
		formData.append("harga", formEvent.harga);
		formData.append("nama_organizer", formEvent.organizer.nama);
		formData.append("kontak_organizer", formEvent.organizer.kontak);
		formData.append("wisata_id", formEvent.wisata.value);
		formData.append("start_date", formEvent.startEvent.date);
		formData.append("start_time", formEvent.startEvent.time);
		formData.append("end_date", formEvent.endEvent.date);
		formData.append("end_time", formEvent.endEvent.time);
		updateEvent(id, formData)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Acara berhasil diperbarui", "success");
				history.push("/acara");
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
		if (id !== undefined) {
			getEvent(id)
				.then((res) => {
					getAllTourismPlace()
						.then((res) => {
							setWisataList(
								res.data.data.map((wisata) => {
									return {
										value: wisata._id,
										label: wisata.nama,
										color: "#00B8D9",
									};
								})
							);
						})
						.catch((err) => {
							Swal.fire("Gagal!", "Acara gagal dimuat", "error").then(() => {
								history.push("/acara");
							});
						});
					setFormEvent({
						...formEvent,
						nama: res.data.data.nama,
						deskripsi: res.data.data.deskripsi,
						organizer: {
							nama: res.data.data.organizer.nama,
							kontak: res.data.data.organizer.kontak,
						},
						startEvent: {
							date: res.data.data.start_event.date,
							time: res.data.data.start_event.time,
						},
						endEvent: {
							date: res.data.data.end_event.date,
							time: res.data.data.end_event.time,
						},
						flyerImagePreview: res.data.data.flyer_image,
					});
					getTourismPlace(res.data.data.wisata_id)
						.then((wisata) => {
							setFormEvent({
								...formEvent,
								wisata: {
									value: res.data.data.wisata_id,
									label: wisata.data.data.nama,
									color: "#00B8D9",
								},
							});
						})
						.catch(() => {
							Swal.fire("Gagal!", "Acara gagal dimuat", "error").then(() => {
								history.push("/acara");
							});
						});
				})
				.catch(() => {
					Swal.fire("Gagal!", "Acara gagal dimuat", "error").then(() => {
						history.push("/acara");
					});
				});
		} else {
			getAllTourismPlace()
				.then((res) => {
					setWisataList(
						res.data.data.map((wisata) => {
							return {
								value: wisata._id,
								label: wisata.nama,
								color: "#00B8D9",
							};
						})
					);
				})
				.catch(() => {
					Swal.fire("Gagal!", "Acara gagal dimuat", "error").then(() => {
						history.push("/acara");
					});
				});
		}
	}, []);

	return (
		<div className="h-80">
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Tambah Acara</h4>
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
											<div className="form-group mb-3 col-md-12">
												<label>Nama</label>
												<input
													type="text"
													className="form-control"
													placeholder="Nama acara"
													value={formEvent.nama}
													onChange={(e) =>
														setFormEvent({ ...formEvent, nama: e.target.value })
													}
												/>
											</div>
											<div className="form-group mb-3">
												<label>Flyer Image</label>
												<div className="input-group">
													<div className="form-file">
														<input
															type="file"
															className="custom-file-input form-control"
															accept="image/*"
															onChange={(event) => {
																checkImageResolution(event.target.files[0])
																	.then(() => {
																		setFormEvent({
																			...formEvent,
																			flyerImage: event.target.files[0],
																		});
																	})
																	.catch(() => {
																		Swal.fire(
																			"Gagal!",
																			"Ukuran gambar terlalu besar",
																			"error"
																		);
																	});
															}}
														/>
													</div>
													<span className="input-group-text">Upload</span>
												</div>
												{formEvent.flyerImagePreview && (
													<img
														src={
															process.env.REACT_APP_STORAGE_BASE_URL +
															"/event/" +
															formEvent.flyerImagePreview
														}
														alt="banner"
														className="img-fluid border border-2 border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
												{formEvent.flyerImage && (
													<img
														src={URL.createObjectURL(formEvent.flyerImage)}
														alt="flyer"
														className="img-fluid border border-2 border-dark rounded-3"
														style={{
															width: "40%",
															height: "auto",
														}}
													/>
												)}
											</div>
											<div className="form-group mb-3 col-md-12">
												<label>Deskripsi</label>
												<textarea
													className="form-control"
													rows="4"
													placeholder="Description"
													value={formEvent.deskripsi}
													onChange={(e) =>
														setFormEvent({
															...formEvent,
															deskripsi: e.target.value,
														})
													}
												></textarea>
											</div>
											<div className="form-group mb-3 col-md-6">
												<label>Nama Penyelenggara</label>
												<input
													type="text"
													className="form-control"
													placeholder="Nama Penyelanggara"
													value={formEvent.organizer.nama}
													onChange={(e) =>
														setFormEvent({
															...formEvent,
															organizer: {
																...formEvent.organizer,
																nama: e.target.value,
															},
														})
													}
												/>
											</div>
											<div className="form-group mb-3 col-md-6">
												<label>Kontak Penyelanggara</label>
												<input
													type="text"
													className="form-control"
													placeholder="Kontak Penyelanggara"
													value={formEvent.organizer.kontak}
													onChange={(e) =>
														setFormEvent({
															...formEvent,
															organizer: {
																...formEvent.organizer,
																kontak: e.target.value,
															},
														})
													}
												/>
											</div>
											<div className="form-group mb-3 col-md-6">
												<label>
													Harga {currencyFormatter(formEvent.harga, "id-ID")}
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan harga"
													value={formEvent.harga}
													onChange={(e) =>
														setFormEvent({
															...formEvent,
															harga: e.target.value,
														})
													}
												/>
											</div>
											<div className="form-group mb-3 col-md-6">
												<label>Wisata</label>
												<Select
													closeMenuOnSelect={true}
													components={{ ClearIndicator }}
													styles={{ clearIndicator: ClearIndicatorStyles }}
													value={formEvent.wisata}
													onChange={(e) => {
														setFormEvent({ ...formEvent, wisata: e });
													}}
													options={wisataList}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
												<label>Tanggal Mulai</label>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<DatePicker
														autoOk
														label=""
														clearable
														format="yyyy-MM-dd"
														value={
															formEvent.startEvent.date
																? formEvent.startEvent.date
																: null
														}
														onChange={(date) => {
															const formattedDate = date
																? format(date, "yyyy-MM-dd")
																: null;
															setFormEvent({
																...formEvent,
																startEvent: {
																	...formEvent.startEvent,
																	date: formattedDate,
																},
															});
														}}
													/>
												</MuiPickersUtilsProvider>
											</div>
											<div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
												<label>Waktu Mulai</label>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<TimePicker
														autoOk
														label=""
														value={
															formEvent.startEvent.time
																? new Date(
																		`01/01/1970 ${formEvent.startEvent.time}`
																  )
																: null
														}
														onChange={(time) => {
															const formattedTime = time
																? format(time, "HH:mm")
																: null;
															setFormEvent({
																...formEvent,
																startEvent: {
																	...formEvent.startEvent,
																	time: formattedTime,
																},
															});
														}}
													/>
												</MuiPickersUtilsProvider>
											</div>
											<div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
												<label>Tanggal Selesai</label>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<DatePicker
														autoOk
														label=""
														clearable
														format="yyyy-MM-dd"
														value={
															formEvent.endEvent.date
																? formEvent.endEvent.date
																: null
														}
														onChange={(date) => {
															const formattedDate = date
																? format(date, "yyyy-MM-dd")
																: null;
															setFormEvent({
																...formEvent,
																endEvent: {
																	...formEvent.endEvent,
																	date: formattedDate,
																},
															});
														}}
													/>
												</MuiPickersUtilsProvider>
											</div>
											<div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
												<label>Waktu Selesai</label>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<TimePicker
														autoOk
														label=""
														value={
															formEvent.endEvent.time
																? new Date(
																		`01/01/1970 ${formEvent.endEvent.time}`
																  )
																: null
														}
														onChange={(time) => {
															const formattedTime = time
																? format(time, "HH:mm")
																: null;
															setFormEvent({
																...formEvent,
																endEvent: {
																	...formEvent.endEvent,
																	time: formattedTime,
																},
															});
														}}
													/>
												</MuiPickersUtilsProvider>
											</div>
										</div>
										<button type="submit" className="btn btn-primary me-3">
											Submit
										</button>
										<Link to="/acara">
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

export default EventForm;

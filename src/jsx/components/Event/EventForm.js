import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { checkImageResolution } from "../../../utils/checkImageWidth";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import Select from "react-select";
import {
	createEvent,
	getEvent,
	updateEvent,
} from "../../../services/EventService";
import Swal from "sweetalert2";
import { getTourismPlace } from "../../../services/TourismPlaceService";

const wisataOption = [
	{ value: "64213529eb7c0000630075c2", label: "Pantai Jawa", color: "#00B8D9" },
];

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

	let title = "Tambah Wisata";
	let button = "Tambah";
	if (id !== undefined) {
		title = "Edit Wisata";
		button = "Perbarui";
	}

	const [nama, setNama] = useState("");
	const [flyerImage, setflyerImage] = useState("");
	const [flyerImagePreview, setflyerImagePreview] = useState("");
	const [deskripsi, setDeskripsi] = useState("");
	const [penyelenggara, setPenyelenggara] = useState("");
	const [wisata, setWisata] = useState({});
	const [tanggal_mulai, setTanggalMulai] = useState("");
	const [tanggal_selesai, setTanggalSelesai] = useState("");

	const handleCreate = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("nama", nama);
		formData.append("flyer_image", flyerImage);
		formData.append("deskripsi", deskripsi);
		formData.append("organizer", penyelenggara);
		formData.append("wisata_id", wisata.value);
		formData.append("start_date", tanggal_mulai);
		formData.append("end_date", tanggal_selesai);
		createEvent(formData)
			.then((res) => {
				Swal.fire("Berhasil!", "Acara berhasil ditambahkan", "success");
				history.push("/acara");
			})
			.catch((err) => {
				Swal.fire("Gagal!", "Acara gagal ditambahkan", "error");
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("nama", nama);
		if (flyerImage !== "") formData.append("flyer_img", flyerImage);
		formData.append("deskripsi", deskripsi);
		formData.append("organizer", penyelenggara);
		formData.append("wisata_id", wisata.value);
		formData.append("start_date", tanggal_mulai);
		formData.append("end_date", tanggal_selesai);
		updateEvent(id, formData)
			.then((res) => {
				Swal.fire("Berhasil!", "Acara berhasil diperbarui", "success");
				history.push("/acara");
			})
			.catch((err) => {
				Swal.fire("Gagal!", "Acara gagal diperbarui", "error");
			});
	};

	useEffect(() => {
		if (id !== undefined) {
			getEvent(id)
				.then((res) => {
					setNama(res.data.data.nama);
					setDeskripsi(res.data.data.deskripsi);
					setPenyelenggara(res.data.data.organizer);
					setTanggalMulai(res.data.data.start_date);
					setTanggalSelesai(res.data.data.end_date);
					setflyerImagePreview(res.data.data.flyer_image);
					getTourismPlace(res.data.data.wisata_id)
						.then((wisata) => {
							setWisata({
								value: res.data.data.wisata_id,
								label: wisata.data.data.nama,
								color: "#00B8D9",
							});
						})
						.catch((err) => {
							Swal.fire("Gagal!", "Wisata acara gagal dimuat", "error").then(
								() => {
									history.push("/acara");
								}
							);
						});
				})
				.catch((err) => {
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
							<div className="basic-form">
								<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
									<div className="row">
										<div className="form-group mb-3 col-md-12">
											<label>Nama</label>
											<input
												type="text"
												className="form-control"
												placeholder="Nama acara"
												value={nama}
												onChange={(e) => setNama(e.target.value)}
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
																.then((res) => {
																	setflyerImage(event.target.files[0]);
																})
																.catch((err) => {
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
											{flyerImagePreview != "" && (
												<img
													src={
														"http://127.0.0.1:8000/storage/event/" +
														flyerImagePreview
													}
													alt="banner"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: "40%",
														height: "auto",
													}}
												/>
											)}
											{flyerImage != "" && (
												<img
													src={URL.createObjectURL(flyerImage)}
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
												value={deskripsi}
												onChange={(e) => setDeskripsi(e.target.value)}
											></textarea>
										</div>
										<div className="form-group mb-3 col-md-6">
											<label>Penyelenggara</label>
											<input
												type="text"
												className="form-control"
												placeholder="Nama acara"
												value={penyelenggara}
												onChange={(e) => setPenyelenggara(e.target.value)}
											/>
										</div>
										<div className="form-group mb-3 col-md-6">
											<label>Wisata</label>
											<Select
												closeMenuOnSelect={true}
												components={{ ClearIndicator }}
												styles={{ clearIndicator: ClearIndicatorStyles }}
												value={wisata}
												onChange={(e) => {
													setWisata(e);
												}}
												options={wisataOption}
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
													value={tanggal_mulai ? tanggal_mulai : null}
													onChange={(date) => {
														const formattedDate = date
															? format(date, "yyyy-MM-dd")
															: null;
														setTanggalMulai(formattedDate);
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
													value={tanggal_selesai ? tanggal_selesai : null}
													onChange={(date) => {
														const formattedDate = date
															? format(date, "yyyy-MM-dd")
															: null;
														setTanggalSelesai(formattedDate);
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

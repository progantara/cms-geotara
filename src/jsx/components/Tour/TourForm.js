import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { createTour, getTour, updateTour } from '../../../services/TourService';
import { getAllDesaSelect } from '../../../services/DesaService';
import { format } from 'date-fns';
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import Select from 'react-select';
import { RControl, RLayerTile, RMap, ROSM } from 'rlayers';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const [desa, setDesa] = useState([]);
	const [inputTour, setInputTour] = useState({
		nama: '',
		thumbnail: '',
		thumbnailPreview: '',
		no_telp: '',
		email: '',
		rating: '',
		harga: '',
	});
	const [lokasi, setLokasi] = useState({
		lat: '',
		long: '',
		desa_id: '',
		alamat: '',
	});
	const [detail, setDetail] = useState({
		fasilitas: [''],
		jurusan: [
			{
				tipe: '',
				harga: '',
				thumbnail: '',
				thumbnailPreview: '',
				keberangkatan: '',
				jam_keberangkatan: '',
				tujuan: '',
				estimasi_sampai: '',
			},
		],
	});

	let title = 'Tambah Tour';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Tour';
		button = 'Update';
	}

	const ClearIndicator = (props) => {
		const {
			children = 'clear all',
			getStyles,
			innerProps: { ref, ...restInnerProps },
		} = props;
		return (
			<div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
				<div style={{ padding: '0px 5px' }}>{children}</div>
			</div>
		);
	};

	const ClearIndicatorStyles = (base, state) => ({
		...base,
		cursor: 'pointer',
		color: state.isFocused ? 'blue' : 'black',
	});

	useEffect(() => {
		const fetchData = async () => {
			const result = await getAllDesaSelect();
			setDesa(result);
		};
		fetchData();
		if (id !== undefined) {
			getTour(id)
				.then((res) => {
					let data = res.data.data;
					setInputTour({
						thumbnail: '',
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
						desa_id: data.lokasi.desa_id,
						alamat: data.lokasi.alamat,
					});
					setDetail({
						fasilitas: data.detail.fasilitas[0],
						jurusan: [
							{
								tipe: data.detail.jurusan[0].tipe,
								harga: data.detail.jurusan[0].harga,
								thumbnail: '',
								thumbnailPreview: data.detail.jurusan[0].thumbnail,
								keberangkatan: data.detail.jurusan[0].keberangkatan,
								jam_keberangkatan: data.detail.jurusan[0].jam_keberangkatan,
								tujuan: data.detail.jurusan[0].tujuan,
								estimasi_sampai: data.detail.jurusan[0].estimasi_sampai,
							},
						],
					});
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Tour gagal dimuat', 'error').then(() => {
						history.push('/tour');
					});
				});
		}
	}, [id, setDesa]);

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
		const newJamOperasional = format(selectedTime, 'HH:mm');
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

	const handleCreate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append('nama', inputTour.nama);
		data.append('thumbnail', inputTour.thumbnail);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id);
		data.append('alamat', lokasi.alamat);
		data.append('no_telp', inputTour.no_telp);
		data.append('email', inputTour.email);
		data.append('rating', inputTour.rating);
		data.append('harga', inputTour.rating);
		data.append('fasilitas[0]', detail.fasilitas[0]);
		data.append('jurusan[0][tipe]', detail.jurusan[0].tipe);
		data.append('jurusan[0][harga]', detail.jurusan[0].harga);
		data.append('jurusan[0][thumbnail]', detail.jurusan[0].thumbnail);
		data.append('jurusan[0][keberangkatan]', detail.jurusan[0].keberangkatan);
		data.append('jurusan[0][jam_keberangkatan]', detail.jurusan[0].jam_keberangkatan);
		data.append('jurusan[0][tujuan]', detail.jurusan[0].tujuan);
		data.append('jurusan[0][estimasi_sampai]', detail.jurusan[0].estimasi_sampai);
		createTour(data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Tour berhasil ditambahkan', 'success');
				history.push('/tour');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Tour gagal ditambahkan.', 'error');
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append('_method', 'put');
		data.append('nama', inputTour.nama);
		if (inputTour.thumbnail !== '') data.append('thumbnail', inputTour.thumbnail);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id);
		data.append('alamat', lokasi.alamat);
		data.append('no_telp', inputTour.no_telp);
		data.append('email', inputTour.email);
		data.append('rating', inputTour.rating);
		data.append('harga', inputTour.rating);
		data.append('fasilitas[0]', detail.fasilitas[0]);
		data.append('jurusan[0][tipe]', detail.jurusan[0].tipe);
		data.append('jurusan[0][harga]', detail.jurusan[0].harga);
		if (detail.jurusan[0].thumbnail !== '') data.append('jurusan[0][thumbnail]', detail.jurusan[0].thumbnail);
		data.append('jurusan[0][keberangkatan]', detail.jurusan[0].keberangkatan);
		data.append('jurusan[0][jam_keberangkatan]', detail.jurusan[0].jam_keberangkatan);
		data.append('jurusan[0][tujuan]', detail.jurusan[0].tujuan);
		data.append('jurusan[0][estimasi_sampai]', detail.jurusan[0].estimasi_sampai);

		updateTour(id, data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Tour berhasil diubah', 'success');
				history.push('/tour');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Tour gagal diubah.', 'error');
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
							<div className="basic-form">
								<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
									<div className="row">
										<div className="form-group mb-3">
											<label>
												Nama
												Tour
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan nama tour"
												name="nama"
												value={
													inputTour.nama
												}
												onChange={
													handleChangeTour
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-3">
											<label>
												Thumbnail
											</label>
											<div className="input-group">
												<div className="form-file">
													<input
														type="file"
														className="form-file-input form-control"
														name="thumbnail"
														accept="image/*"
														onChange={
															handleImageChange
														}
													/>
												</div>
												<span className="input-group-text">
													Upload
												</span>
											</div>
											{inputTour.thumbnailPreview !=
												'' && (
												<img
													src={
														'http://127.0.0.1:8000/storage/tour/' +
														inputTour.thumbnailPreview
													}
													alt="banner"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
											{inputTour.thumbnail !=
												'' && (
												<img
													src={URL.createObjectURL(
														inputTour.thumbnail
													)}
													alt="banner"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-4">
											<label>Desa</label>
											{/* <Select
												closeMenuOnSelect={
													false
												}
												components={{
													ClearIndicator,
												}}
												styles={{
													clearIndicator: ClearIndicatorStyles,
												}}
												value={
													inputTour.desa_id
														? inputTour.desa_id
														: 'option'
												}
												className="form-control"
												name="desa_id"
												onChange={
													handleChangeTour
												}
												options={
													desa
												}
											/> */}
											<select
												value={
													lokasi.desa_id
														? lokasi.desa_id
														: 'option'
												}
												className="form-control"
												name="desa_id"
												onChange={
													handleChangeLokasi
												}
											>
												<option
													value="option"
													disabled
												>
													Pilih
													Desa...
												</option>
												{desa.map(
													(
														item
													) => {
														return (
															<option
																key={
																	item.kode
																}
																value={
																	item.kode
																}
															>
																{
																	item.nama
																}
															</option>
														);
													}
												)}
											</select>
										</div>
										<div className="form-group mb-3 col-md-8">
											<label>
												Alamat
											</label>
											<textarea
												className="form-control"
												rows="2"
												name="alamat"
												value={
													lokasi.alamat
												}
												onChange={
													handleChangeLokasi
												}
											></textarea>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-3">
											<div>
												<label>
													Longitude
												</label>
												<input
													type="text"
													className="form-control mb-3"
													placeholder="Pilih pada peta"
													value={
														lokasi.long
													}
													disabled
												/>
											</div>
											<div>
												<label>
													Latitude
												</label>
												<input
													type="text"
													className="form-control mb-3"
													placeholder="Pilih pada peta"
													value={
														lokasi.lat
													}
													disabled
												/>
											</div>
										</div>
										<div className="form-group mb-3 col-md-9">
											<RMap
												width={
													'100%'
												}
												height={
													'60vh'
												}
												initial={{
													center: fromLonLat(
														[
															107.448914,
															-7.100948,
														]
													),
													zoom: 11,
												}}
												noDefaultControls={
													true
												}
												onClick={useCallback(
													(
														e
													) => {
														const coords =
															e.map.getCoordinateFromPixel(
																e.pixel
															);
														const lonlat =
															toLonLat(
																coords
															);
														setLokasi(
															{
																...lokasi,
																long: lonlat[0],
																lat: lonlat[1],
															}
														);
													},
													[]
												)}
											>
												<ROSM />
												<RControl.RScaleLine />
												<RControl.RAttribution />
												<RControl.RZoom />
												<RControl.RZoomSlider />
											</RMap>
										</div>
									</div>
									<div className="row">
										<div className="mb-3 form-group col-md-4">
											<label>
												No
												Telp
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan nomor telepon"
												name="no_telp"
												onChange={
													handleChangeTour
												}
												value={
													inputTour.no_telp
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-4">
											<label>Email</label>
											<input
												type="email"
												className="form-control"
												placeholder="Masukkan email"
												name="email"
												onChange={
													handleChangeTour
												}
												value={
													inputTour.email
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-4">
											<label>
												Rating
											</label>
											<input
												type="number"
												min="0"
												max="5"
												step="0.5"
												className="form-control"
												placeholder="Masukkan rating"
												name="rating"
												onChange={
													handleChangeTour
												}
												value={
													inputTour.rating
												}
											/>
										</div>
									</div>
									<div className="row">
										<h5>Fasilitas 1</h5>
										<div className="mb-3 form-group col-md-4">
											<label>
												Fasilitas
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan fasilitas"
												name="fasilitas"
												value={
													detail
														.fasilitas[0]
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															detail
														) => ({
															...detail,
															fasilitas: [
																event
																	.target
																	.value,
																...detail.fasilitas.slice(
																	1
																),
															],
														})
													)
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-4">
											<label>Tipe</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan tipe"
												name="tipe"
												value={
													detail
														.jurusan[0]
														.tipe
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															prevState
														) => ({
															...prevState,
															jurusan: [
																{
																	...prevState
																		.jurusan[0],
																	tipe: event
																		.target
																		.value,
																},
																...prevState.jurusan.slice(
																	1
																),
															],
														})
													)
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-4">
											<label>Harga</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan harga"
												name="harga"
												value={
													detail
														.jurusan[0]
														.harga
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															prevState
														) => ({
															...prevState,
															jurusan: [
																{
																	...prevState
																		.jurusan[0],
																	harga: event
																		.target
																		.value,
																},
																...prevState.jurusan.slice(
																	1
																),
															],
														})
													)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="mb-3 form-group">
											<label>
												Thumbnail
											</label>
											<div className="input-group">
												<div className="form-file">
													<input
														type="file"
														className="form-file-input form-control"
														name="thumbnail"
														accept="image/*"
														onChange={(
															event
														) =>
															setDetail(
																(
																	prevState
																) => ({
																	...prevState,
																	jurusan: [
																		{
																			...prevState
																				.jurusan[0],
																			thumbnail: event
																				.target
																				.files[0],
																		},
																		...prevState.jurusan.slice(
																			1
																		),
																	],
																})
															)
														}
													/>
												</div>
												<span className="input-group-text">
													Upload
												</span>
											</div>
											{detail.jurusan[0]
												.thumbnailPreview !=
												'' && (
												<img
													src={
														'http://127.0.0.1:8000/storage/accomodation/detail' +
														detail
															.jurusan[0]
															.thumbnailPreview
													}
													alt="banner"
													className="border border-2 img-fluid border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
											{detail.jurusan[0]
												.thumbnail !=
												'' && (
												<img
													src={URL.createObjectURL(
														detail
															.jurusan[0]
															.thumbnail
													)}
													alt="banner"
													className="border border-2 img-fluid border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
										</div>
									</div>
									<div className="row">
										<div className="mb-3 form-group col-md-6">
											<label>
												Keberangkatan
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan keberangkatan"
												name="keberangkatan"
												value={
													detail
														.jurusan[0]
														.keberangkatan
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															prevState
														) => ({
															...prevState,
															jurusan: [
																{
																	...prevState
																		.jurusan[0],
																	keberangkatan: event
																		.target
																		.value,
																},
																...prevState.jurusan.slice(
																	1
																),
															],
														})
													)
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-6">
											<label>
												Tujuan
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan tujuan"
												name="tujuan"
												value={
													detail
														.jurusan[0]
														.tujuan
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															prevState
														) => ({
															...prevState,
															jurusan: [
																{
																	...prevState
																		.jurusan[0],
																	tujuan: event
																		.target
																		.value,
																},
																...prevState.jurusan.slice(
																	1
																),
															],
														})
													)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
											<label>
												Jam
												Keberangkatan
											</label>
											<MuiPickersUtilsProvider
												utils={
													DateFnsUtils
												}
											>
												<TimePicker
													name="jam_keberangkatan"
													value={
														detail
															.jurusan[0]
															.jam_keberangkatan
															? new Date(
																	`01/01/1970 ${detail.jurusan[0].jam_keberangkatan}`
															  )
															: null
													}
													onChange={(
														e
													) =>
														handleDateChange(
															e,
															'jam_keberangkatan'
														)
													}
												/>
											</MuiPickersUtilsProvider>
										</div>
										<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
											<label>
												Estimasi
												Sampai
											</label>
											<MuiPickersUtilsProvider
												utils={
													DateFnsUtils
												}
											>
												<TimePicker
													name="estimasi_sampai"
													value={
														detail
															.jurusan[0]
															.estimasi_sampai
															? new Date(
																	`01/01/1970 ${detail.jurusan[0].estimasi_sampai}`
															  )
															: null
													}
													onChange={(
														time
													) =>
														handleDateChange(
															time,
															'estimasi_sampai'
														)
													}
												/>
											</MuiPickersUtilsProvider>
										</div>
									</div>
									<button type="submit" className="btn btn-primary me-2">
										{button}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

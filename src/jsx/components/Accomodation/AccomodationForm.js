import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { createAccomodation, getAccomodation, updateAccomodation } from '../../../services/AccomodationService';
import { getAllDesaSelect } from '../../../services/DesaService';
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import Select from 'react-select';
import { RControl, RLayerTile, RMap, ROSM } from 'rlayers';

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const [desa, setDesa] = useState([]);
	const [inputAccomodation, setInputAccomodation] = useState({
		thumbnail: '',
		thumbnailPreview: '',
		nama: '',
		deskripsi: '',
		no_telp: '',
		email: '',
		harga: '',
		rating: '',
	});
	const [lokasi, setLokasi] = useState({
		lat: '',
		long: '',
		desa_id: '',
		alamat: '',
	});
	const [detail, setDetail] = useState({
		fasilitas: [''],
		kamar: [
			{
				tipe: '',
				harga: '',
				thumbnail: '',
				thumbnailPreview: '',
			},
		],
	});

	let title = 'Tambah Accomodation';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Accomodation';
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
			getAccomodation(id)
				.then((res) => {
					// alert(res.data.data);
					let data = res.data.data;
					setInputAccomodation({
						thumbnail: '',
						thumbnailPreview: data.thumbnail,
						nama: data.nama,
						deskripsi: data.deskripsi,
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
						kamar: [
							{
								tipe: data.detail.kamar[0].tipe,
								harga: data.detail.kamar[0].harga,
								thumbnail: '',
								thumbnailPreview: data.detail.kamar[0].thumbnail,
							},
						],
					});
					// console.log(inputAccomodation);
					// console.log(lokasi);
					// console.log(detail);
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Accomodation gagal dimuat', 'error').then(() => {
						history.push('/accomodation');
					});
					console.log(inputAccomodation);
				});
		}
	}, [id, setDesa]);

	const handleChangeAccomodation = (e) => {
		const value = e.target.value;
		setInputAccomodation({
			...inputAccomodation,
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
		setInputAccomodation({
			...inputAccomodation,
			[e.target.name]: value,
		});
	};

	const handleCreate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append('thumbnail', inputAccomodation.thumbnail);
		data.append('nama', inputAccomodation.nama);
		data.append('deskripsi', inputAccomodation.deskripsi);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id);
		data.append('alamat', lokasi.alamat);
		data.append('no_telp', inputAccomodation.no_telp);
		data.append('email', inputAccomodation.email);
		data.append('harga', inputAccomodation.harga);
		data.append('rating', inputAccomodation.rating);
		data.append('fasilitas[0]', detail.fasilitas[0]);
		data.append('kamar[0][tipe]', detail.kamar[0].tipe);
		data.append('kamar[0][harga]', detail.kamar[0].harga);
		data.append('kamar[0][thumbnail]', detail.kamar[0].thumbnail);
		createAccomodation(data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Accomodation berhasil ditambahkan', 'success');
				history.push('/accomodation');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Accomodation gagal ditambahkan.', 'error');
				console.log(err);
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append('_method', 'put');
		if (inputAccomodation.thumbnail !== '') data.append('thumbnail', inputAccomodation.thumbnail);
		data.append('nama', inputAccomodation.nama);
		data.append('deskripsi', inputAccomodation.deskripsi);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id);
		data.append('alamat', lokasi.alamat);
		data.append('no_telp', inputAccomodation.no_telp);
		data.append('email', inputAccomodation.email);
		data.append('harga', inputAccomodation.harga);
		data.append('rating', inputAccomodation.rating);
		data.append('fasilitas[0]', detail.fasilitas[0]);
		data.append('kamar[0][tipe]', detail.kamar[0].tipe);
		data.append('kamar[0][harga]', detail.kamar[0].harga);
		if (detail.kamar[0].thumbnail !== '') data.append('kamar[0][thumbnail]', detail.kamar[0].thumbnail);

		updateAccomodation(id, data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Accomodation berhasil diubah', 'success');
				history.push('/accomodation');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Accomodation gagal diubah.', 'error');
				console.log(err);
				console.log(data);
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
										<div className="mb-3 form-group">
											<label>
												Nama
												Accomodation
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan nama accomodation"
												name="nama"
												value={
													inputAccomodation.nama
												}
												onChange={
													handleChangeAccomodation
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="mb-3 form-group col-md-12">
											<label>
												Deskripsi
											</label>
											<textarea
												className="form-control"
												rows="2"
												name="deskripsi"
												value={
													inputAccomodation.deskripsi
												}
												onChange={
													handleChangeAccomodation
												}
											></textarea>
										</div>
									</div>
									<div className="row">
										<div className="mb-3 form-group">
											<label>
												Banner
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
											{inputAccomodation.thumbnailPreview !=
												'' && (
												<img
													src={
														'http://127.0.0.1:8000/storage/accomodation/' +
														inputAccomodation.thumbnailPreview
													}
													alt="banner"
													className="border border-2 img-fluid border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
											{inputAccomodation.thumbnail !=
												'' && (
												<img
													src={URL.createObjectURL(
														inputAccomodation.thumbnail
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
										<div className="mb-3 form-group col-md-4">
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
													inputAccomodation.desa_id
														? inputAccomodation.desa_id
														: 'option'
												}
												className="form-control"
												name="desa_id"
												onChange={
													handleChangeAccomodation
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
										<div className="mb-3 form-group col-md-8">
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
										<div className="mb-3 form-group col-md-3">
											<div>
												<label>
													Longitude
												</label>
												<input
													type="text"
													className="mb-3 form-control"
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
													className="mb-3 form-control"
													placeholder="Pilih pada peta"
													value={
														lokasi.lat
													}
													disabled
												/>
											</div>
										</div>
										<div className="mb-3 form-group col-md-9">
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
										<div className="mb-3 form-group col-md-6">
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
													handleChangeAccomodation
												}
												value={
													inputAccomodation.no_telp
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-6">
											<label>Email</label>
											<input
												type="email"
												className="form-control"
												placeholder="Masukkan email"
												name="email"
												onChange={
													handleChangeAccomodation
												}
												value={
													inputAccomodation.email
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="mb-3 form-group col-md-6">
											<label>Harga</label>
											<input
												type="number"
												className="form-control"
												placeholder="Masukkan harga"
												name="harga"
												onChange={
													handleChangeAccomodation
												}
												value={
													inputAccomodation.harga
												}
											/>
										</div>
										<div className="mb-3 form-group col-md-6">
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
													handleChangeAccomodation
												}
												value={
													inputAccomodation.rating
												}
											/>
										</div>
									</div>
									<hr />
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
														.kamar[0]
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
															kamar: [
																{
																	...prevState
																		.kamar[0],
																	tipe: event
																		.target
																		.value,
																},
																...prevState.kamar.slice(
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
														.kamar[0]
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
															kamar: [
																{
																	...prevState
																		.kamar[0],
																	harga: event
																		.target
																		.value,
																},
																...prevState.kamar.slice(
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
																	kamar: [
																		{
																			...prevState
																				.kamar[0],
																			thumbnail: event
																				.target
																				.files[0],
																		},
																		...prevState.kamar.slice(
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
											{detail.kamar[0]
												.thumbnailPreview !=
												'' && (
												<img
													src={
														'http://127.0.0.1:8000/storage/accomodation/detail' +
														detail
															.kamar[0]
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
											{detail.kamar[0]
												.thumbnail !=
												'' && (
												<img
													src={URL.createObjectURL(
														detail
															.kamar[0]
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

import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { createAccomodation, getAccomodation, updateAccomodation } from '../../../services/AccomodationService';
import { getAllProvinsi } from '../../../services/ProvinsiService';
import { getAllKotaByCode } from '../../../services/KotaService';
import { getAllDistrikByCode, getDistrik } from '../../../services/DistrikService';
import { getAllDesaByCode, getDesa } from '../../../services/DesaService';
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import Select from 'react-select';
import { RControl, RLayerTile, RMap, ROSM } from 'rlayers';

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const [provinsiId, setProvinsiId] = useState({});
	const [provinsiList, setProvinsiList] = useState([]);
	const [kotaId, setKotaId] = useState({});
	const [kotaList, setKotaList] = useState([]);
	const [distrikId, setDistrikId] = useState({});
	const [distrikList, setDistrikList] = useState([]);
	const [desaList, setDesaList] = useState([]);
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
		desa_id: {},
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
		if (id !== undefined) {
			getAccomodation(id)
				.then((res) => {
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
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Accomodation gagal dimuat', 'error').then(() => {
						history.push('/accomodation');
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
								color: '#00B8D9',
							};
						})
					);
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Provinsi gagal dimuat', 'error');
				});
		}
	}, [id, setProvinsiList]);

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
		data.append('desa_id', lokasi.desa_id.value);
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
		data.append('desa_id', lokasi.desa_id.value);
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
														process.env.REACT_APP_STORAGE_BASE_URL+'/accomodation/' +
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
										<div className="form-group mb-4 col-md-4">
											<label>
												Provinsi
											</label>
											<Select
												closeMenuOnSelect={
													true
												}
												components={{
													ClearIndicator,
												}}
												styles={{
													clearIndicator: ClearIndicatorStyles,
												}}
												value={
													provinsiId
												}
												onChange={(
													e
												) => {
													setProvinsiId(
														e
													);
													getAllKotaByCode(
														e.value
													)
														.then(
															(
																res
															) => {
																setKotaList(
																	res.data.data.map(
																		(
																			item
																		) => {
																			return {
																				value: item.kode,
																				label: item.nama,
																				color: '#00B8D9',
																			};
																		}
																	)
																);
															}
														)
														.catch(
															(
																err
															) => {
																Swal.fire(
																	'Gagal!',
																	'Kota gagal dimuat',
																	'error'
																);
																history.push(
																	'/wisata'
																);
															}
														);
												}}
												options={
													provinsiList
												}
											/>
										</div>
										<div className="form-group mb-4 col-md-4">
											<label>Kota</label>
											<Select
												closeMenuOnSelect={
													true
												}
												components={{
													ClearIndicator,
												}}
												styles={{
													clearIndicator: ClearIndicatorStyles,
												}}
												value={
													kotaId
												}
												onChange={(
													e
												) => {
													setKotaId(
														e
													);
													getAllDistrikByCode(
														e.value
													)
														.then(
															(
																res
															) => {
																setDistrikList(
																	res.data.data.map(
																		(
																			item
																		) => {
																			return {
																				value: item.kode,
																				label: item.nama,
																				color: '#00B8D9',
																			};
																		}
																	)
																);
															}
														)
														.catch(
															(
																err
															) => {
																Swal.fire(
																	'Gagal!',
																	'Distrik gagal dimuat',
																	'error'
																);
																history.push(
																	'/wisata'
																);
															}
														);
												}}
												options={
													kotaList
												}
											/>
										</div>
										<div className="form-group mb-4 col-md-4">
											<label>
												Distrik
											</label>
											<Select
												closeMenuOnSelect={
													true
												}
												components={{
													ClearIndicator,
												}}
												styles={{
													clearIndicator: ClearIndicatorStyles,
												}}
												value={
													distrikId
												}
												onChange={(
													e
												) => {
													setDistrikId(
														e
													);
													getAllDesaByCode(
														e.value
													)
														.then(
															(
																res
															) => {
																setDesaList(
																	res.data.data.map(
																		(
																			item
																		) => {
																			return {
																				value: item.kode,
																				label: item.nama,
																				color: '#00B8D9',
																			};
																		}
																	)
																);
															}
														)
														.catch(
															(
																err
															) => {
																Swal.fire(
																	'Gagal!',
																	'Desa gagal dimuat',
																	'error'
																);
																history.push(
																	'/wisata'
																);
															}
														);
												}}
												options={
													distrikList
												}
											/>
										</div>
										<div className="form-group mb-4 col-md-4">
											<label>Desa</label>
											<Select
												closeMenuOnSelect={
													true
												}
												components={{
													ClearIndicator,
												}}
												styles={{
													clearIndicator: ClearIndicatorStyles,
												}}
												value={
													lokasi.desa_id
												}
												options={
													desaList
												}
												name="desa_id"
												onChange={(
													e
												) => {
													setLokasi(
														{
															...lokasi,
															desa_id: e,
														}
													);
												}}
											/>
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
														process.env.REACT_APP_STORAGE_BASE_URL+'/accomodation/detail' +
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

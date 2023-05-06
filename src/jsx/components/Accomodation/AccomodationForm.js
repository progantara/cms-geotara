import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link, useHistory, useParams } from 'react-router-dom';
import { createAccomodation, getAccomodation, updateAccomodation } from '../../../services/AccomodationService';
import { getAllProvinsi } from '../../../services/ProvinsiService';
import { getAllKotaByCode } from '../../../services/KotaService';
import { getAllDistrikByCode } from '../../../services/DistrikService';
import { getAllDesaByCode, getParentDesa } from '../../../services/DesaService';
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import Select from 'react-select';
import { RControl, RLayerTile, RMap, ROSM } from 'rlayers';
import BeatLoader from 'react-spinners/BeatLoader';

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
				.then(async (res) => {
					let data = res.data.data;
					const parentDesa = await getParentDesa(data.lokasi.desa_id);
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
						desa_id: {
							value: parentDesa.data.data.desa.kode,
							label: parentDesa.data.data.desa.nama,
							color: '#00B8D9',
						},
						alamat: data.lokasi.alamat,
					});
					setDetail({
						fasilitas: data.detail.fasilitas,
						kamar: data.detail.kamar,
					});
					setProvinsiId({
						value: parentDesa.data.data.provinsi.kode,
						label: parentDesa.data.data.provinsi.nama,
						color: '#00B8D9',
					});
					setKotaId({
						value: parentDesa.data.data.kota.kode,
						label: parentDesa.data.data.kota.nama,
						color: '#00B8D9',
					});
					setDistrikId({
						value: parentDesa.data.data.distrik.kode,
						label: parentDesa.data.data.distrik.nama,
						color: '#00B8D9',
					});
					getAllProvinsi()
						.then((prov) => {
							setProvinsiList(
								prov.data.data.map((provItem) => {
									getAllKotaByCode(provItem.kode)
										.then((kota) => {
											setKotaList(
												kota.data.data.map(
													(
														kotaItem
													) => {
														getAllDistrikByCode(
															kotaItem.kode
														)
															.then(
																(
																	distrik
																) => {
																	setDistrikList(
																		distrik.data.data.map(
																			(
																				distrikItem
																			) => {
																				getAllDesaByCode(
																					distrikItem.kode
																				)
																					.then(
																						(
																							desa
																						) => {
																							setDesaList(
																								desa.data.data.map(
																									(
																										desaItem
																									) => {
																										return {
																											value: desaItem.kode,
																											label: desaItem.nama,
																											color: '#00B8D9',
																										};
																									}
																								)
																							);
																						}
																					)
																					.catch(
																						() => {
																							Swal.fire(
																								'Gagal!',
																								'Desa gagal dimuat',
																								'error'
																							);
																						}
																					);
																				return {
																					value: distrikItem.kode,
																					label: distrikItem.nama,
																					color: '#00B8D9',
																				};
																			}
																		)
																	);
																}
															)
															.catch(
																() => {
																	Swal.fire(
																		'Gagal!',
																		'Distrik gagal dimuat',
																		'error'
																	);
																}
															);
														return {
															value: kotaItem.kode,
															label: kotaItem.nama,
															color: '#00B8D9',
														};
													}
												)
											);
										})
										.catch(() => {
											Swal.fire(
												'Gagal!',
												'Kota gagal dimuat',
												'error'
											);
										});
									return {
										value: provItem.kode,
										label: provItem.nama,
										color: '#00B8D9',
									};
								})
							);
						})
						.catch(() => {
							Swal.fire('Gagal!', 'Provinsi gagal dimuat', 'error');
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

	const handleChangeDetail = (e, index = null) => {
		const { name, value } = e.target;
		if (name === 'fasilitas') {
			let arr = [];

			// Memeriksa apakah nilai input adalah string dengan koma
			if (typeof value === 'string' && value.includes(',')) {
				arr = value.split(',');
			} else {
				arr.push(value);
			}
			setDetail({ ...detail, fasilitas: arr });
		} else {
			const newKamar = { ...detail.kamar[index] };
			if (name === 'thumbnail') {
				const files = e.target.files[0];
				newKamar[name] = files;
			} else {
				newKamar[name] = value;
			}
			const newKamars = [...detail.kamar];
			newKamars[index] = newKamar;
			setDetail({ ...detail, kamar: newKamars });
		}
		console.log(detail);
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
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
		for (let i = 0; i < detail.fasilitas.length; i++) {
			data.append(`fasilitas[${i}]`, detail.fasilitas[i]);
		}
		for (let i = 0; i < detail.kamar.length; i++) {
			data.append(`kamar[${i}][tipe]`, detail.kamar[i].tipe);
			data.append(`kamar[${i}][harga]`, detail.kamar[i].harga);
			data.append(`kamar[${i}][thumbnail]`, detail.kamar[i].thumbnail);
		}

		createAccomodation(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Accomodation berhasil ditambahkan', 'success');
				history.push('/accomodation');
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire('Gagal!', err.response.data.message, 'error');
				} else if (err.request) {
					Swal.fire('Gagal!', 'Tidak dapat terhubung ke server', 'error');
				} else {
					Swal.fire('Gagal!', 'Terjadi kesalahan', 'error');
				}
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		setIsLoading(true);
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
		for (let i = 0; i < detail.fasilitas.length; i++) {
			data.append(`fasilitas[${i}]`, detail.fasilitas[i]);
		}
		for (let i = 0; i < detail.kamar.length; i++) {
			data.append(`kamar[${i}][tipe]`, detail.kamar[i].tipe);
			data.append(`kamar[${i}][harga]`, detail.kamar[i].harga);
			if (detail.kamar[i].thumbnail !== '') data.append(`kamar[${i}][thumbnail]`, detail.kamar[i].thumbnail);
		}

		updateAccomodation(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Accomodation berhasil diubah', 'success');
				history.push('/accomodation');
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire('Gagal!', err.response.data.message, 'error');
				} else if (err.request) {
					Swal.fire('Gagal!', 'Tidak dapat terhubung ke server', 'error');
				} else {
					Swal.fire('Gagal!', 'Terjadi kesalahan', 'error');
				}
			});
	};

	return (
		<div id="accomodation-form" className="h-80">
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
										position: 'absolute',
										top: '50%',
										left: '50%',
										zIndex: '999',
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
												filter: 'blur(2px)',
											},
										})}
									>
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
															process
																.env
																.REACT_APP_STORAGE_BASE_URL +
															'/accomodation/' +
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
											<div className="mb-4 form-group col-md-4">
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
											<div className="mb-4 form-group col-md-4">
												<label>
													Kota
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
											<div className="mb-4 form-group col-md-4">
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
											<div className="mb-4 form-group col-md-4">
												<label>
													Desa
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
												<label>
													Email
												</label>
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
												<label>
													Harga
												</label>
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
										<div className="d-flex justify-content-between">
											<span className="font-weight-bold h3">
												Fasilitas
											</span>
										</div>
										<div className="row">
											<div className="form-group">
												<label>
													Fasilitas
													-
													pisahkan
													dengan
													tanda
													koma
													","
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan fasilitas"
													name="fasilitas"
													value={
														detail.fasilitas
													}
													onChange={(
														e
													) =>
														handleChangeDetail(
															e
														)
													}
												/>
											</div>
										</div>
										<hr />
										{detail.kamar.map((item, index) => {
											return (
												<div
													className="mb-4"
													key={
														index
													}
												>
													<div className="row">
														<div className="d-flex justify-content-between">
															<span className="font-weight-bold h3">
																Kamar{' '}
																{` ${
																	index +
																	1
																}`}
															</span>
															{index ? (
																<button
																	type="button"
																	className="mr-4 btn btn-danger btn-sm"
																	onClick={() => {
																		let newKamar =
																			[
																				...detail.kamar,
																			];
																		newKamar.splice(
																			index,
																			1
																		);
																		setDetail(
																			{
																				...detail,
																				kamar: newKamar,
																			}
																		);
																	}}
																>
																	<i className="fa fa-trash color-danger"></i>
																</button>
															) : null}
														</div>
													</div>
													<div className="row">
														<div className="mb-3 form-group col-md-6">
															<label>
																Tipe
															</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan tipe"
																name="tipe-kamar"
																value={
																	item.tipe
																}
																onChange={(
																	e
																) =>
																	handleChangeDetail(
																		e,
																		index
																	)
																}
															/>
														</div>
														<div className="mb-3 form-group col-md-6">
															<label>
																Harga
															</label>
															<input
																type="number"
																className="form-control"
																placeholder="Masukkan harga"
																name="harga-kamar"
																value={
																	item.harga
																}
																onChange={(
																	e
																) =>
																	handleChangeDetail(
																		e,
																		index
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
																		name="thumbnail-kamar"
																		accept="image/*"
																		onChange={(
																			e
																		) =>
																			handleChangeDetail(
																				e,
																				index
																			)
																		}
																	/>
																</div>
																<span className="input-group-text">
																	Upload
																</span>
															</div>
															{detail
																.kamar[
																index
															]
																.thumbnailPreview !==
																'' && (
																<img
																	src={
																		process
																			.env
																			.REACT_APP_STORAGE_BASE_URL +
																		'/accomodation/detail' +
																		detail
																			.kamar[
																			index
																		]
																			.thumbnailPreview
																	}
																	alt="thumbnail"
																	className="border border-2 img-fluid border-dark rounded-3"
																	style={{
																		width: '40%',
																		height: 'auto',
																	}}
																/>
															)}

															{detail
																.kamar[
																index
															]
																.thumbnail &&
																typeof detail
																	.kamar[
																	index
																]
																	.thumbnail ===
																	'object' && (
																	<img
																		src={URL.createObjectURL(
																			detail
																				.kamar[
																				index
																			]
																				.thumbnail
																		)}
																		alt="thumbnail"
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
														<div className="mb-4 col-md-12">
															<div
																style={{
																	display: 'flex',
																	justifyContent: 'center',
																	alignItems: 'center',
																}}
															>
																<hr
																	style={{
																		width: '100%',
																		margin: '0 10px',
																	}}
																/>
																<button
																	type="button"
																	className="btn btn-info btn-xxs"
																	onClick={() => {
																		setDetail(
																			{
																				...detail,
																				kamar: [
																					...detail.kamar,
																					{
																						tipe: '',
																						harga: '',
																						thumbnail: '',
																						thumbnailPreview: '',
																					},
																				],
																			}
																		);
																	}}
																>
																	<i className="fa fa-plus color-info"></i>
																</button>
																<hr
																	style={{
																		width: '100%',
																		margin: '0 10px',
																	}}
																/>
															</div>
														</div>
													</div>
												</div>
											);
										})}
										<button
											id="submit"
											type="submit"
											className="btn btn-primary me-2"
										>
											{button}
										</button>
										<Link to="/accomodation">
											<button
												type="button"
												className="btn btn-warning"
											>
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

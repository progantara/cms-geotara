import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link, useHistory, useParams } from 'react-router-dom';
import { createMerchant, getMerchant, updateMerchant } from '../../../services/MerchantService';
import { getAllProvinsi } from '../../../services/ProvinsiService';
import { getAllKotaByCode } from '../../../services/KotaService';
import { getAllDistrikByCode } from '../../../services/DistrikService';
import { getAllDesaByCode, getParentDesa } from '../../../services/DesaService';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import Select from 'react-select';
import { RControl, RMap, ROSM } from 'rlayers';
import BeatLoader from 'react-spinners/BeatLoader';

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const [isLoading, setIsLoading] = useState(false);
	const [provinsiId, setProvinsiId] = useState('');
	const [kotaId, setKotaId] = useState('');
	const [distrikId, setDistrikId] = useState('');
	const [provinsiList, setProvinsiList] = useState([]);
	const [kotaList, setKotaList] = useState([]);
	const [distrikList, setDistrikList] = useState([]);
	const [desaList, setDesaList] = useState([]);
	const [inputMerchant, setInputMerchant] = useState({
		thumbnail: '',
		thumbnailPreview: '',
		nama: '',
		no_telp: '',
		email: '',
		rating: '',
		jam_buka: '',
		jam_tutup: '',
	});
	const [lokasi, setLokasi] = useState({
		lat: '',
		long: '',
		desa_id: {},
		alamat: '',
	});
	const [detail, setDetail] = useState({
		product: [
			{
				nama: '',
				deskripsi: '',
				varian: [''],
				thumbnail: '',
				thumbnailPreview: '',
				harga: '',
				rating: '',
			},
		],
	});

	let title = 'Tambah Merchant';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Merchant';
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
			getMerchant(id)
				.then(async (res) => {
					let data = res.data.data;
					const parentDesa = await getParentDesa(data.lokasi.desa_id);
					setInputMerchant({
						nama: data.nama,
						no_telp: data.no_telp,
						email: data.email,
						rating: data.rating,
						jam_buka: data.jam_buka,
						jam_tutup: data.jam_tutup,
						thumbnail: '',
						thumbnailPreview: data.thumbnail,
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
						product: data.detail.product,
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
					Swal.fire('Gagal!', 'Merchant gagal dimuat', 'error').then(() => {
						history.push('/merchant');
					});
				});
			console.log(lokasi);
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

	const handleChange = (e) => {
		const value = e.target.value;
		setInputMerchant({
			...inputMerchant,
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
		setInputMerchant({
			...inputMerchant,
			[e.target.name]: value,
		});
	};

	const handleDateChange = (e, type) => {
		const selectedTime = e instanceof Date ? e : new Date();
		const newJamOperasional = format(selectedTime, 'HH:mm');
		setInputMerchant((prevInput) => ({
			...prevInput,
			[type]: newJamOperasional,
		}));
	};

	const handleChangeDetail = (e, index) => {
		const { name, value } = e.target;
		const newProduct = { ...detail.product[index] };
		if (name === 'thumbnail') {
			const files = e.target.files[0];
			newProduct[name] = files;
		} else if (name === 'varian') {
			let arr = [];

			// Memeriksa apakah nilai input adalah string dengan koma
			if (typeof value === 'string' && value.includes(',')) {
				arr = value.split(',');
			} else {
				arr.push(value);
			}
			newProduct[name] = arr;
		} else {
			newProduct[name] = value;
		}
		const newProducts = [...detail.product];
		newProducts[index] = newProduct;
		setDetail({ ...detail, product: newProducts });
		console.log(detail);
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append('thumbnail', inputMerchant.thumbnail);
		data.append('nama', inputMerchant.nama);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id.value);
		data.append('alamat', lokasi.alamat);
		data.append('jam_buka', inputMerchant.jam_buka);
		data.append('jam_tutup', inputMerchant.jam_tutup);

		// Loop through each product and add its details
		for (let i = 0; i < detail.product.length; i++) {
			data.append(`product[${i}][nama]`, detail.product[i].nama);
			data.append(`product[${i}][deskripsi]`, detail.product[i].deskripsi);

			// Loop through each varian of the product and add it as a separate element
			const varianString = detail.product[0].varian.join(',');
			for (let j = 0; j < varianString.length; j++) {
				data.append(`product[${i}][varian][${j}]`, detail.product[i].varian[j]);
			}

			data.append(`product[${i}][thumbnail]`, detail.product[i].thumbnail);
			data.append(`product[${i}][harga]`, detail.product[i].harga);
			data.append(`product[${i}][rating]`, detail.product[i].rating);
		}
		createMerchant(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Merchant berhasil ditambahkan', 'success');
				history.push('/merchant');
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
		if (inputMerchant.thumbnail !== '') data.append('thumbnail', inputMerchant.thumbnail);
		data.append('nama', inputMerchant.nama);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id.value);
		data.append('alamat', lokasi.alamat);
		data.append('jam_buka', inputMerchant.jam_buka);
		data.append('jam_tutup', inputMerchant.jam_tutup);
		// Loop through each product and add its details
		for (let i = 0; i < detail.product.length; i++) {
			data.append(`product[${i}][nama]`, detail.product[i].nama);
			data.append(`product[${i}][deskripsi]`, detail.product[i].deskripsi);

			// Loop through each varian of the product and add it as a separate element
			const varianString = detail.product[0].varian.join(',');
			for (let j = 0; j < varianString.length; j++) {
				data.append(`product[${i}][varian][${j}]`, detail.product[i].varian[j]);
			}

			data.append(`product[${i}][thumbnail]`, detail.product[i].thumbnail);
			data.append(`product[${i}][harga]`, detail.product[i].harga);
			data.append(`product[${i}][rating]`, detail.product[i].rating);
		}

		updateMerchant(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Merchant berhasil diubah', 'success');
				history.push('/merchant');
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
													Merchant
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan nama merchant"
													name="nama"
													value={
														inputMerchant.nama
													}
													onChange={
														handleChange
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
															onChange={
																handleImageChange
															}
														/>
													</div>
													<span className="input-group-text">
														Upload
													</span>
												</div>
												{inputMerchant.thumbnailPreview !=
													'' && (
													<img
														src={
															process
																.env
																.REACT_APP_STORAGE_BASE_URL +
															'/merchant/' +
															inputMerchant.thumbnailPreview
														}
														alt="banner"
														className="border border-2 img-fluid border-dark rounded-3"
														style={{
															width: '40%',
															height: 'auto',
														}}
													/>
												)}
												{inputMerchant.thumbnail !=
													'' && (
													<img
														src={URL.createObjectURL(
															inputMerchant.thumbnail
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
											<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
												<label>
													Jam
													Buka
												</label>
												<MuiPickersUtilsProvider
													utils={
														DateFnsUtils
													}
												>
													<TimePicker
														name="jam_buka"
														value={
															inputMerchant.jam_buka
																? new Date(
																		`01/01/1970 ${inputMerchant.jam_buka}`
																  )
																: null
														}
														onChange={(
															e
														) =>
															handleDateChange(
																e,
																'jam_buka'
															)
														}
													/>
												</MuiPickersUtilsProvider>
											</div>
											<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
												<label>
													Jam
													Tutup
												</label>
												<MuiPickersUtilsProvider
													utils={
														DateFnsUtils
													}
												>
													<TimePicker
														name="jam_tutup"
														value={
															inputMerchant.jam_tutup
																? new Date(
																		`01/01/1970 ${inputMerchant.jam_tutup}`
																  )
																: null
														}
														onChange={(
															time
														) =>
															handleDateChange(
																time,
																'jam_tutup'
															)
														}
													/>
												</MuiPickersUtilsProvider>
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
																Produk{' '}
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
																		let newProduct =
																			[
																				...detail.product,
																			];
																		newProduct.splice(
																			index,
																			1
																		);
																		setDetail(
																			{
																				...detail,
																				product: newProduct,
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
														<div className="mb-3 form-group col-md-4">
															<label>
																Nama
															</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan nama"
																name="nama"
																value={
																	item.nama
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
														<div className="mb-3 form-group col-md-4">
															<label>
																Harga
															</label>
															<input
																type="number"
																className="form-control"
																placeholder="Masukkan harga"
																name="harga"
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
														<div className="mb-3 form-group col-md-4">
															<label>
																Rating
															</label>
															<input
																type="number"
																className="form-control"
																placeholder="Masukkan rating"
																name="rating"
																value={
																	item.rating
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
																Deskripsi
															</label>
															<textarea
																className="form-control"
																rows="2"
																name="deskripsi"
																value={
																	item.deskripsi
																}
																onChange={(
																	e
																) =>
																	handleChangeDetail(
																		e,
																		index
																	)
																}
															></textarea>
														</div>
													</div>
													<div className="row">
														<div className="mb-3 form-group">
															<label>
																Varian
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
																placeholder="Masukkan varian"
																name="varian"
																value={
																	item.varian
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
																		name="thumbnail"
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
																.product[
																index
															]
																.thumbnailPreview !==
																'' && (
																<img
																	src={
																		process
																			.env
																			.REACT_APP_STORAGE_BASE_URL +
																		'/merchant/detail' +
																		detail
																			.product[
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
																.product[
																index
															]
																.thumbnail &&
																typeof detail
																	.product[
																	index
																]
																	.thumbnail ===
																	'object' && (
																	<img
																		src={URL.createObjectURL(
																			detail
																				.product[
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
												</div>
											);
										})}
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
																	product: [
																		...detail.product,
																		{
																			nama: '',
																			deskripsi: '',
																			varian: [],
																			thumbnail: '',
																			thumbnailPreview: '',
																			harga: '',
																			rating: '',
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
										<button
											type="submit"
											className="btn btn-primary me-2"
										>
											{button}
										</button>
										<Link to="/merchant">
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

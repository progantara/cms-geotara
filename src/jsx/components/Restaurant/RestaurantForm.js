import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link, useHistory, useParams } from 'react-router-dom';
import { createRestaurant, getRestaurant, updateRestaurant } from '../../../services/RestaurantService';
import { getAllProvinsi } from '../../../services/ProvinsiService';
import { getAllKotaByCode } from '../../../services/KotaService';
import { getAllDistrikByCode } from '../../../services/DistrikService';
import { getAllDesaByCode, getParentDesa } from '../../../services/DesaService';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format, set } from 'date-fns';
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
	const [inputRestaurant, setInputRestaurant] = useState({
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
		menu: [
			{
				nama: '',
				rating: '',
				harga: '',
			},
		],
	});

	let title = 'Tambah Restaurant';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Restaurant';
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
			getRestaurant(id)
				.then(async (res) => {
					let data = res.data.data;
					const parentDesa = await getParentDesa(data.lokasi.desa_id);
					setInputRestaurant({
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
						menu: data.detail.menu,
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
					Swal.fire('Gagal!', 'Restaurant gagal dimuat', 'error').then(() => {
						history.push('/restaurant');
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

	const handleChange = (e) => {
		const value = e.target.value;
		setInputRestaurant({
			...inputRestaurant,
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
		setInputRestaurant({
			...inputRestaurant,
			[e.target.name]: value,
		});
	};

	const handleDateChange = (e, type) => {
		const selectedTime = e instanceof Date ? e : new Date();
		const newJamOperasional = format(selectedTime, 'HH:mm');
		setInputRestaurant((prevInput) => ({
			...prevInput,
			[type]: newJamOperasional,
		}));
	};

	const handleChangeDetail = (e, index) => {
		const { name, value } = e.target;
		const newMenu = { ...detail.menu[index] };
		if (name === 'thumbnail') {
			const files = e.target.files[0];
			newMenu[name] = files;
		} else {
			newMenu[name] = value;
		}
		const newMenus = [...detail.menu];
		newMenus[index] = newMenu;
		setDetail({ ...detail, menu: newMenus });
		console.log(detail);
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append('thumbnail', inputRestaurant.thumbnail);
		data.append('nama', inputRestaurant.nama);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id.value);
		data.append('alamat', lokasi.alamat);
		data.append('no_telp', inputRestaurant.no_telp);
		data.append('email', inputRestaurant.email);
		data.append('rating', inputRestaurant.rating);
		data.append('jam_buka', inputRestaurant.jam_buka);
		data.append('jam_tutup', inputRestaurant.jam_tutup);
		for (let i = 0; i < detail.menu.length; i++) {
			data.append(`menu[${i}][nama]`, detail.menu[i].nama);
			data.append(`menu[${i}][rating]`, detail.menu[i].rating);
			data.append(`menu[${i}][harga]`, detail.menu[i].harga);
		}

		createRestaurant(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Restaurant berhasil ditambahkan', 'success');
				history.push('/restaurant');
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
		if (inputRestaurant.thumbnail !== '') data.append('thumbnail', inputRestaurant.thumbnail);
		data.append('nama', inputRestaurant.nama);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id.value);
		data.append('alamat', lokasi.alamat);
		data.append('no_telp', inputRestaurant.no_telp);
		data.append('email', inputRestaurant.email);
		data.append('rating', inputRestaurant.rating);
		data.append('jam_buka', inputRestaurant.jam_buka);
		data.append('jam_tutup', inputRestaurant.jam_tutup);
		for (let i = 0; i < detail.menu.length; i++) {
			data.append(`menu[${i}][nama]`, detail.menu[i].nama);
			data.append(`menu[${i}][rating]`, detail.menu[i].rating);
			data.append(`menu[${i}][harga]`, detail.menu[i].harga);
		}

		updateRestaurant(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Restaurant berhasil diubah', 'success');
				history.push('/restaurant');
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
													Restaurant
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan nama restaurant"
													name="nama"
													value={
														inputRestaurant.nama
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
												{inputRestaurant.thumbnailPreview !=
													'' && (
													<img
														src={
															process
																.env
																.REACT_APP_STORAGE_BASE_URL +
															'/restaurant/' +
															inputRestaurant.thumbnailPreview
														}
														alt="banner"
														className="border border-2 img-fluid border-dark rounded-3"
														style={{
															width: '40%',
															height: 'auto',
														}}
													/>
												)}
												{inputRestaurant.thumbnail !=
													'' && (
													<img
														src={URL.createObjectURL(
															inputRestaurant.thumbnail
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
														handleChange
													}
													value={
														inputRestaurant.no_telp
													}
												/>
											</div>
											<div className="mb-3 form-group col-md-4">
												<label>
													Email
												</label>
												<input
													type="email"
													className="form-control"
													placeholder="Masukkan email"
													name="email"
													onChange={
														handleChange
													}
													value={
														inputRestaurant.email
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
														handleChange
													}
													value={
														inputRestaurant.rating
													}
												/>
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
															inputRestaurant.jam_buka
																? new Date(
																		`01/01/1970 ${inputRestaurant.jam_buka}`
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
															inputRestaurant.jam_tutup
																? new Date(
																		`01/01/1970 ${inputRestaurant.jam_tutup}`
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
										{detail.menu.map((item, index) => {
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
																Menu{' '}
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
																		let newMenu =
																			[
																				...detail.menu,
																			];
																		newMenu.splice(
																			index,
																			1
																		);
																		setDetail(
																			{
																				...detail,
																				menu: newMenu,
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
														<div className="mb-3 form-group col-md-4">
															<label>
																Harga
															</label>
															<input
																type="text"
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
																	menu: [
																		...detail.menu,
																		{
																			nama: '',
																			rating: '',
																			harga: '',
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
										<Link to="/restaurant">
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

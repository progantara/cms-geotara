import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { createMerchant, getMerchant, updateMerchant } from '../../../services/MerchantService';
import { getAllProvinsi } from '../../../services/ProvinsiService';
import { getAllKotaByCode } from '../../../services/KotaService';
import { getAllDistrikByCode, getDistrik } from '../../../services/DistrikService';
import { getAllDesaByCode, getDesa } from '../../../services/DesaService';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
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
				.then((res) => {
					let data = res.data.data;
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
						desa_id: data.lokasi.desa_id,
						alamat: data.lokasi.alamat,
					});
					setDetail({
						product: [
							{
								nama: data.detail.product[0].nama,
								harga: data.detail.product[0].harga,
								rating: data.detail.product[0].rating,
							},
						],
					});
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Merchant gagal dimuat', 'error').then(() => {
						history.push('/merchant');
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

	const handleCreate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append('thumbnail', inputMerchant.thumbnail);
		data.append('nama', inputMerchant.nama);
		data.append('lat', lokasi.lat);
		data.append('long', lokasi.long);
		data.append('desa_id', lokasi.desa_id.value);
		data.append('alamat', lokasi.alamat);
		data.append('jam_buka', inputMerchant.jam_buka);
		data.append('jam_tutup', inputMerchant.jam_tutup);
		data.append('product[0][nama]', detail.product[0].nama);
		data.append('product[0][harga]', detail.product[0].harga);
		data.append('product[0][rating]', detail.product[0].rating);
		createMerchant(data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Merchant berhasil ditambahkan', 'success');
				history.push('/merchant');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Merchant gagal ditambahkan.', 'error');
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
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
		data.append('product[0][nama]', detail.product[0].nama);
		data.append('product[0][harga]', detail.product[0].harga);
		data.append('product[0][rating]', detail.product[0].rating);

		updateMerchant(id, data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Merchant berhasil diubah', 'success');
				history.push('/merchant');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Merchant gagal diubah.', 'error');
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
												Merchant
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan nama restaurant"
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
														process.env.REACT_APP_STORAGE_BASE_URL+'/restaurant/' +
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
									<div className="row">
										<h5>Produk 1</h5>
										<div className="mb-3 form-group col-md-4">
											<label>Nama</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan nama"
												name="nama"
												value={
													detail
														.product[0]
														.nama
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															prevState
														) => ({
															...prevState,
															product: [
																{
																	...prevState
																		.product[0],
																	nama: event
																		.target
																		.value,
																},
																...prevState.product.slice(
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
												type="number"
												className="form-control"
												placeholder="Masukkan harga"
												name="harga"
												value={
													detail
														.product[0]
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
															product: [
																{
																	...prevState
																		.product[0],
																	harga: event
																		.target
																		.value,
																},
																...prevState.product.slice(
																	1
																),
															],
														})
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
													detail
														.product[0]
														.rating
												}
												onChange={(
													event
												) =>
													setDetail(
														(
															prevState
														) => ({
															...prevState,
															product: [
																{
																	...prevState
																		.product[0],
																	rating: event
																		.target
																		.value,
																},
																...prevState.product.slice(
																	1
																),
															],
														})
													)
												}
											/>
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

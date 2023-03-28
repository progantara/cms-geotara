import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { createMerchant, getMerchant, updateMerchant } from '../../../services/MerchantService';
import { getAllDesaSelect } from '../../../services/DesaService';
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

	const [desa, setDesa] = useState([]);
	const [thumbnailPreview, setThumbnailPreview] = useState('');
	const [inputResturant, setInputMerchant] = useState({
		banner_image: '',
		nama: '',
		lat: '',
		long: '',
		desa_id: '',
		alamat: '',
		no_telp: '',
		email: '',
		rating: '',
		jam_buka: '',
		jam_tutup: '',
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
		const fetchData = async () => {
			const result = await getAllDesaSelect();
			setDesa(result);
		};
		fetchData();
		if (id !== undefined) {
			getMerchant(id)
				.then((res) => {
					// alert(res.data.data);
					let data = res.data.data;
					setInputMerchant({
						nama: data.nama,
						lat: data.lokasi.lat,
						long: data.lokasi.long,
						desa_id: data.lokasi.desa_id,
						alamat: data.lokasi.alamat,
						no_telp: data.no_telp,
						email: data.email,
						rating: data.rating,
						jam_buka: data.jam_buka,
						jam_tutup: data.jam_tutup,
						banner_image: '',
					});
					setThumbnailPreview(data.banner_image);
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Merchant gagal dimuat', 'error').then(() => {
						// history.push('/restaurant');
					});
					console.log(inputResturant);
				});
		}
	}, [id, setDesa]);

	const handleChange = (e) => {
		const value = e.target.value;
		setInputMerchant({
			...inputResturant,
			[e.target.name]: value,
		});
		// alert(value + ' ' + e.target.name);
		console.log(inputResturant);
	};

	const handleImageChange = (e) => {
		const value = e.target.files[0];
		setInputMerchant({
			...inputResturant,
			[e.target.name]: value,
		});
		// alert(value + ' ' + e.target.name);
		console.log(inputResturant);
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
		data.append('banner_image', inputResturant.banner_image);
		data.append('nama', inputResturant.nama);
		data.append('lat', inputResturant.lat);
		data.append('long', inputResturant.long);
		data.append('desa_id', inputResturant.desa_id);
		data.append('alamat', inputResturant.alamat);
		data.append('no_telp', inputResturant.no_telp);
		data.append('email', inputResturant.email);
		data.append('rating', inputResturant.rating);
		data.append('jam_buka', inputResturant.jam_buka);
		data.append('jam_tutup', inputResturant.jam_tutup);
		createMerchant(data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Merchant berhasil ditambahkan', 'success');
				history.push('/restaurant');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Merchant gagal ditambahkan.', 'error');
				console.log(err);
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append('_method', 'put');
		if (inputResturant.banner_image !== '') data.append('banner_image', inputResturant.banner_image);
		data.append('nama', inputResturant.nama);
		data.append('lat', inputResturant.lat);
		data.append('long', inputResturant.long);
		data.append('desa_id', inputResturant.desa_id);
		data.append('alamat', inputResturant.alamat);
		data.append('no_telp', inputResturant.no_telp);
		data.append('email', inputResturant.email);
		data.append('rating', inputResturant.rating);
		data.append('jam_buka', inputResturant.jam_buka);
		data.append('jam_tutup', inputResturant.jam_tutup);

		updateMerchant(id, data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Merchant berhasil diubah', 'success');
				history.push('/restaurant');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Merchant gagal diubah.', 'error');
				console.log(err);
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
													inputResturant.nama
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
														name="banner_image"
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
											{thumbnailPreview !=
												'' && (
												<img
													src={
														'http://127.0.0.1:8000/storage/restaurant/' +
														thumbnailPreview
													}
													alt="banner"
													className="border border-2 img-fluid border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
											{inputResturant.banner_image !=
												'' && (
												<img
													src={URL.createObjectURL(
														inputResturant.banner_image
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
													inputResturant.desa_id
														? inputResturant.desa_id
														: 'option'
												}
												className="form-control"
												name="desa_id"
												onChange={
													handleChange
												}
												options={
													desa
												}
											/> */}
											<select
												value={
													inputResturant.desa_id
														? inputResturant.desa_id
														: 'option'
												}
												className="form-control"
												name="desa_id"
												onChange={
													handleChange
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
													inputResturant.alamat
												}
												onChange={
													handleChange
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
														inputResturant.long
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
														inputResturant.lat
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
														setInputMerchant(
															{
																...inputResturant,
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
													inputResturant.no_telp
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
													handleChange
												}
												value={
													inputResturant.email
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
													inputResturant.rating
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
														inputResturant.jam_buka
															? new Date(
																	`01/01/1970 ${inputResturant.jam_buka}`
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
														inputResturant.jam_tutup
															? new Date(
																	`01/01/1970 ${inputResturant.jam_tutup}`
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

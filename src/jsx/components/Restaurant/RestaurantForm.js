import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom';
import { createRestaurant, getRestaurant, updateRestaurant } from '../../../services/RestaurantService';
import { getAllDesaSelect } from '../../../services/DesaService';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const [desa, setDesa] = useState([]);
	const [inputResturant, setInputRestaurant] = useState({
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

	let title = 'Tambah Restaurant';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Restaurant';
		button = 'Update';
	}

	useEffect(() => {
		const fetchData = async () => {
			const result = await getAllDesaSelect();
			setDesa(result);
		};
		fetchData();
		if (id !== undefined) {
			getRestaurant(id)
				.then((res) => {
					// alert(res.data.data);
					let data = res.data.data;
					setInputRestaurant({
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
					});
					// console.log(inputResturant);
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Restaurant gagal dimuat', 'error').then(() => {
						history.push('/restaurant');
					});
				});
		}
	}, [id, setDesa]);

	const handleChange = (e) => {
		const value = e.target.value;
		setInputRestaurant({
			...inputResturant,
			[e.target.name]: value,
		});
		// alert(value + ' ' + e.target.name);
		console.log(inputResturant);
	};

	const handleImageChange = (e) => {
		const value = e.target.files[0];
		setInputRestaurant({
			...inputResturant,
			[e.target.name]: value,
		});
		// alert(value + ' ' + e.target.name);
		console.log(inputResturant);
	};

	const handleDateChange = (date, type) => {
		const options = {
			hour12: false,
			timeZone: 'Asia/Jakarta',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		};
		const selectedTime = date.toLocaleString('id-ID', options);
		console.log(selectedTime); // tambahkan log untuk memastikan format yang dihasilkan benar
		setInputRestaurant((prevInput) => ({
			...prevInput,
			[type]: selectedTime,
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
		createRestaurant(data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Restaurant berhasil ditambahkan', 'success');
				history.push('/restaurant');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Restaurant gagal ditambahkan.', 'error');
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

		// for (const [key, value] of data.entries()) {
		// 	console.log(key + ': ' + value);
		// }
		updateRestaurant(id, data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Restaurant berhasil diubah', 'success');
				history.push('/restaurant');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Restaurant gagal diubah.', 'error');
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
							<div className="summernote">
								<div className="card">
									<div className="card-body">
										<div className="basic-form">
											<form
												onSubmit={
													id !==
													undefined
														? handleUpdate
														: handleCreate
												}
											>
												<div className="row mb-3">
													<div className="form-group col-md-6">
														<label>
															Banner
															Image
														</label>
														<div className="from-file">
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
													</div>
													<div className="form-group col-md-6">
														<label>
															Nama
														</label>
														<input
															type="text"
															className="form-control"
															placeholder="Masukkan nama"
															name="nama"
															onChange={
																handleChange
															}
															value={
																inputResturant.nama
															}
														/>
													</div>
												</div>
												<div className="row">
													<div className="mb-3 form-group col-md-4">
														<label>
															Latitude
														</label>
														<input
															type="text"
															className="form-control"
															placeholder="Masukkan latitude"
															name="lat"
															onChange={
																handleChange
															}
															value={
																inputResturant.lat
															}
														/>
													</div>
													<div className="mb-3 form-group col-md-4">
														<label>
															Longitude
														</label>
														<input
															type="text"
															className="form-control"
															placeholder="Masukkan longitude"
															name="long"
															onChange={
																handleChange
															}
															value={
																inputResturant.long
															}
														/>
													</div>
													<div className="mb-3 form-group col-md-4">
														<label>
															Desa
														</label>
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
													<div className="mb-3 form-group">
														<label>
															Alamat
														</label>
														<textarea
															className="form-control"
															id="alamat"
															placeholder="Masukkan alamat"
															name="alamat"
															onChange={
																handleChange
															}
															value={
																inputResturant.alamat
															}
														></textarea>
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
																		? inputResturant.jam_buka
																		: new Date()
																}
																onChange={(
																	time
																) =>
																	handleDateChange(
																		time,
																		'jam_buka'
																	)
																}
																format="HH:mm:ss a"
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
																		? inputResturant.jam_tutup
																		: new Date()
																}
																onChange={(
																	time
																) =>
																	handleDateChange(
																		time,
																		'jam_tutup'
																	)
																}
																format="HH:mm:ss a"
															/>
														</MuiPickersUtilsProvider>
													</div>
												</div>
												{/* <div className="row mb-3">
														<div className=" col-md-12">
															<h5>
																Makanan
																1
															</h5>
														</div>
														<div className="mb-3 form-group col-md-4">
															<label>
																Nama
															</label>
															<input
																type="text"
																className="form-control"
																placeholder="Masukkan Nama Makanan 1"
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
																placeholder="Masukkan Rating Makanan 1"
															/>
														</div>
														<div className="mb-3 form-group col-md-4">
															<label>
																Harga
															</label>
															<input
																type="number"
																className="form-control"
																placeholder="Masukkan Harga Makanan 1"
															/>
														</div>
													</div> */}
												<button
													type="submit"
													className="btn btn-primary me-2"
												>
													{
														button
													}
												</button>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

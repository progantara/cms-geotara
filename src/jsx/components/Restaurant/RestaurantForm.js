import React, { useState, useEffect } from 'react';
import MaterialTime from './MaterialTime';
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
		_id: '',
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

	let title = 'Tambah Pengguna';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Pengguna';
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
					setName(res.data.data.name);
					setEmail(res.data.data.email);
					setRole(res.data.data.role);
				})
				.catch((err) => {
					setError(err);
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

	const handleDateChange = (time, fieldName) => {
		const selectedTime = time.toLocaleTimeString('en-US');
		setInputRestaurant((prevInput) => ({
			...prevInput,
			[fieldName]: selectedTime,
		}));
		// alert(fieldName + ' ' + selectedTime);
		console.log(inputResturant);
	};

	const handleCreate = (e) => {
		e.preventDefault();
		createRestaurant({
			banner_image: inputResturant.banner_image,
			nama: inputResturant.nama,
			lat: inputResturant.lat,
			long: inputResturant.long,
			desa_id: inputResturant.desa_id,
			alamat: inputResturant.alamat,
			no_telp: inputResturant.no_telp,
			email: inputResturant.email,
			rating: inputResturant.rating,
			jam_buka: inputResturant.jam_buka,
			jam_tutup: inputResturant.jam_tutup,
		})
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
		updateRestaurant(id, {
			name,
			email,
			role,
		})
			.then((res) => {
				swal('Berhasil!', 'Pengguna berhasil diupdate', 'success');
				history.push('/pengguna');
			})
			.catch((err) => {
				swal('Gagal!', 'Pengguna gagal diupdate', 'error');
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
																onChange={
																	handleChange
																}
																value={
																	inputResturant.banner_image
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
															defaultValue={
																'option'
															}
															id="inputState"
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
																	new Date()
																}
																onChange={(
																	time
																) =>
																	handleDateChange(
																		time,
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
																	new Date()
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

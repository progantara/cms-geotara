import React, { useState } from 'react';
import MaterialTime from './MaterialTime';
import { Link, useHistory, useParams } from 'react-router-dom';

export default function RestaurantForm() {
	const history = useHistory();
	const { id } = useParams();

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

	const handleChange = (e) => {
		const value = e.target.value;
		setInputRestaurant({
			...inputResturant,
			[e.target.name]: value,
		});
	};

	const handleCreate = (e) => {
		e.preventDefault();
		createUser(inputResturant)
			.then((res) => {
				swal('Berhasil!', 'Pengguna berhasil ditambahkan', 'success');
				history.push('/pengguna');
			})
			.catch((err) => {
				swal('Gagal!', 'Pengguna gagal ditambahkan', 'error');
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		updateUser(id, {
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
														>
															<option
																value="option"
																disabled
															>
																Choose...
															</option>
															<option>
																Option
																1
															</option>
															<option>
																Option
																2
															</option>
															<option>
																Option
																3
															</option>
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
														/>
													</div>
												</div>
												<div className="row">
													<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
														<label>
															Jam
															Buka
														</label>
														<MaterialTime />
													</div>
													<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
														<label>
															Jam
															Tutup
														</label>
														<MaterialTime />
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

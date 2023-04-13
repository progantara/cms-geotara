import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link, useHistory, useParams } from 'react-router-dom';
import { createEntertaiment, getEntertaiment, updateEntertaiment } from '../../../services/EntertaimentService';
import 'ol/ol.css';
import Select from 'react-select';
import { RControl, RLayerTile, RMap, ROSM } from 'rlayers';
import BeatLoader from 'react-spinners/BeatLoader';

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	const options = [
		{ value: 'Youtube', label: 'Youtube' },
		{ value: 'Instagram', label: 'Instagram', isDisabled: true },
	  ];

	const [isLoading, setIsLoading] = useState(false);
	const [inputEntertaiment, setInputEntertaiment] = useState({
		judul: '',
		deskripsi: '',
		file: '',
	});

	let title = 'Tambah Entertaiment';
	let button = 'Simpan';
	if (id !== undefined) {
		title = 'Edit Entertaiment';
		button = 'Update';
	}

	useEffect(() => {
		if (id !== undefined) {
			getEntertaiment(id)
				.then(async (res) => {
					let data = res.data.data;
					setInputEntertaiment({
						judul: data.judul,
						deskripsi: data.deskripsi,
						file: data.file,
					});
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Entertaiment gagal dimuat', 'error').then(() => {
						history.push('/entertaiment');
					});
				});
		}
	}, [id]);

	const handleChangeEntertaiment = (e) => {
		const value = e.target.value;
		setInputEntertaiment({
			...inputEntertaiment,
			[e.target.name]: value,
		});
	};

	const handleFileChange = (e) => {
		const value = e.target.files[0];
		setInputEntertaiment({
			...inputEntertaiment,
			[e.target.name]: value,
		});
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append('file', inputEntertaiment.file);
		data.append('judul', inputEntertaiment.judul);
		data.append('deskripsi', inputEntertaiment.deskripsi);
		createEntertaiment(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Entertaiment berhasil ditambahkan', 'success');
				history.push('/Entertaiment');
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
		if (inputEntertaiment.file !== '') data.append('file', inputEntertaiment.file);
		data.append('judul', inputEntertaiment.judul);
		data.append('deskripsi', inputEntertaiment.deskripsi);

		updateEntertaiment(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire('Berhasil!', 'Entertaiment berhasil diubah', 'success');
				history.push('/Entertaiment');
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
													Judul
													Entertaiment
												</label>
												<input
													type="text"
													className="form-control"
													placeholder="Masukkan judul Entertaiment"
													name="judul"
													value={
														inputEntertaiment.judul
													}
													onChange={
														handleChangeEntertaiment
													}
												/>
											</div>
										</div>
										<div className="row">
											<div className="mb-3 form-group">
												<label>
													Tipe
													Entertaiment
												</label>
												<Select options={options} />
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
														inputEntertaiment.deskripsi
													}
													onChange={
														handleChangeEntertaiment
													}
												></textarea>
											</div>
										</div>
										<div className="row">
											<div className="mb-3 form-group">
												<label>
													File
												</label>
												<div className="input-group">
													<div className="form-file">
														<input
															type="file"
															className="form-file-input form-control"
															name="file"
															accept="video/*"
															onChange={
																handleFileChange
															}
														/>
													</div>
													<span className="input-group-text">
														Upload
													</span>
												</div>
											</div>
										</div>
										<button
											type="submit"
											className="btn btn-primary me-2"
										>
											{button}
										</button>
										<Link to="/Entertaiment">
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

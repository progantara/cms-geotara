import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import 'react-dropzone-uploader/dist/styles.css';
import { checkImageResolution } from '../../../utils/checkImageWidth';
import Select from 'react-select';
import { capitalizeEachFirstLetter, currencyFormatter } from '../../../utils/stringFormatter';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { fromLonLat, toLonLat } from 'ol/proj';
import 'ol/ol.css';
import { RControl, RMap, ROSM } from 'rlayers';
import { createTourismPlace, getTourismPlace, updateTourismPlace } from '../../../services/TourismPlaceService';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import ReactPannellum from 'react-pannellum';
import { getAllProvinsi } from '../../../services/ProvinsiService';
import { getAllKotaByCode } from '../../../services/KotaService';
import { getAllDistrikByCode, getDistrik } from '../../../services/DistrikService';
import { getAllDesaByCode, getDesa } from '../../../services/DesaService';

const kategoriOption = [{ value: 'alam', label: 'Wisata', color: '#00B8D9' }];

const subkategoriOption = [
	{ value: 'pantai', label: 'Pantai', color: '#00B8D9' },
	{ value: 'curug', label: 'Curug', color: '#00B8D9' },
];

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

const WisataForm = () => {
	const history = useHistory();
	const { id } = useParams();

	let title = 'Tambah Wisata';
	let button = 'Tambah';
	if (id !== undefined) {
		title = 'Edit Wisata';
		button = 'Perbarui';
	}

	const [thumbnailPreview, setThumbnailPreview] = useState('');
	const [thumbnail, setThumbnail] = useState('');
	const [nama, setNama] = useState('');
	const [deskripsi, setDeskripsi] = useState('');
	const [kategori, setKategori] = useState([]);
	const [subkategori, setSubkategori] = useState([]);
	const [hargaTiket, setHargaTiket] = useState('');
	const [isActive, setIsActive] = useState();
	const [jamOperasional, setJamOperasional] = useState([
		{
			mulai: '',
			akhir: '',
			hari: '',
		},
	]);
	const [lat, setLat] = useState('');
	const [long, setLong] = useState('');
	const [provinsiId, setProvinsiId] = useState({});
	const [provinsiList, setProvinsiList] = useState([]);
	const [kotaId, setKotaId] = useState({});
	const [kotaList, setKotaList] = useState([]);
	const [distrikId, setDistrikId] = useState({});
	const [distrikList, setDistrikList] = useState([]);
	const [desaId, setDesaId] = useState({});
	const [desaList, setDesaList] = useState([]);
	const [alamat, setAlamat] = useState('');
	const [file360, setFile360] = useState('');
	const [file360Preview, setFile360Preview] = useState('');

	const handleCreate = (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append('nama', nama);
		data.append('deskripsi', deskripsi);
		kategori.map((item) => item.value).forEach((item, index) => {
			data.append(`kategori[${index}]`, item);
		});
		subkategori.map((item) => item.value).forEach((item, index) => {
			data.append(`sub_kategori[${index}]`, item);
		});
		data.append('harga_tiket', hargaTiket);
		data.append('is_active', isActive);
		jamOperasional.forEach((item, index) => {
			data.append(`jam_operasional[${index}][hari]`, item.hari);
			data.append(`jam_operasional[${index}][mulai]`, item.mulai);
			data.append(`jam_operasional[${index}][akhir]`, item.akhir);
		});
		data.append('lat', lat);
		data.append('long', long);
		data.append('desa_id', desaId.value);
		data.append('alamat', alamat);
		data.append('thumbnail', thumbnail);
		data.append('file360', file360);
		createTourismPlace(data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Wisata berhasil ditambahkan', 'success');
				history.push('/wisata');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Wisata gagal ditambahkan', 'error');
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append('_method', 'PUT');
		data.append('nama', nama);
		data.append('deskripsi', deskripsi);
		kategori.map((item) => item.value).forEach((item, index) => {
			data.append(`kategori[${index}]`, item);
		});
		subkategori.map((item) => item.value).forEach((item, index) => {
			data.append(`sub_kategori[${index}]`, item);
		});
		data.append('harga_tiket', hargaTiket);
		data.append('is_active', isActive);
		jamOperasional.forEach((item, index) => {
			data.append(`jam_operasional[${index}][hari]`, item.hari);
			data.append(`jam_operasional[${index}][mulai]`, item.mulai);
			data.append(`jam_operasional[${index}][akhir]`, item.akhir);
		});
		data.append('lat', lat);
		data.append('long', long);
		data.append('desa_id', desaId.value);
		data.append('alamat', alamat);
		if (thumbnail !== '') data.append('thumbnail', thumbnail);
		if (file360 !== '') data.append('file360', file360);
		updateTourismPlace(id, data)
			.then((res) => {
				Swal.fire('Berhasil!', 'Wisata berhasil diperbarui', 'success');
				history.push('/wisata');
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Wisata gagal diperbarui', 'error');
			});
	};

	useEffect(() => {
		if (id !== undefined) {
			getTourismPlace(id)
				.then((res) => {
					setNama(res.data.data.nama);
					setDeskripsi(res.data.data.deskripsi);
					setKategori(
						res.data.data.kategori.map((item) => {
							return {
								value: item,
								label: capitalizeEachFirstLetter(item),
								color: '#00B8D9',
							};
						})
					);
					setSubkategori(
						res.data.data.sub_kategori.map((item) => {
							return {
								value: item,
								label: capitalizeEachFirstLetter(item),
								color: '#00B8D9',
							};
						})
					);
					setHargaTiket(res.data.data.harga_tiket);
					setIsActive(res.data.data.is_active);
					setJamOperasional(
						res.data.data.jam_operasional.map((item) => ({
							mulai: item.mulai,
							akhir: item.akhir,
							hari: item.hari,
						}))
					);
					setLat(res.data.data.lokasi.lat);
					setLong(res.data.data.lokasi.long);
					setAlamat(res.data.data.lokasi.alamat);
					setThumbnailPreview(res.data.data.thumbnail);
					setFile360Preview(res.data.data.file360);
				})
				.catch((err) => {
					Swal.fire('Gagal!', 'Wisata gagal dimuat', 'error').then(() => {
						history.push('/wisata');
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
	}, [id]);

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
										<div className="form-group mb-4">
											<label>
												Nama
												Wisata
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan nama wisata"
												value={
													nama
												}
												onChange={(
													e
												) =>
													setNama(
														e
															.target
															.value
													)
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4">
											<label>Cover</label>
											<div className="input-group">
												<div className="form-file">
													<input
														type="file"
														className="custom-file-input form-control"
														accept="image/*"
														onChange={(
															event
														) => {
															checkImageResolution(
																event
																	.target
																	.files[0]
															)
																.then(
																	(
																		res
																	) => {
																		setThumbnail(
																			event
																				.target
																				.files[0]
																		);
																	}
																)
																.catch(
																	(
																		err
																	) => {
																		console.log(
																			err
																		);
																	}
																);
														}}
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
														process
															.env
															.REACT_APP_STORAGE_BASE_URL +
														'/wisata/' +
														thumbnailPreview
													}
													alt="banner"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
											{thumbnail !=
												'' && (
												<img
													src={URL.createObjectURL(
														thumbnail
													)}
													alt="banner"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: '40%',
														height: 'auto',
													}}
												/>
											)}
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4">
											<label>
												File
												360
											</label>
											<div className="input-group">
												<div className="form-file">
													<input
														type="file"
														className="custom-file-input form-control"
														accept="image/*"
														onChange={(
															event
														) => {
															setFile360(
																event
																	.target
																	.files[0]
															);
														}}
													/>
												</div>
												<span className="input-group-text">
													Upload
												</span>
											</div>
											{file360Preview !=
												'' && (
												<a
													href={
														process.env.REACT_APP_STORAGE_BASE_URL+'/wisata/' +
														file360Preview
													}
													target="_blank"
												>
													See
													Preview
												</a>
											)}
											{file360 != '' && (
												<ReactPannellum
													id="1"
													type="equirectangular"
													sceneId="firstScene"
													imageSource={URL.createObjectURL(
														file360
													)}
													style={{
														width: '40%',
														height: '160px',
													}}
													config={{
														autoLoad: true,
														showFullscreenCtrl: false,
														escapeHTML: true,
													}}
												></ReactPannellum>
											)}
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4">
											<label>
												Deskripsi
											</label>
											<textarea
												className="form-control"
												rows="2"
												value={
													deskripsi
												}
												onChange={(
													e
												) => {
													setDeskripsi(
														e
															.target
															.value
													);
												}}
											></textarea>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4">
											<label>
												Kategori
											</label>
											<Select
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
													kategori
												}
												onChange={(
													e
												) => {
													setKategori(
														e
													);
												}}
												isMulti
												options={
													kategoriOption
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4">
											<label>
												Sub
												Kategori
											</label>
											<Select
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
													subkategori
												}
												onChange={(
													e
												) => {
													setSubkategori(
														e
													);
												}}
												isMulti
												options={
													subkategoriOption
												}
											/>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4 col-md-6">
											<label>
												Harga{' '}
												{currencyFormatter(
													hargaTiket,
													'id-ID'
												)}
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan harga tiket"
												value={
													hargaTiket
												}
												onChange={(
													e
												) =>
													setHargaTiket(
														e
															.target
															.value
													)
												}
											/>
										</div>
										<div className="form-group mb-4 col-md-6">
											<label>
												Status
												Aktif
											</label>
											<select
												value={
													isActive
												}
												className="form-control"
												onChange={(
													e
												) =>
													setIsActive(
														e
															.target
															.value
													)
												}
											>
												<option
													value={
														''
													}
												>
													Pilih
													Status
												</option>
												<option
													value={
														1
													}
												>
													Aktif
												</option>
												<option
													value={
														0
													}
												>
													Tidak
													Aktif
												</option>
											</select>
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
													desaId
												}
												onChange={(
													e
												) => {
													setDesaId(
														e
													);
												}}
												options={
													desaList
												}
											/>
										</div>
										<div className="form-group mb-4 col-md-8">
											<label>
												Alamat
											</label>
											<textarea
												className="form-control"
												rows="2"
												value={
													alamat
												}
												onChange={(
													e
												) =>
													setAlamat(
														e
															.target
															.value
													)
												}
											></textarea>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-4 col-md-3">
											<div>
												<label>
													Longitude
												</label>
												<input
													type="text"
													className="form-control mb-3"
													placeholder="Pilih pada peta"
													value={
														long
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
													className="form-control mb-3"
													placeholder="Pilih pada peta"
													value={
														lat
													}
													disabled
												/>
											</div>
										</div>
										<div className="form-group mb-4 col-md-9">
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
														setLong(
															lonlat[0]
														);
														setLat(
															lonlat[1]
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
									{jamOperasional.map((item, index) => {
										return (
											<div
												className="row"
												key={
													index
												}
											>
												<div className="col-md-3">
													<label>
														Hari
													</label>
													<input
														type="text"
														className="form-control"
														placeholder="Masukkan hari"
														value={
															item.hari ||
															''
														}
														onChange={(
															e
														) => {
															let newJamOperasional =
																[
																	...jamOperasional,
																];
															newJamOperasional[
																index
															].hari =
																e.target.value;
															setJamOperasional(
																newJamOperasional
															);
														}}
													/>
												</div>
												<div className="col-md-4">
													<label>
														Waktu
														Buka
													</label>
													<MuiPickersUtilsProvider
														utils={
															DateFnsUtils
														}
													>
														<TimePicker
															autoOk
															label=""
															value={
																item.mulai
																	? new Date(
																			`01/01/1970 ${item.mulai}`
																	  )
																	: null
															}
															onChange={(
																e
															) => {
																const selectedTime =
																	e instanceof
																	Date
																		? e
																		: new Date();
																const newJamOperasional =
																	[
																		...jamOperasional,
																	];
																newJamOperasional[
																	index
																].mulai =
																	format(
																		selectedTime,
																		'HH:mm'
																	);
																setJamOperasional(
																	newJamOperasional
																);
															}}
														/>
													</MuiPickersUtilsProvider>
												</div>
												<div className="col-md-4">
													<label>
														Waktu
														Tutup
													</label>
													<MuiPickersUtilsProvider
														utils={
															DateFnsUtils
														}
													>
														<TimePicker
															autoOk
															label=""
															value={
																item.akhir
																	? new Date(
																			`01/01/1970 ${item.akhir}`
																	  )
																	: null
															}
															onChange={(
																e
															) => {
																const selectedTime =
																	e instanceof
																	Date
																		? e
																		: new Date();
																const newJamOperasional =
																	[
																		...jamOperasional,
																	];
																newJamOperasional[
																	index
																].akhir =
																	format(
																		selectedTime,
																		'HH:mm'
																	);
																setJamOperasional(
																	newJamOperasional
																);
															}}
														/>
													</MuiPickersUtilsProvider>
												</div>
												{index ? (
													<div className="col-md-1">
														<button
															type="button"
															className="btn btn-danger mt-3 btn-sm"
															onClick={() => {
																let newJamOperasional =
																	[
																		...jamOperasional,
																	];
																newJamOperasional.splice(
																	index,
																	1
																);
																setJamOperasional(
																	newJamOperasional
																);
															}}
														>
															<i className="fa fa-trash color-danger"></i>
														</button>
													</div>
												) : null}
											</div>
										);
									})}
									<div className="row">
										<div className="col-md-12 mb-4">
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
														setJamOperasional(
															[
																...jamOperasional,
																{
																	hari: '',
																	mulai: '',
																	akhir: '',
																},
															]
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
									<button type="submit" className="btn btn-primary me-2">
										{button}
									</button>
									<Link to="/wisata">
										<button
											type="button"
											className="btn btn-warning"
										>
											Kembali
										</button>
									</Link>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WisataForm;

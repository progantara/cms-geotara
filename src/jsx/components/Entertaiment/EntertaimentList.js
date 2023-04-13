import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { getAllEntertaiment, deleteEntertaiment } from '../../../services/EntertaimentService';
import ClipLoader from 'react-spinners/ClipLoader';
import { currencyFormatter } from '../../../utils/stringFormatter';

const EntertaimentList = () => {
	const [data, setData] = useState([
		{
			no: 1,
			judul: "Keindahan Alam Sutra",
			tipe: "Youtube",
			link: ( 
				<div className="d-flex">
					<Link
						to='https://www.youtube.com/watch?v=0UzfcDNAP-o'
						className="btn btn-info shadow sharp me-1"
					>
						Lihat
					</Link>
				</div>
				),
			action: (
				<div className="d-flex">
					<Link
						to={'/entertaiment/detail/' + 0}
						className="btn btn-primary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-eye"></i>
					</Link>
					<Link
						to={'/entertaiment/edit/' + 0}
						className="btn btn-secondary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-danger shadow btn-xs sharp"
						onClick={() =>
							Swal.fire({
								title: 'Anda yakin ingin menghapus Entertaiment ini?',
								text: 'Setelah dihapus, Anda tidak akan dapat memulihkannya',
								icon: 'warning',
								showCancelButton: true,
								confirmButtonColor: '#3085d6',
								cancelButtonColor: '#d33',
								confirmButtonText: 'Ya, hapus!',
							}).then((res) => {
								if (
									res.isConfirmed
								) {
									deleteEntertaiment(
										0
									);
									let newData =
										data.filter(
											(
												e
											) =>
												e._id !==
												0
										);
									setData(
										newData
									);
									Swal.fire(
										'Dihapus!',
										'Entertaiment telah dihapus.',
										'success'
									);
								}
							})
						}
					>
						<i className="fa fa-trash"></i>
					</Link>
				</div>
			),
		},
	]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{
			name: 'No',
			selector: (row) => row.no,
			sortable: true,
			width: '10%',
		},
		{
			name: 'Judul',
			selector: (row) => row.judul,
			sortable: true,
			width: '45%',
		},
		{
			name: 'Tipe',
			selector: (row) => row.tipe,
			sortable: true,
			width: '10%',
		},
		{
			name: 'Link',
			selector: (row) => row.link,
			sortable: true,
			width: '15%',
		},
		{
			name: 'Aksi',
			selector: (row) => row.action,
			width: '20%',
		},
	];

	const customStyles = {
		headCells: {
			style: {
				borderBottom: '0.125rem solid #F2F2F2',
				borderTop: '0',
				color: '#000',
				whiteSpace: 'nowrap',
				fontSize: '1.125rem',
				textTransform: 'capitalize',
				fontWeight: '600',
				padding: '1.25rem 0.9375rem',
			},
		},
		rows: {
			style: {
				background: 'transparent !important',
				padding: '1.25rem 0.9375rem',
				fontSize: '1rem',
				fontWeight: '400',
				borderBottom: '0',
			},
		},
	};

	useEffect(() => {
		setIsLoading(true);
		getAllEntertaiment()
			.then((res) => {
				res.data.data.map((item, index) => {
					setData((data) => [
						...data,
						{
							no: index + 1,
							judul: item.judul,
							tipe: "Youtube",
							link: ( 
								<div className="d-flex">
									<Link
										to={item.link}
										className="btn btn-primary shadow btn-xs sharp me-1"
									>
										Lihat
									</Link>
								</div>
								),
							action: (
								<div className="d-flex">
									<Link
										to={'/entertaiment/detail/' + 0}
										className="btn btn-primary shadow btn-xs sharp me-1"
									>
										<i className="fas fa-eye"></i>
									</Link>
									<Link
										to={'/entertaiment/edit/' + 0}
										className="btn btn-secondary shadow btn-xs sharp me-1"
									>
										<i className="fas fa-pen"></i>
									</Link>
									<Link
										to="#"
										className="btn btn-danger shadow btn-xs sharp"
										onClick={() =>
											Swal.fire({
												title: 'Anda yakin ingin menghapus Entertaiment ini?',
												text: 'Setelah dihapus, Anda tidak akan dapat memulihkannya',
												icon: 'warning',
												showCancelButton: true,
												confirmButtonColor: '#3085d6',
												cancelButtonColor: '#d33',
												confirmButtonText: 'Ya, hapus!',
											}).then((res) => {
												if (
													res.isConfirmed
												) {
													deleteEntertaiment(
														0
													);
													let newData =
														data.filter(
															(
																e
															) =>
																e._id !==
																0
														);
													setData(
														newData
													);
													Swal.fire(
														'Dihapus!',
														'Entertaiment telah dihapus.',
														'success'
													);
												}
											})
										}
									>
										<i className="fa fa-trash"></i>
									</Link>
								</div>
							),
						},
					]);
				});
				setIsLoading(false);
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
		console.log(data);
	}, [setData]);

	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Daftar Entertaiment</h4>
					<Link to="/entertaiment/tambah">
						<Button className="me-2" variant="primary btn-rounded">
							<span className="btn-icon-start text-primary">
								<i className="fa fa-plus color-primary" />
							</span>
							Tambah
						</Button>
					</Link>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<div id="job_data" className="dataTables_wrapper">
							<DataTable
								columns={columns}
								data={data}
								pagination
								paginationPerPage={10}
								customStyles={customStyles}
								progressPending={isLoading}
								progressComponent={
									<ClipLoader
										color={'#20c997'}
										loading={isLoading}
										aria-label="Loading Spinner"
									/>
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EntertaimentList;

import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const MerchantList = () => {
	const columns = [
		{
			name: 'No',
			selector: (row) => row.no,
			sortable: true,
			width: '10%',
		},
		{
			name: 'Nama',
			selector: (row) => row.nama,
			sortable: true,
			width: '20%',
		},
		{
			name: 'Kontak',
			selector: (row) => row.kontak,
			sortable: true,
			width: '20%',
		},
		{
			name: 'Alamat',
			selector: (row) => row.alamat,
			sortable: true,
			width: '30%',
		},
		{
			name: 'Aksi',
			selector: (row) => row.aksi,
			width: '20%',
		},
	];

	const data = [
		{
			id: 1,
			no: '1',
			nama: 'Toko Souvenir Ciletuh Pass',
			kontak: '081222954662',
			alamat: 'Bandung, Jawa Barat',
			aksi: (
				<div className="d-flex">
					<Link to="/merchant/detail/1" className="shadow btn btn-primary btn-xs sharp me-1">
						<i className="fas fa-eye"></i>
					</Link>
					<Link to="/merchant/edit/1" className="shadow btn btn-secondary btn-xs sharp me-1">
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="shadow btn btn-danger btn-xs sharp"
						onClick={() =>
							Swal.fire({
								title: 'Anda yakin ingin menghapus merchant ini?',
								text: 'Setelah dihapus, Anda tidak akan dapat memulihkannya',
								icon: 'warning',
								showCancelButton: true,
								confirmButtonColor: '#3085d6',
								cancelButtonColor: '#d33',
								confirmButtonText: 'Ya, hapus!',
							}).then((res) => {
								if (res.isConfirmed) {
									Swal.fire('Dihapus!', 'Merchant telah dihapus.', 'success');
								}
							})
						}
					>
						<i className="fa fa-trash"></i>
					</Link>
				</div>
			),
		},
		{
			id: 2,
			no: '2',
			nama: 'Homestay Ciletuh Pass',
			harga: 'Rp. 25.000,00 s.d Rp. 50.000,00',
			lokasi: 'Bandung, Jawa Barat',
			aksi: (
				<div className="d-flex">
					<Link to="/merchant/detail/1" className="shadow btn btn-primary btn-xs sharp me-1">
						<i className="fas fa-eye"></i>
					</Link>
					<Link to="/merchant/edit/1" className="shadow btn btn-secondary btn-xs sharp me-1">
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="shadow btn btn-danger btn-xs sharp"
						onClick={() =>
							swal({
								title: 'Anda yakin ingin menghapus akomodasi ini?',
								text: 'Setelah dihapus, Anda tidak akan dapat memulihkannya',
								icon: 'warning',
								buttons: true,
								dangerMode: true,
							}).then((willDelete) => {
								if (willDelete) {
									swal('Akomodasi telah dihapus!', {
										icon: 'success',
									});
								}
							})
						}
					>
						<i className="fa fa-trash"></i>
					</Link>
				</div>
			),
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

	// use effect
	useEffect(() => {}, []);

	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Daftar Merchant</h4>
					<Link to="/merchant/tambah">
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
								paginationPerPage={5}
								customStyles={customStyles}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MerchantList;

import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import DataTable from "react-data-table-component";

const ArticleList = () => {
	const columns = [
		{
			name: "No",
			selector: (row) => row.no,
			sortable: true,
      width: '10%',
		},
		{
			name: "Judul",
			selector: (row) => row.judul,
			sortable: true,
      width: '30%',
		},
		{
			name: "Penulis",
			selector: (row) => row.penulis,
			sortable: true,
      width: '20%',
		},
		{
			name: "Tanggal Publikasi",
			selector: (row) => row.tanggal_publikasi,
			sortable: true,
      width: '20%',
		},
		{
			name: "Aksi",
			selector: (row) => row.aksi,
      width: '20%',
		},
	];

	const data = [
		{
			id: 1,
			no: "1",
			judul: "Keindahan Curug Sodong",
			penulis: "Sobri W",
			tanggal_publikasi: "1988",
			aksi: (
				<div className="d-flex">
					<Link to="/artikel/detail/1" className="btn btn-primary shadow btn-xs sharp me-1">
						<i className="fas fa-eye"></i>
					</Link>
					<Link
						to="/pengguna/edit/1"
						className="btn btn-secondary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-danger shadow btn-xs sharp"
						onClick={() =>
							swal({
								title: "Anda yakin ingin menghapus pengguna ini?",
								text: "Setelah dihapus, Anda tidak akan dapat memulihkannya",
								icon: "warning",
								buttons: true,
								dangerMode: true,
							}).then((willDelete) => {
								if (willDelete) {
									swal("Pengguna telah dihapus!", {
										icon: "success",
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
				borderBottom: "0.125rem solid #F2F2F2",
				borderTop: "0",
				color: "#000",
				whiteSpace: "nowrap",
				fontSize: "1.125rem",
				textTransform: "capitalize",
				fontWeight: "600",
				padding: "1.25rem 0.9375rem",
			},
		},
		rows: {
			style: {
				background: "transparent !important",
				padding: "1.25rem 0.9375rem",
				fontSize: "1rem",
				fontWeight: "400",
				borderBottom: "0",
			},
		},
	};

	// use effect
	useEffect(() => {}, []);

	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Daftar Artikel</h4>
					<Link to="/artikel/tambah">
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

export default ArticleList;

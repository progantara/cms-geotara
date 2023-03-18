import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { getAllAccomodation } from "../../../services/AccomodationService";

const AccomodationList = () => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{
			name: "No",
			selector: (row) => row.no,
			sortable: true,
      width: '10%',
		},
		{
			name: "Nama",
			selector: (row) => row.name,
			sortable: true,
      width: '20%',
		},
		{
			name: "Harga",
			selector: (row) => row.price,
			sortable: true,
      width: '20%',
		},
		{
			name: "Lokasi",
			selector: (row) => row.location,
			sortable: true,
      width: '30%',
		},
		{
			name: "Aksi",
			selector: (row) => row.action,
      width: '20%',
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
	useEffect(() => {
		setIsLoading(true);
		getAllAccomodation()
			.then((res) => {
				res.data.data.map((item, index) => {
					setData((data) => [
						...data,
						{
							no: index + 1,
							name: item.nama,
							price: item.harga,
							location: item.lokasi,
							action: (
								<div className="d-flex">
									<Link
										to={`/akomodasi/detail/${item._id}`}
										className="btn btn-primary shadow btn-xs sharp me-1"
									>
										<i className="fas fa-eye"></i>
									</Link>
									<Link
										to={`/akomodasi/edit/${item._id}`}
										className="btn btn-secondary shadow btn-xs sharp me-1"
									>
										<i className="fas fa-pen"></i>
									</Link>
									<Link
										to="#"
										className="btn btn-danger shadow btn-xs sharp"
										onClick={() =>
											Swal.fire({
												title: "Anda yakin ingin menghapus akomodasi ini?",
												text: "Setelah dihapus, Anda tidak akan dapat memulihkannya",
												icon: "warning",
												showCancelButton: true,
												confirmButtonColor: "#3085d6",
												cancelButtonColor: "#d33",
												confirmButtonText: "Ya, hapus!",
											}).then((res) => {
												if (res.isConfirmed) {
													Swal.fire(
														'Dihapus!',
														'Akomodasi telah dihapus.',
														'success'
													)
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
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	}, []);

	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Daftar Akomodasi</h4>
					<Link to="/akomodasi/tambah">
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

export default AccomodationList;

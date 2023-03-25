import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { getAllTourismPlace } from "../../../services/TourismPlaceService";

const WisataList = () => {
	const history = useHistory();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{
			name: "No",
			selector: (row) => row.no,
			sortable: true,
			width: "10%",
		},
		{
			name: "Nama",
			selector: (row) => row.nama,
			sortable: true,
			width: "25%",
		},
		{
			name: "Kategori",
			selector: (row) => row.kategori,
			sortable: true,
			width: "15%",
		},
		{
			name: "Lokasi",
			selector: (row) => row.lokasi,
			sortable: true,
			width: "25%",
		},
		{
			name: "Aksi",
			selector: (row) => row.aksi,
			width: "25%",
		},
	];

	const dummy = [
		{
			id: 1,
			no: "1",
			nama: "Curug Sodong",
			kategori: "Curug",
			lokasi: "Bandung, Jawa Barat",
			aksi: (
				<div className="d-flex">
					<Link
						to="/wisata/detail/1"
						className="btn btn-primary shadow btn-xs me-1"
					>
						<i className="fas fa-eye"></i>
					</Link>
					<Link
						to="/wisata/edit/1"
						className="btn btn-secondary shadow btn-xs me-1"
					>
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-danger shadow btn-xs me-1"
						onClick={() =>
							Swal.fire({
								title: "Anda yakin ingin menghapus wisata ini?",
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
										'Wisata telah dihapus.',
										'success'
									)
								}
							})
						}
					>
						<i className="fa fa-trash"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-info shadow btn-xs me-1"
						>
						V-Tour
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
	useEffect(() => {
		setIsLoading(true);
		getAllTourismPlace()
			.then((res) => {
				res.data.data.map((item, index) => {
					getUser(item.author_id)
						.then((user) => {
							setData((data) => [
								...data,
								{
									id: item._id,
									no: index + 1,
									title: item.judul,
									writer: user.data.data.name,
									publication_date: moment(item.created_at).format("LL"),
									action: (
										<div className="d-flex">
											<Link
												to={`/wisata/detail/${item._id}`}
												className="btn btn-primary shadow btn-xs sharp me-1"
											>
												<i className="fas fa-eye"></i>
											</Link>
											<Link
												to={`/wisata/edit/${item._id}`}
												className="btn btn-secondary shadow btn-xs sharp me-1"
											>
												<i className="fas fa-pen"></i>
											</Link>
											<Link
												to="#"
												className="btn btn-danger shadow btn-xs sharp"
												onClick={() =>
													Swal.fire({
														title: "Anda yakin ingin menghapus wisata ini?",
														text: "Setelah dihapus, Anda tidak akan dapat memulihkannya",
														icon: "warning",
														showCancelButton: true,
														confirmButtonColor: "#3085d6",
														cancelButtonColor: "#d33",
														confirmButtonText: "Ya, hapus!",
													}).then((res) => {
														if (res.isConfirmed) {
															deleteArticle(item._id)
																.then((res) => {
																	Swal.fire(
																		"Dihapus!",
																		"Wisata telah dihapus.",
																		"success"
																	);
																	history.push("/wisata");
																})
																.catch((err) => {
																	Swal.fire("Gagal!", "Wisata gagal dihapus", "error");
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
							]);
							setIsLoading(false);
						})
						.catch((errUser) => {
							Swal.fire('Gagal!', 'Wisata gagal dimuat, silahkan refresh', 'error');
							setIsLoading(false);
						});
				});
			})
			.catch((err) => {
				Swal.fire('Gagal!', 'Wisata gagal dimuat', 'error');
				setIsLoading(false);
			});
	}, []);

	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Daftar Wisata</h4>
					<Link to="/wisata/tambah">
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

export default WisataList;

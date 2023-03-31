import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { deleteEvent, getAllEvents } from "../../../services/EventService";
import ClipLoader from "react-spinners/ClipLoader";

const EventList = () => {
	const history = useHistory();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{
			name: "No",
			selector: (row) => row.no,
			sortable: false,
			width: "10%",
		},
		{
			name: "Nama",
			selector: (row) => row.nama,
			sortable: true,
			width: "25%",
		},
		{
			name: "Penyelenggara",
			selector: (row) => row.penyelenggara,
			sortable: true,
			width: "20%",
		},
		{
			name: "Mulai",
			selector: (row) => row.tanggal_mulai,
			sortable: true,
			width: "15%",
		},
		{
			name: "Aksi",
			width: "15%",
			cell: (row) => (
				<div className="d-flex">
					<Link
						to="#"
						// to={"/acara/detail/" + row._id}
						className="btn btn-primary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-eye"></i>
					</Link>
					<Link
						to={"/acara/edit/" + row._id}
						className="btn btn-secondary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-danger shadow btn-xs sharp"
						onClick={() =>
							Swal.fire({
								title: "Anda yakin ingin menghapus acara ini?",
								text: "Setelah dihapus, Anda tidak akan dapat memulihkannya",
								icon: "warning",
								showCancelButton: true,
								confirmButtonColor: "#3085d6",
								cancelButtonColor: "#d33",
								confirmButtonText: "Ya, hapus!",
							}).then((res) => {
								if (res.isConfirmed) {
									handleDelete(row._id);
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

	const handleDelete = async (id) => {
		const response = await deleteEvent(id);
		if (response.status === 200) {
			const newData = data.filter((item) => item._id !== id);
			setData(newData);
			Swal.fire("Berhasil!", "Acara berhasil dihapus", "success");
			setIsLoading(true);
			fetchData();
			setIsLoading(false);
		} else {
			Swal.fire("Gagal!", "Acara gagal dihapus", "error");
		}
	};

	// use effect
	useEffect(() => {
		setIsLoading(true);
		fetchData();
	}, []);

	const fetchData = async () => {
		const response = await getAllEvents();
		console.log(response);
		if (response.status === 200) {
			const data = response.data.data.map((item, index) => {
				return {
					...item,
					no: index + 1,
					nama: item.nama,
					penyelenggara: item.organizer.nama,
					tanggal_mulai: item.start_event.date,
				};
			});
			setData(data);
		}
		setIsLoading(false);
	};

	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">Daftar Acara</h4>
					<Link to="/acara/tambah">
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
						<div className="dataTables_wrapper">
							<DataTable
								columns={columns}
								data={data}
								pagination
								paginationPerPage={5}
								customStyles={customStyles}
								progressPending={isLoading}
								progressComponent={
									<ClipLoader
										color={"#20c997"}
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

export default EventList;

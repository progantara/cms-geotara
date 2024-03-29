import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { deleteUser, getAllUser } from "../../../services/UserService";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const UserList = () => {
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
			selector: (row) => row.name,
			sortable: true,
			width: "20%",
		},
		{
			name: "Email",
			selector: (row) => row.email,
			sortable: true,
			width: "20%",
		},
		{
			name: "Peran",
			selector: (row) => row.role,
			sortable: true,
			width: "30%",
		},
		{
			name: "Aksi",
			width: "20%",
			cell: (row) => (
				<div className="d-flex">
					<Link
						to="#"
						// to={"/pengguna/detail/" + row._id}
						className="btn btn-primary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-eye"></i>
					</Link>
					<Link
						to={"/pengguna/edit/" + row._id}
						className="btn btn-secondary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-danger shadow btn-xs sharp"
						onClick={() =>
							Swal.fire({
								title: "Anda yakin ingin menghapus pengguna ini?",
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
		const response = await deleteUser(id);
		if (response.status === 200) {
			const newData = data.filter((item) => item._id !== id);
			setData(newData);
			Swal.fire("Berhasil!", "Pengguna berhasil dihapus", "success");
			setIsLoading(true);
			fetchData();
			setIsLoading(false);
		} else {
			Swal.fire("Gagal!", "Pengguna gagal dihapus", "error");
		}
	};

	useEffect(() => {
		setIsLoading(true);
		fetchData();
	}, []);

	const fetchData = async () => {
		const response = await getAllUser();
		if (response.status === 200) {
			const data = response.data.data.map((item, index) => {
				return {
					...item,
					no: index + 1,
					name: item.name,
					email: item.email,
					role: item.role,
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
					<h4 className="card-title">Daftar Pengguna</h4>
					<Link to="/pengguna/tambah">
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
						<div id="user_list" className="dataTables_wrapper">
							<DataTable
								columns={columns}
								data={data}
								pagination
								paginationPerPage={10}
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

export default UserList;

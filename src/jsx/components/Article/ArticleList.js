import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { deleteArticle, getAllArticle } from "../../../services/ArticleService";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader"
import moment from "moment";
import "moment/locale/id";
import { getUser } from "../../../services/UserService";
moment.locale("id");

const ArticleList = () => {
	const history = useHistory();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const columns = [
		{
			name: 'No',
			selector: (row) => row.no,
			sortable: true,
			width: '5%',
		},
		{
			name: "Judul",
			selector: (row) => row.title,
			sortable: true,
			width: "30%",
		},
		{
			name: "Penulis",
			selector: (row) => row.writer,
			sortable: true,
			width: "20%",
		},
		{
			name: "Tanggal Publikasi",
			selector: (row) => row.publication_date,
			sortable: true,
			width: "20%",
		},
		{
			name: "Aksi",
			width: "20%",
			cell: (row) => (
				<div className="d-flex">
					<Link
						to="#"
						// to={"/artikel/detail/" + row._id}
						className="btn btn-primary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-eye"></i>
					</Link>
					<Link
						to={"/artikel/edit/" + row._id}
						className="btn btn-secondary shadow btn-xs sharp me-1"
					>
						<i className="fas fa-pen"></i>
					</Link>
					<Link
						to="#"
						className="btn btn-danger shadow btn-xs sharp"
						onClick={() =>
							Swal.fire({
								title: "Anda yakin ingin menghapus artikel ini?",
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
		const response = await deleteArticle(id);
		if (response.status === 200) {
			const newData = data.filter((item) => item._id !== id);
			setData(newData);
			Swal.fire("Berhasil!", "Artikel berhasil dihapus", "success");
			setIsLoading(true);
			fetchData();
			setIsLoading(false);
		} else {
			Swal.fire("Gagal!", "Artikel gagal dihapus", "error");
		}
	};

	// use effect
	useEffect(() => {
		setIsLoading(true);
		fetchData();
	}, []);

	const fetchData = async () => {
		const response = await getAllArticle();
		if (response.status === 200) {
			const data = response.data.data.map((item, index) => {
				return {
					...item,
					no: index + 1,
					title: item.judul,
					writer: item.author_id,
					publication_date: moment(item.created_at).format("LL"),
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

export default ArticleList;

import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createUser, getUser, updateUser } from "../../../services/UserService";

export default function UserForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [role, setRole] = useState("");
	const [error, setError] = useState("");
	const history = useHistory();

	const { id } = useParams();

	let title = "Tambah Pengguna";
	let button = "Simpan";
	if (id !== undefined) {
		title = "Edit Pengguna";
		button = "Update";
	}

	const handleCreate = (e) => {
		e.preventDefault();
		createUser({
			name,
			email,
			password,
			password_confirmation: passwordConfirmation,
			role,
		})
			.then((res) => {
				swal("Berhasil!", "Pengguna berhasil ditambahkan", "success");
				history.push("/pengguna");
			})
			.catch((err) => {
				swal("Gagal!", "Pengguna gagal ditambahkan", "error");
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		updateUser(id, {
			name,
			email,
			role,
		})
			.then((res) => {
				swal("Berhasil!", "Pengguna berhasil diupdate", "success");
				history.push("/pengguna");
			})
			.catch((err) => {
				swal("Gagal!", "Pengguna gagal diupdate", "error");
			});
	};

	useEffect(() => {
		if (id !== undefined) {
			getUser(id)
				.then((res) => {
					setName(res.data.data.name);
					setEmail(res.data.data.email);
					setRole(res.data.data.role);
				})
				.catch((err) => {
					setError(err);
				});
		}
	}, [id]);

	return (
		<div className="col-xl-12 col-lg-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">{title}</h4>
				</div>
				<div className="card-body">
					<div className="basic-form">
						<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
							<div className="row">
								<div className="form-group mb-3 col-md-6">
									<label>Nama</label>
									<input
										type="text"
										className="form-control"
										placeholder="Masukkan Nama"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="form-group mb-3 col-md-6">
									<label>Email</label>
									<input
										type="email"
										className="form-control"
										placeholder="Masukkan Email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								{id === undefined ? (
								<div className="form-group mb-3 col-md-6">
									<label>Kata Sandi</label>
									<input
										type="password"
										className="form-control"
										placeholder="Masukkan Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								) : null}
								{id === undefined ? (
									<div className="form-group mb-3 col-md-6">
										<label>Konfirmasi Kata Sandi</label>
										<input
											type="password"
											className="form-control"
											placeholder="Masukkan Kata Sandi Kembali"
											onChange={(e) => setPasswordConfirmation(e.target.value)}
										/>
									</div>
								) : null}
							</div>
							<div className="row">
								<div className="form-group mb-3 col-md-4">
									<label>Peran</label>
									<select
										defaultValue={"option"}
										id="inputState"
										className="form-control"
										onChange={(e) => setRole(e.target.value)}
									>
										<option value="option" disabled>
											Pilih Peran...
										</option>
										<option value="admin">Admin</option>
										<option value="writer">Penulis Konten</option>
										<option value="visitor">Pengunjung</option>
									</select>
								</div>
							</div>
							<button type="submit" className="btn btn-primary me-2">
								{button}
							</button>
							<Link to="/pengguna">
								<button type="button" className="btn btn-warning">
									Kembali
								</button>
							</Link>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

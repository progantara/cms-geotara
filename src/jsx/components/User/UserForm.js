import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import Swal from "sweetalert2";
import { createUser, getUser, updateUser } from "../../../services/UserService";

export default function UserForm() {
	const history = useHistory();
	const { id } = useParams();

	let title = "Tambah Pengguna";
	let button = "Simpan";
	if (id !== undefined) {
		title = "Edit Pengguna";
		button = "Update";
	}

	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [role, setRole] = useState("");

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		createUser({
			name,
			email,
			password,
			password_confirmation: passwordConfirmation,
			role,
		})
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Pengguna berhasil ditambahkan", "success");
				history.push("/pengguna");
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		updateUser(id, {
			name,
			email,
			role,
		})
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Pengguna berhasil diupdate", "success");
				history.push("/pengguna");
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
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
				.catch(() => {
					Swal.fire("Gagal!", "Pengguna gagal dimuat", "error");
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
					{isLoading && (
						<BeatLoader
							color="#36d7b7"
							cssOverride={{
								position: "absolute",
								top: "50%",
								left: "50%",
								zIndex: "999",
							}}
							size={30}
						/>
					)}
					<div className="basic-form">
						<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
							<fieldset
								{...(isLoading && { disabled: true })}
								{...(isLoading && { style: { filter: "blur(2px)" } })}
							>
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
												onChange={(e) =>
													setPasswordConfirmation(e.target.value)
												}
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
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

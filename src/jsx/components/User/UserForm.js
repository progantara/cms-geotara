import React from "react";
import { Link, useParams } from "react-router-dom";

export default function UserForm() {
  const { id } = useParams();

  let title = "Tambah Pengguna";
  let button = "Simpan";
  if(id !== undefined) {
    title = "Edit Pengguna";
    button = "Update";
  }

	return (
		<div className="col-xl-12 col-lg-12">
			<div className="card">
				<div className="card-header">
					<h4 className="card-title">{title}</h4>
				</div>
				<div className="card-body">
					<div className="basic-form">
						<form onSubmit={(e) => e.preventDefault()}>
							<div className="row">
								<div className="form-group mb-3 col-md-6">
									<label>Nama</label>
									<input
										type="text"
										className="form-control"
										placeholder="Nama"
									/>
								</div>
								<div className="form-group mb-3 col-md-6">
									<label>Email</label>
									<input
										type="email"
										className="form-control"
										placeholder="Email"
									/>
								</div>
								<div className="form-group mb-3 col-md-6">
									<label>Password</label>
									<input
										type="password"
										className="form-control"
										placeholder="Password"
									/>
								</div>
							</div>
							<div className="row">
								<div className="form-group mb-3 col-md-4">
									<label>Role</label>
									<select
										defaultValue={"option"}
										id="inputState"
										className="form-control"
									>
										<option value="option" disabled>
											Pilih...
										</option>
										<option>Pengelola</option>
										<option>Penulis Konten</option>
										<option>Pengunjung</option>
									</select>
								</div>
							</div>
							<button type="submit" className="btn btn-primary me-2">
								{button}
							</button>
              <Link to="/user">
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

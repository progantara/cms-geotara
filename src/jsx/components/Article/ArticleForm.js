import React from "react";
import Rte from "./ArticleRte";
import { Link, useParams } from "react-router-dom";

const ArticleForm = () => {
	const { id } = useParams();

	let title = "Tambah Artikel";
	let button = "Tambah";
	if (id !== undefined) {
		title = "Edit Artikel";
		button = "Perbarui";
	}

	return (
		<div className="h-80">
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">{title}</h4>
						</div>
						<div className="card-body">
							<form onSubmit={(e) => e.preventDefault()}>
								<div className="basic-form form_file_input">
									<div className="form-group">
										<label>Banner</label>
										<div className="input-group mb-3">
											<div className="form-file">
												<input
													type="file"
													className="custom-file-input form-control"
												/>
											</div>

											<span className="input-group-text">Upload</span>
										</div>
									</div>
									<div className="form-group">
										<label>Judul Artikel</label>
										<input
											type="text"
											className="form-control mb-3"
											placeholder="Masukkan judul artikel"
										/>
									</div>
								</div>
								<div className="summernote">
									<div className="form-group">
										<label>Konten</label>
										<Rte />
									</div>
								</div>
								<div className="form-group mt-3">
									<button type="submit" className="btn btn-primary me-2">
										{button}
									</button>
									<Link to="/artikel">
										<button type="button" className="btn btn-warning">
											Kembali
										</button>
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticleForm;

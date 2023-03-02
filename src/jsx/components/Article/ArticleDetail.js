import React, { useState } from "react";
import Rte from "./Rte";

const ArticleDetail = () => {
  const { banner, setBanner } = useState("");
  const { judul, setJudul } = useState("");
  const { konten, setKonten } = useState("");

	return (
		<div className="h-80">
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Detail Artikel</h4>
						</div>
						<div className="card-body">
							<div className="basic-form">
								<div className="form-group">
									<label>Banner</label>
									<div className="input-group mb-3">
										<div className="form-file">
											<input
												type="file"
												className="custom-file-input form-control"
												name="banner_img"
												value={banner}
											/>
										</div>
									</div>
								</div>
								<div className="form-group">
									<label>Judul Artikel</label>
									<input
										type="text"
										className="form-control mb-3"
										name="judul"
										value={judul}
									/>
								</div>
							</div>
							<div className="summernote">
								<div className="form-group">
									<label>Konten</label>
									<Rte />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticleDetail;

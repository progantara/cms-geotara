import React, { Component } from "react";
import MaterialTime from "./MaterialTime";
import { Link } from "react-router-dom";

const EventForm = () => {
	return (
		<div className="h-80">
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Tambah Acara</h4>
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
												placeholder="Nama acara"
											/>
										</div>
										<div className="form-group mb-3 col-md-4">
											<label>Wisata</label>
											<select
												defaultValue={"option"}
												className="form-control"
											>
												<option value="option" disabled>
													Choose...
												</option>
												<option>Option 1</option>
												<option>Option 2</option>
												<option>Option 3</option>
											</select>
										</div>
										<div className="form-group mb-3">
											<label>Deskripsi</label>
											<textarea
												className="form-control"
												rows="4"
												placeholder="Description"
											></textarea>
										</div>
										{/* <div className="form-group mb-3 col-md-6">
                                             <label>City</label>
                                             <input type="text" className="form-control" />
                                          </div> */}
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-4">
											<label>State</label>
											<select
												defaultValue={"option"}
												id="inputState"
												className="form-control"
											>
												<option value="option" disabled>
													Choose...
												</option>
												<option>Option 1</option>
												<option>Option 2</option>
												<option>Option 3</option>
											</select>
										</div>
										<div className="form-group mb-3 col-md-4">
											<label>Province</label>
											<select
												defaultValue={"option"}
												id="inputState"
												className="form-control"
											>
												<option value="option" disabled>
													Choose...
												</option>
												<option>Option 1</option>
												<option>Option 2</option>
												<option>Option 3</option>
											</select>
										</div>
										<div className="form-group col-md-2">
											<label>HTM</label>
											<input
												type="text"
												className="form-control"
												placeholder="Gratis"
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
											<label>Start</label>
											<MaterialTime />
										</div>
										<div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
											<label>End</label>
											<MaterialTime />
										</div>
									</div>
									<Link to="/event-table">
										<button type="submit" className="btn btn-primary">
											Submit
										</button>
									</Link>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventForm;

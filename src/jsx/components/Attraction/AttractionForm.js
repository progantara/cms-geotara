import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AttractionForm extends Component {
	render() {
		return (
			<div className="h-80">
				<div className="row">
					<div className="col-xl-12 col-xxl-12">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title">Form Attraction</h4>
							</div>
							<div className="card-body">
								<div className="summernote">
									<div className="card">
										<div className="card-body">
											<div className="basic-form">
												<form
													onSubmit={(
														e
													) =>
														e.preventDefault()
													}
												>
													<div className="row">
														<label>
															Thumbnail
														</label>
														<div className="input-group">
															<div className="from-file">
																<input
																	type="file"
																	className="form-file-input form-control"
																/>
															</div>
														</div>
														<div className="mb-3 form-group col-md-6">
															<label>
																Name
															</label>
															<input
																type="text"
																className="form-control"
																placeholder="Homestay"
															/>
														</div>
														<div className="mb-3 form-group col-md-4">
															<label>
																Category
															</label>
															<select
																defaultValue={
																	'option'
																}
																id="inputState"
																className="form-control"
															>
																<option
																	value="option"
																	disabled
																>
																	Choose...
																</option>
																<option>
																	Option
																	1
																</option>
																<option>
																	Option
																	2
																</option>
																<option>
																	Option
																	3
																</option>
															</select>
														</div>
														<div className="mb-3 form-group">
															<label>
																Description
															</label>
															<textarea
																className="form-control"
																// rows="4"
																id="description"
															></textarea>
														</div>
														{/* <div className="mb-3 form-group col-md-6">
                                             <label>City</label>
                                             <input type="text" className="form-control" />
                                          </div> */}
													</div>
													<div className="row">
														<div className="mb-3 form-group col-md-4">
															<label>
																State
															</label>
															<select
																defaultValue={
																	'option'
																}
																id="inputState"
																className="form-control"
															>
																<option
																	value="option"
																	disabled
																>
																	Choose...
																</option>
																<option>
																	Option
																	1
																</option>
																<option>
																	Option
																	2
																</option>
																<option>
																	Option
																	3
																</option>
															</select>
														</div>
														<div className="mb-3 form-group col-md-4">
															<label>
																Province
															</label>
															<select
																defaultValue={
																	'option'
																}
																id="inputState"
																className="form-control"
															>
																<option
																	value="option"
																	disabled
																>
																	Choose...
																</option>
																<option>
																	Option
																	1
																</option>
																<option>
																	Option
																	2
																</option>
																<option>
																	Option
																	3
																</option>
															</select>
														</div>
														<div className="form-group col-md-2">
															<label>
																Harga
															</label>
															<input
																type="text"
																className="form-control"
																placeholder="Gratis"
															/>
														</div>
													</div>
													<div className="row">
														<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
															<label>
																Start
															</label>
															<MaterialTime />
														</div>
														<div className="mb-3 col-xl-3 col-xxl-6 col-md-6">
															<label>
																End
															</label>
															<MaterialTime />
														</div>
													</div>
													<Link to="/accomodation-table">
														<button
															type="submit"
															className="btn btn-primary"
														>
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
					</div>
				</div>
			</div>
		);
	}
}

export default AttractionForm;

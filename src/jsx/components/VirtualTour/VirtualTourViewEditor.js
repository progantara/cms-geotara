import React, { Fragment, useEffect, useRef, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import ReactPannellum, {
	mouseEventToCoords,
	addHotSpot,
	removeHotSpot,
} from "react-pannellum";
import Sample360 from "../../../images/360/1.jpg";
import { Button } from "react-bootstrap";

const VirtualTourViewEditor = () => {
	const [mouseCoord, setMouseCoord] = useState(false);
	const [activeAction, setActiveAction] = useState("");

	const [spotForm, setSpotForm] = useState({
		id: 0,
		pitch: 0,
		yaw: 0,
		text: "",
		URL: "",
	});

	const [spotList, setSpotList] = useState([]);

	const viewConfig = {
		autoLoad: true,
		hotSpots: spotList,
		compass: true,
		showFullscreenCtrl: false,
		escapeHTML: true,
	};

	const handleChange = (event) => {
		setSpotForm({ ...spotForm, [event.target.name]: event.target.value });
	};

	return (
		<Fragment>
			<PageTitle
				activeMenu="View Editor"
				motherMenu="Virtual Tour"
				pageContent="View Editor"
			/>

			<div className="row">
				<div className="col-xl-4 col-lg-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Spot Editor</h4>
						</div>
						<div className="card-body">
							<div className="basic-form">
								<form onSubmit={(e) => e.preventDefault()}>
									<div className="row">
										<div className="form-group mb-3 col-md-12">
											<label>Jenis Spot</label>
											<select
												defaultValue={spotForm.type}
												className="form-control"
												name="type"
												onChange={handleChange}
											>
												<option>Pilih...</option>
												<option value="scene">Transition</option>
												<option value="info">Information</option>
											</select>
										</div>
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-12">
											<label>Text</label>
											<input
												type="text"
												className="form-control"
												name="text"
												placeholder="Spot Text"
												value={spotForm.text}
												onChange={handleChange}
											/>
										</div>
										{spotForm.type === "info" && (
											<div className="form-group mb-3 col-md-12">
												<label>Go To an URL</label>
												<input
													type="text"
													className="form-control"
													name="URL"
													placeholder="https://"
													value={spotForm.URL}
													onChange={handleChange}
												/>
											</div>
										)}
										{spotForm.type === "scene" && (
											<div className="form-group mb-3 col-md-12">
												<label>Go To a View</label>
												<select
													defaultValue={"option"}
													className="form-control"
													name="view"
												>
													<option value="option" disabled>
														Choose...
													</option>
													<option value="">Info</option>
													<option value="">Transition</option>
													<option value="">Option 3</option>
												</select>
											</div>
										)}
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-6">
											<label>Yaw</label>
											<input
												type="text"
												className="form-control"
												name="yaw"
												placeholder="46.5512132"
												value={spotForm.yaw}
												onChange={handleChange}
											/>
										</div>
										<div className="form-group mb-3 col-md-6">
											<label>Pitch</label>
											<input
												type="text"
												className="form-control"
												name="pitch"
												placeholder="46.5512132"
												value={spotForm.pitch}
												onChange={handleChange}
											/>
										</div>
									</div>
									<button
										type="submit"
										onClick={(event) => {
											addHotSpot({
												id: 2,
												type: "scene",
												pitch: -107,
												yaw: 31,
												text: "Change Scene",
												sceneId: "2",
												// URL: "https://gitlab.com",
											});
											addHotSpot({
												id: 3,
												type: "info",
												pitch: -115,
												yaw: 40,
												text: "Facebook",
												// URL: "https://gitlab.com",
											});
											setSpotList([
												...spotList,
												{
													id: 2,
													type: "scene",
													pitch: -107,
													yaw: 31,
													text: "Change Scene",
													sceneId: "2",
													// URL: "https://gitlab.com",
												},
												{
													id: 3,
													type: "info",
													pitch: -115,
													yaw: 40,
													text: "Facebook",
													// URL: "https://gitlab.com",
												},
											]);
											console.log(spotList);
										}}
										className="btn btn-primary"
									>
										Save
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-8 col-lg-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">View Editor</h4>
						</div>
						<div className="card-body">
							<div className="mb-2">
								<Button
									className="btn-square btn-sm"
									variant={activeAction === "select" ? "dark" : "outline-dark"}
									onClick={() => {
										activeAction !== "select"
											? setActiveAction("select")
											: setActiveAction("");
									}}
								>
									<i className="fa fa-mouse-pointer"></i>
								</Button>
								<Button
									className="btn-square btn-sm"
									variant={activeAction === "add" ? "dark" : "outline-dark"}
									onClick={() => {
										activeAction !== "add"
											? setActiveAction("add")
											: setActiveAction("");
									}}
								>
									<i className="fa fa-plus"></i>
								</Button>
								<Button
									className="btn-square btn-sm"
									variant={activeAction === "remove" ? "dark" : "outline-dark"}
									onClick={() => {
										handleRemoveSpot();
										activeAction !== "remove"
											? setActiveAction("remove")
											: setActiveAction("");
									}}
								>
									<i className="fa fa-trash"></i>
								</Button>
							</div>

							<ReactPannellum
								id="1"
								type="equirectangular"
								sceneId="firstScene"
								imageSource={Sample360}
								style={{
									width: "100%",
									height: "400px",
								}}
								config={viewConfig}
								onPanoramaMouseDown={(event) => {
									const coord = mouseEventToCoords(event);
									setMouseCoord({
										x: coord[0],
										y: coord[1],
									});
								}}
								onPanoramaMouseUp={(event) => {
									const coord = mouseEventToCoords(event);
									const diffX = mouseCoord.x - coord[0];
									const diffY = mouseCoord.y - coord[1];

									if (diffX === 0 && diffY === 0) {
										if (activeAction === "add") {
											if (event.which === 1) {
												const newSpotId = spotList.length + 1;
												const newSpot = {
													id: newSpotId,
													type: "info",
													pitch: coord[0],
													yaw: coord[1],
													text: "Facebook",
													clickHandlerArgs: { id: newSpotId },
													clickHandlerFunc: (evt, args) => {
														if (evt.which === 1) {
															// handleRemoveSpot(evt, args);
														}
													},
													// URL: "https://gitlab.com",
												};
												addHotSpot(newSpot);
											}
										}
									}
								}}
								onContextMenu={(event) => {
									console.log("Right Clicked");
								}}
							></ReactPannellum>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default VirtualTourViewEditor;

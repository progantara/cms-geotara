import React, { Fragment, useEffect, useRef, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import ReactPannellum, {
	getConfig,
	getPitch,
	mouseEventToCoords,
	addHotSpot,
	removeHotSpot,
} from "react-pannellum";
import Sample360 from "../../../images/360/1.jpg";

const VirtualTourViewEditor = () => {
	const panImage = useRef();
	const [mouseCoord, setMouseCoord] = useState(false);

	const click = (event) => {
		console.log(getPitch());
	};

	const [spotInfo, setSpotInfo] = useState({
		pitch: 0,
		yaw: 0,
		text: "",
		URL: "",
	});

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
	};

	const handleChange = (event) => {
		setSpotInfo({ ...spotInfo, [event.target.name]: event.target.value });
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
							<h4 className="card-title">Spot Attribute</h4>
						</div>
						<div className="card-body">
							<div className="basic-form">
								<form onSubmit={(e) => e.preventDefault()}>
									<div className="row">
										<div className="form-group mb-3 col-md-12">
											<label>Jenis Spot</label>
											<select
												defaultValue={spotInfo.type}
												className="form-control"
												name="type"
											>
												<option value="option" disabled>
													Choose...
												</option>
												<option value="info">Info</option>
												<option value="custom">Custom</option>
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
												value={spotInfo.text}
												onChange={handleChange}
											/>
										</div>
										<div className="form-group mb-3 col-md-12">
											<label>Go To an URL</label>
											<input
												type="text"
												className="form-control"
												name="URL"
												placeholder="https://"
												value={spotInfo.URL}
												onChange={handleChange}
											/>
										</div>
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
									</div>
									<div className="row">
										<div className="form-group mb-3 col-md-6">
											<label>Yaw</label>
											<input
												type="text"
												className="form-control"
												name="yaw"
												placeholder="46.5512132"
												value={spotInfo.yaw}
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
												value={spotInfo.pitch}
												onChange={handleChange}
											/>
										</div>
									</div>
									<button
										type="submit"
										onClick={(event) => {
											addHotSpot({
												id: 2,
												type: "info",
												pitch: -107,
												yaw: 31,
												text: "Facebook",
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
													type: "info",
													pitch: -107,
													yaw: 31,
													text: "Facebook",
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
							<h4 className="card-title">View</h4>
						</div>
						<div className="card-body">
							<ReactPannellum
								ref={panImage}
								id="1"
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
									})
								}}
								onPanoramaMouseUp={(event) => {
									const coord = mouseEventToCoords(event);
									const diffX = mouseCoord.x - coord[0];
									const diffY = mouseCoord.y - coord[1];

									if(diffX === 0 && diffY === 0) {
										if (event.which === 1) {
											let coord = mouseEventToCoords(event);
											addHotSpot({
												id: spotList.length + 1,
												type: "info",
												pitch: coord[0],
												yaw: coord[1],
												text: "Facebook",
												clickHandlerArgs: { id: spotList.length + 1 },
												clickHandlerFunc: (evt, args) => {
													if(evt.which === 1) {
														removeHotSpot(args.id)
														// TODO: Left Click to Edit Hotspot
														// TODO: Delete Hotspot from SpotList State
													}
													// TODO: Right Click to Delete Hotspot
												}
												// URL: "https://gitlab.com",
											});
										}
									}
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default VirtualTourViewEditor;

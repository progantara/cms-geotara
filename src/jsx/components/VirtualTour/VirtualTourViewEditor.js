import React, { Fragment, useEffect, useRef, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import ReactPannellum, {
	mouseEventToCoords,
	addHotSpot,
	removeHotSpot,
} from "react-pannellum";
import styled from "styled-components";
import Sample360 from "../../../images/360/1.jpg";

const ContextMenu = styled.div`
	border-radius: 4px;
	box-sizing: border-box;
	position: absolute;
	width: 200px;
	background-color: #383838;
	box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	ul {
		list-style-type: none;
		box-sizing: border-box;
		margin: 0;
		padding: 10px;
	}
	ul li {
		padding: 18px 12px;
		border-radius: 4px;
	}
	ul li:hover {
		cursor: pointer;
		background-color: #4b4b4b;
	}
`;

const ContextMenuProps = styled(ContextMenu)`
	${({ top, left }) => css`
		top: ${top}px;
		left: ${left}px;
	`}
`;

const VirtualTourViewEditor = () => {
	const [mouseCoord, setMouseCoord] = useState(false);

	const [spotInfo, setSpotInfo] = useState({
		type: "",
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
		escapeHTML: true,
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
												value={spotInfo.text}
												onChange={handleChange}
											/>
										</div>
										{spotInfo.type === "info" && (
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
										)}
										{spotInfo.type === "scene" && (
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
							<h4 className="card-title">View</h4>
						</div>
						<div className="card-body">
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
													console.log(evt);
													if (evt.which === 1) {
														removeHotSpot(args.id);
														// TODO: Left Click to Edit Hotspot
														// TODO: Delete Hotspot from SpotList State
													}
													// TODO: Right Click to Delete Hotspot
												},
												// URL: "https://gitlab.com",
											});
										}
									}
								}}
								onContextMenu={(event) => {
									console.log("Right Clicked");
								}}
							>
								<div
									style={{
										position: "absolute",
										bottom: "0",
										zIndex: "2",
										textAlign: "center",
										width: "100%",
										paddingBottom: "3px",
									}}
								>
									<div
										id="pan-up"
										style={{
											padding: "8px 5px",
											width: "30px",
											textAlign: "center",
											background: "rgba(200, 200, 200, 0.8)",
											display: "inline-block",
											cursor: "pointer",
											"&:hover": {
												background: "rgba(200, 200, 200, 1)",
											},
										}}
									>
										&#9650;
									</div>
									<div
										id="pan-up"
										style={{
											padding: "8px 5px",
											width: "30px",
											textAlign: "center",
											background: "rgba(200, 200, 200, 0.8)",
											display: "inline-block",
											cursor: "pointer",
											"&:hover": {
												background: "rgba(200, 200, 200, 1)",
											},
										}}
									>
										&#9660;
									</div>
									<div
										id="pan-up"
										style={{
											padding: "8px 5px",
											width: "30px",
											textAlign: "center",
											background: "rgba(200, 200, 200, 0.8)",
											display: "inline-block",
											cursor: "pointer",
											"&:hover": {
												background: "rgba(200, 200, 200, 1)",
											},
										}}
									>
										&#9664;
									</div>
									<div
										id="pan-up"
										style={{
											padding: "8px 5px",
											width: "30px",
											textAlign: "center",
											background: "rgba(200, 200, 200, 0.8)",
											display: "inline-block",
											cursor: "pointer",
											"&:hover": {
												background: "rgba(200, 200, 200, 1)",
											},
										}}
									>
										&#9654;
									</div>
								</div>
							</ReactPannellum>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default VirtualTourViewEditor;

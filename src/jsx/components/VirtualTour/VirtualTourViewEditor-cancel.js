import React, { Fragment, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Pannellum, PannellumVideo } from "pannellum-react";
import Sample360 from "../../../images/360/1.jpg";

const VirtualTourViewEditor = () => {
	const [yaw, setYaw] = React.useState(0);
	const [pitch, setPitch] = React.useState(0);

	const panImage = React.useRef(null);

	const [spotInfo, setSpotInfo] = useState({
		type: "option",
		pitch: 0,
		yaw: 0,
		text: "",
		URL: "",
	});

	const [spotList, setSpotList] = useState([
		{
			type: "custom",
			pitch: -167,
			yaw: 11,
			text: "Github",
			URL: "https://github.com",
		},
		{
			type: "custom",
			pitch: -107,
			yaw: 31,
			text: "Gitlab",
			URL: "https://gitlab.com",
		},
	]);

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
												value={spotInfo.type}
												onChange={handleChange}
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
												value={yaw}
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
												value={pitch}
												onChange={handleChange}
											/>
										</div>
									</div>
									<button type="submit" className="btn btn-primary">
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
							<Pannellum
								ref={panImage}
								width="100%"
								height="400px"
								image={Sample360}
								pitch={10}
								yaw={180}
								hfov={110}
								autoLoad
								compass
								onLoad={() => {
									console.log("panorama loaded");
								}}
								onMouseup={(event) => {
									console.log(event)
									setSpotList([
										...spotList,
										{
											type: "info",
											pitch: panImage.current.getViewer().mouseEventToCoords(event)[0],
											yaw: panImage.current.getViewer().mouseEventToCoords(event)[1],
											text: "Facebook",
											URL: "https://facebook.com",
										}
									])
								}}
							>
								{spotList.map((item, index) => {
									return (
										<Pannellum.Hotspot
											type={item.type}
											pitch={item.pitch}
											yaw={item.yaw}
											text={item.text}
											handleClick={(evt, args) => setSpotInfo(args)}
											handleClickArg={{
												type: item.type,
												pitch: item.pitch,
												yaw: item.yaw,
												text: item.text,
												URL: item.URL,
											}}
										/>
									);
								})}
							</Pannellum>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default VirtualTourViewEditor;

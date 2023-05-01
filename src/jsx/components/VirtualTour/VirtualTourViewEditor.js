import React, { Fragment, useEffect, useRef, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import ReactPannellum, {
	mouseEventToCoords,
	addHotSpot,
	removeHotSpot,
	getPitch,
	getYaw
} from "react-pannellum";
import Sample360 from "../../../images/360/1.jpg";
import {
	Badge,
	Button,
	ListGroup,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import "./virtualTour.css";
import { generateUUID } from "../../../utils/stringFormatter";
import Swal from "sweetalert2";

const VirtualTourViewEditor = () => {
	const [mouseCoord, setMouseCoord] = useState(false);
	const [activeAction, setActiveAction] = useState("");
	const [clickedSpot, setClickedSpot] = useState({});
	const [spotList, setSpotList] = useState([]);
	const [spotListLength, setSpotListLength] = useState(0);
	const [centerView, setCenterView] = useState({
		yaw: 0,
		pitch: 0,
	});

	const viewConfig = {
		autoLoad: true,
		hotSpots: spotList,
		compass: true,
		showFullscreenCtrl: false,
		escapeHTML: true,
		hfov: 200,
		yaw: centerView.yaw,
		pitch: centerView.pitch,
	};

	const handleAddHotSpot = (coord) => {
		let newSpotId;
		let findSpot;
		do {
			newSpotId = generateUUID(8);
			findSpot = spotList.find((spot) => spot.id === newSpotId);
		} while (findSpot);

		const newSpot = {
			id: newSpotId,
			text: "Spot " + newSpotId,
			type: "info",
			pitch: coord[0],
			yaw: coord[1],
			clickHandlerArgs: {
				id: newSpotId,
				sceneId: "firstScene",
			},
			clickHandlerFunc: (evt, args) => {
				if (evt.which === 1) {
					handleClickHandlerChange(args);
				}
			},
		};
		setSpotList([...spotList, newSpot]);
		addHotSpot(newSpot);
	};

	const handleClickHandlerChange = (args) => {
		if (activeAction === "select") {
			if (clickedSpot.id !== args.id) {
				setClickedSpot(args);
			} else {
				setClickedSpot({});
			}
		} else if (activeAction === "remove") {
			Swal.fire({
				title: "Hapus Spot?",
				text: "Spot yang dihapus tidak dapat dikembalikan!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Hapus",
				cancelButtonText: "Batal",
			}).then((result) => {
				if (result.isConfirmed) {
					setSpotList(spotList.filter((spot) => spot.id !== args.id));
					removeHotSpot(args.id, args.sceneId);
					if(clickedSpot.id === args.id) {
						setClickedSpot({});
					}
				}
			});
		} else {
			Swal.fire({
				title: "Pilih Aksi!",
				text: "Pilih aksi yang akan dilakukan!",
				icon: "warning",
				showCancelButton: false,
				confirmButtonText: "OK",
			});
		}
	};

	useEffect(() => {
		refreshComponent();
	}, [activeAction, clickedSpot]);

	const refreshComponent = () => {
		spotList.forEach((spot) => {
			spot.clickHandlerFunc = (evt, args) => {
				if (evt.which === 1) {
					handleClickHandlerChange(args);
				}
			};

			if (spot.id === clickedSpot.id) {
				spot.cssClass = "active-hotspot";
			} else {
				spot.cssClass = "";
			}
		});
		setSpotListLength(spotListLength + 1);
	};

	return (
		<>
			<PageTitle
				activeMenu="View Editor"
				motherMenu="Virtual Tour"
				pageContent="View Editor"
			/>

			<div className="row">
				<div className="col-xl-9 col-lg-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">View Editor</h4>
						</div>
						<div className="card-body d-flex">
							<ReactPannellum
								key={`pannellum-${spotListLength}`}
								className={
									activeAction === "select"
										? "cursor-select"
										: activeAction === "add"
										? "cursor-add"
										: activeAction === "remove"
										? "cursor-remove"
										: ""
								}
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
											if (activeAction === "add") {
												handleAddHotSpot(coord);
											}
										}
									} else {
										setCenterView({
											yaw: getYaw(),
											pitch: getPitch(),
										});
									}
								}}
							></ReactPannellum>

							<div
								className="ms-2 d-flex flex-column"
							>
								<OverlayTrigger
									placement="right"
									overlay={<Tooltip>Pilih Spot</Tooltip>}
								>
									<Button
										className="btn-square btn-sm"
										variant={
											activeAction === "select" ? "dark" : "outline-dark"
										}
										onClick={() => {
											activeAction !== "select"
												? setActiveAction("select")
												: setActiveAction("");
										}}
									>
										<i className="fa fa-mouse-pointer"></i>
									</Button>
								</OverlayTrigger>
								<OverlayTrigger
									placement="right"
									overlay={<Tooltip>Tambah Spot</Tooltip>}
								>
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
								</OverlayTrigger>
								<OverlayTrigger
									placement="right"
									overlay={<Tooltip>Hapus Spot</Tooltip>}
								>
									<Button
										className="btn-square btn-sm"
										variant={
											activeAction === "remove" ? "dark" : "outline-dark"
										}
										onClick={() => {
											activeAction !== "remove"
												? setActiveAction("remove")
												: setActiveAction("");
										}}
									>
										<i className="fa fa-trash"></i>
									</Button>
								</OverlayTrigger>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Spot List</h4>
						</div>
						<div className="basic-list-group">
							<ListGroup>
								{spotList.map((list, i) => (
									<Fragment key={i}>
										{list.id === clickedSpot.id ? (
											<ListGroup.Item
												action
												active
												className="custom-listspot"
												onClick={() => {
													setClickedSpot({});
												}}
											>
												<Badge variant="secondary" pill>
													{i + 1}
												</Badge>{" "}
												{list.text}
											</ListGroup.Item>
										) : (
											<ListGroup.Item
												action
												className="custom-listspot"
												onClick={() => {
													setClickedSpot(list);
													setCenterView({
														yaw: list.yaw,
														pitch: list.pitch,
													});
												}}
											>
												<Badge variant="secondary" pill>
													{i + 1}
												</Badge>{" "}
												{list.text}
											</ListGroup.Item>
										)}
									</Fragment>
								))}
							</ListGroup>
						</div>
						{clickedSpot !== null && Object.keys(clickedSpot).length !== 0 && (
							<div className="card-footer px-0">
								<div className="btn-group">
									<Button
										className="btn-square btn-sm"
										variant="secondary"
									>
										<i className="fa fa-edit"></i>
									</Button>
									<Button
										className="btn-square btn-sm"
										variant="danger"
										onClick={() => {
											const isSpotExists = spotList.find(
												(spot) => spot.id === clickedSpot.id
											);
											if (isSpotExists) {
												removeHotSpot(clickedSpot.id, clickedSpot.sceneId);
												setSpotList(
													spotList.filter((spot) => spot.id !== clickedSpot.id)
												);
												setClickedSpot({});
												Swal.fire("Dihapus!", "Spot dihapus", "success");
											} else {
												Swal.fire("Gagal!", "Spot tidak ditemukan", "error");
											}
										}}
									>
										<i className="fa fa-trash"></i>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default VirtualTourViewEditor;

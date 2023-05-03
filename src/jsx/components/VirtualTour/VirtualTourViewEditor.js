import React, { Fragment, useEffect, useRef, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import ReactPannellum, {
	mouseEventToCoords,
	addHotSpot,
	removeHotSpot,
	getPitch,
	getYaw,
} from "react-pannellum";
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
import { useParams } from "react-router-dom";
import {
	createSpot,
	deleteSpot,
	getAllSpot,
	getView,
} from "../../../services/VirtualTourService";

const VirtualTourViewEditor = () => {
	const { idView } = useParams();

	const [imageEditor, setImageEditor] = useState(null);
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
		let randomSpotName;
		let findSpot;
		randomSpotName = generateUUID(8);

		const data = new FormData();
		data.append("view_id", idView);
		data.append("nama", "Spot " + randomSpotName);
		data.append("yaw", coord[1]);
		data.append("pitch", coord[0]);
		data.append("tipe", "info");
		data.append("aksi[url]", "#");

		createSpot(data)
			.then((response) => {
				const newSpot = {
					id: response.data.data._id,
					text: response.data.data.nama,
					type: response.data.data.tipe,
					pitch: response.data.data.koordinat.pitch,
					yaw: response.data.data.koordinat.yaw,
					url: response.data.data.aksi.url,
					clickHandlerArgs: {
						id: response.data.data._id,
						sceneId: idView,
					},
					clickHandlerFunc: (evt, args) => {
						if (evt.which === 1) {
							handleClickHandlerChange(args);
						}
					},
				};

				setSpotList([...spotList, newSpot]);
				addHotSpot(newSpot);
			})
			.catch((error) => {
				Swal.fire({
					title: "Gagal Menambah Spot!",
					text: error.response.data.message,
					icon: "error",
					showCancelButton: false,
					confirmButtonText: "OK",
				});
			});
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
					deleteSpot(args.id)
						.then((response) => {
							setSpotList(spotList.filter((spot) => spot.id !== args.id));
							removeHotSpot(args.id, args.sceneId);
							if (clickedSpot.id === args.id) {
								setClickedSpot({});
							}
						})
						.catch((error) => {
							Swal.fire({
								title: "Gagal Menghapus Spot!",
								text: error.response.data.message,
								icon: "error",
								showCancelButton: false,
								confirmButtonText: "OK",
							});
						});
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

	const loadData = async () => {
		try {
			const responseView = await getView(idView);
			setImageEditor(responseView.data.data.file);

			const responseSpot = await getAllSpot(idView);
			setSpotList(
				responseSpot.data.data.map((spot) => {
					return {
						id: spot._id,
						text: spot.nama,
						type: spot.tipe,
						pitch: spot.koordinat.pitch,
						yaw: spot.koordinat.yaw,
						url: spot.aksi.url,
						clickHandlerArgs: {
							id: spot._id,
							sceneId: spot.view_id,
						},
						clickHandlerFunc: (evt, args) => {
							if (evt.which === 1) {
								handleClickHandlerChange(args);
							}
						},
					};
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		loadData();
		refreshComponent();
	}, [activeAction, clickedSpot]);

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
							{imageEditor && (
								<ReactPannellum
									key={`pannellum-${spotListLength}-${spotList.length}`}
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
									sceneId={idView}
									imageSource={
										process.env.REACT_APP_STORAGE_BASE_URL +
										"/view/" +
										imageEditor
									}
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
							)}

							<div className="ms-2 d-flex flex-column">
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
									<Button className="btn-square btn-sm" variant="secondary">
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

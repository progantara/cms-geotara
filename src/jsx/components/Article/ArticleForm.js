import React, { useEffect, useRef, useState } from "react";

import { Link as RouterLink, useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import { checkImageResolution } from "../../../utils/checkImageWidth";
import {
	createArticle,
	getArticle,
	updateArticle,
} from "../../../services/ArticleService";
import Swal from "sweetalert2";
import { capitalizeEachFirstLetter } from "../../../utils/stringFormatter";
import BeatLoader from "react-spinners/BeatLoader";

// AM Editor
import Engine from "@aomao/engine";
import Toolbar, { ToolbarPlugin, ToolbarComponent } from "@aomao/toolbar";
import Image, { ImageComponent, ImageUploader } from "@aomao/plugin-image";
import Table, { TableComponent } from "@aomao/plugin-table";
import File, { FileComponent, FileUploader } from "@aomao/plugin-file";
import Video, { VideoComponent, VideoUploader } from "@aomao/plugin-video";
import Math, { MathComponent } from "@aomao/plugin-math";
import Status, { StatusComponent } from "@aomao/plugin-status";
import CodeBlock, { CodeBlockComponent } from "@aomao/plugin-codeblock";
import Undo from "@aomao/plugin-undo";
import Redo from "@aomao/plugin-redo";
import Paintformat from "@aomao/plugin-paintformat";
import Removeformat from "@aomao/plugin-removeformat";
import Bold from "@aomao/plugin-bold";
import Underline from "@aomao/plugin-underline";
import Italic from "@aomao/plugin-italic";
import Strikethrough from "@aomao/plugin-strikethrough";
import Code from "@aomao/plugin-code";
import Sub from "@aomao/plugin-sub";
import Sup from "@aomao/plugin-sup";
import Mark from "@aomao/plugin-mark";
import Alignment from "@aomao/plugin-alignment";
import Heading from "@aomao/plugin-heading";
import Fontfamily from "@aomao/plugin-fontfamily";
import Fontsize from "@aomao/plugin-fontsize";
import Fontcolor from "@aomao/plugin-fontcolor";
import Backcolor from "@aomao/plugin-backcolor";
import Unorderedlist from "@aomao/plugin-unorderedlist";
import Orderedlist from "@aomao/plugin-orderedlist";
import Tasklist, { CheckboxComponent } from "@aomao/plugin-tasklist";
import Indent from "@aomao/plugin-indent";
import LineHeight from "@aomao/plugin-line-height";
import Link from "@aomao/plugin-link";
import Quote from "@aomao/plugin-quote";
import Hr, { HrComponent } from "@aomao/plugin-hr";

const tagsOption = [
	{ value: "wisata", label: "Wisata", color: "#00B8D9" },
	{ value: "indonesia", label: "Indonesia", color: "#0052CC" },
];

const ClearIndicator = (props) => {
	const {
		children = "clear all",
		getStyles,
		innerProps: { ref, ...restInnerProps },
	} = props;
	return (
		<div
			{...restInnerProps}
			ref={ref}
			style={getStyles("clearIndicator", props)}
		>
			<div style={{ padding: "0px 5px" }}>{children}</div>
		</div>
	);
};

const ClearIndicatorStyles = (base, state) => ({
	...base,
	cursor: "pointer",
	color: state.isFocused ? "blue" : "black",
});

const ArticleForm = () => {
	const history = useHistory();
	const { id } = useParams();

	let title = "Tambah Artikel";
	let button = "Tambah";
	if (id !== undefined) {
		title = "Edit Artikel";
		button = "Perbarui";
	}

	const editorRef = useRef(null);
	const [engine, setEngine] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [formArticle, setFormArticle] = useState({
		thumbnail: "",
		thumbnailPreview: "",
		judul: "",
		tags: [],
	});
	const [content, setContent] = useState("");

	const [bannerResolution, setBannerResolution] = useState({
		width: 0,
		height: 0,
	});

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const data = new FormData();
		data.append("thumbnail", formArticle.thumbnail);
		data.append("judul", formArticle.judul);
		data.append("content", content);
		formArticle.tags
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`tags[${index}]`, item);
			});
		createArticle(data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Artikel berhasil ditambahkan", "success");
				history.push("/artikel");
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		let data = new FormData();
		data.append("_method", "put");
		if (formArticle.banner !== "")
			data.append("thumbnail", formArticle.thumbnail);
		data.append("judul", formArticle.judul);
		data.append("content", content);
		formArticle.tags
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`tags[${index}]`, item);
			});
		updateArticle(id, data)
			.then(() => {
				setIsLoading(false);
				Swal.fire("Berhasil!", "Artikel berhasil diperbarui", "success");
				history.push("/artikel");
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					Swal.fire("Gagal!", err.response.data.message, "error");
				} else if (err.request) {
					Swal.fire("Gagal!", "Tidak dapat terhubung ke server", "error");
				} else {
					Swal.fire("Gagal!", "Terjadi kesalahan", "error");
				}
			});
	};

	const initEditor = (val) => {
		if (!editorRef.current) return;
		const engine = new Engine(editorRef.current, {
			lang: "en-US",
			plugins: [
				ToolbarPlugin,
				CodeBlock,
				Image,
				ImageUploader,
				Table,
				File,
				FileUploader,
				Video,
				VideoUploader,
				Math,
				Status,
				Undo,
				Redo,
				Paintformat,
				Removeformat,
				Bold,
				Italic,
				Underline,
				Strikethrough,
				Code,
				Sub,
				Sup,
				Mark,
				Alignment,
				Heading,
				Fontfamily,
				Fontsize,
				Fontcolor,
				Backcolor,
				Unorderedlist,
				Orderedlist,
				Tasklist,
				Indent,
				LineHeight,
				Link,
				Quote,
				Hr,
			],
			cards: [
				ToolbarComponent,
				CodeBlockComponent,
				ImageComponent,
				TableComponent,
				FileComponent,
				VideoComponent,
				MathComponent,
				StatusComponent,
				HrComponent,
				CheckboxComponent,
			],
		});
		engine.setValue(val);
		engine.on("change", () => {
			const value = engine.getValue();
			setContent(value);
		});
		setEngine(engine);
	};

	const loadArticle = async () => {
		try {
			const res = await getArticle(id);
			setFormArticle({
				...formArticle,
				thumbnailPreview: res.data.data.thumbnail,
				judul: res.data.data.judul,
				tags: res.data.data.tags.map((item) => ({
					value: item,
					label: capitalizeEachFirstLetter(item),
					color: "#00B8D9",
				})),
			});

			initEditor(res.data.data.content);
		} catch (error) {
			Swal.fire("Gagal!", "Artikel gagal dimuat", "error").then(() => {
				history.push("/artikel");
			});
		}
	};

	useEffect(() => {
		if (id !== undefined) {
			loadArticle();
		} else {
			initEditor("");
		}
	}, [id]);

	return (
		<div className="h-80">
			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">{title}</h4>
						</div>
						<div className="card-body">
							{isLoading && (
								<BeatLoader
									color="#36d7b7"
									cssOverride={{
										position: "absolute",
										top: "50%",
										left: "50%",
										zIndex: "999",
									}}
									size={30}
								/>
							)}
							<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
								<fieldset
									{...(isLoading && { disabled: true })}
									{...(isLoading && { style: { filter: "blur(2px)" } })}
								>
									<div className="basic-form form_file_input">
										<div className="form-group mb-3">
											<label>Thumbnail</label>
											<div className="input-group">
												<div className="form-file">
													<input
														type="file"
														className="custom-file-input form-control"
														accept="image/*"
														onChange={(event) => {
															checkImageResolution(event.target.files[0])
																.then((res) => {
																	setFormArticle({
																		...formArticle,
																		thumbnail: event.target.files[0],
																	});
																	setBannerResolution({
																		width: res.width,
																		height: res.height,
																	});
																})
																.catch((err) => {
																	console.log(err);
																});
														}}
													/>
												</div>
												<span className="input-group-text">Upload</span>
											</div>
											{formArticle.thumbnailPreview && (
												<img
													src={
														process.env.REACT_APP_STORAGE_BASE_URL +
														"/artikel/" +
														formArticle.thumbnailPreview
													}
													alt="thumbnail"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: "40%",
														height: "auto",
													}}
												/>
											)}
											{formArticle.thumbnail && (
												<img
													src={URL.createObjectURL(formArticle.thumbnail)}
													alt="thumbnail"
													className="img-fluid border border-2 border-dark rounded-3"
													style={{
														width: "40%",
														height: "auto",
													}}
												/>
											)}
										</div>
										<div className="form-group mb-4">
											<label>Judul Artikel</label>
											<input
												type="text"
												className="form-control"
												placeholder="Masukkan judul artikel"
												value={formArticle.judul}
												onChange={(e) =>
													setFormArticle({
														...formArticle,
														judul: e.target.value,
													})
												}
											/>
										</div>
										<div className="form-group mb-5">
											{engine && (
												<Toolbar
													engine={engine}
													items={[
														["collapse"],
														["undo", "redo", "paintformat", "removeformat"],
														["heading", "fontfamily", "fontsize"],
														[
															"bold",
															"italic",
															"underline",
															"strikethrough",
															"moremark",
														],
														["fontcolor", "backcolor"],
														["alignment"],
														["code", "sub", "sup"],
														[
															"unorderedlist",
															"orderedlist",
															"tasklist",
															"indent",
															"line-height",
														],
														["link", "quote", "hr"],
													]}
												/>
											)}
											<div ref={editorRef} />
										</div>
										<div className="form-group mb-3">
											<label>Tag</label>
											<Select
												closeMenuOnSelect={false}
												components={{
													ClearIndicator,
												}}
												styles={{
													clearIndicator: ClearIndicatorStyles,
												}}
												value={formArticle.tags}
												onChange={(e) => {
													setFormArticle({ ...formArticle, tags: e });
												}}
												isMulti
												options={tagsOption}
											/>
										</div>
									</div>
									<div className="form-group mt-3">
										<button type="submit" className="btn btn-primary me-2">
											{button}
										</button>
										<RouterLink to="/artikel">
											<button type="button" className="btn btn-warning">
												Kembali
											</button>
										</RouterLink>
									</div>
								</fieldset>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticleForm;

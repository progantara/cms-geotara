import React, { useEffect, useState } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
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

	const [isLoading, setIsLoading] = useState(false);
	const [formArticle, setFormArticle] = useState({
		thumbnail: "",
		thumbnailPreview: "",
		judul: "",
		tags: [],
		content: "",
	});

	const [bannerResolution, setBannerResolution] = useState({
		width: 0,
		height: 0,
	});

	const handleEditorChange = (content, editor) => {
		setFormArticle({
			...formArticle,
			content: content,
		});
	};

	const handleCreate = (e) => {
		e.preventDefault();
		setIsLoading(true);
		const data = new FormData();
		data.append("thumbnail", formArticle.thumbnail);
		data.append("judul", formArticle.judul);
		data.append("content", formArticle.content);
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
		data.append("content", formArticle.content);
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

	useEffect(() => {
		if (id !== undefined) {
			getArticle(id)
				.then((res) => {
					setFormArticle({
						...formArticle,
						thumbnailPreview: res.data.data.thumbnail,
						judul: res.data.data.judul,
						content: res.data.data.content,
						tags: res.data.data.tags.map((item) => {
							return {
								value: item,
								label: capitalizeEachFirstLetter(item),
								color: "#00B8D9",
							};
						}),
					});
				})
				.catch(() => {
					Swal.fire("Gagal!", "Artikel gagal dimuat", "error").then(() => {
						history.push("/artikel");
					});
				});
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
										<div className="form-group mb-3">
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
										<div className="form-group mb-3">
											<Editor
												initialValue=""
												value={formArticle.content}
												onEditorChange={handleEditorChange}
												init={{
													height: 500,
													menubar: false,
													plugins: [
														"advlist autolink lists link image code charmap print preview anchor",
														"searchreplace visualblocks code fullscreen",
														"insertdatetime media table paste code help wordcount",
													],
													toolbar:
														"undo redo | formatselect | code |link | image | bold italic backcolor |  alignleft aligncenter alignright alignjustify | \n" +
														"bullist numlist outdent indent | removeformat | help ",
													content_style: "body { color: #828282 }",
												}}
											/>
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
										<Link to="/artikel">
											<button type="button" className="btn btn-warning">
												Kembali
											</button>
										</Link>
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

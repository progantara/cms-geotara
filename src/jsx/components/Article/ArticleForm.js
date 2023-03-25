import React, { useEffect, useState } from "react";

import { Link, useHistory, useParams } from "react-router-dom";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
import { checkImageResolution } from "../../../utils/checkImageWidth";
import {
	createArticle,
	getArticle,
	updateArticle,
} from "../../../services/ArticleService";
import Swal from "sweetalert2";
import { capitalizeEachFirstLetter } from "../../../utils/stringFormatter";

const colourOptions = [
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

	const [bannerPreview, setBannerPreview] = useState("");
	const [banner, setBanner] = useState("");
	const [bannerResolution, setBannerResolution] = useState({
		width: 0,
		height: 0,
	});
	const [judul, setJudul] = useState("");
	const [tag, setTag] = useState([]);
	const [content, setContent] = useState("");

	const handleEditorChange = (content, editor) => {
		setContent(content);
	};

	const handleCreate = (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append("banner_image", banner);
		data.append("judul", judul);
		data.append("content", content);
		tag
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`tags[${index}]`, item);
			});
		createArticle(data)
			.then((res) => {
				Swal.fire("Berhasil!", "Artikel berhasil ditambahkan", "success");
				history.push("/artikel");
			})
			.catch((err) => {
				Swal.fire("Gagal!", "Artikel gagal ditambahkan", "error");
			});
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append("_method", "put");
		if(banner !== "") data.append("banner_image", banner);
		data.append("judul", judul);
		data.append("content", content);
		tag
			.map((item) => item.value)
			.forEach((item, index) => {
				data.append(`tags[${index}]`, item);
			});
		updateArticle(id, data)
			.then((res) => {
				Swal.fire("Berhasil!", "Artikel berhasil diperbarui", "success");
				history.push("/artikel");
			})
			.catch((err) => {
				Swal.fire("Gagal!", "Artikel gagal diperbarui", "error");
			});
	};

	useEffect(() => {
		if (id !== undefined) {
			getArticle(id)
				.then((res) => {
					setBannerPreview(res.data.data.banner_image);
					setJudul(res.data.data.judul);
					setContent(res.data.data.content);
					setTag(
						res.data.data.tags.map((item) => {
							return {
								value: item,
								label: capitalizeEachFirstLetter(item),
								color: "#00B8D9",
							};
						})
					);
				})
				.catch((err) => {
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
							<form onSubmit={id !== undefined ? handleUpdate : handleCreate}>
								<div className="basic-form form_file_input">
									<div className="form-group mb-3">
										<label>Banner</label>
										<div className="input-group">
											<div className="form-file">
												<input
													type="file"
													className="custom-file-input form-control"
													accept="image/*"
													onChange={(event) => {
														checkImageResolution(event.target.files[0])
															.then((res) => {
																setBanner(event.target.files[0]);
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
										{bannerPreview != "" && (
											<img
												src={'http://127.0.0.1:8000/storage/artikel/' + bannerPreview}
												alt="banner"
												className="img-fluid border border-2 border-dark rounded-3"
												style={{
													width: "40%",
													height: "auto",
												}}
											/>
										)}
										{banner != "" && (
											<img
												src={URL.createObjectURL(banner)}
												alt="banner"
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
											value={judul}
											onChange={(e) => setJudul(e.target.value)}
										/>
									</div>
									<div className="form-group mb-3">
										<Editor
											initialValue=""
											value={content}
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
											components={{ ClearIndicator }}
											styles={{ clearIndicator: ClearIndicatorStyles }}
											value={tag}
											onChange={(e) => {
												setTag(e);
											}}
											isMulti
											options={colourOptions}
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
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticleForm;

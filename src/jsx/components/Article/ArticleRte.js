import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const ArticleRte = () => {
	const [content, setContent] = useState("");

	const handleEditorChange = (content, editor) => {
		console.log("Content was updated:", content);
		setContent(content);
	};

	return (
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
	);
};

export default ArticleRte;
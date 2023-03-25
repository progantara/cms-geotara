const checkImageResolution = async (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (event) => {
			const image = new Image();
			image.src = event.target.result;
			image.onload = () => {
				resolve({
					width: image.width,
					height: image.height,
				});
				return {
					width: image.width,
					height: image.height,
				};
			};
			reader.onerror = (err) => reject(err);
		};
	});
};
export { checkImageResolution };
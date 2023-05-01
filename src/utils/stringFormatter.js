const capitalizeEachFirstLetter = (string) => {
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const currencyFormatter = (stringNumber, locale) => {
	const formatter = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	});

	return formatter.format(stringNumber);
};

const generateUUID = (len) => {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < len; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

export { capitalizeEachFirstLetter, currencyFormatter, generateUUID };

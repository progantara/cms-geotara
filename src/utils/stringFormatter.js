const capitalizeEachFirstLetter = (str) => {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const currencyFormatter = (stringNumber, locale) => {
	const formatter = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: "IDR",
	});

  return formatter.format(stringNumber);
};

const parseCurrency = (stringNumber, locale) => {
	const thousandSeparator = Intl.NumberFormat(locale)
		.format(11111)
		.replace(/\p{Number}/gu, "");
	const decimalSeparator = Intl.NumberFormat(locale)
		.format(1.1)
		.replace(/\p{Number}/gu, "");

	return parseFloat(
		stringNumber
			.replace(new RegExp("\\" + thousandSeparator, "g"), "")
			.replace(new RegExp("\\" + decimalSeparator), ".")
	);
};

export { capitalizeEachFirstLetter, currencyFormatter, parseCurrency };

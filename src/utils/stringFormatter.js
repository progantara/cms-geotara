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
		maximumFractionDigits: 0,
	});

  return formatter.format(stringNumber);
};

export { capitalizeEachFirstLetter, currencyFormatter };

export const convertDateToUTC = (timestamp: number) => {
	const date = new Date(timestamp * 1000);
	const dateUTC = new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
	);

	dateUTC.setUTCHours(0);
	dateUTC.setUTCMinutes(0);
	dateUTC.setUTCSeconds(0);
	dateUTC.setUTCMilliseconds(0);

	return dateUTC.getTime() / 1000;
};

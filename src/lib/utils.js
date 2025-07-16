export function formatDateTime(isoString, includeTime = false) {
	if (!isoString) return "";

	// Ensure compatibility by trimming microseconds if necessary
	const trimmed = isoString.split(".")[0];

	const date = new Date(trimmed);

	if (isNaN(date)) return "";

	const pad = (num) => String(num).padStart(2, "0");

	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1); // Months are 0-indexed
	const year = date.getFullYear();

	const formattedDate = `${day}.${month}.${year}.`;

	if (!includeTime) return formattedDate;

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${formattedDate} ${hours}:${minutes}:${seconds}`;
}

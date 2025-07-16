// TODO: Use TypeScript

import { API_GATEWAY_URL } from "../config.js";

const ASSETS_SERVICE_API = `${API_GATEWAY_URL}/assets/api`;

export async function getBuildings(page, size) {
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/buildings?page=${page}&size=${size}`);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

export async function getBuildingFloor(buildingId, floorId) {
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/buildings/${buildingId}/floors/${floorId}`);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

export async function getBuildingFloorPresence(buildingId, floorId) {
	const res = await fetch(
		`${ASSETS_SERVICE_API}/v1/buildings/${buildingId}/floors/${floorId}/users`
	);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

export async function getBuildingFloorUserPresence(buildingId, floorId, userId) {
	const res = await fetch(
		`${ASSETS_SERVICE_API}/v1/buildings/${buildingId}/floors/${floorId}/users/${userId}`
	);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

export async function getUsers(page, size) {
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/users?page=${page}&size=${size}`);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

export async function getDevices(page, size) {
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/devices?page=${page}&size=${size}`);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

// TODO: Telemetry service
export async function getLatestRoomEvidences(buildingId, floorId, limit = 10) {
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/buildings/${buildingId}/floors/${floorId}/telemetries?limit=${limit}`);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

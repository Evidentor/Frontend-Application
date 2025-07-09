// TODO: Use TypeScript

const ASSETS_SERVICE_API = "http://localhost:8080/assets/api";

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
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/buildings/${buildingId}/floors/${floorId}/users`);

	if (!res.ok) throw new Error("Error fetching the data");

	return await res.json();
}

export async function getBuildingFloorUserPresence(buildingId, floorId, userId) {
	const res = await fetch(`${ASSETS_SERVICE_API}/v1/buildings/${buildingId}/floors/${floorId}/users/${userId}`);

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

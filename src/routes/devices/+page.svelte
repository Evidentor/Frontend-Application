<script>
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getDevices, deleteDevice } from "$lib/api.js";
	import { formatDateTime } from "$lib/utils.js";

	let content;
	let meta;
	let size = 5;
	let showConfirm = false;
	let deviceToDelete = null;

	const loadData = async (page, size) => {
		const body = await getDevices(page, size);
		content = body.content;
		meta = body.meta;
	};

	const handleDelete = (device) => {
		deviceToDelete = device;
		showConfirm = true;
	};

	const confirmDelete = async () => {
		console.log("Trying to delete...");
		if (deviceToDelete) {
			await deleteDevice(deviceToDelete.id);
			await loadData(meta.page, size); // reload current page
			showConfirm = false;
			deviceToDelete = null;
		}
	};

	const cancelDelete = () => {
		showConfirm = false;
		deviceToDelete = null;
	};

	onMount(async () => {
		await loadData(0, size);
	});
</script>

<h1 class="page-title">Devices</h1>

<table>
	<thead>
	<tr>
		<th>Device Id</th>
		<th>Room Id</th>
		<th>Serial Number</th>
		<th>Installation Date</th>
		<th>Last Received Message</th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	{#if content}
		{#each content as device}
			<tr>
				<td>{device.id}</td>
				<td>{device.roomId ?? "Not Defined"}</td>
				<td>{device.serialNumber == "" ? "Not Defined" : device.serialNumber}</td>
				<td>{formatDateTime(device.installationDate, false)}</td>
				<td>{device.lastMessageTimestamp ? formatDateTime(device.lastMessageTimestamp, true) : "Never"}</td>
				<td class="actions">
					<button class="edit" on:click={() => goto(`/devices/${device.id}`)}>Edit</button>
					<button class="delete" on:click={() => handleDelete(device)}>Delete</button>
				</td>
			</tr>
		{/each}
	{:else}
		<tr>
			<td colspan="5" class="empty-message">No devices found.</td>
		</tr>
	{/if}
	</tbody>
</table>

{#if meta}
	<div class="pagination">
		{#if meta.hasPrevious}
			<button on:click={() => loadData(meta.page - 1, size)}>Previous</button>
		{/if}

		<span>Page {meta.page + 1} of {meta.totalPages}</span>

		{#if meta.hasNext}
			<button on:click={() => loadData(meta.page + 1, size)}>Next</button>
		{/if}
	</div>
{/if}

{#if showConfirm}
	<div class="modal-backdrop">
		<div class="modal">
			<p>Are you sure you want to delete device <b>{deviceToDelete.serialNumber}</b>?</p>
			<div class="modal-buttons">
				<button class="confirm" on:click={confirmDelete}>Yes</button>
				<button class="cancel" on:click={cancelDelete}>Cancel</button>
			</div>
		</div>
	</div>
{/if}

<style>
    new-device {
        margin-bottom: 1rem;
        padding: 8px 16px;
        font-size: 1rem;
        background-color: #44c767;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }

    .new-device:hover {
        background-color: #36a85e;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .modal {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        width: 300px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .modal-buttons {
        margin-top: 1rem;
        display: flex;
        justify-content: space-around;
    }

    .modal-buttons .confirm {
        background-color: #d9534f;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
    }

    .modal-buttons .cancel {
        background-color: #ccc;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
    }

    .page-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #333;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        overflow: hidden;
    }

    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e5e5e5;
    }

    th {
        background-color: #f9f9f9;
        color: #555;
        font-weight: 600;
        font-size: 0.95rem;
    }

    td img {
        height: 48px;
        object-fit: contain;
        border-radius: 4px;
    }

    .actions button {
        margin-right: 8px;
        padding: 6px 12px;
        font-size: 0.85rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .actions button.view {
        background-color: #eef;
        color: #225;
    }

    .actions button.edit {
        background-color: #fa2;
        color: #225;
    }

    .actions button.delete {
        background-color: #fee;
        color: #a00;
    }

    .pagination {
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pagination span {
        font-size: 0.95rem;
        color: #555;
    }

    .pagination button {
        padding: 6px 12px;
        background-color: #eee;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .pagination button:hover {
        background-color: #ddd;
    }

    .empty-message {
        text-align: center;
        padding: 1rem;
        color: #999;
    }
</style>

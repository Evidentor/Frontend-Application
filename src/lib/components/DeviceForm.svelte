<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getDeviceById, saveDevice, updateDevice, getRooms } from '$lib/api.js';

	let id;
	let isEdit = false;

	let serialNumber = '';
	let roomId = null;
	let installationDate = '';
	let rooms = [];

	// Load from page URL
	$: id = $page.params.deviceId;
	$: isEdit = !!id;

	onMount(async () => {
		const rooms_body = await getRooms();
		rooms = rooms_body.content;

		if (isEdit) {
			const device = await getDeviceById(id);
			serialNumber = device.serialNumber;
			roomId = device.roomId;
			installationDate = device.installationDate?.split('T')[0]; // yyyy-mm-dd
		}
	});

	const handleSubmit = async () => {
		const payload = {
			serialNumber,
			roomId: roomId || null,
			installationDate: installationDate || null,
		};

		try {
			if (isEdit) {
				await updateDevice(id, payload);
			} else {
				await saveDevice(payload);
			}
			goto('/devices');
		} catch (e) {
			alert('Failed to save device.');
			console.error(e);
		}
	};
</script>

<h1 class="page-title">{isEdit ? 'Edit Device' : 'Create New Device'}</h1>

<form on:submit|preventDefault={handleSubmit}>
	<div>
		<label>Serial Number *</label>
		<input type="text" bind:value={serialNumber} required />
	</div>

	<div>
		<label>Room</label>
		<select bind:value={roomId}>
			<option value="">Not Assigned</option>
			{#each rooms as room}
				<option value={room.id}>{room.name}</option>
			{/each}
		</select>
	</div>

	<div>
		<label>Installation Date</label>
		<input type="date" bind:value={installationDate} />
	</div>

	<button type="submit">{isEdit ? 'Update' : 'Create'}</button>
</form>

<style>
    .page-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #333;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 400px;
    }
    input, select {
        padding: 0.5rem;
        font-size: 1rem;
    }
    button {
        padding: 0.6rem 1.2rem;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>

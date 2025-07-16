<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { getBuildings } from "$lib/api.js";

	let content;
	let meta;
	let size = 5;

	const loadData = async (page, size) => {
		const body = await getBuildings(page, size);
		content = body.content;
		meta = body.meta;
	}

	const viewBuilding = (buildingId) => {
		goto(`/buildings/${buildingId}/view`);
	}

	const viewBuildingPresence = (buildingId) => {
		goto(`/buildings/${buildingId}/view/current-presence`);
	}

	onMount(async () => {
		await loadData(0, size)
	});
</script>

<h1 class="page-title">Buildings</h1>

<table>
	<thead>
	<tr>
		<th>Building Id</th>
		<th>Building Name</th>
		<th>Image</th>
		<th>Floors</th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	{#if content}
		{#each content as building}
			<tr>
				<td>{building.id}</td>
				<td>{building.name}</td>
				<td>
					{#if building.image}
						<img src="{building.image}" alt="Building" />
					{/if}
				</td>
				<td>{building.numberOfFloors}</td>
				<td class="actions">
					<button class="view" on:click={() => viewBuilding(building.id)}>View</button>
					<button class="view" on:click={() => viewBuildingPresence(building.id)}>Current Presence</button>
					<button class="edit">Edit</button>
					<button class="delete">Delete</button>
				</td>
			</tr>
		{/each}
	{:else}
		<tr>
			<td colspan="5" class="empty-message">No buildings found.</td>
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

<style>
    .page-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #333;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

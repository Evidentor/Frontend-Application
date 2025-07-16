<script>
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { getBuildingFloorPresence, getLatestRoomEvidences, getUsers } from "$lib/api.js";
	import { formatDateTime } from "$lib/utils.js";

	$: buildingId = $page.params.buildingId;

	let currentFloor = 1;
	let data;
	let meta;
	let cellGrid;

	let evidences = [];
	let users = [];
	let selectedUser = "All";

	const loadData = async (buildingId, floorId) => {
		const body = await getBuildingFloorPresence(buildingId, floorId);
		data = body.content;
		meta = body.meta;

		const floor = data.floor;
		// currentFloor = floor;
		const rooms = floor.rooms;

		// Calculate a number of rows and cols
		let rows = 0;
		let cols = 0;
		rooms.forEach(({ roomVisualization: rv }) => {
			rows = Math.max(rows, rv.startRow + rv.rowSpan);
			cols = Math.max(cols, rv.startCol + rv.colSpan);
		});

		// Init table grid
		cellGrid = Array.from(
			{ length: rows },
			() => Array.from(
				{ length: cols },
				() => (
					{ type: "hall", render: true, rowSpan: 1, colSpan: 1, room: null }	// Initially, all cells are hall
				)
			)
		);

		// Place rooms and mark merged cells
		for (const room of rooms) {
			const { startRow, startCol, rowSpan, colSpan } = room.roomVisualization;
			cellGrid[startRow][startCol] = {
				type: "room",	// CSS class
				render: true, // Will render that cell (html td tag)
				rowSpan,
				colSpan,
				room
			};

			for (let r = startRow; r < startRow + rowSpan; r++) {
				for (let c = startCol; c < startCol + colSpan; c++) {
					if (r === startRow && c === startCol) continue;
					cellGrid[r][c].render = false;	// Won't render since this cell (html td tag) will eventually be merged
				}
			}
		}
	};

	onMount(async () => {
		await loadData(buildingId, currentFloor);
		const evidences_body = await getLatestRoomEvidences(buildingId, currentFloor, 10);
		evidences = evidences_body.content;
		const users_body = await getUsers(0, 10);	// TODO: Paging
		users = users_body.content;
	});

	const handleUserChange = (event) => {
		const userId = event.target.value;
		if (userId !== "all") {
			goto(`/buildings/${buildingId}/users/${userId}/view-presence`);
		}
	};
</script>

<div class="container">
	{#if data}
		<h1 class="page-title"><b>{data.name} - {data.floor.index + 1}. kat</b></h1>
		<div class="content-wrapper">
			<!-- Left: Map -->
			<div class="map-area">
				<table>
					<tbody>
					{#each cellGrid as row, rowIndex (`row-${rowIndex}`)}
						<tr>
							{#each row as cell, cellIndex (`cell-${cellIndex}`)}
								{#if cell.render}
									<td
										class={cell.type}
										rowspan={cell.rowSpan}
										colspan={cell.colSpan}
									>
										{cell.room?.name}
										{#if (cell.room)}
											({cell.room?.currentPresence})
										{/if}
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
					</tbody>
				</table>

				{#if meta}
					<div class="pagination">
						{#if meta.hasPreviousFloor}
							<button on:click={() => loadData(buildingId, meta.previousFloorId)}>Previous Floor</button>
						{/if}

						<span>Floor {meta.currentFloor + 1} of {meta.totalNumberOfFloors}</span>

						{#if meta.hasNextFloor}
							<button on:click={() => loadData(buildingId, meta.nextFloorId)}>Next Floor</button>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Right: Sidebar -->
			<div class="sidebar">
				<div class="user-select">
					<label for="userDropdown">Filter by user:</label>
					<select id="userDropdown" on:change={handleUserChange}>
						<option value="all">All</option>
						{#each users as user}
							<option value={user.id}>{user.firstName} {user.lastName}</option>
						{/each}
					</select>
				</div>

				<h2>Latest Room Evidences</h2>
				<ul class="evidence-list">
					{#each evidences as e}
						<li>
							<b>{e.roomName}</b> – {e.userName} – <i>{formatDateTime(e.scanTime, true)}</i>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{:else}
		<p>Loading mock data...</p>
	{/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100vw;
        height: 100vh;
        padding: 1rem;
        box-sizing: border-box;
    }

    .content-wrapper {
        display: flex;
        width: 100%;
        max-width: 1200px;
        gap: 2rem;
    }

    .map-area {
        flex: 3;
    }

    .sidebar {
        flex: 1;
        background: #f8f9fa;
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 8px;
        max-height: 600px;
        overflow-y: auto;
    }

    .sidebar h2 {
        font-size: 1.2rem;
        margin-bottom: 0.75rem;
    }

    .evidence-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem 0;
    }

    .evidence-list li {
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }

    .user-select label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: bold;
    }

    .user-select select {
        width: 100%;
        padding: 0.4rem;
        border-radius: 4px;
        border: 1px solid #aaa;
    }

    /* Keep existing styles below */
    .page-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #333;
    }

    table {
        border-collapse: collapse;
        border: 2px solid black;
    }

    td {
        width: 50px;
        height: 50px;
        border: 1px solid #999;
        text-align: center;
        vertical-align: middle;
        position: relative;
    }

    .room {
        background-color: #cce5ff;
    }

    .hall {
        background-color: #e2e3e5;
        border: none;
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
        margin-left: 0.5rem;
        margin-right: 0.5rem;
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
</style>
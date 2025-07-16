<script>
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { getBuildingFloorUserPresence } from "$lib/api.js";

	$: buildingId = $page.params.buildingId;
	$: userId = $page.params.userId;

	let data;
	let meta;
	let cellGrid;
	let rooms = [];

	const maxPresenceIndex = 9;
	const baseHue = 220;
	const saturation = 100;

	const getShade = (index) => {
		const minLightness = 30;
		const maxLightness = 90;

		if (index > maxPresenceIndex || index === 0) {
			return "#cce5ff";
		}

		const clampedIndex = Math.min(index, maxPresenceIndex);
		const lightness = minLightness + ((maxLightness - minLightness) * (clampedIndex / maxPresenceIndex));
		return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
	};

	const loadData = async (buildingId, floorId, userId) => {
		const body = await getBuildingFloorUserPresence(buildingId, floorId, userId);
		data = body.content;
		meta = body.meta;

		const floor = data.floor;
		rooms = floor.rooms;
		rooms.sort((r1, r2) => r1.presenceIndex - r2.presenceIndex);

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
		loadData(buildingId, 1, userId);
	})
</script>

<div class="container">
	{#if data}
		<h1 class="page-title"><b>{data.name} - {data.floor.index + 1}. kat</b></h1>
		<div class="content-wrapper">
			<!-- Left: Map -->
			<div class="map-area">
				<table>
					<tbody>
					{#each cellGrid as row, rowIndex (`row-{${rowIndex}}`)}
						<tr>
							{#each row as cell, cellIndex (`cell-${cellIndex}`)}
								{#if cell.render}
									<td
										class={cell.type}
										rowspan={cell.rowSpan}
										colspan={cell.colSpan}
										style="background-color: {getShade(cell.room?.presenceIndex)}"
									>
										{cell.room?.name}
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
							<button on:click={() => loadData(1, meta.previousFloorId, userId)}>Previous Floor</button>
						{/if}

						<span>Floor {meta.currentFloor + 1} of {meta.totalNumberOfFloors}</span>

						{#if meta.hasNextFloor}
							<button on:click={() => loadData(1, meta.nextFloorId, userId)}>Next Floor</button>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Right: Sidebar -->
			<div class="sidebar">
				<h2>Latest Room Evidences</h2>
				<ul class="evidence-list">
					{#each rooms as room}
						{#if room.presenceIndex > 0}
							<li>
								<b>{room.presenceIndex}.</b> {room.name}
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	{:else}
		<p>Loading mock data...</p>
	{/if}
</div>

<style>
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

    .content-wrapper {
        display: flex;
        width: 100%;
        max-width: 1200px;
        gap: 2rem;
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
<script>
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { getBuildingFloor } from "$lib/api.js";

	$: buildingId = $page.params.id;

	let data;
	let meta;
	let cellGrid;

	const loadData = async (buildingId, floorId) => {
		debugger;
		const body = await getBuildingFloor(buildingId, floorId);
		data = body.content;
		meta = body.meta;

		const floor = data.floor;
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
		loadData(buildingId, 1);
	})
</script>

<div class="container">
	{#if data}
		<h1 class="page-title"><b>{data.name} - {data.floor.index + 1}. kat</b></h1>
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
							>
								{cell.room?.name}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
			</tbody>
		</table>
	{:else}
		<p>Loading mock data...</p>
	{/if}

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
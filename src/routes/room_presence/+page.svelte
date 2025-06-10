<script>
	import { onMount } from "svelte";

	let data;
	let cellGrid;

	onMount(async () => {
		const module = await import("/src/db/room_presence.js")
		data = module.data;

		const floor = data.floors[0];
		const rooms = floor.rooms;

		// Calculate a number of rows and cols
		let rows = 0;
		let cols = 0;
		rooms.forEach(({ roomVisualization: rv }) => {
			rows = Math.max(rows, rv.startRow + rv.rowspan);
			cols = Math.max(cols, rv.startCol + rv.colspan);
		});

		// Init table grid
		cellGrid = Array.from(
			{ length: rows },
			() => Array.from(
				{ length: cols },
				() => (
					{ type: "hall", render: true, rowspan: 1, colspan: 1, room: null }	// Initially, all cells are hall
				)
			)
		);

		// Place rooms and mark merged cells
		for (const room of rooms) {
			const { startRow, startCol, rowspan, colspan } = room.roomVisualization;
			cellGrid[startRow][startCol] = {
				type: "room",	// CSS class
				render: true, // Will render that cell (html td tag)
				rowspan,
				colspan,
				room
			};

			for (let r = startRow; r < startRow + rowspan; r++) {
				for (let c = startCol; c < startCol + colspan; c++) {
					if (r === startRow && c === startCol) continue;
					cellGrid[r][c].render = false;	// Won't render since this cell (html td tag) will eventually be merged
				}
			}
		}
	})
</script>

<div class="container">
	{#if data}
		<h1><b>{data.name}</b></h1>
		<table>
			<tbody>
			{#each cellGrid as row, rowIndex (`row-{${rowIndex}}`)}
				<tr>
					{#each row as cell, cellIndex (`cell-${cellIndex}`)}
						{#if cell.render}
							<td
								class={cell.type}
								rowspan={cell.rowspan}
								colspan={cell.colspan}
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
	{:else}
		<p>Loading mock data...</p>
	{/if}
</div>

<style>
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
</style>

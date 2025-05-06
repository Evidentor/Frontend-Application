<script>
	// TODO: Temp, this will be loaded from the backend
	const building = {
		"id": 1,
		"name": "Temp Building",
		"floors": [
			{
				"id": 1,
				"index": 0,
				"rooms": [
					{
						"id": 1,
						"name": "WC",
						"roomVisualization": {
							"startRow": 0,
							"startCol": 0,
							"rowspan": 1,
							"colspan": 1
						}
					},
					{
						"id": 2,
						"name": "D-020",
						"roomVisualization": {
							"startRow": 0,
							"startCol": 2,
							"rowspan": 2,
							"colspan": 2
						}
					},
					{
						"id": 3,
						"name": "Laboratory",
						"roomVisualization": {
							"startRow": 3,
							"startCol": 0,
							"rowspan": 1,
							"colspan": 3
						}
					}
				]
			}
		]
	};

	const floor = building.floors[0];
	const rooms = floor.rooms;

	// Calculate a number of rows and cols
	let rows = 0;
	let cols = 0;
	rooms.forEach(({ roomVisualization: rv }) => {
		rows = Math.max(rows, rv.startRow + rv.rowspan);
		cols = Math.max(cols, rv.startCol + rv.colspan);
	});

	// Init table grid
	let cellGrid = Array.from(
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
</script>

<h2>{building.name}</h2>
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
					</td>
				{/if}
			{/each}
		</tr>
	{/each}
	</tbody>
</table>

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

    .room {
        background-color: #cce5ff;
    }

    .hall {
        background-color: #e2e3e5;
        border: none;
    }
</style>

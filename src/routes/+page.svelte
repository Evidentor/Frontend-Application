<script>
	// TODO: Temp, this will be loaded from the backend
	// const building = {
	// 	"id": 1,
	// 	"name": "Temp Building",
	// 	"floors": [
	// 		{
	// 			"id": 1,
	// 			"index": 0,
	// 			"rooms": [
	// 				{
	// 					"id": 1,
	// 					"name": "WC",
	// 					"roomVisualization": {
	// 						"startRow": 0,
	// 						"startCol": 0,
	// 						"rowspan": 1,
	// 						"colspan": 1
	// 					}
	// 				},
	// 				{
	// 					"id": 2,
	// 					"name": "D-020",
	// 					"roomVisualization": {
	// 						"startRow": 0,
	// 						"startCol": 2,
	// 						"rowspan": 2,
	// 						"colspan": 2
	// 					}
	// 				},
	// 				{
	// 					"id": 3,
	// 					"name": "Laboratory",
	// 					"roomVisualization": {
	// 						"startRow": 3,
	// 						"startCol": 0,
	// 						"rowspan": 1,
	// 						"colspan": 3
	// 					}
	// 				}
	// 			]
	// 		}
	// 	]
	// };
	const ferBuilding = {
		"id": 1,
		"name": "FER - D zgrada",
		"floors": [
			{
				"id": 1,
				"index": 0,
				"rooms": [
					{
						"id": 1, "name": "Bijela vijećnica", "roomVisualization": { "startRow": 0, "startCol": 0, "rowspan": 2, "colspan": 2 }
					},
					{
						"id": 2, "name": "Siva vijećnica", "roomVisualization": { "startRow": 0, "startCol": 2, "rowspan": 2, "colspan": 2 }
					},
					{
						"id": 3, "name": "WC", "roomVisualization": { "startRow": 0, "startCol": 4, "rowspan": 2, "colspan": 1 }
					},
					{
						"id": 4, "name": "Stepenice", "roomVisualization": { "startRow": 0, "startCol": 5, "rowspan": 2, "colspan": 1 }
					},
					{
						"id": 5, "name": "D1", "roomVisualization": { "startRow": 2, "startCol": 7, "rowspan": 4, "colspan": 5 }
					},
					{
						"id": 6, "name": "D-28", "roomVisualization": { "startRow": 3, "startCol": 0, "rowspan": 1, "colspan": 3 }
					},
					{
						"id": 7, "name": "SS Pult", "roomVisualization": { "startRow": 3, "startCol": 3, "rowspan": 6, "colspan": 2 }
					},
					{
						"id": 8, "name": "D2", "roomVisualization": { "startRow": 6, "startCol": 7, "rowspan": 4, "colspan": 5 }
					},
					{
						"id": 9, "name": "D-020", "roomVisualization": { "startRow": 9, "startCol": 0, "rowspan": 2, "colspan": 2 }
					},
					{
						"id": 10, "name": "D-021", "roomVisualization": { "startRow": 9, "startCol": 2, "rowspan": 1, "colspan": 1 }
					},
					{
						"id": 11, "name": "D-022", "roomVisualization": { "startRow": 9, "startCol": 3, "rowspan": 1, "colspan": 1 }
					},
					{
						"id": 12, "name": "D-023", "roomVisualization": { "startRow": 9, "startCol": 4, "rowspan": 1, "colspan": 1 }
					},
					{
						"id": 13, "name": "Galerija", "roomVisualization": { "startRow": 10, "startCol": 8, "rowspan": 2, "colspan": 4 }
					},
					{
						"id": 14, "name": "ZEA Laboratorij", "roomVisualization": { "startRow": 11, "startCol": 1, "rowspan": 1, "colspan": 3 }
					},
					{
						"id": 15, "name": "WC", "roomVisualization": { "startRow": 11, "startCol": 4, "rowspan": 1, "colspan": 1 }
					},
					{
						"id": 16, "name": "Stepenice", "roomVisualization": { "startRow": 11, "startCol": 5, "rowspan": 1, "colspan": 1 }
					},
					{
						"id": 17, "name": "D-013", "roomVisualization": { "startRow": 11, "startCol": 7, "rowspan": 1, "colspan": 1 }
					},
				]
			}
		]
	};

	const floor = ferBuilding.floors[0];
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

<div class="container">
	<h1><b>{ferBuilding.name}</b></h1>
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

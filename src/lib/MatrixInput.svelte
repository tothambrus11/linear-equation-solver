<script lang='ts'>
	import { onMount } from 'svelte';

	let {
		columnCount = $bindable(1),
		rowCount = $bindable(1),
		rowsFixed = false,
		columnsFixed = false,
		matrix = $bindable([]),
		onmatrixChanged = (m: number[][]) => {}
	} = $props();

	function setSize() {
		let tempMatrix = [];
		for (let i = 0; i < rowCount; i++) {
			let row = [];
			for (let j = 0; j < columnCount; j++) {
				row.push(0);
			}
			tempMatrix.push(row);
		}
		matrix = tempMatrix;
		onmatrixChanged(matrix);
	}

	onMount(() => {
		setSize();
	});

	function onColumnCountChanged(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value === '') return;
		if (Number(target.value) < 1) target.value = '1';
		columnCount = Number(target.value);
		setSize();
	}

	function onRowCountChanged(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value === '') return;
		if (Number(target.value) < 1) target.value = '1';
		rowCount = Number(target.value);
		setSize();
	}

	$effect(() => {
		onmatrixChanged(matrix);
	});

</script>
<div class='cont'>
	<div class='header'>
		{#if !columnsFixed}
			<label for='column-count'>Column count:</label>
			<input id='column-count' type='number' value={columnCount} min='1'
						 oninput={onColumnCountChanged} class='outer-input'>
		{/if}
		{#if !rowsFixed}
			<label for='row-count'>Row count:</label>
			<input id='row-count' type='number' value={rowCount} min='1' oninput={onRowCountChanged}
						 class='outer-input'>
		{/if}
	</div>

	<table class='grid'>
		<tbody>
		{#each matrix as row, i}
			<tr>
				{#each row as cell, j}
					<td>
						<input type='number' bind:value={matrix[i][j]}>
					</td>
				{/each}
			</tr>
		{/each}
		</tbody>
	</table>
</div>

<style lang='scss'>
  @use "./colors" as *;

	.cont{
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

  table {
    border-spacing: 0;
    max-width: 100vw;
  }

  td {
    padding: 0;
    border-collapse: collapse;
    border: 1px solid $input-border;
  }

  .outer-input {
    outline: 1px solid $input-border;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;
    font-family: inherit;
    padding: 10px;
    color: $text-color;
    background-color: $input-bg;
    border: none;

    &:focus {
      outline: 1px solid $input-border-focus;
      background-color: $input-bg-focus;
    }
  }

  .grid {
    background-color: $input-border;
    border-collapse: collapse;
    border-radius: 5px;
		overflow: hidden;
		border: 1px solid $input-border;
		box-sizing: border-box;
	}

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    input {
      width: 50px;
    }
  }
</style>
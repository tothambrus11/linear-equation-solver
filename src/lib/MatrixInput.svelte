<script lang='ts'>
	import { createEventDispatcher, onMount } from 'svelte';

	export let columnCount = 1;
	export let rowCount = 1;
	export let rowsFixed = false;
	export let columnsFixed = false;
	export let matrix = [];

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
	}

	onMount(() => {
		setSize();
	});

	const dispatch = createEventDispatcher();


	function onColumnCountChanged(e: InputEvent) {
		if (e.target.value === '') return;
		if (e.target.value < 1) e.target.value = '1';
		columnCount = e.target.value;
		setSize();
	}

	function onRowCountChanged(e: InputEvent) {
		if (e.target.value === '') return;
		if (e.target.value < 1) e.target.value = '1';
		rowCount = e.target.value;
		setSize();
	}

	$: {
		dispatch("matrixChanged", matrix);
	}

</script>
<div class='cont'>
	<div class='header'>
		{#if !columnsFixed}
			<label for='column-count'>Column count:</label>
			<input id='column-count' type='number' value={columnCount} min='1'
						 on:input={onColumnCountChanged} class='outer-input'>
		{/if}
		{#if !rowsFixed}
			<label for='row-count'>Row count:</label>
			<input id='row-count' type='number' value={rowCount} min='1' on:input={onRowCountChanged}
						 class='outer-input'>
		{/if}
	</div>

	<table class='grid'>
		{#each matrix as row}
			<tr>
				{#each row as cell}
					<td>
						<input type='number' bind:value={cell}>
					</td>
				{/each}
			</tr>
		{/each}
	</table>
</div>

<style lang='scss'>
  @use "./colors";

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
    border: 1px solid colors.$input-border;
  }

  .outer-input {
    outline: 1px solid colors.$input-border;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;
    font-family: inherit;
    padding: 10px;
    color: colors.$text-color;
    background-color: colors.$input-bg;
    border: none;

    &:focus {
      outline: 1px solid colors.$input-border-focus;
      background-color: colors.$input-bg-focus;
    }
  }

  .grid {
    background-color:  colors.$input-border;
    border-collapse: collapse;
    border-radius: 5px;
		overflow: hidden;
		border: 1px solid green;
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
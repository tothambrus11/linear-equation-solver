<script lang='ts'>
	import MatrixInput from '$lib/MatrixInput.svelte';
	import Fraction from 'fraction.js';
	import { solveEquationMatrix } from '$lib/matrix';

	let matrix: number[][] = [];

	function onMatrixChanged(m) {
		matrix = m.detail;
	}


	let matrices = [];

	let res = "";
	function onSolve() {
		// Initial matrix
		let fracMatrix = matrix.map(row => {
			return row.map(cell => new Fraction(cell));
		});

		res = solveEquationMatrix(fracMatrix);
	}

</script>

<h1 style='text-align: center'>Linear Equation Solver</h1>
<svelte:options accessors/>

<div class='page-col' style='display: flex; flex-direction: column; align-items: center; gap: 16px'>
	<MatrixInput rowCount={3} columnCount={4} on:matrixChanged={onMatrixChanged}></MatrixInput>
	<button on:click={onSolve} on:keypress={onSolve}>Solve!</button>

	<div>{@html res}</div>
</div>


<style lang='scss'>
  @use "$lib/colors.scss";

  button {
    padding: 10px 20px;
    background-color: colors.$a6;
    color: colors.$a1;
    border-radius: 5px;
    border: none;
    font-family: inherit;
    font-size: inherit;

    &:hover {
      background-color: colors.$a7;
    }
  }

	.page-col :global(.solution-row){
		padding: 30px;
		background-color: colors.$a1;
		margin-bottom: 20px;
		border-radius: 5px;
	}

</style>
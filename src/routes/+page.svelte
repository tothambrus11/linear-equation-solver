<script lang='ts'>
	import MatrixInput from '$lib/MatrixInput.svelte';
	import Fraction from 'fraction.js';
	import { solveEquationMatrix } from '$lib/matrix';

	let matrix = $state<number[][]>([]);

	function onMatrixChanged(m: number[][]) {
		matrix = m;
	}


	let matrices = $state([]);

	let res = $state("");
	function onSolve() {
		// Initial matrix
		let fracMatrix = matrix.map(row => {
			return row.map(cell => new Fraction(cell));
		});

		res = solveEquationMatrix(fracMatrix);
	}

</script>

<h1 style='text-align: center'>Linear Equation Solver</h1>

<div class='page-col' style='display: flex; flex-direction: column; align-items: center; gap: 16px'>
	<MatrixInput rowCount={3} columnCount={4} onmatrixChanged={onMatrixChanged}></MatrixInput>
	<button onclick={onSolve}>Solve!</button>

	<div>{@html res}</div>
</div>


<style lang='scss'>
  @use "../lib/colors.scss" as *;

  button {
    padding: 10px 20px;
    background-color: $a6;
    color: $a1;
    border-radius: 5px;
    border: none;
    font-family: inherit;
    font-size: inherit;

    &:hover {
      background-color: $a7;
    }
  }

  .page-col :global(.solution-row){
    padding: 30px;
    background-color: $a1;
    margin-bottom: 20px;
    border-radius: 5px;
  }

</style>
<script lang='ts'>
	export let matrices: string[] = [];

	import katex from 'katex';

	$: latexString = matrices.join(" = ");
</script>

<div>
	{@html katex.renderToString(latexString)}
</div>

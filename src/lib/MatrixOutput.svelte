<script lang='ts'>
	let { matrices = [] }: { matrices: string[] } = $props();

	import katex from 'katex';

	let latexString = $derived(matrices.join(" = "));
</script>

<div>
	{@html katex.renderToString(latexString)}
</div>

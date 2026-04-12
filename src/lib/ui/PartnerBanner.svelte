<script lang="ts">
	import { PARTNERS } from '$lib/config';
	import { reveal } from '$lib/actions/reveal';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	const t = $derived(T[lang.current].partners);
</script>

<section
	class="px-4 py-14 sm:px-6 lg:px-8"
	style="background-color: var(--gem-surface); border-top: 1px solid var(--gem-border-subtle);"
>
	<div class="mx-auto max-w-7xl">
		<p use:reveal={0} class="section-label mb-10 text-center">{t.sectionLabel}</p>

		<div use:reveal={100} class="flex flex-wrap items-center justify-center gap-10 md:gap-16">
			{#each PARTNERS as partner}
				<span
					class="font-display text-gem-dim hover:text-copper cursor-default text-xl font-bold tracking-widest uppercase transition-colors duration-200"
				>
					{partner}
				</span>
			{/each}
		</div>
	</div>
</section>

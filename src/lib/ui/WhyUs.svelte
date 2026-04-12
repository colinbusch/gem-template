<script lang="ts">
	import { STATS, USPS, BRAND } from '$lib/config';
	import { reveal } from '$lib/actions/reveal';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	const t = $derived(T[lang.current].whyUs);
</script>

<section
	id="ueber-uns"
	class="px-4 py-28 sm:px-6 lg:px-8"
	style="background-color: var(--gem-surface);"
>
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div use:reveal={0} class="mb-14 text-center">
			<p class="section-label mb-3">{t.sectionLabelPrefix} {BRAND.shortName} {BRAND.trade}</p>
			<h2 class="font-display text-gem-text text-4xl leading-tight font-bold uppercase sm:text-5xl">
				{t.heading}<br /><span class="text-gradient-copper">{t.headingAccent}</span>
			</h2>
		</div>

		<!-- Stats grid (values from config, labels translated) -->
		<div
			use:reveal={80}
			class="mb-16 grid grid-cols-2 md:grid-cols-4"
			style="gap: 1px; background-color: var(--gem-border-subtle);"
		>
			{#each STATS as stat, i}
				<div
					class="flex flex-col items-center justify-center p-8 text-center"
					style="background-color: var(--gem-surface);"
				>
					<span class="font-display text-gradient-copper mb-2 text-4xl font-bold md:text-5xl">
						{stat.stat}
					</span>
					<span class="text-gem-muted text-xs font-medium tracking-wider uppercase">
						{t.statLabels[i]}
					</span>
				</div>
			{/each}
		</div>

		<!-- USP cards (icons + stat from config, label + body translated) -->
		<div class="grid gap-6 md:grid-cols-3">
			{#each USPS as usp, i}
				{@const UspIcon = usp.icon}
				<div use:reveal={i * 100} class="card-gem rounded-xl p-8">
					<!-- Icon -->
					<div
						class="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border"
						style="background-color: color-mix(in srgb, var(--copper) 12%, transparent); border-color: var(--gem-border);"
					>
						<UspIcon size={20} class="text-copper" />
					</div>

					<!-- Stat (same in both languages) -->
					<p class="font-display text-gradient-copper mb-1 text-3xl font-bold">
						{usp.stat}
					</p>

					<!-- Label -->
					<p class="font-display text-gem-text mb-3 text-lg font-bold tracking-wide uppercase">
						{t.usps[i].label}
					</p>

					<!-- Body -->
					<p class="text-gem-muted text-sm leading-relaxed">
						{t.usps[i].body}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

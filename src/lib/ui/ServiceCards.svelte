<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { SERVICES, BRAND } from '$lib/config';
	import { reveal } from '$lib/actions/reveal';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	const t = $derived(T[lang.current].services);
</script>

<section
	id="leistungen"
	class="px-4 py-28 sm:px-6 lg:px-8"
	style="background-color: var(--gem-bg);"
>
	<div class="mx-auto max-w-6xl">
		<!-- Section header -->
		<div use:reveal={0} class="mb-14">
			<p class="section-label mb-3">{t.sectionLabel}</p>
			<div class="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-6">
				<h2
					class="font-display text-gem-text text-4xl leading-tight font-bold uppercase sm:text-5xl"
				>
					{t.heading}<br /><span class="text-gradient-copper">{t.headingAccent}</span>
				</h2>
				<div class="copper-divider hidden flex-1 md:block"></div>
			</div>
			<p class="text-gem-muted mt-4 max-w-xl">
				{t.sublinePre}
				{BRAND.shortName}
				{BRAND.trade}
				{t.sublinePost}
			</p>
		</div>

		<!-- Card grid -->
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each SERVICES as service, i}
				{@const ServiceIcon = service.icon}
				<article use:reveal={i * 75} class="card-gem group cursor-default rounded-xl p-7">
					<!-- Icon (stays from config) -->
					<div
						class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg"
						style="background-color: var(--gem-surface-2);"
					>
						<ServiceIcon size={22} class="text-copper" />
					</div>

					<!-- Title -->
					<h3 class="font-display text-gem-text mb-3 text-2xl font-bold uppercase">
						{t.items[i].title}
					</h3>

					<!-- Description -->
					<p class="text-gem-muted mb-6 text-sm leading-relaxed">
						{t.items[i].description}
					</p>

					<!-- Footer -->
					<div
						class="text-copper flex items-center gap-1.5 text-sm font-medium transition-transform duration-200 group-hover:translate-x-1"
					>
						{t.learnMore}
						<ArrowRight size={15} />
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

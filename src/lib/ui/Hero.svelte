<script lang="ts">
	import { ArrowRight, Phone, Star, CheckCircle2, ChevronDown } from '@lucide/svelte';
	import { BRAND, CONTACT, ADDRESS } from '$lib/config';
	import { reveal } from '$lib/actions/reveal';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	const t = $derived(T[lang.current].hero);
</script>

<section
	id="home"
	class="relative flex min-h-dvh flex-col justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 lg:px-8"
	style="background-color: var(--gem-bg);"
>
	<!-- Radial copper gradient glows -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0"
		style="background:
      radial-gradient(ellipse 60% 50% at 90% 10%, color-mix(in srgb, var(--copper) 14%, transparent) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 5% 85%, color-mix(in srgb, var(--copper) 8%, transparent) 0%, transparent 65%);"
	></div>

	<!-- Copper grid overlay -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-0"
		style="opacity: 0.022; background-image: linear-gradient(var(--copper) 1px, transparent 1px), linear-gradient(90deg, var(--copper) 1px, transparent 1px); background-size: 64px 64px;"
	></div>

	<!-- Left copper accent bar (desktop) -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-0 bottom-0 left-8 hidden w-px lg:block"
		style="background: linear-gradient(to bottom, transparent 0%, var(--copper) 30%, var(--copper) 70%, transparent 100%); opacity: 0.18;"
	></div>

	<!-- Content -->
	<div class="relative z-10 mx-auto w-full max-w-6xl">
		<!-- Pre-badge -->
		<div
			use:reveal={0}
			class="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2"
			style="border-color: color-mix(in srgb, var(--copper) 40%, transparent); background-color: color-mix(in srgb, var(--copper) 6%, transparent);"
		>
			<span class="relative flex h-2 w-2">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
					style="background-color: var(--copper);"
				></span>
				<span
					class="relative inline-flex h-2 w-2 rounded-full"
					style="background-color: var(--copper);"
				></span>
			</span>
			<span class="text-copper text-xs font-semibold tracking-widest uppercase">
				{t.badgeLabel} · {ADDRESS.city} · {t.badgeSince}
				{BRAND.foundingYear}
			</span>
		</div>

		<!-- Headline -->
		<h1
			use:reveal={80}
			class="font-display mb-6 leading-none font-bold uppercase"
			style="font-size: clamp(3.5rem, 9.5vw, 9.5rem);"
		>
			<span class="text-gem-text block">{t.h1prefix} {BRAND.trade}–</span>
			<span class="text-gradient-copper block">{t.h1middle}</span>
			<span class="text-gem-text block">in {ADDRESS.city}.</span>
		</h1>

		<!-- Subline -->
		<p use:reveal={160} class="text-gem-muted mb-10 max-w-lg text-base leading-relaxed sm:text-lg">
			{t.sublinePre}
			<strong class="text-copper-light font-semibold">{t.sublineStrong}</strong>
			{t.sublinePost}
		</p>

		<!-- CTA row -->
		<div use:reveal={240} class="mb-12 flex flex-wrap items-center gap-4">
			<a href="#anfragen" class="btn-copper inline-flex items-center gap-2">
				{t.cta}
				<ArrowRight size={18} />
			</a>
			<a href="tel:{CONTACT.phoneHref}" class="btn-ghost inline-flex items-center gap-2">
				<Phone size={16} />
				{CONTACT.phone}
			</a>
		</div>

		<!-- Trust strip -->
		<div use:reveal={320} class="flex flex-wrap items-center gap-x-3 gap-y-2">
			{#each t.trustItems as item, i}
				{#if i > 0}
					<span class="text-gem-dim hidden sm:inline">·</span>
				{/if}
				<div class="flex items-center gap-1.5">
					{#if i === 0}
						<span class="flex items-center gap-0.5">
							{#each Array(5) as _}
								<Star size={13} class="text-copper" fill="currentColor" />
							{/each}
						</span>
					{:else}
						<CheckCircle2 size={13} class="text-copper" />
					{/if}
					<span class="text-gem-muted text-xs font-medium">{item}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Scroll cue -->
	<a
		href="#leistungen"
		class="text-gem-dim hover:text-copper absolute bottom-8 left-1/2 -translate-x-1/2 transition-colors"
		aria-label={t.scrollAriaLabel}
	>
		<ChevronDown size={28} class="animate-bounce" />
	</a>
</section>

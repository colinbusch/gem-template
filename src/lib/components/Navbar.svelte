<script lang="ts">
	import { Menu, X, Wrench } from '@lucide/svelte';
	import { BRAND, CONTACT } from '$lib/config';
	import LangSwitch from '$lib/components/LangSwitch.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 60;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener('scroll', onScroll);
	});

	function closeMobile() {
		mobileOpen = false;
	}

	const t = $derived(T[lang.current]);
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300 {scrolled ? 'nav-glass' : ''}"
	style="border-bottom: 1px solid {scrolled ? 'var(--gem-border-subtle)' : 'transparent'};"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="group flex items-center gap-3" aria-label="{BRAND.name} Startseite">
				<div
					class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
					style="background: linear-gradient(135deg, var(--gem-copper) 0%, var(--gem-copper-dark) 100%);"
				>
					<Wrench size={15} color="#fff" aria-hidden="true" />
				</div>
				<div class="flex flex-col leading-none">
					<span class="font-display text-sm font-bold tracking-widest text-white uppercase">
						{BRAND.shortName}
					</span>
					<span class="font-display text-copper text-xs font-semibold tracking-widest uppercase">
						{BRAND.trade}
					</span>
				</div>
			</a>

			<!-- Desktop nav -->
			<nav class="hidden items-center gap-6 md:flex" aria-label="Hauptnavigation">
				{#each t.nav as link}
					<a
						href={link.href}
						class="text-gem-muted text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<!-- Desktop CTA -->
			<div class="hidden items-center gap-4 md:flex">
				<ThemeSwitch />
				<LangSwitch />
				<a
					href="tel:{CONTACT.phoneHref}"
					class="text-gem-muted hover:text-copper text-sm font-medium transition-colors duration-200"
					aria-label="{t.callAriaPrefix}: {CONTACT.phone}"
				>
					{CONTACT.phone}
				</a>
				<a href="#anfragen" class="btn-copper text-sm">
					{t.cta}
				</a>
			</div>

			<!-- Mobile hamburger -->
			<button
				class="text-gem-muted flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200 hover:text-white md:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label={mobileOpen ? t.menuClose : t.menuOpen}
				aria-expanded={mobileOpen}
				aria-controls="mobile-menu"
			>
				{#if mobileOpen}
					<X size={20} aria-hidden="true" />
				{:else}
					<Menu size={20} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div
			id="mobile-menu"
			class="nav-glass border-t md:hidden"
			style="border-color: var(--gem-border-subtle);"
		>
			<nav class="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile Navigation">
				{#each t.nav as link}
					<a
						href={link.href}
						class="text-gem-muted rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/5 hover:text-white"
						onclick={closeMobile}
					>
						{link.label}
					</a>
				{/each}
				<div
					class="mt-2 flex flex-col gap-3 border-t pt-3"
					style="border-color: var(--gem-border-subtle);"
				>
					<a
						href="tel:{CONTACT.phoneHref}"
						class="text-gem-muted hover:text-copper px-3 py-2.5 text-sm font-medium transition-colors duration-200"
						aria-label="{t.callAriaPrefix}: {CONTACT.phone}"
						onclick={closeMobile}
					>
						{CONTACT.phone}
					</a>
					<a href="#anfragen" class="btn-copper text-center text-sm" onclick={closeMobile}>
						{t.cta}
					</a>
					<div class="flex items-center gap-3 px-3 py-1">
						<ThemeSwitch />
						<LangSwitch />
						<span class="text-gem-muted font-display text-xs tracking-wide uppercase">
							{lang.current === 'de' ? 'Deutsch' : 'English'}
						</span>
					</div>
				</div>
			</nav>
		</div>
	{/if}
</header>

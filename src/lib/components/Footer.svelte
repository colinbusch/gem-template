<script lang="ts">
	import { Phone, Mail, MapPin, Wrench } from '@lucide/svelte';
	import { BRAND, CONTACT, ADDRESS, HOURS } from '$lib/config';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	const year = new Date().getFullYear();

	const t = $derived(T[lang.current].footer);
	// Service titles follow the services translation so the footer stays in sync
	const serviceItems = $derived(T[lang.current].services.items.map((s) => s.title));
</script>

<footer style="background: var(--gem-surface); border-top: 1px solid var(--gem-border-subtle);">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
		<!-- 3-column grid -->
		<div class="grid grid-cols-1 gap-12 md:grid-cols-3">
			<!-- Col 1: Brand -->
			<div class="flex flex-col gap-6">
				<a href="/" class="flex w-fit items-center gap-3" aria-label="{BRAND.name} Startseite">
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

				<p class="text-gem-muted text-sm leading-relaxed">
					{t.taglineCert}
					{BRAND.trade} in {ADDRESS.city}. {t.taglineSince}
					{BRAND.foundingYear}.
				</p>

				<!-- Contact list -->
				<ul class="flex flex-col gap-3">
					<li>
						<a
							href="tel:{CONTACT.phoneHref}"
							class="text-gem-muted hover:text-copper flex items-center gap-2.5 text-sm transition-colors duration-200"
							aria-label="{t.callAriaLabel}: {CONTACT.phone}"
						>
							<Phone
								size={15}
								class="flex-shrink-0"
								style="color: var(--gem-copper);"
								aria-hidden="true"
							/>
							{CONTACT.phone}
						</a>
					</li>
					<li>
						<a
							href="mailto:{CONTACT.email}"
							class="text-gem-muted hover:text-copper flex items-center gap-2.5 text-sm transition-colors duration-200"
							aria-label="E-Mail: {CONTACT.email}"
						>
							<Mail
								size={15}
								class="flex-shrink-0"
								style="color: var(--gem-copper);"
								aria-hidden="true"
							/>
							{CONTACT.email}
						</a>
					</li>
					<li>
						<span class="text-gem-muted flex items-start gap-2.5 text-sm">
							<MapPin
								size={15}
								class="mt-0.5 flex-shrink-0"
								style="color: var(--gem-copper);"
								aria-hidden="true"
							/>
							{ADDRESS.street}, {ADDRESS.zip}
							{ADDRESS.city}
						</span>
					</li>
				</ul>
			</div>

			<!-- Col 2: Services -->
			<div class="flex flex-col gap-6">
				<h3 class="section-label">{t.servicesHeading}</h3>
				<ul class="flex flex-col gap-2.5">
					{#each serviceItems as service}
						<li>
							<a
								href="#leistungen"
								class="text-gem-muted hover:text-copper text-sm transition-colors duration-200"
							>
								{service}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Col 3: Opening hours -->
			<div class="flex flex-col gap-6">
				<h3 class="section-label">{t.hoursHeading}</h3>
				<ul class="flex flex-col gap-3">
					{#each HOURS as entry, i}
						<li class="flex items-center justify-between gap-4">
							<span class="text-gem-muted text-sm">{t.hoursLabels[i]}</span>
							{#if i === HOURS.length - 1}
								<span class="text-copper text-sm font-semibold">{entry.hours}</span>
							{:else}
								<span class="text-sm text-white">{entry.hours}</span>
							{/if}
						</li>
					{/each}
				</ul>

				<!-- Emergency CTA box -->
				<div
					class="mt-2 flex flex-col gap-3 rounded-xl p-5"
					style="background: var(--gem-surface-2); border: 1px solid var(--gem-border-subtle);"
				>
					<p class="text-gem-muted text-xs font-semibold tracking-widest uppercase">
						{t.emergencyLabel}
					</p>
					<a
						href="tel:{CONTACT.phoneHref}"
						class="text-copper font-display text-xl font-bold tracking-wide transition-opacity duration-200 hover:opacity-80"
						aria-label="{t.callAriaLabel}: {CONTACT.phone}"
					>
						{CONTACT.phone}
					</a>
					<p class="text-gem-muted text-xs">
						{t.availability}
					</p>
					<a href="tel:{CONTACT.phoneHref}" class="btn-copper mt-1 text-center text-sm">
						{t.callNow}
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="copper-divider mt-12"></div>
		<div class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
			<p class="text-gem-muted text-xs">
				© {year}
				{BRAND.name}. {t.copyright}
			</p>
			<nav class="flex items-center gap-6" aria-label="Legal">
				<a
					href="/impressum"
					class="text-gem-muted hover:text-copper text-xs transition-colors duration-200"
				>
					{t.legal}
				</a>
				<a
					href="/datenschutz"
					class="text-gem-muted hover:text-copper text-xs transition-colors duration-200"
				>
					{t.privacy}
				</a>
			</nav>
		</div>
	</div>
</footer>

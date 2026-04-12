<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { BRAND, CONTACT, ADDRESS } from '$lib/config';
</script>

<svelte:head>
	<title>Impressum – {BRAND.name}</title>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<main class="mx-auto max-w-3xl px-5 py-32 sm:px-8 lg:px-12">
	<!-- Back link -->
	<a
		href="/"
		class="mb-10 inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
		style="color: var(--gem-copper)"
	>
		<ArrowLeft size={16} />
		Zurück zur Startseite
	</a>

	<!-- Page header -->
	<p class="mb-2 text-xs font-semibold tracking-widest uppercase" style="color: var(--gem-copper)">
		Rechtliches
	</p>
	<h1
		class="font-display mb-12 text-5xl font-bold tracking-tight uppercase"
		style="color: var(--gem-text)"
	>
		Impressum
	</h1>

	<!-- 1. Angaben gemäß § 5 TMG -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Angaben gemäß § 5 TMG
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p class="font-semibold" style="color: var(--gem-text)">{BRAND.name}</p>
			<!-- TODO: replace with actual owner name -->
			<p>Max Mustermann (Inhaber / Geschäftsführer)</p>
			<p>{ADDRESS.street}</p>
			<p>{ADDRESS.zip} {ADDRESS.city}</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 2. Kontakt -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Kontakt
		</h2>
		<div class="space-y-1 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Telefon:
				<a
					href="tel:{CONTACT.phoneHref}"
					class="transition-opacity hover:opacity-70"
					style="color: var(--gem-copper)">{CONTACT.phone}</a
				>
			</p>
			<p>
				E-Mail:
				<a
					href="mailto:{CONTACT.email}"
					class="transition-opacity hover:opacity-70"
					style="color: var(--gem-copper)">{CONTACT.email}</a
				>
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 3. Registereintrag -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Registereintrag
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<!-- TODO: fill in correct register details -->
			<p>Eintragung im Handelsregister.</p>
			<p>Registergericht: Amtsgericht {ADDRESS.city}</p>
			<p>Registernummer: HRB XXXXX</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 4. Umsatzsteuer-ID -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Umsatzsteuer-ID
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<!-- TODO: fill in correct USt-ID -->
			<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:</p>
			<p>DE XXX XXX XXX</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 5. Berufsbezeichnung -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Berufsbezeichnung und berufsrechtliche Regelungen
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>Berufsbezeichnung: Meisterbetrieb {BRAND.trade}</p>
			<!-- TODO: fill in correct chamber name and location -->
			<p>Zuständige Kammer: Handwerkskammer [Name der zuständigen Handwerkskammer]</p>
			<p>
				Es gelten die berufsrechtlichen Regelungen der Handwerksordnung (HwO). Diese sind einsehbar
				unter:
				<a
					href="https://www.gesetze-im-internet.de/hwo/"
					target="_blank"
					rel="noopener noreferrer"
					class="transition-opacity hover:opacity-70"
					style="color: var(--gem-copper)">www.gesetze-im-internet.de/hwo/</a
				>
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 6. Redaktionell verantwortlich -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Redaktionell verantwortlich
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<!-- TODO: replace with actual responsible person name -->
			<p>Max Mustermann</p>
			<p>{ADDRESS.street}</p>
			<p>{ADDRESS.zip} {ADDRESS.city}</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 7. EU-Streitschlichtung -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			EU-Streitschlichtung
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
				<a
					href="https://ec.europa.eu/consumers/odr/"
					target="_blank"
					rel="noopener noreferrer"
					class="transition-opacity hover:opacity-70"
					style="color: var(--gem-copper)">https://ec.europa.eu/consumers/odr/</a
				>
			</p>
			<p class="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 8. Verbraucherstreitbeilegung -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Verbraucherstreitbeilegung / Universalschlichtungsstelle
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
				Verbraucherschlichtungsstelle teilzunehmen.
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 9. Haftung für Inhalte -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Haftung für Inhalte
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
				den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
				jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
				oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
			</p>
			<p class="mt-2">
				Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
				allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst
				ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
				von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 10. Haftung für Links -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Haftung für Links
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
				Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
				Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
				Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
				mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung
				nicht erkennbar.
			</p>
			<p class="mt-2">
				Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
				Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
				Rechtsverletzungen werden wir derartige Links umgehend entfernen.
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 11. Urheberrecht -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Urheberrecht
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
				deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
				Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
				des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
				privaten, nicht kommerziellen Gebrauch gestattet.
			</p>
			<p class="mt-2">
				Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
				Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
				gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
				bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden
				wir derartige Inhalte umgehend entfernen.
			</p>
		</div>
	</section>
</main>

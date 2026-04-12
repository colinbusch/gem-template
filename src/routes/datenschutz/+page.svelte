<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { BRAND, CONTACT, ADDRESS } from '$lib/config';
</script>

<svelte:head>
	<title>Datenschutzerklärung – {BRAND.name}</title>
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
		Datenschutz&shy;erklärung
	</h1>

	<!-- 1. Verantwortlicher -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Verantwortlicher
		</h2>
		<div
			class="gem-surface space-y-1 rounded-xl p-5 text-sm leading-relaxed"
			style="color: var(--gem-text-muted)"
		>
			<p class="font-semibold" style="color: var(--gem-text)">{BRAND.name}</p>
			<!-- TODO: replace with actual owner name -->
			<p>Max Mustermann (Geschäftsführer)</p>
			<p>{ADDRESS.street}</p>
			<p>{ADDRESS.zip} {ADDRESS.city}</p>
			<p class="pt-1">
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

	<!-- 2. Allgemeines zur Datenverarbeitung -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Allgemeines zur Datenverarbeitung
		</h2>
		<div class="space-y-2 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur
				Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
				erforderlich ist. Die Verarbeitung personenbezogener Daten unserer Nutzer erfolgt nur mit
				Einwilligung des Nutzers oder wenn die Verarbeitung durch gesetzliche Vorschriften erlaubt
				ist.
			</p>
			<p>
				Sofern wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der
				betroffenen Person einholen, dient Art. 6 Abs. 1 lit. a EU-Datenschutzgrundverordnung
				(DSGVO) als Rechtsgrundlage. Bei der Verarbeitung von personenbezogenen Daten, die zur
				Erfüllung eines Vertrages, dessen Vertragspartei die betroffene Person ist, erforderlich
				ist, dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage. Soweit eine Verarbeitung
				personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist,
				dient Art. 6 Abs. 1 lit. c DSGVO als Rechtsgrundlage. Ist die Verarbeitung zur Wahrung eines
				berechtigten Interesses unseres Unternehmens oder eines Dritten erforderlich und überwiegen
				die Interessen, Grundrechte und Grundfreiheiten des Betroffenen das erstgenannte Interesse
				nicht, so dient Art. 6 Abs. 1 lit. f DSGVO als Rechtsgrundlage.
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 3. Server-Logdateien -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Server-Logdateien
		</h2>
		<div class="space-y-2 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Diese Website wird auf Servern der <strong style="color: var(--gem-text)"
					>Hetzner Online GmbH</strong
				>, Industriestr. 25, 91710 Gunzenhausen, Deutschland, gehostet. Die Server befinden sich in
				Deutschland und unterliegen dem deutschen und europäischen Datenschutzrecht.
			</p>
			<p>
				Der Hosting-Anbieter erhebt und speichert automatisch Informationen in sogenannten
				Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind:
			</p>
			<ul class="ml-5 list-disc space-y-1">
				<li>Browsertyp und Browserversion</li>
				<li>Verwendetes Betriebssystem</li>
				<li>Referrer URL (zuvor besuchte Seite)</li>
				<li>Hostname des zugreifenden Rechners (IP-Adresse)</li>
				<li>Uhrzeit der Serveranfrage</li>
				<li>HTTP-Statuscode und übertragene Datenmenge</li>
			</ul>
			<p>
				Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
				Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der
				technisch fehlerfreien Darstellung und der Optimierung dieser Website.
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 4. Kontakt- und Anfrageformular -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Kontakt- und Anfrageformular
		</h2>
		<div class="space-y-2 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Wenn Sie über unser Anfrageformular Kontakt mit uns aufnehmen, werden folgende Daten
				verarbeitet:
			</p>
			<ul class="ml-5 list-disc space-y-1">
				<li>Name</li>
				<li>Telefonnummer</li>
				<li>Art des Problems / Problemtyp</li>
				<li>Optionale Nachricht</li>
			</ul>
			<p>
				Diese Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage und zur Kontaktaufnahme
				verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) sowie Art. 6
				Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Kundenanfragen).
			</p>
			<p>
				Die über das Formular übermittelten Daten werden nicht an Dritte weitergegeben. Eine
				Weitergabe erfolgt nur, wenn dies zur Vertragserfüllung notwendig ist oder wir gesetzlich
				dazu verpflichtet sind. Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks
				ihrer Erhebung nicht mehr erforderlich sind — in der Regel nach Abschluss des jeweiligen
				Auftrags, spätestens nach Ablauf der gesetzlichen Aufbewahrungsfristen (max. 10 Jahre).
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 5. Cookies und Tracking -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Cookies und Tracking
		</h2>
		<div class="space-y-2 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Diese Website verwendet <strong style="color: var(--gem-text)"
					>keine Tracking-Cookies</strong
				>, kein Web-Analytics (z. B. Google Analytics), keine Social-Media-Pixel und keine
				Werbenetzwerke. Es findet keinerlei verhaltensbasiertes Tracking statt.
			</p>
			<p>
				Alle Schriftarten werden <strong style="color: var(--gem-text)">selbst gehostet</strong> – es
				werden keine Anfragen an Google Fonts oder andere externe Font-CDNs gestellt.
			</p>
			<p>
				Es werden ausschließlich technisch notwendige Session-Cookies eingesetzt, die für den
				Betrieb der Website unbedingt erforderlich sind (z. B. CSRF-Schutz). Diese Cookies enthalten
				keine personenbezogenen Daten und werden nach dem Schließen des Browsers automatisch
				gelöscht. Eine Einwilligung ist hierfür gemäß § 25 Abs. 2 TTDSG nicht erforderlich.
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 6. Ihre Rechte -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Ihre Rechte (Art. 15–21 DSGVO)
		</h2>
		<div class="space-y-2 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen
				Daten:
			</p>
			<ul class="ml-5 list-disc space-y-1">
				<li>
					<strong style="color: var(--gem-text)">Auskunft</strong> (Art. 15 DSGVO): Recht auf Auskunft
					über die gespeicherten Daten, deren Herkunft, Empfänger und Verarbeitungszweck.
				</li>
				<li>
					<strong style="color: var(--gem-text)">Berichtigung</strong> (Art. 16 DSGVO): Recht auf unverzügliche
					Berichtigung unrichtiger Daten.
				</li>
				<li>
					<strong style="color: var(--gem-text)">Löschung</strong> (Art. 17 DSGVO): Recht auf Löschung
					Ihrer Daten, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht.
				</li>
				<li>
					<strong style="color: var(--gem-text)">Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO):
					Recht auf Einschränkung der Verarbeitung unter bestimmten Voraussetzungen.
				</li>
				<li>
					<strong style="color: var(--gem-text)">Widerspruch</strong> (Art. 21 DSGVO): Recht auf Widerspruch
					gegen die Verarbeitung aufgrund berechtigter Interessen.
				</li>
				<li>
					<strong style="color: var(--gem-text)">Datenübertragbarkeit</strong> (Art. 20 DSGVO): Recht
					auf Erhalt Ihrer Daten in einem strukturierten, maschinenlesbaren Format.
				</li>
				<li>
					<strong style="color: var(--gem-text)">Widerruf</strong>: Recht auf jederzeitigen Widerruf
					einer erteilten Einwilligung mit Wirkung für die Zukunft.
				</li>
			</ul>
			<p>
				Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
				<a
					href="mailto:{CONTACT.email}"
					class="transition-opacity hover:opacity-70"
					style="color: var(--gem-copper)">{CONTACT.email}</a
				>
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 7. Beschwerderecht -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Beschwerderecht bei der Aufsichtsbehörde
		</h2>
		<div class="space-y-2 text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
				personenbezogenen Daten durch uns zu beschweren (Art. 77 DSGVO).
			</p>
			<!-- TODO: replace with the supervisory authority of the federal state where the business is registered -->
			<p>
				Zuständige Datenschutz-Aufsichtsbehörde Ihres Bundeslandes (bitte für den konkreten
				Einsatzort ersetzen).
			</p>
		</div>
	</section>

	<div class="copper-divider my-8"></div>

	<!-- 8. Aktualität -->
	<section class="mb-8">
		<h2
			class="font-display mb-3 text-xl font-bold tracking-wide uppercase"
			style="color: var(--gem-text)"
		>
			Aktualität dieser Datenschutzerklärung
		</h2>
		<div class="text-sm leading-relaxed" style="color: var(--gem-text-muted)">
			<p>
				Diese Datenschutzerklärung hat den Stand April 2026. Durch die Weiterentwicklung unserer
				Website und Angebote oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann
				es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle
				Datenschutzerklärung kann jederzeit auf dieser Seite abgerufen werden.
			</p>
		</div>
	</section>
</main>

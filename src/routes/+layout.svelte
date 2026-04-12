<script lang="ts">
	import '../app.css';
	import '@fontsource/barlow-condensed/700.css';
	import '@fontsource/barlow-condensed/400.css';
	import '@fontsource/dm-sans/400.css';
	import '@fontsource/dm-sans/500.css';
	import '@fontsource/dm-sans/600.css';

	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { BRAND, CONTACT, ADDRESS, PROOF, META, OG, HOURS } from '$lib/config';
	import theme, { THEMES, type ThemeId } from '$lib/theme.svelte';

	let { children } = $props();

	// Load persisted theme on mount
	$effect(() => {
		const saved = localStorage.getItem('gem-theme') as ThemeId | null;
		if (saved && THEMES.some((t) => t.id === saved)) {
			theme.set(saved);
		}
	});

	// Apply data-theme attribute + persist whenever theme changes
	$effect(() => {
		if (theme.current === 'copper') {
			document.documentElement.removeAttribute('data-theme');
		} else {
			document.documentElement.setAttribute('data-theme', theme.current);
		}
		localStorage.setItem('gem-theme', theme.current);
	});

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': BRAND.schemaType,
		name: BRAND.name,
		description: META.layoutDescription,
		url: BRAND.url,
		telephone: CONTACT.phoneHref,
		email: CONTACT.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: ADDRESS.street,
			addressLocality: ADDRESS.city,
			postalCode: ADDRESS.zip,
			addressCountry: ADDRESS.country
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: ADDRESS.lat,
			longitude: ADDRESS.lng
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				opens: '07:00',
				closes: '18:00'
			},
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Saturday'],
				opens: '08:00',
				closes: '14:00'
			}
		],
		priceRange: '€€',
		areaServed: { '@type': 'City', name: ADDRESS.city },
		foundingDate: BRAND.foundingYear,
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: PROOF.rating,
			reviewCount: PROOF.reviewCount
		}
	};
</script>

<svelte:head>
	<title>{META.layoutTitle}</title>
	<meta name="description" content={META.layoutDescription} />

	<!-- Open Graph -->
	<meta property="og:title" content={META.layoutTitle} />
	<meta property="og:description" content={META.layoutDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={OG.locale} />
	<meta property="og:site_name" content={OG.siteName} />
	<meta property="og:url" content={BRAND.url} />
	<meta property="og:image" content={OG.image} />

	<!-- Twitter / X card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={META.layoutTitle} />
	<meta name="twitter:description" content={META.layoutDescription} />
	<meta name="twitter:image" content={OG.image} />

	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col font-sans transition-colors duration-300">
	<Navbar />
	<main class="flex-grow">{@render children()}</main>
	<Footer />
</div>

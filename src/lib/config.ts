import type { Component } from 'svelte';
import type { LucideProps } from '@lucide/svelte';
import {
	Droplets,
	Flame,
	Home,
	Clock,
	Wrench,
	ShieldCheck,
	Zap,
	Award,
	CheckCircle2
} from '@lucide/svelte';

// ══════════════════════════════════════════════════════════════════
//  GEM CLIENT CONFIG — swap this file per client deployment
//  All components and routes read from here. No other file needs
//  to change for a different trade / city / brand.
// ══════════════════════════════════════════════════════════════════

export type Service = {
	icon: Component<LucideProps>;
	title: string;
	description: string;
};

export type Stat = {
	stat: string;
	label: string;
};

export type USP = {
	icon: Component<LucideProps>;
	stat: string;
	label: string;
	body: string;
};

export type OpeningDay = {
	label: string;
	hours: string;
};

// ── Identity ──────────────────────────────────────────────────────
export const BRAND = {
	/** Full legal business name */
	name: 'Muster Handwerk GmbH',
	/** Short brand name shown in logo / nav */
	shortName: 'Muster',
	/** Trade descriptor shown after the short name in accented copper */
	trade: 'Sanitär',
	/** One-line tagline used in meta description and hero subline */
	tagline:
		'Rohre, Heizung, Badezimmer – wir reagieren in 30 Minuten auf Ihre Anfrage. Festpreise. Keine Überraschungen.',
	/** JSON-LD @type — e.g. Plumber | Electrician | Painter | RoofingContractor | HVACBusiness */
	schemaType: 'Plumber',
	/** Canonical URL of the deployed site */
	url: 'https://www.muster-handwerk.de',
	/** Year the business was founded (string for JSON-LD) */
	foundingYear: '2010'
} as const;

// ── Contact ───────────────────────────────────────────────────────
export const CONTACT = {
	/** Display format shown in UI */
	phone: '+49 000 000 000',
	/** href-safe format for tel: links */
	phoneHref: '+490000000000',
	/** WhatsApp target number — digits only, no + */
	whatsapp: '490000000000',
	email: 'info@muster-handwerk.de'
} as const;

// ── Address ───────────────────────────────────────────────────────
export const ADDRESS = {
	street: 'Musterstraße 1',
	/** City name used in copy */
	city: 'Musterstadt',
	/** District / Stadtteil used in JSON-LD areaServed */
	district: 'Musterstadt',
	zip: '00000',
	country: 'DE',
	/** Approximate coordinates for JSON-LD GeoCoordinates */
	lat: '51.0000',
	lng: '7.0000'
} as const;

// ── Social proof ──────────────────────────────────────────────────
export const PROOF = {
	rating: '4.9',
	reviewCount: '100',
	projectCount: '1.500+',
	yearsActive: '14+'
} as const;

// ── Opening hours ─────────────────────────────────────────────────
export const HOURS: OpeningDay[] = [
	{ label: 'Mo – Fr', hours: '07:00 – 18:00 Uhr' },
	{ label: 'Samstag', hours: '08:00 – 14:00 Uhr' },
	{ label: 'Notdienst', hours: '24 / 7' }
];

// ── Navigation ────────────────────────────────────────────────────
export const NAV_LINKS = [
	{ href: '#leistungen', label: 'Leistungen' },
	{ href: '#ueber-uns', label: 'Über uns' },
	{ href: '#anfragen', label: 'Anfragen' }
] as const;

// ── Services ──────────────────────────────────────────────────────
export const SERVICES: Service[] = [
	{
		icon: Droplets,
		title: 'Rohrreinigung',
		description:
			'Verstopfte Abflüsse schnell und nachhaltig gelöst – mit modernster HD-Spültechnik und Kamerainspektion.'
	},
	{
		icon: Flame,
		title: 'Heizungsservice',
		description:
			'Wartung, Reparatur und Neuinstallation aller gängigen Heizsysteme – Gas, Wärmepumpe, Solarthermie.'
	},
	{
		icon: Home,
		title: 'Bad-Sanierung',
		description:
			'Von der Planung bis zur schlüsselfertigen Übergabe – wir renovieren Ihr Badezimmer termingerecht.'
	},
	{
		icon: Clock,
		title: '24/7 Notdienst',
		description:
			'Wasserrohrbruch oder Heizungsausfall? Wir sind rund um die Uhr erreichbar und innerhalb von 60 Min. vor Ort.'
	},
	{
		icon: Wrench,
		title: 'Installation & Montage',
		description:
			'Fachgerechte Installation von Armaturen, Heizkörpern, Boilern und kompletten Sanitäranlagen.'
	},
	{
		icon: ShieldCheck,
		title: 'Wartung & Inspektion',
		description:
			'Regelmäßige Inspektionen sichern den Betrieb Ihrer Anlagen und vermeiden kostspielige Folgeschäden.'
	}
];

// ── Stats (Why-Us grid) ───────────────────────────────────────────
export const STATS: Stat[] = [
	{ stat: PROOF.projectCount, label: 'Projekte abgeschlossen' },
	{ stat: PROOF.yearsActive, label: 'Jahre Erfahrung' },
	{ stat: `${PROOF.rating} ★`, label: 'Ø Kundenbewertung' },
	{ stat: '30 Min.', label: 'Garantierte Antwort' }
];

// ── USPs ──────────────────────────────────────────────────────────
export const USPS: USP[] = [
	{
		icon: Zap,
		stat: '30 Min.',
		label: 'Reaktionszeit',
		body: 'Nach Ihrer Anfrage erhalten Sie innerhalb von 30 Minuten ein konkretes Angebot – per WhatsApp oder E-Mail. Kein Warten, kein Vertrösten.'
	},
	{
		icon: Award,
		stat: `${PROOF.yearsActive} Jahre`,
		label: 'Erfahrung',
		body: `Seit ${BRAND.foundingYear} Meisterbetrieb in ${ADDRESS.city}. Über ${PROOF.projectCount} erfolgreich abgeschlossene Aufträge für private und gewerbliche Kunden.`
	},
	{
		icon: CheckCircle2,
		stat: 'Festpreis',
		label: 'Garantie',
		body: 'Kein böses Erwachen: Was wir anbieten, das berechnen wir. Transparente Festpreise, keine versteckten Kosten.'
	}
];

// ── Trust strip items (hero) ──────────────────────────────────────
export const TRUST_ITEMS = [
	{ label: `${PROOF.rating} / 5 Sterne (${PROOF.reviewCount}+ Bewertungen)` },
	{ label: `Meisterbetrieb seit ${BRAND.foundingYear}` },
	{ label: 'Antwort in 30 Minuten' },
	{ label: 'Festpreisgarantie' },
	{ label: 'Vollständig versichert' }
];

// ── Partner / brand logos ─────────────────────────────────────────
export const PARTNERS = ['Viessmann', 'Buderus', 'Hansgrohe', 'Grohe', 'Geberit', 'Vaillant'];

// ── Quote form — problem type options ────────────────────────────
export const PROBLEM_TYPES = [
	'Rohrverstopfung / Abfluss',
	'Heizung defekt / kalt',
	'Wasserrohrbruch',
	'Bad-Sanierung / Renovierung',
	'Warmwasser-Problem',
	'Neuinstallation',
	'Wartung / Inspektion',
	'Sonstiges / Notfall'
];

// ── Footer service links ──────────────────────────────────────────
export const FOOTER_SERVICES = SERVICES.map((s) => s.title);

// ── Page meta ─────────────────────────────────────────────────────
export const META = {
	title: `${BRAND.shortName} ${BRAND.trade} – Ihr Meisterbetrieb in ${ADDRESS.city}`,
	description: `${BRAND.trade}, Heizung & Badezimmer – Meisterbetrieb in ${ADDRESS.city} seit ${BRAND.foundingYear}. Kostenlose Anfrage, Antwort in 30 Minuten. Festpreise ohne Überraschungen.`,
	layoutTitle: `${BRAND.name} | Ihr Meisterbetrieb in ${ADDRESS.city}`,
	layoutDescription: `Schnelle Hilfe bei Rohrbruch, Heizungsausfall und Sanitär-Problemen in ${ADDRESS.city}. Kontaktieren Sie uns per WhatsApp für eine Antwort in 30 Minuten.`
} as const;

// ── Open Graph / Social meta ──────────────────────────────────────
// Drop a 1200×630px og-image.jpg into /static/ before going live.
export const OG = {
	/** Absolute URL of the social preview image — add og-image.jpg to /static/ */
	image: `${BRAND.url}/og-image.jpg`,
	locale: 'de_DE',
	siteName: BRAND.name
} as const;

// ── Translations — add keys here, then use t.section.key in components ──────
// Import config for dynamic values embedded in strings.
import { BRAND, ADDRESS, PROOF } from '$lib/config';

export const T = {
	de: {
		// ── Navbar ──────────────────────────────────────────────────────────
		nav: [
			{ href: '#leistungen', label: 'Leistungen' },
			{ href: '#ueber-uns', label: 'Über uns' },
			{ href: '#anfragen', label: 'Anfragen' }
		],
		cta: 'Jetzt anfragen',
		menuOpen: 'Menü öffnen',
		menuClose: 'Menü schließen',
		callAriaPrefix: 'Jetzt anrufen',
		langSwitchAriaTo: 'Switch to English',

		// ── Hero ─────────────────────────────────────────────────────────────
		hero: {
			badgeLabel: 'Meisterbetrieb',
			badgeSince: 'Seit',
			h1prefix: 'Ihr',
			h1middle: 'Meister',
			sublinePre: 'Rohre, Heizung, Badezimmer – wir reagieren in',
			sublineStrong: '30 Minuten',
			sublinePost: 'auf Ihre Anfrage. Festpreise. Keine Überraschungen.',
			cta: 'Kostenloses Angebot',
			scrollAriaLabel: 'Zu den Leistungen scrollen',
			trustItems: [
				`${PROOF.rating} / 5 Sterne (${PROOF.reviewCount}+ Bewertungen)`,
				`Meisterbetrieb seit ${BRAND.foundingYear}`,
				'Antwort in 30 Minuten',
				'Festpreisgarantie',
				'Vollständig versichert'
			]
		},

		// ── Services ─────────────────────────────────────────────────────────
		services: {
			sectionLabel: 'Was wir tun',
			heading: 'Unsere',
			headingAccent: 'Leistungen',
			sublinePre: 'Von der schnellen Notfallhilfe bis zur vollständigen Badsanierung –',
			sublinePost: 'ist Ihr zuverlässiger Partner für alle sanitärtechnischen Aufgaben.',
			learnMore: 'Mehr erfahren',
			items: [
				{
					title: 'Rohrreinigung',
					description:
						'Verstopfte Abflüsse schnell und nachhaltig gelöst – mit modernster HD-Spültechnik und Kamerainspektion.'
				},
				{
					title: 'Heizungsservice',
					description:
						'Wartung, Reparatur und Neuinstallation aller gängigen Heizsysteme – Gas, Wärmepumpe, Solarthermie.'
				},
				{
					title: 'Bad-Sanierung',
					description:
						'Von der Planung bis zur schlüsselfertigen Übergabe – wir renovieren Ihr Badezimmer termingerecht.'
				},
				{
					title: '24/7 Notdienst',
					description:
						'Wasserrohrbruch oder Heizungsausfall? Wir sind rund um die Uhr erreichbar und innerhalb von 60 Min. vor Ort.'
				},
				{
					title: 'Installation & Montage',
					description:
						'Fachgerechte Installation von Armaturen, Heizkörpern, Boilern und kompletten Sanitäranlagen.'
				},
				{
					title: 'Wartung & Inspektion',
					description:
						'Regelmäßige Inspektionen sichern den Betrieb Ihrer Anlagen und vermeiden kostspielige Folgeschäden.'
				}
			]
		},

		// ── Why Us ───────────────────────────────────────────────────────────
		whyUs: {
			sectionLabelPrefix: 'Warum',
			heading: 'Qualität,',
			headingAccent: 'die überzeugt.',
			statLabels: [
				'Projekte abgeschlossen',
				'Jahre Erfahrung',
				'Ø Kundenbewertung',
				'Garantierte Antwort'
			],
			usps: [
				{
					label: 'Reaktionszeit',
					body: 'Nach Ihrer Anfrage erhalten Sie innerhalb von 30 Minuten ein konkretes Angebot – per WhatsApp oder E-Mail. Kein Warten, kein Vertrösten.'
				},
				{
					label: 'Erfahrung',
					body: `Seit ${BRAND.foundingYear} Meisterbetrieb in ${ADDRESS.city}. Über ${PROOF.projectCount} erfolgreich abgeschlossene Aufträge für private und gewerbliche Kunden.`
				},
				{
					label: 'Festpreis Garantie',
					body: 'Kein böses Erwachen: Was wir anbieten, das berechnen wir. Transparente Festpreise, keine versteckten Kosten.'
				}
			]
		},

		// ── Quote form ───────────────────────────────────────────────────────
		form: {
			sectionLabel: 'Kostenlos & unverbindlich',
			heading: 'Jetzt',
			headingAccent: 'anfragen.',
			subline:
				'Schildern Sie uns kurz Ihr Anliegen – wir melden uns innerhalb von 30 Minuten per WhatsApp oder E-Mail mit einem konkreten Festpreisangebot.',
			callLabel: 'Direkt anrufen',
			emergencyLabel: '⚡ Notfall-Sofortservice',
			emergencyPre: 'Sofort anrufen. Wir sind in',
			emergencyStrong: '60 Minuten',
			emergencyPost: 'vor Ort.',
			formHeading: 'Kostenlose Anfrage',
			requiredNote: '* Pflichtfelder',
			nameLabel: 'Name *',
			namePlaceholder: 'Klaus Muster',
			phoneLabel: 'Telefon *',
			problemLabel: 'Problem / Anliegen *',
			selectPlaceholder: 'Bitte auswählen…',
			problemTypes: [
				'Rohrverstopfung / Abfluss',
				'Heizung defekt / kalt',
				'Wasserrohrbruch',
				'Bad-Sanierung / Renovierung',
				'Warmwasser-Problem',
				'Neuinstallation',
				'Wartung / Inspektion',
				'Sonstiges / Notfall'
			],
			messageLabel: 'Nachricht',
			messagePlaceholder: 'Kurze Beschreibung Ihres Anliegens…',
			submitLabel: 'Anfrage senden',
			submittingLabel: 'Wird gesendet…',
			guarantee: '⚡ Antwort garantiert\ninnerhalb von 30 Minuten',
			privacyPre: 'Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer',
			privacyLink: 'Datenschutzerklärung',
			privacyPost: 'zu.',
			successHeading: 'Anfrage gesendet!',
			successBodyPre: 'Wir melden uns innerhalb von',
			successBodyStrong: '30 Minuten',
			successBodyPost: 'Klicken Sie unten, um direkt zu WhatsApp zu wechseln.',
			whatsappCta: 'WhatsApp öffnen',
			errorFallback: 'Bitte versuchen Sie es erneut.'
		},

		// ── Partner banner ───────────────────────────────────────────────────
		partners: {
			sectionLabel: 'Unsere Markenpartner'
		},

		// ── Footer ───────────────────────────────────────────────────────────
		footer: {
			taglineCert: 'Ihr zertifizierter Meisterbetrieb für',
			taglineSince: 'Seit',
			servicesHeading: 'Leistungen',
			hoursHeading: 'Öffnungszeiten',
			hoursLabels: ['Mo – Fr', 'Samstag', 'Notdienst'],
			emergencyLabel: 'Notfall? Jetzt anrufen',
			availability: '24 / 7 erreichbar — auch an Sonn- und Feiertagen',
			callNow: 'Jetzt anrufen',
			copyright: 'Alle Rechte vorbehalten.',
			legal: 'Impressum',
			privacy: 'Datenschutz',
			callAriaLabel: 'Anrufen'
		}
	},

	en: {
		// ── Navbar ──────────────────────────────────────────────────────────
		nav: [
			{ href: '#leistungen', label: 'Services' },
			{ href: '#ueber-uns', label: 'About us' },
			{ href: '#anfragen', label: 'Contact' }
		],
		cta: 'Request a quote',
		menuOpen: 'Open menu',
		menuClose: 'Close menu',
		callAriaPrefix: 'Call us now',
		langSwitchAriaTo: 'Auf Deutsch wechseln',

		// ── Hero ─────────────────────────────────────────────────────────────
		hero: {
			badgeLabel: 'Master Craftsman',
			badgeSince: 'Since',
			h1prefix: 'Your',
			h1middle: 'Master',
			sublinePre: 'Pipes, heating, bathrooms – we respond within',
			sublineStrong: '30 minutes',
			sublinePost: 'to your request. Fixed prices. No surprises.',
			cta: 'Free Quote',
			scrollAriaLabel: 'Scroll to services',
			trustItems: [
				`${PROOF.rating} / 5 Stars (${PROOF.reviewCount}+ Reviews)`,
				`Master Craftsman since ${BRAND.foundingYear}`,
				'Response within 30 minutes',
				'Fixed Price Guarantee',
				'Fully Insured'
			]
		},

		// ── Services ─────────────────────────────────────────────────────────
		services: {
			sectionLabel: 'What we do',
			heading: 'Our',
			headingAccent: 'Services',
			sublinePre: 'From quick emergency help to complete bathroom renovation –',
			sublinePost: 'is your reliable partner for all plumbing and heating tasks.',
			learnMore: 'Learn more',
			items: [
				{
					title: 'Pipe Cleaning',
					description:
						'Blocked drains solved quickly and durably – with state-of-the-art HD flushing technology and camera inspection.'
				},
				{
					title: 'Heating Service',
					description:
						'Maintenance, repair and new installation of all common heating systems – gas, heat pump, solar thermal.'
				},
				{
					title: 'Bathroom Renovation',
					description:
						'From planning to turnkey handover – we renovate your bathroom on schedule and to the highest standard.'
				},
				{
					title: '24/7 Emergency Service',
					description:
						'Burst pipe or heating failure? We are available around the clock and on-site within 60 minutes.'
				},
				{
					title: 'Installation & Assembly',
					description:
						'Professional installation of fittings, radiators, boilers and complete sanitary systems.'
				},
				{
					title: 'Maintenance & Inspection',
					description:
						'Regular inspections keep your systems running and prevent costly consequential damage.'
				}
			]
		},

		// ── Why Us ───────────────────────────────────────────────────────────
		whyUs: {
			sectionLabelPrefix: 'Why',
			heading: 'Quality',
			headingAccent: 'that convinces.',
			statLabels: [
				'Projects completed',
				'Years of experience',
				'Avg. customer rating',
				'Guaranteed response'
			],
			usps: [
				{
					label: 'Response time',
					body: 'After your request you receive a concrete offer within 30 minutes – via WhatsApp or email. No waiting, no stalling.'
				},
				{
					label: 'Experience',
					body: `Master trade business in ${ADDRESS.city} since ${BRAND.foundingYear}. Over ${PROOF.projectCount} successfully completed orders for private and commercial customers.`
				},
				{
					label: 'Fixed Price Guarantee',
					body: 'No nasty surprises: what we quote is what we charge. Transparent fixed prices, no hidden costs.'
				}
			]
		},

		// ── Quote form ───────────────────────────────────────────────────────
		form: {
			sectionLabel: 'Free & non-binding',
			heading: 'Get in',
			headingAccent: 'touch.',
			subline:
				'Briefly describe your issue – we will get back to you within 30 minutes via WhatsApp or email with a concrete fixed-price offer.',
			callLabel: 'Call directly',
			emergencyLabel: '⚡ Emergency service',
			emergencyPre: 'Call now. We are on-site within',
			emergencyStrong: '60 minutes',
			emergencyPost: '',
			formHeading: 'Free Quote',
			requiredNote: '* Required fields',
			nameLabel: 'Name *',
			namePlaceholder: 'John Smith',
			phoneLabel: 'Phone *',
			problemLabel: 'Problem / Request *',
			selectPlaceholder: 'Please select…',
			problemTypes: [
				'Blocked pipe / drain',
				'Heating defective / cold',
				'Burst pipe',
				'Bathroom renovation',
				'Hot water problem',
				'New installation',
				'Maintenance / inspection',
				'Other / emergency'
			],
			messageLabel: 'Message',
			messagePlaceholder: 'Brief description of your request…',
			submitLabel: 'Send request',
			submittingLabel: 'Sending…',
			guarantee: '⚡ Response guaranteed\nwithin 30 minutes',
			privacyPre: 'By submitting you agree to the processing of your data in accordance with our',
			privacyLink: 'Privacy Policy',
			privacyPost: '.',
			successHeading: 'Request sent!',
			successBodyPre: 'We will get back to you within',
			successBodyStrong: '30 minutes',
			successBodyPost: 'Click below to open WhatsApp directly.',
			whatsappCta: 'Open WhatsApp',
			errorFallback: 'Please try again.'
		},

		// ── Partner banner ───────────────────────────────────────────────────
		partners: {
			sectionLabel: 'Our brand partners'
		},

		// ── Footer ───────────────────────────────────────────────────────────
		footer: {
			taglineCert: 'Your certified master craftsman for',
			taglineSince: 'Since',
			servicesHeading: 'Services',
			hoursHeading: 'Opening hours',
			hoursLabels: ['Mon – Fri', 'Saturday', 'Emergency'],
			emergencyLabel: 'Emergency? Call now',
			availability: 'Available 24/7 — including Sundays and public holidays',
			callNow: 'Call now',
			copyright: 'All rights reserved.',
			legal: 'Legal Notice',
			privacy: 'Privacy Policy',
			callAriaLabel: 'Call'
		}
	}
} as const;

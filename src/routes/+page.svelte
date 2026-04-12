<script lang="ts">
	import Hero from '$lib/ui/Hero.svelte';
	import ServiceCards from '$lib/ui/ServiceCards.svelte';
	import WhyUs from '$lib/ui/WhyUs.svelte';
	import QuoteForm from '$lib/ui/QuoteForm.svelte';
	import PartnerBanner from '$lib/ui/PartnerBanner.svelte';
	import { META } from '$lib/config';
</script>

<svelte:head>
	<title>{META.title}</title>
	<meta name="description" content={META.description} />
</svelte:head>

<Hero />
<ServiceCards />
<WhyUs />
<QuoteForm />
<PartnerBanner />

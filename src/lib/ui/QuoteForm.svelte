<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowRight, Phone, CheckCircle2 } from '@lucide/svelte';
	import { CONTACT } from '$lib/config';
	import { reveal } from '$lib/actions/reveal';
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';

	let { form = undefined }: { form?: unknown } = $props();

	let submitting = $state(false);
	let errorMsg = $state('');
	let submitted = $state(false);
	let redirectUrl = $state('');

	const t = $derived(T[lang.current].form);
</script>

<section id="anfragen" class="px-4 py-28 sm:px-6 lg:px-8" style="background-color: var(--gem-bg);">
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
		<!-- LEFT column -->
		<div use:reveal={0} class="lg:col-span-2">
			<p class="section-label mb-3">{t.sectionLabel}</p>
			<h2
				class="font-display text-gem-text mb-5 text-4xl leading-tight font-bold uppercase sm:text-5xl"
			>
				{t.heading}<br /><span class="text-gradient-copper">{t.headingAccent}</span>
			</h2>
			<p class="text-gem-muted mb-8 text-base leading-relaxed">{t.subline}</p>

			<!-- Contact tiles -->
			<div class="flex flex-col gap-4">
				<!-- Phone tile -->
				<a
					href="tel:{CONTACT.phoneHref}"
					class="card-gem hover:border-gem-border flex items-center gap-4 rounded-xl p-5 transition-colors"
				>
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
						style="background-color: var(--gem-copper-glow); border: 1px solid var(--gem-border);"
					>
						<Phone size={20} class="text-copper" />
					</div>
					<div>
						<p class="text-gem-muted mb-0.5 text-xs font-semibold tracking-wider uppercase">
							{t.callLabel}
						</p>
						<p class="font-display text-gem-text text-lg font-bold">{CONTACT.phone}</p>
					</div>
				</a>

				<!-- Emergency tile -->
				<div
					class="rounded-xl border p-5"
					style="background-color: var(--gem-surface-2); border-color: var(--gem-border);"
				>
					<p class="text-copper mb-1.5 text-xs font-semibold tracking-wider uppercase">
						{t.emergencyLabel}
					</p>
					<p class="text-gem-muted text-sm leading-relaxed">
						{t.emergencyPre}
						<strong class="text-gem-text font-semibold">{t.emergencyStrong}</strong>
						{t.emergencyPost}
					</p>
				</div>
			</div>
		</div>

		<!-- RIGHT column -->
		<div use:reveal={150} class="lg:col-span-3">
			<div
				class="rounded-2xl border p-8 md:p-10"
				style="background-color: var(--gem-surface); border-color: var(--gem-border-subtle);"
			>
				{#if submitted}
					<!-- ── Success state ── -->
					<div class="flex flex-col items-center justify-center gap-6 py-12 text-center">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full"
							style="background-color: var(--gem-copper-glow); border: 1px solid var(--gem-border);"
						>
							<CheckCircle2 size={28} class="text-copper" />
						</div>
						<div>
							<h3 class="font-display text-gem-text mb-2 text-2xl font-bold uppercase">
								{t.successHeading}
							</h3>
							<p class="text-gem-muted mx-auto max-w-xs text-sm leading-relaxed">
								{t.successBodyPre}
								<strong class="text-gem-text">{t.successBodyStrong}</strong>.
								{t.successBodyPost}
							</p>
						</div>
						<a
							href={redirectUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-copper inline-flex items-center gap-2 rounded-md px-7 py-3"
						>
							{t.whatsappCta}
							<ArrowRight size={16} />
						</a>
					</div>
				{:else}
					<!-- ── Form ── -->
					<div class="mb-7 flex items-center justify-between gap-4">
						<h3 class="font-display text-gem-text text-2xl font-bold uppercase">{t.formHeading}</h3>
						<span class="text-gem-dim shrink-0 text-xs">{t.requiredNote}</span>
					</div>

					<form
						method="POST"
						action="?/quote"
						use:enhance={() => {
							submitting = true;
							errorMsg = '';
							return async ({ result, update }) => {
								submitting = false;
								if (result.type === 'failure') {
									const data = result.data as { error?: string } | undefined;
									errorMsg = data?.error ?? T[lang.current].form.errorFallback;
									await update({ reset: false });
								} else if (result.type === 'redirect') {
									redirectUrl = result.location;
									submitted = true;
								} else {
									await update();
								}
							};
						}}
					>
						<div class="grid gap-5 sm:grid-cols-2">
							<!-- Name -->
							<div>
								<label
									for="name"
									class="text-gem-muted mb-1.5 block text-xs font-semibold tracking-wider uppercase"
								>
									{t.nameLabel}
								</label>
								<input
									id="name"
									name="name"
									type="text"
									required
									placeholder={t.namePlaceholder}
									class="field-gem rounded-md px-4 py-3 text-sm"
								/>
							</div>

							<!-- Phone -->
							<div>
								<label
									for="phone"
									class="text-gem-muted mb-1.5 block text-xs font-semibold tracking-wider uppercase"
								>
									{t.phoneLabel}
								</label>
								<input
									id="phone"
									name="phone"
									type="tel"
									required
									placeholder="+49 …"
									class="field-gem rounded-md px-4 py-3 text-sm"
								/>
							</div>

							<!-- Problem type -->
							<div class="sm:col-span-2">
								<label
									for="problemType"
									class="text-gem-muted mb-1.5 block text-xs font-semibold tracking-wider uppercase"
								>
									{t.problemLabel}
								</label>
								<select
									id="problemType"
									name="problemType"
									required
									class="field-gem cursor-pointer rounded-md px-4 py-3 text-sm"
								>
									<option value="" disabled selected>{t.selectPlaceholder}</option>
									{#each t.problemTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>

							<!-- Message -->
							<div class="sm:col-span-2">
								<label
									for="message"
									class="text-gem-muted mb-1.5 block text-xs font-semibold tracking-wider uppercase"
								>
									{t.messageLabel}
								</label>
								<textarea
									id="message"
									name="message"
									rows={4}
									placeholder={t.messagePlaceholder}
									class="field-gem resize-none rounded-md px-4 py-3 text-sm"
								></textarea>
							</div>
						</div>

						<!-- Error banner -->
						{#if errorMsg}
							<div
								class="mt-5 rounded-lg border px-4 py-3 text-sm"
								style="background-color: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #fca5a5;"
							>
								{errorMsg}
							</div>
						{/if}

						<!-- Submit row -->
						<div class="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<button
								type="submit"
								disabled={submitting}
								class="btn-copper inline-flex items-center justify-center gap-2 rounded-md px-8 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{submitting ? t.submittingLabel : t.submitLabel}
								{#if !submitting}<ArrowRight size={16} />{/if}
							</button>

							<p
								class="text-gem-dim text-right text-xs leading-snug sm:max-w-[160px]"
								style="white-space: pre-line;"
							>
								{t.guarantee}
							</p>
						</div>

						<!-- Privacy -->
						<p class="text-gem-dim mt-5 text-xs leading-relaxed">
							{t.privacyPre}
							<a
								href="/datenschutz"
								class="hover:text-copper underline underline-offset-2 transition-colors"
							>
								{t.privacyLink}
							</a>
							{t.privacyPost}
						</p>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

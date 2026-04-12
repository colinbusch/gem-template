<script lang="ts">
	import lang from '$lib/lang.svelte';
	import { T } from '$lib/i18n';
</script>

<!--
  Rocker light-switch toggle between DE and EN.
  The paddle tilts toward the active language using a CSS perspective transform.
-->
<button
	class="lang-switch"
	onclick={lang.toggle}
	role="switch"
	aria-checked={lang.current === 'en'}
	aria-label={T[lang.current].langSwitchAriaTo}
	title={T[lang.current].langSwitchAriaTo}
>
	<!-- Housing plate -->
	<span class="plate">
		<!-- Rocker paddle -->
		<span class="rocker" class:en={lang.current === 'en'}>
			<span class="face de">DE</span>
			<span class="face en">EN</span>
		</span>
	</span>
</button>

<style>
	.lang-switch {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		/* give room for the perspective effect */
		perspective: 120px;
		-webkit-tap-highlight-color: transparent;
	}

	.lang-switch:focus-visible .plate {
		outline: 2px solid var(--gem-copper);
		outline-offset: 3px;
	}

	/* ── Wall plate ── */
	.plate {
		position: relative;
		width: 52px;
		height: 28px;
		background: var(--gem-surface-3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 5px;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.55),
			0 1px 0 rgba(255, 255, 255, 0.06);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* ── Rocker paddle ── */
	.rocker {
		position: absolute;
		inset: 3px;
		border-radius: 3px;
		display: flex;
		transform-style: preserve-3d;
		/* DE active: left side pressed down (tilts right/positive Y) */
		transform: rotateY(18deg);
		transition: transform 0.18s cubic-bezier(0.34, 1.4, 0.64, 1);
		background: var(--gem-surface-2);
		border: 1px solid rgba(255, 255, 255, 0.07);
		box-shadow:
			2px 0 6px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	/* EN active: right side pressed down (tilts left/negative Y) */
	.rocker.en {
		transform: rotateY(-18deg);
		box-shadow:
			-2px 0 6px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	/* ── Label faces ── */
	.face {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition:
			color 0.18s ease,
			text-shadow 0.18s ease;
		user-select: none;
	}

	/* DE face lit when DE is active (rocker tilted right = .de side is "up") */
	.rocker:not(.en) .face.de {
		color: var(--gem-copper-light);
		text-shadow: 0 0 8px var(--gem-copper-glow);
	}
	.rocker:not(.en) .face.en {
		color: var(--gem-text-dim);
	}

	/* EN face lit when EN is active */
	.rocker.en .face.en {
		color: var(--gem-copper-light);
		text-shadow: 0 0 8px var(--gem-copper-glow);
	}
	.rocker.en .face.de {
		color: var(--gem-text-dim);
	}

	/* Subtle separator between faces */
	.face.de {
		border-right: 1px solid rgba(255, 255, 255, 0.06);
	}
</style>

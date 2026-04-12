<script lang="ts">
	import theme, { THEMES } from '$lib/theme.svelte';
</script>

<!--
  3-paddle breaker-panel style theme switcher.
  Each paddle corresponds to one theme. Active = raised & lit.
  Update THEMES in theme.svelte.ts to set real accent colours per theme.
-->
<div class="theme-switch" role="group" aria-label="Select theme">
	<div class="plate">
		{#each THEMES as t}
			<button
				class="paddle"
				class:active={theme.current === t.id}
				style="--accent: {t.accent}; --glow: {t.accentGlow};"
				onclick={() => theme.set(t.id)}
				aria-pressed={theme.current === t.id}
				aria-label="Theme {t.label}"
				title="Theme {t.label}"
			>
				<span class="pip"></span>
				<span class="num">{t.label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.theme-switch {
		display: inline-flex;
		align-items: center;
	}

	/* ── Housing plate ── */
	.plate {
		display: flex;
		gap: 3px;
		padding: 3px;
		background: var(--gem-surface-3);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 5px;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.55),
			0 1px 0 rgba(255, 255, 255, 0.06);
	}

	/* ── Individual paddle ── */
	.paddle {
		position: relative;
		width: 18px;
		height: 26px;
		background: var(--gem-surface-2);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 3px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		cursor: pointer;
		padding: 0;
		/* Inactive: pressed down */
		transform: translateY(1.5px);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.5),
			inset 0 -1px 0 rgba(0, 0, 0, 0.3);
		transition:
			transform 0.14s cubic-bezier(0.34, 1.4, 0.64, 1),
			box-shadow 0.14s ease;
	}

	/* Active: popped up */
	.paddle.active {
		transform: translateY(-1.5px);
		background: var(--gem-surface-3);
		box-shadow:
			0 3px 8px rgba(0, 0, 0, 0.5),
			0 0 10px var(--glow),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	/* ── Colour pip ── */
	.pip {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		opacity: 0.35;
		transition:
			opacity 0.14s ease,
			box-shadow 0.14s ease;
		flex-shrink: 0;
	}

	.paddle.active .pip {
		opacity: 1;
		box-shadow: 0 0 5px var(--glow);
	}

	/* ── Number label ── */
	.num {
		font-family: var(--font-display);
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--gem-text-dim);
		transition: color 0.14s ease;
		line-height: 1;
		user-select: none;
	}

	.paddle.active .num {
		color: var(--accent);
	}
</style>

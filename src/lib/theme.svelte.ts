// Shared reactive theme store — Svelte 5 runes
// accent / accentGlow are used by ThemeSwitch to show each theme's colour swatch.
// Update them when you fill in the real theme tokens.

export type ThemeId = 'copper' | 'theme2' | 'theme3';

export const THEMES: { id: ThemeId; label: string; accent: string; accentGlow: string }[] = [
	{ id: 'copper', label: '1', accent: '#c47a38', accentGlow: 'rgba(196,122,56,0.45)' },
	{ id: 'theme2', label: '2', accent: '#b6d7a8', accentGlow: 'rgba(182,215,168,0.55)' },
	{ id: 'theme3', label: '3', accent: '#029ab2', accentGlow: 'rgba(2,154,178,0.55)' }
];

const store = (() => {
	let current = $state<ThemeId>('copper');
	return {
		get current() {
			return current;
		},
		set(id: ThemeId) {
			current = id;
		}
	};
})();

export default store;

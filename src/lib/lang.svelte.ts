// Shared reactive language store — Svelte 5 runes
export type Lang = 'de' | 'en';

const store = (() => {
	let current = $state<Lang>('de');
	return {
		get current() {
			return current;
		},
		toggle() {
			current = current === 'de' ? 'en' : 'de';
		},
		set(l: Lang) {
			current = l;
		}
	};
})();

export default store;

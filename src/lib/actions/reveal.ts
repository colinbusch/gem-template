/**
 * GEM scroll-reveal Svelte action.
 * Adds .reveal class on mount, then .visible when the element enters the viewport.
 * Uses a single IntersectionObserver per element — unobserves after first trigger.
 *
 * Usage:  <div use:reveal={200}>   (optional delay in ms)
 */
export function reveal(node: HTMLElement, delay = 0): { destroy: () => void } {
	node.classList.add('reveal');
	if (delay) node.style.transitionDelay = `${delay}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('visible');
				observer.unobserve(node);
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);
	return { destroy: () => observer.disconnect() };
}

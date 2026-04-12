import tailwindcss from '@tailwindcss/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		// MUST be before sveltekit() — auto-converts assets to WebP/AVIF at build time
		enhancedImages(),
		tailwindcss(),
		sveltekit()
	]
});

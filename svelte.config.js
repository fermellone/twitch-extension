import adapter from 'sveltekit-adapter-chrome-extension';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	build: {
		rollupOptions: {
			input: {
				content: fileURLToPath(new URL('./src/content.ts', import.meta.url))
			}
		}
	},

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			manifest: 'manifest.json',
			static: {
				include: ['static']
			}
		}),
		appDir: 'app'
	}
};

export default config;

// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	markdown: {
		syntaxHighlight: {
			type: "shiki",
		},
		shikiConfig: {
			theme: "catppuccin-mocha",
			wrap: false,
		},
	},
	output: "server",
	integrations: [tailwind()],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
	vite: {
		define: {
			"process.env": import.meta.env,
		},
	},
});

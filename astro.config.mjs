// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  vite: {
		define: {
			"process.env": import.meta.env,
		},
	},
  output: "server"
});
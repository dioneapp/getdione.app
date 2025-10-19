import type { CloudflareEnv } from "../../cloudflare-env";

// Function to get environment variables in Cloudflare Workers context
export function getCloudflareEnv(): CloudflareEnv {
	// In Cloudflare Workers, environment variables are available through the global context
	// This function will be called from the worker context where env is available
	return {
		SCRIPTS_DISCORD_WEBHOOK_URL: process.env.SCRIPTS_DISCORD_WEBHOOK_URL || "",
		FEATURED_DISCORD_WEBHOOK_URL:
			process.env.FEATURED_DISCORD_WEBHOOK_URL || "",
		BETA_DISCORD_WEBHOOK_URL: process.env.BETA_DISCORD_WEBHOOK_URL || "",
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
		NEXT_PUBLIC_SUPABASE_ANON_KEY:
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
	};
}

// Alternative function that can be used with Cloudflare Workers env context
export function getWebhookUrl(
	env: CloudflareEnv,
	webhookType: "scripts" | "featured" | "beta",
): string {
	switch (webhookType) {
		case "scripts":
			return env.SCRIPTS_DISCORD_WEBHOOK_URL;
		case "featured":
			return env.FEATURED_DISCORD_WEBHOOK_URL;
		case "beta":
			return env.BETA_DISCORD_WEBHOOK_URL;
		default:
			throw new Error(`Unknown webhook type: ${webhookType}`);
	}
}

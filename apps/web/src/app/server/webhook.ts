"use server";

import { getCloudflareEnv, getWebhookUrl } from "../../utils/env";

// Helper function to get webhook URL with fallback
function getWebhookUrlWithFallback(
	envVar: string,
	fallbackVar?: string,
): string {
	const primary = process.env[envVar];
	if (primary) return primary;

	if (fallbackVar) {
		const fallback = process.env[fallbackVar];
		if (fallback) return fallback;
	}

	return "";
}

export async function sendWebhook(data: unknown) {
	try {
		const webhookUrl = getWebhookUrlWithFallback("BETA_DISCORD_WEBHOOK_URL");
		console.log("BETA_DISCORD_WEBHOOK_URL:", webhookUrl ? "SET" : "NOT SET");

		if (!webhookUrl) {
			throw new Error(
				"BETA_DISCORD_WEBHOOK_URL environment variable is not set",
			);
		}

		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Discord webhook error: ${response.statusText}`);
		}

		return { success: true };
	} catch (error) {
		console.error("Beta webhook error:", error);
		return { error: "Failed to submit webhook" };
	}
}

export async function sendFeaturedWebhook(data: unknown) {
	try {
		const webhookUrl = getWebhookUrlWithFallback(
			"FEATURED_DISCORD_WEBHOOK_URL",
		);
		console.log(
			"FEATURED_DISCORD_WEBHOOK_URL:",
			webhookUrl ? "SET" : "NOT SET",
		);

		if (!webhookUrl) {
			throw new Error(
				"FEATURED_DISCORD_WEBHOOK_URL environment variable is not set",
			);
		}

		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Discord webhook error: ${response.statusText}`);
		}

		return { success: true };
	} catch (error) {
		console.error("Webhook error:", error);
		return { error: "Failed to submit webhook" };
	}
}

export async function sendScriptsWebhook(data: unknown) {
	try {
		const webhookUrl = getWebhookUrlWithFallback("SCRIPTS_DISCORD_WEBHOOK_URL");
		console.log("SCRIPTS_DISCORD_WEBHOOK_URL:", webhookUrl ? "SET" : "NOT SET");

		if (!webhookUrl) {
			throw new Error(
				"SCRIPTS_DISCORD_WEBHOOK_URL environment variable is not set",
			);
		}

		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Discord webhook error: ${response.statusText}`);
		}

		return { success: true };
	} catch (error) {
		console.error("Webhook error:", error);
		return { error: "Failed to submit webhook" };
	}
}

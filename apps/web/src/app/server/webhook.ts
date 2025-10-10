"use server";

export async function sendWebhook(data: unknown) {
	try {
		const response = await fetch(process.env.BETA_DISCORD_WEBHOOK_URL!, {
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

export async function sendFeaturedWebhook(data: unknown) {
	try {
		const webhookUrl = process.env.FEATURED_DISCORD_WEBHOOK_URL;
		console.log("FEATURED_DISCORD_WEBHOOK_URL:", webhookUrl ? "SET" : "NOT SET");
		
		if (!webhookUrl) {
			throw new Error("FEATURED_DISCORD_WEBHOOK_URL environment variable is not set");
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
		console.error("Featured webhook error:", error);
		return { error: "Failed to submit webhook" };
	}
}

export async function sendScriptsWebhook(data: unknown) {
	try {
		const webhookUrl = process.env.SCRIPTS_DISCORD_WEBHOOK_URL;
		console.log("SCRIPTS_DISCORD_WEBHOOK_URL:", webhookUrl ? "SET" : "NOT SET");
		
		if (!webhookUrl) {
			throw new Error("SCRIPTS_DISCORD_WEBHOOK_URL environment variable is not set");
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
		console.error("Scripts webhook error:", error);
		return { error: "Failed to submit webhook" };
	}
}

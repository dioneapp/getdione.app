"use server";

export async function sendWebhook(data: any) {
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

export async function sendFeaturedWebhook(data: any) {
	try {
		const response = await fetch(process.env.FEATURED_DISCORD_WEBHOOK_URL!, {
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
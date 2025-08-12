"use server";

import { sendFeaturedWebhook } from "./server/webhook";

export async function getScriptsAction(limit: number = 50) {
	try {
		const response = await fetch(
			`https://api.getdione.app/v1/scripts?limit=${encodeURIComponent(String(limit))}`,
			{
				headers: { Accept: "application/json" },
				cache: "no-store",
			},
		);

		if (!response.ok) {
			return [] as any[];
		}

		const data = await response.json();
		return Array.isArray(data) ? data : [];
	} catch (error) {
		return [] as any[];
	}
}

export async function featuredWebhookAction(body: any) {
	try {
		const result = await sendFeaturedWebhook(body);
		if (result.success) {
			return { success: true };
		} else {
			return { error: "Failed to submit webhook" };
		}
	} catch (error) {
		return { error: "Internal server error" };
	}
}

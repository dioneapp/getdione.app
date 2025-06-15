import { NextResponse } from "next/server";

export interface Env {
	BETA_DISCORD_WEBHOOK_URL: string;
}

// handle webhook submission securely
export async function POST(request: Request, env: Env) {
	try {
		const data = await request.json();

		const response = await fetch(env.BETA_DISCORD_WEBHOOK_URL || process.env.BETA_DISCORD_WEBHOOK_URL!, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			console.error("Discord webhook error:", response.statusText);
			throw new Error(`Discord webhook error: ${response.statusText}`);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json(
			{ error: "Failed to submit webhook" },
			{ status: 500 },
		);
	}
}

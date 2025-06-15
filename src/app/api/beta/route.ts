import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const response = await fetch(process.env.BETA_DISCORD_WEBHOOK_URL!, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
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
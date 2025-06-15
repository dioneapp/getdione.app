export async function onRequestPost(context: any) {
	try {
		const data = await context.request.json();
		const response = await fetch(context.env.BETA_DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		
		if (!response.ok) {
			throw new Error(`Discord webhook error: ${response.statusText}`);
		}
		
		return new Response(JSON.stringify({ success: true }), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Webhook error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to submit webhook" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
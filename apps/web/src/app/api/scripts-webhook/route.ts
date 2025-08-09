import { type NextRequest, NextResponse } from "next/server";
import { sendScriptsWebhook } from "@/app/server/webhook";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const result = await sendScriptsWebhook(body);
		if ((result as any).success) {
			return NextResponse.json({ success: true });
		}
		return NextResponse.json(
			{ error: "Failed to submit webhook" },
			{ status: 500 },
		);
	} catch {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

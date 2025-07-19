import { NextRequest, NextResponse } from "next/server";
import { sendFeaturedWebhook } from "@/app/server/webhook";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await sendFeaturedWebhook(body);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to submit webhook" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

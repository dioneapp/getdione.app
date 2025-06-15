import { NextResponse } from "next/server";
import { handleWebhook } from './webhook-handler';

export const runtime = 'edge';

export async function POST(request: Request) {
	return handleWebhook(request);
}
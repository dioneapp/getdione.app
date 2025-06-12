import { NextResponse } from "next/server";

// handle changelog submission securely
export async function GET(request: Request) {
    try {
        const response = await fetch('https://api.github.com/repos/dioneapp/dioneapp/releases', {
            method: "GET",
            headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
            next: { revalidate: 3600 }, // revalidate every hour
        });

        if (!response.ok) {
            throw new Error(`Changelog error: ${response.statusText}`);
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error("Changelog error:", error);
        return NextResponse.json(
            { error: "Failed to fetch changelog" },
            { status: 500 },
        );
    }
}

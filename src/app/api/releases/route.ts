import { NextResponse } from "next/server";

export async function GET() {
	console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? "exists" : "missing");

	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		return NextResponse.json(
			{ error: "No GitHub token configured" },
			{ status: 500 },
		);
	}

	const response = await fetch(
		"https://api.github.com/repos/dioneapp/dioneapp/releases",
		{
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${token}`,
				"X-GitHub-Api-Version": "2022-11-28",
				"User-Agent": "dioneapp",
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch releases: ${response.statusText} (${response.status})`,
		);
	}

	const data = await response.json();
	return NextResponse.json(data);
}

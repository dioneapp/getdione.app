import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
	const token = locals.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

	if (!token) {
		return new Response(JSON.stringify({ error: "GitHub token missing" }), {
			status: 500,
		});
	}

	const res = await fetch(
		"https://api.github.com/repos/dioneapp/dioneapp/releases",
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"User-Agent": "Dione",
			},
		},
	);

	if (!res.ok) {
		console.log("error", res.statusText);
		return new Response(JSON.stringify({ error: "Failed to fetch releases" }), {
			status: res.status,
		});
	}

	const releases = await res.json();
	return new Response(JSON.stringify(releases), {
		headers: { "Content-Type": "application/json" },
	});
};

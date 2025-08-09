export async function getScripts() {
	try {
		const limit = process.env.NODE_ENV === "development" ? 12 : 50;
		const res = await fetch(
			`https://api.getdione.app/v1/scripts?limit=${limit}`,
			{
				headers: { Accept: "application/json" },
				cache: "no-store",
			},
		);
		if (!res.ok) throw new Error(`failed to fetch: ${res.status}`);
		const data = await res.json();
		return data;
	} catch (err) {
		console.error("Error fetching scripts:", err);
		return [];
	}
}

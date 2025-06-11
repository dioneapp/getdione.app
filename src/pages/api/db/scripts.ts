import type { APIRoute } from "astro";
import { supabase } from "../../../utils/database";

export const GET: APIRoute = async () => {
	const { data, error } = await supabase
		.from("scripts")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(24);

	if (error) {
		console.error("Error fetching scripts:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify(data), {
		headers: { "Content-Type": "application/json" },
	});
};

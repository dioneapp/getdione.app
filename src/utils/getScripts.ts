import { supabase } from "@/utils/database";

export async function getScripts() {
	const { data, error } = await supabase
		.from("scripts")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(24);

	if (error) {
		console.error("Error fetching scripts:", error);
		return [];
	}

	return data;
} 
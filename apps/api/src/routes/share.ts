import { createClient } from "@supabase/supabase-js";
import { Hono } from "hono";
import { nanoid } from "nanoid";

type Bindings = {
	SUPABASE_URL: string;
	SUPABASE_SERVICE_ROLE_KEY: string;
	PRIVATE_KEY: string;
};

const shareRouter = new Hono<{ Bindings: Bindings }>();

const requireAuth = async (c: any, next: any) => {
	const auth = c.req.header("Authorization");

	if (auth !== "Bearer " + c.env.PRIVATE_KEY) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	await next();
};

shareRouter.post("/", requireAuth, async (c) => {
	try {
		const body = await c.req.json();
		const { url } = body;

		if (!url || typeof url !== "string") {
			return c.json({ error: "URL is required" }, 400);
		}

		try {
			new URL(url);
		} catch {
			return c.json({ error: "Invalid URL format" }, 400);
		}

		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY,
		);

		const shortId = nanoid(12);

		const { data, error } = await supabase
			.from("shared_urls")
			.insert({
				id: shortId,
				long_url: url,
				created_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			console.error("Database error:", error);
			return c.json({ error: "Failed to create shortened URL" }, 500);
		}

		return c.json({
			id: data.id,
			shortUrl: `https://getdione.app/share/${data.id}`,
			longUrl: data.long_url,
		});
	} catch (error) {
		console.error("Error creating shortened URL:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

shareRouter.get("/:id", requireAuth, async (c) => {
	try {
		const id = c.req.param("id");

		if (!id) {
			return c.json({ error: "ID is required" }, 400);
		}

		const supabase = createClient(
			c.env.SUPABASE_URL,
			c.env.SUPABASE_SERVICE_ROLE_KEY,
		);

		const { data, error } = await supabase
			.from("shared_urls")
			.select("long_url")
			.eq("id", id)
			.single();

		if (error || !data) {
			return c.json({ error: "URL not found" }, 404);
		}

		return c.json({
			id,
			longUrl: data.long_url,
		});
	} catch (error) {
		console.error("Error fetching URL:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

export default shareRouter;

import { Hono } from "hono";
import { getFilteredEntries } from "../services/scripts";

const scriptsRouter = new Hono();

scriptsRouter.get("/", async (c) => {
	// pagination
	const page = Number(c.req.query("page")) || 1;
	const limit = Number(c.req.query("limit")) || 10;

	// filters
	const tags = c.req.query("tags");
	const orderType = c.req.query("order_type");
	const order = c.req.query("order");

	// search
	const query = c.req.query("q");
	const id = c.req.query("id");
	const featured = c.req.query("featured");

	const filters = {
		tags,
		orderType,
		order,
	};

	const entries = await getFilteredEntries(
		page,
		limit,
		c,
		filters,
		query,
		featured,
		id,
	);

	if (entries?.status && entries.status >= 400) {
		return c.json({
			error: true,
			status: entries.status,
			message: entries.message,
			code: entries.code,
		});
	}

	if (!entries.data || !entries.data.length) {
		return c.json({
			error: true,
			status: entries.status,
			message: entries.message,
			code: entries.code,
		});
	}

	return c.json(entries?.data || [], 200);
});

export default scriptsRouter;

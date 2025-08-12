import type { Context } from "hono";
import { initializeSupabase } from "../utils/database";

/**
 * Gets paginated filtered entries from the database.
 *
 * @param {number} page The page number to fetch.
 * @param {number} pageSize The number of items per page.
 * @param {Context} c The Hono context.
 * @param {Object} filters The filters to apply. Supports `tags`, `orderType` and `order`.
 * @param {string} [search] The search query to filter by.
 *
 * @returns {Promise<Object>} The response object with a `status` property and either a `message` or `data` property.
 */
export const getFilteredEntries = async (
	page: number,
	pageSize: number,
	c: Context,
	filters: { tags?: string; orderType?: string; order?: string },
	search?: string,
	featured?: string,
	id?: string,
	showPending?: boolean,
) => {
	const supabase = initializeSupabase(c);

	const minPageSize = 1;
	const maxPageSize = 50;

	if (pageSize < minPageSize) {
		return {
			status: 400,
			message: `Page size must be at least ${minPageSize}.`,
		};
	}
	if (pageSize > maxPageSize) {
		return {
			status: 400,
			message: `Page size must not exceed ${maxPageSize}.`,
		};
	}

	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	let query = supabase
		.from("scripts")
		.select("*")
		.not("status", "cs", '"DENIED"')
		.not("status", "cs", '"PENDING_REVIEW"')
		.or("pending_review.eq.false,status.not.is.null")
		.range(startIndex, endIndex - 1);

	if (search) {
		const cleanSearch = search.replace(/ /g, "-");
		query = query.or(
			`name.ilike.%${cleanSearch}%,name.ilike.%${cleanSearch.replace(/-/g, " ")}`,
		);
	}

	if (filters.tags) {
		query = query.filter("tags", "ilike", `%${filters.tags}%`);
	}

	if (filters.orderType) {
		query = query.order(filters.order || "created_at", {
			ascending: filters.orderType === "asc",
		});
	}

	if (featured) {
		query = query.eq("featured", true);
	}

	if (id) {
		query = query.eq("id", id);
	}

	const { data, error } = await query;

	if (error) {
		if (error.code === "PGRST116") {
			return {
				status: 404,
				message: "No results found",
				code: error.code,
			};
		}

		if (error.code === "22P02") {
			return {
				status: 400,
				message: "Bad request",
				code: error.code,
			};
		}

		if (error.code === "401") {
			return {
				status: 401,
				message: "Unauthorized",
				code: error.code,
			};
		}

		if (error.code === "403") {
			return {
				status: 403,
				message: "Forbidden",
				code: error.code,
			};
		}

		console.error("Error getting filtered data", error);
		return {
			status: 500,
			message: "Error getting data from database",
			code: error.code,
		};
	}

	if (!data || !data.length) {
		return {
			status: 404,
			message: "No results found",
			code: "PGRST116",
		};
	}

	return {
		status: 200,
		data: data || [],
	};
};
